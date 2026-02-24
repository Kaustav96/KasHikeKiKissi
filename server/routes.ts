/**
 * API Routes for Kaustav & Himasree Wedding Application
 *
 * Structure:
 *   Public routes  → /api/*
 *   Admin routes   → /api/admin/* (JWT protected)
 *   Webhook routes → /api/webhooks/*
 */

import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import cookieParser from "cookie-parser";
import { storage } from "./storage";
import { requireAdmin, setAuthCookie, clearAuthCookie } from "./middleware/auth";
import { rsvpSubmitSchema, insertGuestSchema, insertWeddingEventSchema } from "@shared/schema";
import { sendRsvpConfirmation } from "./services/whatsapp";
import { verifyWebhookSignature } from "./services/whatsapp";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { randomUUID } from "crypto";

// ─── Rate Limiting (simple in-memory) ────────────────────────────────────────
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

// ─── ICS Calendar generation ──────────────────────────────────────────────────
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

// ─── Slug generation ──────────────────────────────────────────────────────────
function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 20);
  const suffix = randomUUID().split("-")[0]; // 8 hex chars for uniqueness
  return `${base}-${suffix}`;
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.use(cookieParser());

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PUBLIC ROUTES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // GET /api/config — Public wedding configuration (strips sensitive fields)
  app.get("/api/config", async (_req, res) => {
    const config = await storage.getWeddingConfig();
    if (!config) return res.json(null);
    // Never expose admin password hash to public
    const { adminPasswordHash: _, ...safe } = config;
    res.json(safe);
  });

  // GET /api/events — Public list of wedding events
  app.get("/api/events", async (_req, res) => {
    const events = await storage.getWeddingEvents();
    res.json(events);
  });

  // GET /api/invite/:slug — Fetch invite details (safe, no enumeration risk via random slug)
  app.get("/api/invite/:slug", async (req, res) => {
    const guest = await storage.getGuestBySlug(req.params.slug);
    if (!guest) return res.status(404).json({ error: "Invite not found" });
    // Return only safe fields
    const { id, name, email, phone, rsvpStatus, plusOne, plusOneName, dietaryRequirements, message, whatsappOptIn, side } = guest;
    res.json({ id, name, email, phone, rsvpStatus, plusOne, plusOneName, dietaryRequirements, message, whatsappOptIn, side });
  });

  // POST /api/rsvp — Submit RSVP (rate limited, validated, sanitized)
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

    // Sanitize inputs
    const updates = {
      rsvpStatus: data.rsvpStatus,
      plusOne: data.plusOne,
      plusOneName: data.plusOneName.trim().slice(0, 100),
      dietaryRequirements: data.dietaryRequirements.trim().slice(0, 500),
      message: data.message.trim().slice(0, 1000),
      whatsappOptIn: data.whatsappOptIn,
      phone: data.phone.trim().slice(0, 20),
      email: (data.email || "").trim().slice(0, 255),
    };

    const updated = await storage.updateGuest(guest.id, updates);
    if (!updated) return res.status(500).json({ error: "Failed to update RSVP" });

    // If guest opted into WhatsApp and confirmed, send confirmation message
    if (updates.whatsappOptIn && updates.rsvpStatus === "confirmed" && updates.phone) {
      sendRsvpConfirmation({
        id: updated.id,
        name: updated.name,
        phone: updates.phone,
      }).catch((err) => console.error("[RSVP] WhatsApp send failed:", err));
    }

    res.json({ success: true, rsvpStatus: updated.rsvpStatus });
  });

  // GET /api/events/:id/calendar — Download ICS file for an event
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

  // POST /api/webhooks/whatsapp — WhatsApp status webhook (with signature verification)
  app.post("/api/webhooks/whatsapp", (req, res) => {
    const signature = req.headers["x-hub-signature-256"] as string;
    const rawBody = JSON.stringify(req.body);

    if (!verifyWebhookSignature(rawBody, signature)) {
      return res.status(403).json({ error: "Invalid webhook signature" });
    }

    // Process message status updates (delivered, read, failed)
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

  // GET /api/webhooks/whatsapp — Webhook verification challenge
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

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ADMIN AUTH
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // POST /api/admin/login
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

  // POST /api/admin/logout
  app.post("/api/admin/logout", requireAdmin, (_req, res) => {
    clearAuthCookie(res);
    res.json({ success: true });
  });

  // GET /api/admin/me — Check auth status
  app.get("/api/admin/me", requireAdmin, (req, res) => {
    res.json({ admin: (req as any).admin });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ADMIN — CONFIG
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ADMIN — GUESTS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
      plusOne: false,
      plusOneName: "",
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
      plusOne: z.boolean().optional(),
      plusOneName: z.string().max(100).optional(),
      dietaryRequirements: z.string().max(500).optional(),
      message: z.string().max(1000).optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

    const updated = await storage.updateGuest(req.params.id, parsed.data as any);
    if (!updated) return res.status(404).json({ error: "Guest not found" });
    res.json(updated);
  });

  app.delete("/api/admin/guests/:id", requireAdmin, async (req, res) => {
    await storage.deleteGuest(req.params.id);
    res.json({ success: true });
  });

  // GET /api/admin/guests/export — Download CSV of all guests
  app.get("/api/admin/guests/export", requireAdmin, async (_req, res) => {
    const guestList = await storage.getGuests();

    const headers = [
      "Name", "Email", "Phone", "Side", "RSVP Status",
      "Plus One", "Plus One Name", "Dietary Requirements",
      "WhatsApp Opt-In", "Table Number", "Message", "Invite Slug",
    ];

    const rows = guestList.map((g) => [
      g.name, g.email, g.phone, g.side, g.rsvpStatus,
      g.plusOne ? "Yes" : "No", g.plusOneName, g.dietaryRequirements,
      g.whatsappOptIn ? "Yes" : "No", g.tableNumber ?? "",
      g.message.replace(/"/g, '""'), g.inviteSlug,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=\"wedding_guests.csv\"");
    res.send(csv);
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ADMIN — EVENTS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.startTime) updateData.startTime = new Date(parsed.data.startTime);
    if (parsed.data.endTime !== undefined) updateData.endTime = parsed.data.endTime ? new Date(parsed.data.endTime) : null;

    const updated = await storage.updateWeddingEvent(req.params.id, updateData as any);
    if (!updated) return res.status(404).json({ error: "Event not found" });
    res.json(updated);
  });

  app.delete("/api/admin/events/:id", requireAdmin, async (req, res) => {
    await storage.deleteWeddingEvent(req.params.id);
    res.json({ success: true });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ADMIN — WHATSAPP & MESSAGE LOGS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  app.get("/api/admin/message-logs", requireAdmin, async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const logs = await storage.getMessageLogs(limit);
    res.json(logs);
  });

  // POST /api/admin/whatsapp/send — Manually send a WhatsApp message to a guest
  app.post("/api/admin/whatsapp/send", requireAdmin, async (req, res) => {
    const schema = z.object({
      guestId: z.string().uuid(),
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

  // POST /api/admin/whatsapp/toggle — Enable/disable WhatsApp automation
  app.post("/api/admin/whatsapp/toggle", requireAdmin, async (req, res) => {
    const schema = z.object({ enabled: z.boolean() });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data" });

    const config = await storage.upsertWeddingConfig({ whatsappEnabled: parsed.data.enabled });
    res.json({ whatsappEnabled: config.whatsappEnabled });
  });

  return httpServer;
}
