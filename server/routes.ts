import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import cookieParser from "cookie-parser";
import { storage } from "./storage";
import { requireAdmin, setAuthCookie, clearAuthCookie } from "./middleware/auth";
import { rsvpSubmitSchema, publicRsvpSchema } from "../shared/schema.js";
import { sendRsvpConfirmation } from "./services/whatsapp";
import { verifyWebhookSignature } from "./services/whatsapp";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { randomUUID } from "crypto";

const rateLimit = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.reset) {
    rateLimit.set(ip, { count: 1, reset: now + windowMs });
    return false;
  }
  if (entry.count >= limit) return true;
  entry.count++;
  return false;
}

function generateICS(event: {
  title: string;
  startTime: Date;
  endTime?: Date | null;
  venueName: string;
  venueAddress: string;
  description: string;
}): string {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = event.endTime
    ? fmt(new Date(event.endTime))
    : fmt(new Date(new Date(event.startTime).getTime() + 3 * 60 * 60 * 1000));

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kaustav & Himasree Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${randomUUID()}@wedding.app`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(new Date(event.startTime))}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${event.venueName}, ${event.venueAddress}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function generateSlug(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 20);
  return `${base}-${randomUUID().split("-")[0]}`;
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.use(cookieParser());

  app.get("/api/config", async (_req, res) => {
    const config = await storage.getWeddingConfig();
    if (!config) return res.json(null);
    const { adminPasswordHash: _, ...safe } = config;
    res.json(safe);
  });

  app.post("/api/increment-view", async (_req, res) => {
    try {
      const config = await storage.getWeddingConfig();
      if (!config) return res.status(404).json({ error: "Config not found" });

      await storage.upsertWeddingConfig({ viewCount: (config.viewCount || 0) + 1 });
      res.json({ success: true });
    } catch (error) {
      console.error("Error incrementing view count:", error);
      res.status(500).json({ error: "Failed to increment view count" });
    }
  });

  app.get("/api/events", async (_req, res) => {
    const events = await storage.getWeddingEvents();
    res.json(events);
  });

  app.get("/api/stories", async (_req, res) => {
    const stories = await storage.getStoryMilestones();
    res.json(stories);
  });

  app.get("/api/venues", async (_req, res) => {
    const venueList = await storage.getVenues();
    res.json(venueList);
  });

  app.get("/api/faqs", async (_req, res) => {
    const faqList = await storage.getFaqs();
    res.json(faqList);
  });

  app.get("/api/invite/:slug", async (req, res) => {
    const guest = await storage.getGuestBySlug(req.params.slug);
    if (!guest) return res.status(404).json({ error: "Invite not found" });
    const { id, name, email, phone, rsvpStatus, adultsCount, childrenCount, foodPreference, eventsAttending, dietaryRequirements, message, whatsappOptIn, side } = guest;
    res.json({ id, name, email, phone, rsvpStatus, adultsCount, childrenCount, foodPreference, eventsAttending, dietaryRequirements, message, whatsappOptIn, side });
  });

  app.get("/api/guests/by-phone", async (req, res) => {
    const phone = req.query.phone as string;
    if (!phone) return res.status(400).json({ error: "Phone number required" });

    const normalizedPhone = phone.replace(/\s+/g, "").trim();
    const guest = await storage.getGuestByPhone(normalizedPhone);

    if (!guest) return res.status(404).json({ error: "Guest not found" });

    const { id, name, email, rsvpStatus, adultsCount, childrenCount, foodPreference, eventsAttending, dietaryRequirements, message, whatsappOptIn, side } = guest;
    res.json({ id, name, email, phone: guest.phone, rsvpStatus, adultsCount, childrenCount, foodPreference, eventsAttending, dietaryRequirements, message, whatsappOptIn, side });
  });

  app.post("/api/rsvp", async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress || "unknown";
    if (isRateLimited(ip, 5, 60_000)) {
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }

    const parsed = rsvpSubmitSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid RSVP data", details: parsed.error.flatten() });
    }

    const data = parsed.data;
    const guest = await storage.getGuestBySlug(data.slug);
    if (!guest) return res.status(404).json({ error: "Invite not found" });

    const updates = {
      rsvpStatus: data.rsvpStatus,
      adultsCount: data.adultsCount,
      childrenCount: data.childrenCount,
      foodPreference: data.foodPreference,
      eventsAttending: data.eventsAttending.trim(),
      dietaryRequirements: data.dietaryRequirements.trim().slice(0, 500),
      message: data.message.trim().slice(0, 1000),
      whatsappOptIn: data.whatsappOptIn,
      phone: data.phone.trim().slice(0, 20),
      email: (data.email || "").trim().slice(0, 255),
    };

    const updated = await storage.updateGuest(guest.id, updates);
    if (!updated) return res.status(500).json({ error: "Failed to update RSVP" });

    if (updates.whatsappOptIn && updates.rsvpStatus === "confirmed" && updates.phone) {
      sendRsvpConfirmation({
        id: updated.id,
        name: updated.name,
        phone: updates.phone,
      }).catch((err) => console.error("[RSVP] WhatsApp send failed:", err));
    }

    res.json({ success: true, rsvpStatus: updated.rsvpStatus });
  });

  app.post("/api/rsvp/public", async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress || "unknown";
    if (isRateLimited(ip, 5, 60_000)) {
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }

    const parsed = publicRsvpSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid RSVP data", details: parsed.error.flatten() });
    }

    const data = parsed.data;
    const normalizedPhone = data.phone.replace(/\s+/g, "").trim();
    const normalizedEmail = (data.email || "").trim().toLowerCase();

    // Check by phone to update existing guest record
    let guest = normalizedPhone ? await storage.getGuestByPhone(normalizedPhone) : null;

    if (guest) {
      const updated = await storage.updateGuest(guest.id, {
        name: data.name,
        rsvpStatus: data.rsvpStatus,
        adultsCount: data.rsvpStatus === "declined" ? 0 : data.adultsCount,
        childrenCount: data.rsvpStatus === "declined" ? 0 : data.childrenCount,
        foodPreference: data.rsvpStatus === "declined" ? "" : (data.foodPreference || "vegetarian"),
        eventsAttending: data.rsvpStatus === "declined" ? "" : data.eventsAttending.trim(),
        dietaryRequirements: data.dietaryRequirements.trim().slice(0, 500),
        message: data.message.trim().slice(0, 1000),
        whatsappOptIn: data.whatsappOptIn,
        email: (data.email || "").trim(),
        side: data.side, // Preserve side on update
      });
      if (!updated) return res.status(500).json({ error: "Failed to update RSVP" });

      if (data.whatsappOptIn && data.rsvpStatus === "confirmed" && normalizedPhone) {
        sendRsvpConfirmation({ id: updated.id, name: updated.name, phone: normalizedPhone })
          .catch((err) => console.error("[RSVP] WhatsApp send failed:", err));
      }

      return res.json({ success: true, rsvpStatus: updated.rsvpStatus, isNew: false });
    }

    const slug = generateSlug(data.name);
    const newGuest = await storage.createGuest({
      name: data.name,
      phone: normalizedPhone,
      email: (data.email || "").trim(),
      inviteSlug: slug,
      rsvpStatus: data.rsvpStatus,
      adultsCount: data.rsvpStatus === "declined" ? 0 : data.adultsCount,
      childrenCount: data.rsvpStatus === "declined" ? 0 : data.childrenCount,
      foodPreference: data.rsvpStatus === "declined" ? "" : (data.foodPreference || "vegetarian"),
      eventsAttending: data.rsvpStatus === "declined" ? "" : data.eventsAttending.trim(),
      dietaryRequirements: data.dietaryRequirements.trim().slice(0, 500),
      message: data.message.trim().slice(0, 1000),
      whatsappOptIn: data.whatsappOptIn,
      side: data.side, // Now properly validated by schema
      tableNumber: null,
    });

    if (data.whatsappOptIn && data.rsvpStatus === "confirmed" && normalizedPhone) {
      sendRsvpConfirmation({ id: newGuest.id, name: newGuest.name, phone: normalizedPhone })
        .catch((err) => console.error("[RSVP] WhatsApp send failed:", err));
    }

    res.status(201).json({ success: true, rsvpStatus: newGuest.rsvpStatus, isNew: true });
  });

  app.get("/api/events/:id/calendar", async (req, res) => {
    const event = await storage.getWeddingEventById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const ics = generateICS({
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      venueName: event.venueName,
      venueAddress: event.venueAddress,
      description: event.description,
    });

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${event.title.replace(/\s+/g, "_")}.ics"`);
    res.send(ics);
  });

  app.post("/api/webhooks/whatsapp", (req, res) => {
    const signature = req.headers["x-hub-signature-256"] as string;
    const rawBody = JSON.stringify(req.body);

    if (!verifyWebhookSignature(rawBody, signature)) {
      return res.status(403).json({ error: "Invalid webhook signature" });
    }

    const entry = req.body?.entry?.[0];
    const change = entry?.changes?.[0];
    const statuses = change?.value?.statuses;

    if (statuses) {
      for (const status of statuses) {
        console.log(`[Webhook] Message ${status.id} status: ${status.status}`);
      }
    }

    res.json({ received: true });
  });

  app.get("/api/webhooks/whatsapp", (req, res) => {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === verifyToken) {
      res.status(200).send(challenge);
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    const schema = z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid credentials" });

    const user = await storage.getUserByUsername(parsed.data.username);
    if (!user) return res.status(401).json({ error: "Invalid username or password" });

    const valid = await bcrypt.compare(parsed.data.password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid username or password" });

    setAuthCookie(res, { userId: user.id, username: user.username });
    res.json({ success: true, username: user.username });
  });

  app.post("/api/admin/logout", requireAdmin, (_req, res) => {
    clearAuthCookie(res);
    res.json({ success: true });
  });

  app.get("/api/admin/me", requireAdmin, (req, res) => {
    res.json({ admin: (req as any).admin });
  });

  app.get("/api/admin/config", requireAdmin, async (_req, res) => {
    const config = await storage.getWeddingConfig();
    res.json(config);
  });

  app.patch("/api/admin/config", requireAdmin, async (req, res) => {
    const schema = z.object({
      weddingDate: z.string().datetime().optional(),
      dateConfirmed: z.boolean().optional(),
      venueName: z.string().max(200).optional(),
      venueAddress: z.string().max(500).optional(),
      venueMapUrl: z.string().url().optional().or(z.literal("")),
      coupleStory: z.string().max(5000).optional(),
      whatsappEnabled: z.boolean().optional(),
      upiId: z.string().max(200).optional(),
      backgroundMusicUrl: z.string().optional().or(z.literal("")),
      groomMusicUrls: z.array(z.string()).optional(),
      brideMusicUrls: z.array(z.string()).optional(),
      groomPhone: z.string().max(20).optional(),
      bridePhone: z.string().max(20).optional(),
      groomWhatsapp: z.string().max(20).optional(),
      brideWhatsapp: z.string().max(20).optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid config data", details: parsed.error.flatten() });

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.weddingDate) {
      updateData.weddingDate = new Date(parsed.data.weddingDate);
    }

    const config = await storage.upsertWeddingConfig(updateData as any);
    const { adminPasswordHash: _, ...safe } = config;
    res.json(safe);
  });

  app.get("/api/admin/guests", requireAdmin, async (_req, res) => {
    const guestList = await storage.getGuests();
    res.json(guestList);
  });

  app.post("/api/admin/guests", requireAdmin, async (req, res) => {
    const schema = z.object({
      name: z.string().min(1).max(200),
      email: z.string().email().optional().or(z.literal("")),
      phone: z.string().max(20).optional().or(z.literal("")),
      side: z.enum(["bride", "groom", "both"]).default("both"),
      tableNumber: z.number().int().positive().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid guest data", details: parsed.error.flatten() });

    const slug = generateSlug(parsed.data.name);
    const guest = await storage.createGuest({
      ...parsed.data,
      email: parsed.data.email || "",
      phone: parsed.data.phone || "",
      inviteSlug: slug,
      rsvpStatus: "pending",
      whatsappOptIn: false,
      adultsCount: 1,
      childrenCount: 0,
      foodPreference: "vegetarian",
      eventsAttending: "",
      dietaryRequirements: "",
      message: "",
      tableNumber: parsed.data.tableNumber ?? null,
    });
    res.status(201).json(guest);
  });

  app.patch("/api/admin/guests/:id", requireAdmin, async (req, res) => {
    const schema = z.object({
      name: z.string().min(1).max(200).optional(),
      email: z.string().email().optional().or(z.literal("")),
      phone: z.string().max(20).optional(),
      side: z.enum(["bride", "groom", "both"]).optional(),
      tableNumber: z.number().int().positive().nullable().optional(),
      rsvpStatus: z.enum(["pending", "confirmed", "declined"]).optional(),
      whatsappOptIn: z.boolean().optional(),
      adultsCount: z.number().int().min(1).max(20).optional(),
      childrenCount: z.number().int().min(0).max(20).optional(),
      foodPreference: z.enum(["vegetarian", "non-vegetarian"]).optional(),
      eventsAttending: z.string().optional(),
      dietaryRequirements: z.string().max(500).optional(),
      message: z.string().max(1000).optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

    const updated = await storage.updateGuest(String(req.params.id), parsed.data as any);
    if (!updated) return res.status(404).json({ error: "Guest not found" });
    res.json(updated);
  });

  app.delete("/api/admin/guests/:id", requireAdmin, async (req, res) => {
    await storage.deleteGuest(String(req.params.id));
    res.json({ success: true });
  });

  app.get("/api/admin/guests/export", requireAdmin, async (req, res) => {
    const allGuests = await storage.getGuests();
    const events = await storage.getWeddingEvents();

    // Get filter parameters
    const eventFilter = req.query.event as string || "";
    const foodFilter = req.query.food as string || "";
    const sideFilter = req.query.side as string || "";

    // Filter guests based on parameters
    let guestList = allGuests.filter(g => g.rsvpStatus !== "declined");

    if (eventFilter) {
      guestList = guestList.filter(g => g.eventsAttending.includes(eventFilter));
    }
    if (foodFilter) {
      guestList = guestList.filter(g => g.foodPreference === foodFilter);
    }
    if (sideFilter) {
      guestList = guestList.filter(g => g.side === sideFilter);
    }

    // Create a map of event IDs to event names
    const eventMap = new Map(events.map(e => [e.id, e.title]));

    const headers = [
      "Name", "Email", "Phone", "Side", "RSVP Status",
      "Adults", "Children", "Food Preference", "Events Attending",
      "Dietary Requirements", "WhatsApp Opt-In", "Table Number", "Message", "Invite Slug",
    ];

    const rows = guestList.map((g) => {
      // Convert event IDs to event names
      const eventIds = g.eventsAttending.split(",").filter(Boolean);
      const eventNames = eventIds.map(id => eventMap.get(id) || id).join(", ");

      return [
        g.name, g.email, g.phone, g.side, g.rsvpStatus,
        g.adultsCount, g.childrenCount, g.foodPreference, eventNames,
        g.dietaryRequirements, g.whatsappOptIn ? "Yes" : "No", g.tableNumber ?? "",
        g.message.replace(/"/g, '""'), g.inviteSlug,
      ];
    });

    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
    ].join("\n");

    // Generate filename based on filters
    let filename = "wedding_guests";
    if (eventFilter || foodFilter || sideFilter) {
      const filterParts = [];
      if (eventFilter) {
        const event = events.find(e => e.id === eventFilter);
        filterParts.push(event?.title.replace(/\s+/g, "_") || "event");
      }
      if (foodFilter) filterParts.push(foodFilter);
      if (sideFilter) filterParts.push(sideFilter);
      filename += "_" + filterParts.join("_");
    }
    filename += ".csv";

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csv);
  });

  app.get("/api/admin/events", requireAdmin, async (_req, res) => {
    const events = await storage.getWeddingEvents();
    res.json(events);
  });

  app.post("/api/admin/events", requireAdmin, async (req, res) => {
    const schema = z.object({
      title: z.string().min(1).max(200),
      description: z.string().max(2000).default(""),
      startTime: z.string().datetime(),
      endTime: z.string().datetime().optional().nullable(),
      venueName: z.string().max(200).default(""),
      venueAddress: z.string().max(500).default(""),
      venueMapUrl: z.string().url().optional().or(z.literal("")),
      isMainEvent: z.boolean().default(false),
      dressCode: z.string().max(200).default(""),
      sortOrder: z.number().int().default(0),
      howToReach: z.string().max(1000).default(""),
      accommodation: z.string().max(1000).default(""),
      distanceInfo: z.string().max(500).default(""),
      contactPerson: z.string().max(200).default(""),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid event data", details: parsed.error.flatten() });

    const event = await storage.createWeddingEvent({
      ...parsed.data,
      startTime: new Date(parsed.data.startTime),
      endTime: parsed.data.endTime ? new Date(parsed.data.endTime) : null,
      venueMapUrl: parsed.data.venueMapUrl || "",
    });
    res.status(201).json(event);
  });

  app.patch("/api/admin/events/:id", requireAdmin, async (req, res) => {
    const schema = z.object({
      title: z.string().min(1).max(200).optional(),
      description: z.string().max(2000).optional(),
      startTime: z.string().datetime().optional(),
      endTime: z.string().datetime().nullable().optional(),
      venueName: z.string().max(200).optional(),
      venueAddress: z.string().max(500).optional(),
      venueMapUrl: z.string().url().optional().or(z.literal("")),
      isMainEvent: z.boolean().optional(),
      dressCode: z.string().max(200).optional(),
      sortOrder: z.number().int().optional(),
      howToReach: z.string().max(1000).optional(),
      accommodation: z.string().max(1000).optional(),
      distanceInfo: z.string().max(500).optional(),
      contactPerson: z.string().max(200).optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.startTime) updateData.startTime = new Date(parsed.data.startTime);
    if (parsed.data.endTime !== undefined) updateData.endTime = parsed.data.endTime ? new Date(parsed.data.endTime) : null;

    const updated = await storage.updateWeddingEvent(String(req.params.id), updateData as any);
    if (!updated) return res.status(404).json({ error: "Event not found" });
    res.json(updated);
  });

  app.delete("/api/admin/events/:id", requireAdmin, async (req, res) => {
    await storage.deleteWeddingEvent(String(req.params.id));
    res.json({ success: true });
  });

  app.get("/api/admin/stories", requireAdmin, async (_req, res) => {
    const stories = await storage.getStoryMilestones();
    res.json(stories);
  });

  app.post("/api/admin/stories", requireAdmin, async (req, res) => {
    const schema = z.object({
      title: z.string().min(1).max(200),
      date: z.string().min(1).max(100),
      description: z.string().max(2000),
      imageUrl: z.string().max(500).default(""),
      sortOrder: z.number().int().default(0),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

    const milestone = await storage.createStoryMilestone(parsed.data);
    res.status(201).json(milestone);
  });

  app.patch("/api/admin/stories/:id", requireAdmin, async (req, res) => {
    const schema = z.object({
      title: z.string().min(1).max(200).optional(),
      date: z.string().min(1).max(100).optional(),
      description: z.string().max(2000).optional(),
      imageUrl: z.string().max(500).optional(),
      sortOrder: z.number().int().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

    const updated = await storage.updateStoryMilestone(String(req.params.id), parsed.data);
    if (!updated) return res.status(404).json({ error: "Story not found" });
    res.json(updated);
  });

  app.delete("/api/admin/stories/:id", requireAdmin, async (req, res) => {
    await storage.deleteStoryMilestone(String(req.params.id));
    res.json({ success: true });
  });

  app.get("/api/admin/venues", requireAdmin, async (_req, res) => {
    const venueList = await storage.getVenues();
    res.json(venueList);
  });

  app.post("/api/admin/venues", requireAdmin, async (req, res) => {
    const schema = z.object({
      name: z.string().min(1).max(200),
      address: z.string().max(500).default(""),
      description: z.string().max(2000).default(""),
      mapUrl: z.string().max(500).default(""),
      mapEmbedUrl: z.string().max(500).default(""),
      directions: z.string().max(2000).default(""),
      accommodation: z.string().max(2000).default(""),
      contactInfo: z.string().max(500).default(""),
      imageUrl: z.string().max(500).default(""),
      sortOrder: z.number().int().default(0),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

    const venue = await storage.createVenue(parsed.data);
    res.status(201).json(venue);
  });

  app.patch("/api/admin/venues/:id", requireAdmin, async (req, res) => {
    const schema = z.object({
      name: z.string().min(1).max(200).optional(),
      address: z.string().max(500).optional(),
      description: z.string().max(2000).optional(),
      mapUrl: z.string().max(500).optional(),
      mapEmbedUrl: z.string().max(500).optional(),
      directions: z.string().max(2000).optional(),
      accommodation: z.string().max(2000).optional(),
      contactInfo: z.string().max(500).optional(),
      imageUrl: z.string().max(500).optional(),
      sortOrder: z.number().int().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

    const updated = await storage.updateVenue(String(req.params.id), parsed.data);
    if (!updated) return res.status(404).json({ error: "Venue not found" });
    res.json(updated);
  });

  app.delete("/api/admin/venues/:id", requireAdmin, async (req, res) => {
    await storage.deleteVenue(String(req.params.id));
    res.json({ success: true });
  });

  app.get("/api/admin/faqs", requireAdmin, async (_req, res) => {
    const faqList = await storage.getFaqs();
    res.json(faqList);
  });

  app.post("/api/admin/faqs", requireAdmin, async (req, res) => {
    const schema = z.object({
      question: z.string().min(1).max(500),
      answer: z.string().min(1).max(2000),
      category: z.string().max(100).default("general"),
      sortOrder: z.number().int().default(0),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

    const faq = await storage.createFaq(parsed.data);
    res.status(201).json(faq);
  });

  app.patch("/api/admin/faqs/:id", requireAdmin, async (req, res) => {
    const schema = z.object({
      question: z.string().min(1).max(500).optional(),
      answer: z.string().min(1).max(2000).optional(),
      category: z.string().max(100).optional(),
      sortOrder: z.number().int().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

    const updated = await storage.updateFaq(String(req.params.id), parsed.data);
    if (!updated) return res.status(404).json({ error: "FAQ not found" });
    res.json(updated);
  });

  app.delete("/api/admin/faqs/:id", requireAdmin, async (req, res) => {
    await storage.deleteFaq(String(req.params.id));
    res.json({ success: true });
  });

  app.get("/api/admin/message-logs", requireAdmin, async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const logs = await storage.getMessageLogs(limit);
    res.json(logs);
  });

  app.post("/api/admin/whatsapp/send", requireAdmin, async (req, res) => {
    const schema = z.object({
      guestId: z.string(),
      messageType: z.string().min(1),
      templateName: z.string().min(1),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data" });

    const guest = await storage.getGuestById(parsed.data.guestId);
    if (!guest) return res.status(404).json({ error: "Guest not found" });
    if (!guest.phone) return res.status(400).json({ error: "Guest has no phone number" });

    const { sendMessage, buildBodyComponents } = await import("./services/whatsapp");
    await sendMessage({
      guestId: guest.id,
      guestName: guest.name,
      phone: guest.phone,
      templateName: parsed.data.templateName,
      messageType: parsed.data.messageType,
      components: buildBodyComponents([guest.name]),
    });

    res.json({ success: true });
  });

  app.post("/api/admin/whatsapp/toggle", requireAdmin, async (req, res) => {
    const schema = z.object({ enabled: z.boolean() });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data" });

    const config = await storage.upsertWeddingConfig({ whatsappEnabled: parsed.data.enabled });
    res.json({ whatsappEnabled: config.whatsappEnabled });
  });

  return httpServer;
}
