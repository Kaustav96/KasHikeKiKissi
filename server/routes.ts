import type { Express } from "express";
import { createServer, type Server } from "http";
import cookieParser from "cookie-parser";
import { storage } from "./storage";
import { requireAdmin, setAuthCookie, clearAuthCookie } from "./middleware/auth";
import { rsvpSubmitSchema, publicRsvpSchema, guests, weddingConfig } from "../shared/schema.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { randomUUID } from "crypto";
import { and, eq, sql } from "drizzle-orm";
import { db } from "./db.js";

/* =========================================================
   Utilities
========================================================= */

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

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 20);

  return `${base}-${randomUUID().split("-")[0]}`;
}

/* =========================================================
   Routes
========================================================= */

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(cookieParser());

  /* ================= PUBLIC ================= */

  app.post("/api/increment-view", async (_req, res) => {
    try {
      await db
        .update(weddingConfig)
        .set({
          viewCount: sql`${weddingConfig.viewCount} + 1`,
          updatedAt: new Date(),
        });

      res.json({ success: true });

    } catch (error) {
      console.error("Error incrementing view count:", error);
      res.status(500).json({ error: "Failed to increment view count" });
    }
  });
  app.get("/api/guests/by-name", async (req, res) => {
    const name = req.query.name as string;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const guest = await storage.getGuestByName(name);
    if (!guest) return res.status(404).json({ error: "Guest not found" });

    res.json(guest);
  });
  app.get("/api/config", async (_req, res) => {
    const config = await storage.getWeddingConfig();
    if (!config) return res.json(null);

    const { adminPasswordHash: _, ...safe } = config;
    res.json(safe);
  });

  app.get("/api/events", async (_req, res) => {
    res.json(await storage.getWeddingEvents());
  });
  app.get("/api/events/:id/calendar", async (req, res) => {
    try {
      const event = await storage.getWeddingEventById(req.params.id);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const ics = generateICS({
        title: event.title,
        startTime: event.startTime,
        endTime: event.endTime ?? undefined,
        venueName: event.venueName,
        venueAddress: event.venueAddress,
        description: event.description,
      });

      // Clean filename
      const safeFileName = event.title
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");

      res.setHeader("Content-Type", "text/calendar; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${safeFileName}.ics"`
      );

      res.send(ics);

    } catch (error) {
      console.error("Calendar generation error:", error);
      res.status(500).json({ error: "Failed to generate calendar file" });
    }
  });
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

  app.get("/api/stories", async (_req, res) => {
    res.json(await storage.getStoryMilestones());
  });

  app.get("/api/venues", async (_req, res) => {
    res.json(await storage.getVenues());
  });

  app.get("/api/faqs", async (_req, res) => {
    res.json(await storage.getFaqs());
  });

  app.get("/api/invite/:slug", async (req, res) => {
    const guest = await storage.getGuestBySlug(req.params.slug);
    if (!guest) return res.status(404).json({ error: "Invite not found" });

    res.json(guest);
  });

  /* ================= RSVP ================= */

  app.post("/api/rsvp", async (req, res) => {
    const ip = req.ip || "unknown";
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: "Too many requests" });
    }

    const parsed = rsvpSubmitSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid RSVP data" });
    }

    const data = parsed.data;
    const guest = await storage.getGuestBySlug(data.slug);
    if (!guest) return res.status(404).json({ error: "Invite not found" });

    const updated = await storage.updateGuest(guest.id, {
      rsvpStatus: data.rsvpStatus,
      adultsCount: data.rsvpStatus === "declined" ? 0 : data.adultsCount,
      childrenCount: data.rsvpStatus === "declined" ? 0 : data.childrenCount,
      foodPreference:
        data.rsvpStatus === "declined" ? "" : data.foodPreference,
      eventsAttending:
        data.rsvpStatus === "declined" ? [] : data.eventsAttending,
      dietaryRequirements: data.dietaryRequirements,
      message: data.message,
    });

    res.json({ success: true, rsvpStatus: updated?.rsvpStatus });
  });

  app.post("/api/rsvp/public", async (req, res) => {
    const ip = req.ip || "unknown";
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: "Too many requests" });
    }

    if (typeof req.body.eventsAttending === "string") {
      req.body.eventsAttending = req.body.eventsAttending
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    const parsed = publicRsvpSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid RSVP data" });
    }

    const data = parsed.data;
    const existing = await storage.getGuestByName(data.name);


    if (existing) {
      const updated = await storage.updateGuest(existing.id, {
        rsvpStatus: data.rsvpStatus,
        adultsCount: data.adultsCount,
        childrenCount: data.childrenCount,
        foodPreference: data.foodPreference,
        eventsAttending:
          data.rsvpStatus === "declined" ? [] : data.eventsAttending,
        dietaryRequirements: data.dietaryRequirements,
        message: data.message,
      });

      return res.json({
        success: true,
        rsvpStatus: updated?.rsvpStatus,
        isNew: false,
      });
    }

    const slug = generateSlug(data.name);

    const newGuest = await storage.createGuest({
      name: data.name,
      inviteSlug: slug,
      rsvpStatus: data.rsvpStatus,
      adultsCount: data.adultsCount,
      childrenCount: data.childrenCount,
      foodPreference:
        data.rsvpStatus === "declined"
          ? ""
          : data.foodPreference || "vegetarian",
      eventsAttending:
        data.rsvpStatus === "declined" ? [] : data.eventsAttending,
      dietaryRequirements: data.dietaryRequirements,
      message: data.message,
      side: data.side,
      tableNumber: null,
    });

    res.status(201).json({
      success: true,
      rsvpStatus: newGuest.rsvpStatus,
      isNew: true,
    });
  });

  /* ================= ADMIN ================= */

  app.post("/api/admin/login", async (req, res) => {
    const schema = z.object({
      username: z.string(),
      password: z.string(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid" });

    const user = await storage.getUserByUsername(parsed.data.username);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(parsed.data.password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    setAuthCookie(res, { userId: user.id, username: user.username });
    res.json({ success: true });
  });

  app.post("/api/admin/logout", requireAdmin, (_req, res) => {
    clearAuthCookie(res);
    res.json({ success: true });
  });
  app.get("/api/admin/me", requireAdmin, (req, res) => {
    res.json({ admin: (req as any).admin });
  });
  app.patch("/api/admin/config", requireAdmin, async (req, res) => {
    const schema = z.object({
      weddingDate: z.string().datetime().nullable().optional(),
      dateConfirmed: z.boolean().optional(),
      venueName: z.string().max(200).optional(),
      venueAddress: z.string().max(500).optional(),
      venueMapUrl: z.string().url().optional().or(z.literal("")),
      coupleStory: z.string().max(5000).optional(),
      upiId: z.string().max(200).optional(),
      backgroundMusicUrl: z.string().optional().or(z.literal("")),
      groomMusicUrls: z.array(z.string()).optional(),
      brideMusicUrls: z.array(z.string()).optional(),
    });
    try {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid config data" });
      }

      const existing = await storage.getWeddingConfig();
      if (!existing) {
        return res.status(404).json({ error: "Config not found" });
      }

      const data = parsed.data;

      const updateData: any = {
        updatedAt: new Date(),
      };

      if (data.weddingDate !== undefined) {
        updateData.weddingDate =
          data.weddingDate === null ? null : new Date(data.weddingDate);
      }

      if (data.dateConfirmed !== undefined)
        updateData.dateConfirmed = data.dateConfirmed;

      if (data.coupleStory !== undefined)
        updateData.coupleStory = data.coupleStory;

      if (data.upiId !== undefined)
        updateData.upiId = data.upiId;

      if (data.backgroundMusicUrl !== undefined)
        updateData.backgroundMusicUrl = data.backgroundMusicUrl;

      if (data.groomMusicUrls !== undefined)
        updateData.groomMusicUrls = data.groomMusicUrls;

      if (data.brideMusicUrls !== undefined)
        updateData.brideMusicUrls = data.brideMusicUrls;

      const [updated] = await db
        .update(weddingConfig)
        .set(updateData)
        .where(eq(weddingConfig.id, existing.id))
        .returning();

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save config" });
    }
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
      // isMainEvent: z.boolean().default(false),
      isMainEvent: z
        .union([z.boolean(), z.string()])
        .transform((val) => {
          if (typeof val === "boolean") return val;
          return val === "true";
        })
        .optional(),
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
      isMainEvent: z
        .union([z.boolean(), z.string()])
        .transform((val) => {
          if (typeof val === "boolean") return val;
          return val === "true";
        })
        .optional(),
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
  app.delete("/api/admin/guests/:id", requireAdmin, async (req, res) => {
    await storage.deleteGuest(String(req.params.id));
    res.json({ success: true });
  });
  app.get("/api/admin/stories", requireAdmin, async (_req, res) => {
    const stories = await storage.getStoryMilestones();
    res.json(stories);
  });
  app.post("/api/admin/stories", requireAdmin, async (req, res) => {
    try {
      const schema = z.object({
        title: z.string().trim().min(1).max(200),

        date: z.string().trim().min(1).max(100),

        description: z.string().trim().max(2000),

        imageUrl: z
          .string()
          .trim()
          .max(500)
          .optional()
          .transform((val) => val || ""),

        // Handles "0" coming as string from form inputs
        sortOrder: z.coerce.number().int().default(0),
      });

      const parsed = schema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid data",
          details: parsed.error.flatten(),
        });
      }

      const milestone = await storage.createStoryMilestone(parsed.data);

      res.status(201).json(milestone);

    } catch (err) {
      console.error("Create story error:", err);
      res.status(500).json({ error: "Failed to create story milestone" });
    }
  });
  app.patch("/api/admin/stories/:id", requireAdmin, async (req, res) => {
    try {
      const schema = z.object({
        title: z.string().trim().min(1).max(200).optional(),

        date: z.string().trim().min(1).max(100).optional(),

        description: z.string().trim().max(2000).optional(),

        imageUrl: z
          .string()
          .trim()
          .max(500)
          .optional()
          .transform((val) => val ?? ""),

        // Handles "1" coming from forms
        sortOrder: z.coerce.number().int().optional(),
      });

      const parsed = schema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid data",
          details: parsed.error.flatten(),
        });
      }

      // Prevent empty PATCH
      if (Object.keys(parsed.data).length === 0) {
        return res.status(400).json({ error: "No fields provided to update" });
      }

      const updated = await storage.updateStoryMilestone(
        String(req.params.id),
        parsed.data
      );

      if (!updated) {
        return res.status(404).json({ error: "Story not found" });
      }

      res.json(updated);

    } catch (err) {
      console.error("Update story error:", err);
      res.status(500).json({ error: "Failed to update story milestone" });
    }
  });
  app.delete("/api/admin/stories/:id", requireAdmin, async (req, res) => {
    await storage.deleteStoryMilestone(String(req.params.id));
    res.json({ success: true });
  });
  app.get("/api/admin/venues", requireAdmin, async (_req, res) => {
    try {
      const venueList = await storage.getVenues();
      res.json(venueList);
    } catch (err) {
      console.error("Fetch venues error:", err);
      res.status(500).json({ error: "Failed to fetch venues" });
    }
  });
  app.post("/api/admin/venues", requireAdmin, async (req, res) => {
    try {
      const schema = z.object({
        name: z.string().trim().min(1).max(200),

        address: z.string().trim().max(500).optional().transform(v => v ?? ""),

        description: z.string().trim().max(2000).optional().transform(v => v ?? ""),

        mapUrl: z.string().trim().max(500).optional().transform(v => v ?? ""),

        mapEmbedUrl: z.string().trim().max(500).optional().transform(v => v ?? ""),

        directions: z.string().trim().max(2000).optional().transform(v => v ?? ""),

        accommodation: z.string().trim().max(2000).optional().transform(v => v ?? ""),

        contactInfo: z.string().trim().max(500).optional().transform(v => v ?? ""),

        imageUrl: z.string().trim().max(500).optional().transform(v => v ?? ""),

        sortOrder: z.coerce.number().int().default(0),
      });

      const parsed = schema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid data",
          details: parsed.error.flatten(),
        });
      }

      const venue = await storage.createVenue(parsed.data);

      res.status(201).json(venue);

    } catch (err) {
      console.error("Create venue error:", err);
      res.status(500).json({ error: "Failed to create venue" });
    }
  });
  app.patch("/api/admin/venues/:id", requireAdmin, async (req, res) => {
    try {
      const schema = z.object({
        name: z.string().trim().min(1).max(200).optional(),

        address: z.string().trim().max(500).optional(),

        description: z.string().trim().max(2000).optional(),

        mapUrl: z.string().trim().max(500).optional(),

        mapEmbedUrl: z.string().trim().max(500).optional(),

        directions: z.string().trim().max(2000).optional(),

        accommodation: z.string().trim().max(2000).optional(),

        contactInfo: z.string().trim().max(500).optional(),

        imageUrl: z.string().trim().max(500).optional(),

        sortOrder: z.coerce.number().int().optional(),
      });

      const parsed = schema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid data",
          details: parsed.error.flatten(),
        });
      }

      if (Object.keys(parsed.data).length === 0) {
        return res.status(400).json({ error: "No fields provided to update" });
      }

      const updated = await storage.updateVenue(
        String(req.params.id),
        parsed.data
      );

      if (!updated) {
        return res.status(404).json({ error: "Venue not found" });
      }

      res.json(updated);

    } catch (err) {
      console.error("Update venue error:", err);
      res.status(500).json({ error: "Failed to update venue" });
    }
  });
  app.delete("/api/admin/venues/:id", requireAdmin, async (req, res) => {
    await storage.deleteVenue(String(req.params.id));
    res.json({ success: true });
  });
  app.delete("/api/admin/faqs/:id", requireAdmin, async (req, res) => {
    await storage.deleteFaq(String(req.params.id));
    res.json({ success: true });
  });

  /* ================= ADMIN GUEST LIST (PAGINATED) ================= */

  app.get("/api/admin/guests", requireAdmin, async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = (page - 1) * limit;

    const filters = [];

    if (req.query.status) {
      filters.push(eq(guests.rsvpStatus, String(req.query.status)));
    }

    if (req.query.side) {
      filters.push(eq(guests.side, String(req.query.side)));
    }

    const whereClause = filters.length ? and(...filters) : undefined;

    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(guests)
        .where(whereClause)
        .limit(limit)
        .offset(offset),

      db
        .select({ count: sql<number>`count(*)` })
        .from(guests)
        .where(whereClause),
    ]);

    const total = Number(totalResult[0]?.count ?? 0);

    res.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });

  /* ================= EXPORT (JSONB SAFE) ================= */

  app.get("/api/admin/guests/export", requireAdmin, async (req, res) => {
    try {
      const filters = [];

      // RSVP filter (optional now, not hardcoded)
      if (req.query.rsvp) {
        filters.push(eq(guests.rsvpStatus, String(req.query.rsvp)));
      }

      if (req.query.side) {
        filters.push(eq(guests.side, String(req.query.side)));
      }

      if (req.query.food) {
        filters.push(eq(guests.foodPreference, String(req.query.food)));
      }

      // JSONB event filter (correct operator for jsonb array)
      if (req.query.event) {
        filters.push(
          sql`${guests.eventsAttending} @> ${JSON.stringify([
            String(req.query.event),
          ])}::jsonb`
        );
      }

      const whereClause = filters.length > 0 ? and(...filters) : undefined;

      const guestList = await db
        .select()
        .from(guests)
        .where(whereClause);

      const events = await storage.getWeddingEvents();
      const eventMap = new Map(events.map((e) => [e.id, e.title]));

      const headers = [
        "Name",
        "Side",
        "RSVP Status",
        "Adults",
        "Children",
        "Food Preference",
        "Events Attending",
        "Dietary Requirements",
        "Table Number",
        "Message",
        "Invite Slug",
      ];

      const escapeCsv = (value: any) =>
        `"${String(value ?? "")
          .replace(/"/g, '""')
          .replace(/\n/g, " ")}"`;

      const rows = guestList.map((g) => {
        const eventNames = Array.isArray(g.eventsAttending)
          ? g.eventsAttending
            .map((id: string) => eventMap.get(id) || id)
            .join(", ")
          : "";

        return [
          g.name,
          g.side,
          g.rsvpStatus,
          g.adultsCount,
          g.childrenCount,
          g.foodPreference,
          eventNames,
          g.dietaryRequirements,
          g.tableNumber ?? "",
          g.message,
          g.inviteSlug,
        ].map(escapeCsv);
      });

      const csv = [
        headers.map(escapeCsv).join(","),
        ...rows.map((r) => r.join(",")),
      ].join("\n");

      // ---------- Dynamic Filename ----------
      const clean = (val: string) =>
        val.toLowerCase().replace(/\s+/g, "-");

      let fileNameParts = ["guests"];

      if (req.query.rsvp)
        fileNameParts.push(clean(String(req.query.rsvp)));
      if (req.query.side)
        fileNameParts.push(clean(String(req.query.side)));
      if (req.query.food)
        fileNameParts.push(clean(String(req.query.food)));
      if (req.query.event) {
        const eventId = String(req.query.event);
        const eventTitle = eventMap.get(eventId);

        if (eventTitle) {
          const cleanEventName = eventTitle
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, ""); // remove special characters

          fileNameParts.push(cleanEventName);
        }
      }


      const date = new Date().toISOString().split("T")[0];

      const fileName = `${fileNameParts.join("_")}_${date}.csv`;

      // ---------- Headers ----------
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      res.send(csv);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Export failed" });
    }
  });

  return httpServer;
}
// import type { Express, Request, Response } from "express";
// import { createServer, type Server } from "http";
// import cookieParser from "cookie-parser";
// import { storage } from "./storage";
// import { requireAdmin, setAuthCookie, clearAuthCookie } from "./middleware/auth";
// import { rsvpSubmitSchema, publicRsvpSchema, guests } from "../shared/schema.js";
// import bcrypt from "bcryptjs";
// import { z } from "zod";
// import { randomUUID } from "crypto";
// import { and, eq, like } from "drizzle-orm";
// import { db } from "./db.js";

// const rateLimit = new Map<string, { count: number; reset: number }>();

// function isRateLimited(ip: string, limit = 5, windowMs = 60_000): boolean {
//   const now = Date.now();
//   const entry = rateLimit.get(ip);
//   if (!entry || now > entry.reset) {
//     rateLimit.set(ip, { count: 1, reset: now + windowMs });
//     return false;
//   }
//   if (entry.count >= limit) return true;
//   entry.count++;
//   return false;
// }

// function generateICS(event: {
//   title: string;
//   startTime: Date;
//   endTime?: Date | null;
//   venueName: string;
//   venueAddress: string;
//   description: string;
// }): string {
//   const fmt = (d: Date) =>
//     d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
//   const end = event.endTime
//     ? fmt(new Date(event.endTime))
//     : fmt(new Date(new Date(event.startTime).getTime() + 3 * 60 * 60 * 1000));

//   return [
//     "BEGIN:VCALENDAR",
//     "VERSION:2.0",
//     "PRODID:-//Kaustav & Himasree Wedding//EN",
//     "CALSCALE:GREGORIAN",
//     "METHOD:PUBLISH",
//     "BEGIN:VEVENT",
//     `UID:${randomUUID()}@wedding.app`,
//     `DTSTAMP:${fmt(new Date())}`,
//     `DTSTART:${fmt(new Date(event.startTime))}`,
//     `DTEND:${end}`,
//     `SUMMARY:${event.title}`,
//     `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
//     `LOCATION:${event.venueName}, ${event.venueAddress}`,
//     "STATUS:CONFIRMED",
//     "END:VEVENT",
//     "END:VCALENDAR",
//   ].join("\r\n");
// }

// function generateSlug(name: string): string {
//   const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 20);
//   return `${base}-${randomUUID().split("-")[0]}`;
// }

// export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
//   app.use(cookieParser());

//   app.get("/api/config", async (_req, res) => {
//     const config = await storage.getWeddingConfig();
//     if (!config) return res.json(null);
//     const { adminPasswordHash: _, ...safe } = config;
//     res.json(safe);
//   });

//   app.post("/api/increment-view", async (_req, res) => {
//     try {
//       const config = await storage.getWeddingConfig();
//       if (!config) return res.status(404).json({ error: "Config not found" });

//       await storage.upsertWeddingConfig({ viewCount: (config.viewCount || 0) + 1 });
//       res.json({ success: true });
//     } catch (error) {
//       console.error("Error incrementing view count:", error);
//       res.status(500).json({ error: "Failed to increment view count" });
//     }
//   });

//   app.get("/api/events", async (_req, res) => {
//     const events = await storage.getWeddingEvents();
//     res.json(events);
//   });

//   app.get("/api/stories", async (_req, res) => {
//     const stories = await storage.getStoryMilestones();
//     res.json(stories);
//   });

//   app.get("/api/venues", async (_req, res) => {
//     const venueList = await storage.getVenues();
//     res.json(venueList);
//   });

//   app.get("/api/faqs", async (_req, res) => {
//     const faqList = await storage.getFaqs();
//     res.json(faqList);
//   });

//   app.get("/api/invite/:slug", async (req, res) => {
//     const guest = await storage.getGuestBySlug(req.params.slug);
//     if (!guest) return res.status(404).json({ error: "Invite not found" });
//     const { id, name, rsvpStatus, adultsCount, childrenCount, foodPreference, eventsAttending, dietaryRequirements, message, side } = guest;
//     res.json({ id, name, rsvpStatus, adultsCount, childrenCount, foodPreference, eventsAttending, dietaryRequirements, message, side });
//   });

//   app.get("/api/guests/by-name", async (req, res) => {
//     const name = req.query.name as string;
//     if (!name) return res.status(400).json({ error: "Name is required" });

//     const guest = await storage.getGuestByName(name);
//     if (!guest) return res.status(404).json({ error: "Guest not found" });

//     res.json(guest);
//   });

//   app.post("/api/rsvp", async (req, res) => {
//     const ip = req.ip || req.connection.remoteAddress || "unknown";
//     if (isRateLimited(ip, 5, 60_000)) {
//       return res.status(429).json({ error: "Too many requests. Please try again later." });
//     }

//     const parsed = rsvpSubmitSchema.safeParse(req.body);
//     if (!parsed.success) {
//       return res.status(400).json({ error: "Invalid RSVP data", details: parsed.error.flatten() });
//     }

//     const data = parsed.data;
//     const guest = await storage.getGuestBySlug(data.slug);
//     if (!guest) return res.status(404).json({ error: "Invite not found" });

//     const updates = {
//       rsvpStatus: data.rsvpStatus,
//       adultsCount: data.rsvpStatus === "declined" ? 0 : data.adultsCount,
//       childrenCount: data.rsvpStatus === "declined" ? 0 : data.childrenCount,
//       foodPreference: data.rsvpStatus === "declined" ? "" : data.foodPreference,
//       eventsAttending: data.eventsAttending,
//       dietaryRequirements: data.dietaryRequirements.trim().slice(0, 500),
//       message: data.message.trim().slice(0, 1000),
//     };

//     const updated = await storage.updateGuest(guest.id, updates);
//     if (!updated) return res.status(500).json({ error: "Failed to update RSVP" });

//     res.json({ success: true, rsvpStatus: updated.rsvpStatus });
//   });

//   app.post("/api/rsvp/public", async (req, res) => {
//     const ip = req.ip || req.connection.remoteAddress || "unknown";
//     if (isRateLimited(ip, 5, 60_000)) {
//       return res.status(429).json({ error: "Too many requests. Please try again later." });
//     }

//     const parsed = publicRsvpSchema.safeParse(req.body);
//     if (!parsed.success) {
//       return res.status(400).json({ error: "Invalid RSVP data" });
//     }

//     const data = parsed.data;
//     // 🔥 Check if already exists by name
//     const existing = await storage.getGuestByName(data.name);

//     if (existing) {
//       const updated = await storage.updateGuest(existing.id, {
//         rsvpStatus: data.rsvpStatus,
//         adultsCount: data.adultsCount,
//         childrenCount: data.childrenCount,
//         foodPreference: data.foodPreference,
//         eventsAttending: data.eventsAttending,
//         dietaryRequirements: data.dietaryRequirements,
//         message: data.message,
//       });

//       return res.json({
//         success: true,
//         rsvpStatus: updated?.rsvpStatus,
//         isNew: false,
//       });
//     }

//     // Create new guest
//     const slug = generateSlug(data.name);
//     const newGuest = await storage.createGuest({
//       name: data.name,
//       inviteSlug: slug,
//       rsvpStatus: data.rsvpStatus,
//       adultsCount: data.rsvpStatus === "declined" ? 0 : data.adultsCount,
//       childrenCount: data.rsvpStatus === "declined" ? 0 : data.childrenCount,
//       foodPreference: data.rsvpStatus === "declined" ? "" : (data.foodPreference || "vegetarian"),
//       eventsAttending: data.rsvpStatus === "declined" ? [] : data.eventsAttending,
//       dietaryRequirements: data.dietaryRequirements.trim().slice(0, 500),
//       message: data.message.trim().slice(0, 1000),
//       side: data.side,
//       tableNumber: null,
//     });

//     res.status(201).json({ success: true, rsvpStatus: newGuest.rsvpStatus, isNew: true });
//   });

//   app.get("/api/events/:id/calendar", async (req, res) => {
//     const event = await storage.getWeddingEventById(req.params.id);
//     if (!event) return res.status(404).json({ error: "Event not found" });

//     const ics = generateICS({
//       title: event.title,
//       startTime: event.startTime,
//       endTime: event.endTime,
//       venueName: event.venueName,
//       venueAddress: event.venueAddress,
//       description: event.description,
//     });

//     res.setHeader("Content-Type", "text/calendar; charset=utf-8");
//     res.setHeader("Content-Disposition", `attachment; filename="${event.title.replace(/\s+/g, "_")}.ics"`);
//     res.send(ics);
//   });

//   app.post("/api/admin/login", async (req, res) => {
//     const schema = z.object({
//       username: z.string().min(1),
//       password: z.string().min(1),
//     });

//     const parsed = schema.safeParse(req.body);
//     if (!parsed.success) return res.status(400).json({ error: "Invalid credentials" });

//     const user = await storage.getUserByUsername(parsed.data.username);
//     if (!user) return res.status(401).json({ error: "Invalid username or password" });

//     const valid = await bcrypt.compare(parsed.data.password, user.password);
//     if (!valid) return res.status(401).json({ error: "Invalid username or password" });

//     setAuthCookie(res, { userId: user.id, username: user.username });
//     res.json({ success: true, username: user.username });
//   });

//   app.post("/api/admin/logout", requireAdmin, (_req, res) => {
//     clearAuthCookie(res);
//     res.json({ success: true });
//   });

//   app.get("/api/admin/me", requireAdmin, (req, res) => {
//     res.json({ admin: (req as any).admin });
//   });

//   app.get("/api/admin/config", requireAdmin, async (_req, res) => {
//     const config = await storage.getWeddingConfig();
//     res.json(config);
//   });

//   app.patch("/api/admin/config", requireAdmin, async (req, res) => {
//     const schema = z.object({
//       weddingDate: z.string().datetime().optional(),
//       dateConfirmed: z.boolean().optional(),
//       venueName: z.string().max(200).optional(),
//       venueAddress: z.string().max(500).optional(),
//       venueMapUrl: z.string().url().optional().or(z.literal("")),
//       coupleStory: z.string().max(5000).optional(),
//       upiId: z.string().max(200).optional(),
//       backgroundMusicUrl: z.string().optional().or(z.literal("")),
//       groomMusicUrls: z.array(z.string()).optional(),
//       brideMusicUrls: z.array(z.string()).optional(),
//     });

//     const parsed = schema.safeParse(req.body);
//     if (!parsed.success) return res.status(400).json({ error: "Invalid config data", details: parsed.error.flatten() });

//     const updateData: Record<string, unknown> = { ...parsed.data };
//     if (parsed.data.weddingDate) {
//       updateData.weddingDate = new Date(parsed.data.weddingDate);
//     }

//     const config = await storage.upsertWeddingConfig(updateData as any);
//     const { adminPasswordHash: _, ...safe } = config;
//     res.json(safe);
//   });

//   app.get("/api/admin/guests", requireAdmin, async (_req, res) => {
//     const guestList = await storage.getGuests(300); // Limit to 300 guests for admin view
//     res.json(guestList);
//   });

//   app.post("/api/admin/guests", requireAdmin, async (req, res) => {
//     const schema = z.object({
//       name: z.string().min(1).max(200),
//       side: z.enum(["bride", "groom", "both"]).default("both"),
//       tableNumber: z.number().int().positive().optional(),
//     });

//     const parsed = schema.safeParse(req.body);
//     if (!parsed.success) return res.status(400).json({ error: "Invalid guest data", details: parsed.error.flatten() });

//     const slug = generateSlug(parsed.data.name);
//     const guest = await storage.createGuest({
//       ...parsed.data,
//       inviteSlug: slug,
//       rsvpStatus: "pending",
//       adultsCount: 1,
//       childrenCount: 0,
//       foodPreference: "vegetarian",
//       eventsAttending: [],
//       dietaryRequirements: "",
//       message: "",
//       tableNumber: parsed.data.tableNumber ?? null,
//     });
//     res.status(201).json(guest);
//   });

//   app.patch("/api/admin/guests/:id", requireAdmin, async (req, res) => {
//     const schema = z.object({
//       name: z.string().min(1).max(200).optional(),
//       side: z.enum(["bride", "groom", "both"]).optional(),
//       tableNumber: z.number().int().positive().nullable().optional(),
//       rsvpStatus: z.enum(["pending", "confirmed", "declined"]).optional(),
//       adultsCount: z.number().int().min(1).max(20).optional(),
//       childrenCount: z.number().int().min(0).max(20).optional(),
//       foodPreference: z.enum(["vegetarian", "non-vegetarian"]).optional(),
//       eventsAttending: z.string().optional(),
//       dietaryRequirements: z.string().max(500).optional(),
//       message: z.string().max(1000).optional(),
//     });

//     const parsed = schema.safeParse(req.body);
//     if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

//     const updated = await storage.updateGuest(String(req.params.id), parsed.data as any);
//     if (!updated) return res.status(404).json({ error: "Guest not found" });
//     res.json(updated);
//   });

//   app.delete("/api/admin/guests/:id", requireAdmin, async (req, res) => {
//     await storage.deleteGuest(String(req.params.id));
//     res.json({ success: true });
//   });

//   // app.get("/api/admin/guests/export", requireAdmin, async (req, res) => {
//   //   const allGuests = await storage.getGuests();
//   //   const events = await storage.getWeddingEvents();

//   //   // Get filter parameters
//   //   const eventFilter = req.query.event as string || "";
//   //   const foodFilter = req.query.food as string || "";
//   //   const sideFilter = req.query.side as string || "";

//   //   // Filter guests based on parameters
//   //   let guestList = allGuests.filter(g => g.rsvpStatus !== "declined");

//   //   if (eventFilter) {
//   //     guestList = guestList.filter(g => g.eventsAttending.includes(eventFilter));
//   //   }
//   //   if (foodFilter) {
//   //     guestList = guestList.filter(g => g.foodPreference === foodFilter);
//   //   }
//   //   if (sideFilter) {
//   //     guestList = guestList.filter(g => g.side === sideFilter);
//   //   }

//   //   // Create a map of event IDs to event names
//   //   const eventMap = new Map(events.map(e => [e.id, e.title]));

//   //   const headers = [
//   //     "Name", "Side", "RSVP Status",
//   //     "Adults", "Children", "Food Preference", "Events Attending",
//   //     "Dietary Requirements", "Table Number", "Message", "Invite Slug",
//   //   ];

//   //   const rows = guestList.map((g) => {
//   //     // Convert event IDs to event names
//   //     const eventIds = g.eventsAttending.split(",").filter(Boolean);
//   //     const eventNames = eventIds.map(id => eventMap.get(id) || id).join(", ");

//   //     return [
//   //       g.name, g.side, g.rsvpStatus,
//   //       g.adultsCount, g.childrenCount, g.foodPreference, eventNames,
//   //       g.dietaryRequirements, g.tableNumber ?? "",
//   //       g.message.replace(/"/g, '""'), g.inviteSlug,
//   //     ];
//   //   });

//   //   const csv = [
//   //     headers.join(","),
//   //     ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
//   //   ].join("\n");

//   //   // Generate filename based on filters
//   //   let filename = "wedding_guests";
//   //   if (eventFilter || foodFilter || sideFilter) {
//   //     const filterParts = [];
//   //     if (eventFilter) {
//   //       const event = events.find(e => e.id === eventFilter);
//   //       filterParts.push(event?.title.replace(/\s+/g, "_") || "event");
//   //     }
//   //     if (foodFilter) filterParts.push(foodFilter);
//   //     if (sideFilter) filterParts.push(sideFilter);
//   //     filename += "_" + filterParts.join("_");
//   //   }
//   //   filename += ".csv";

//   //   res.setHeader("Content-Type", "text/csv; charset=utf-8");
//   //   res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
//   //   res.send(csv);
//   // });
//   app.get("/api/admin/guests/export", requireAdmin, async (req, res) => {
//     try {
//       const eventFilter = (req.query.event as string) || "";
//       const foodFilter = (req.query.food as string) || "";
//       const sideFilter = (req.query.side as string) || "";

//       const conditions = [];

//       // Only confirmed guests
//       conditions.push(eq(guests.rsvpStatus, "confirmed"));

//       if (eventFilter) {
//         conditions.push(like(guests.eventsAttending, `%${eventFilter}%`));
//       }

//       if (foodFilter) {
//         conditions.push(eq(guests.foodPreference, foodFilter));
//       }

//       if (sideFilter) {
//         conditions.push(eq(guests.side, sideFilter));
//       }

//       // 🔥 SQL filtered query
//       const guestList = await db
//         .select()
//         .from(guests)
//         .where(and(...conditions));

//       // Get events once (small table)
//       const events = await storage.getWeddingEvents();
//       const eventMap = new Map(events.map(e => [e.id, e.title]));

//       const headers = [
//         "Name",
//         "Side",
//         "RSVP Status",
//         "Adults",
//         "Children",
//         "Food Preference",
//         "Events Attending",
//         "Dietary Requirements",
//         "Table Number",
//         "Message",
//         "Invite Slug",
//       ];

//       const rows = guestList.map((g) => {
//         const eventIds = (g.eventsAttending || [])
//           .split(",")
//           .filter(Boolean);

//         const eventNames = eventIds
//           .map((id) => eventMap.get(id) || id)
//           .join(", ");

//         return [
//           g.name,
//           g.side,
//           g.rsvpStatus,
//           g.adultsCount,
//           g.childrenCount,
//           g.foodPreference,
//           eventNames,
//           g.dietaryRequirements || "",
//           g.tableNumber ?? "",
//           (g.message || "").replace(/"/g, '""'),
//           g.inviteSlug,
//         ];
//       });

//       const csv = [
//         headers.join(","),
//         ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
//       ].join("\n");

//       let filename = "wedding_guests";

//       if (eventFilter || foodFilter || sideFilter) {
//         const parts = [];

//         if (eventFilter) {
//           const event = events.find((e) => e.id === eventFilter);
//           parts.push(event?.title.replace(/\s+/g, "_") || "event");
//         }

//         if (foodFilter) parts.push(foodFilter);
//         if (sideFilter) parts.push(sideFilter);

//         filename += "_" + parts.join("_");
//       }

//       filename += ".csv";

//       res.setHeader("Content-Type", "text/csv; charset=utf-8");
//       res.setHeader(
//         "Content-Disposition",
//         `attachment; filename="${filename}"`
//       );

//       res.send(csv);

//     } catch (error) {
//       console.error("Export error:", error);
//       res.status(500).json({ error: "Failed to export guests" });
//     }
//   });

//   app.get("/api/admin/events", requireAdmin, async (_req, res) => {
//     const events = await storage.getWeddingEvents();
//     res.json(events);
//   });

//   app.post("/api/admin/events", requireAdmin, async (req, res) => {
//     const schema = z.object({
//       title: z.string().min(1).max(200),
//       description: z.string().max(2000).default(""),
//       startTime: z.string().datetime(),
//       endTime: z.string().datetime().optional().nullable(),
//       venueName: z.string().max(200).default(""),
//       venueAddress: z.string().max(500).default(""),
//       venueMapUrl: z.string().url().optional().or(z.literal("")),
//       isMainEvent: z.boolean().default(false),
//       dressCode: z.string().max(200).default(""),
//       sortOrder: z.number().int().default(0),
//       howToReach: z.string().max(1000).default(""),
//       accommodation: z.string().max(1000).default(""),
//       distanceInfo: z.string().max(500).default(""),
//       contactPerson: z.string().max(200).default(""),
//     });

//     const parsed = schema.safeParse(req.body);
//     if (!parsed.success) return res.status(400).json({ error: "Invalid event data", details: parsed.error.flatten() });

//     const event = await storage.createWeddingEvent({
//       ...parsed.data,
//       startTime: new Date(parsed.data.startTime),
//       endTime: parsed.data.endTime ? new Date(parsed.data.endTime) : null,
//       venueMapUrl: parsed.data.venueMapUrl || "",
//     });
//     res.status(201).json(event);
//   });

//   app.patch("/api/admin/events/:id", requireAdmin, async (req, res) => {
//     const schema = z.object({
//       title: z.string().min(1).max(200).optional(),
//       description: z.string().max(2000).optional(),
//       startTime: z.string().datetime().optional(),
//       endTime: z.string().datetime().nullable().optional(),
//       venueName: z.string().max(200).optional(),
//       venueAddress: z.string().max(500).optional(),
//       venueMapUrl: z.string().url().optional().or(z.literal("")),
//       isMainEvent: z.boolean().optional(),
//       dressCode: z.string().max(200).optional(),
//       sortOrder: z.number().int().optional(),
//       howToReach: z.string().max(1000).optional(),
//       accommodation: z.string().max(1000).optional(),
//       distanceInfo: z.string().max(500).optional(),
//       contactPerson: z.string().max(200).optional(),
//     });

//     const parsed = schema.safeParse(req.body);
//     if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

//     const updateData: Record<string, unknown> = { ...parsed.data };
//     if (parsed.data.startTime) updateData.startTime = new Date(parsed.data.startTime);
//     if (parsed.data.endTime !== undefined) updateData.endTime = parsed.data.endTime ? new Date(parsed.data.endTime) : null;

//     const updated = await storage.updateWeddingEvent(String(req.params.id), updateData as any);
//     if (!updated) return res.status(404).json({ error: "Event not found" });
//     res.json(updated);
//   });

//   app.delete("/api/admin/events/:id", requireAdmin, async (req, res) => {
//     await storage.deleteWeddingEvent(String(req.params.id));
//     res.json({ success: true });
//   });

//   app.get("/api/admin/stories", requireAdmin, async (_req, res) => {
//     const stories = await storage.getStoryMilestones();
//     res.json(stories);
//   });

//   app.post("/api/admin/stories", requireAdmin, async (req, res) => {
//     const schema = z.object({
//       title: z.string().min(1).max(200),
//       date: z.string().min(1).max(100),
//       description: z.string().max(2000),
//       imageUrl: z.string().max(500).default(""),
//       sortOrder: z.number().int().default(0),
//     });

//     const parsed = schema.safeParse(req.body);
//     if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

//     const milestone = await storage.createStoryMilestone(parsed.data);
//     res.status(201).json(milestone);
//   });

//   app.patch("/api/admin/stories/:id", requireAdmin, async (req, res) => {
//     const schema = z.object({
//       title: z.string().min(1).max(200).optional(),
//       date: z.string().min(1).max(100).optional(),
//       description: z.string().max(2000).optional(),
//       imageUrl: z.string().max(500).optional(),
//       sortOrder: z.number().int().optional(),
//     });

//     const parsed = schema.safeParse(req.body);
//     if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

//     const updated = await storage.updateStoryMilestone(String(req.params.id), parsed.data);
//     if (!updated) return res.status(404).json({ error: "Story not found" });
//     res.json(updated);
//   });

//   app.delete("/api/admin/stories/:id", requireAdmin, async (req, res) => {
//     await storage.deleteStoryMilestone(String(req.params.id));
//     res.json({ success: true });
//   });

//   app.get("/api/admin/venues", requireAdmin, async (_req, res) => {
//     const venueList = await storage.getVenues();
//     res.json(venueList);
//   });

//   app.post("/api/admin/venues", requireAdmin, async (req, res) => {
//     const schema = z.object({
//       name: z.string().min(1).max(200),
//       address: z.string().max(500).default(""),
//       description: z.string().max(2000).default(""),
//       mapUrl: z.string().max(500).default(""),
//       mapEmbedUrl: z.string().max(500).default(""),
//       directions: z.string().max(2000).default(""),
//       accommodation: z.string().max(2000).default(""),
//       contactInfo: z.string().max(500).default(""),
//       imageUrl: z.string().max(500).default(""),
//       sortOrder: z.number().int().default(0),
//     });

//     const parsed = schema.safeParse(req.body);
//     if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

//     const venue = await storage.createVenue(parsed.data);
//     res.status(201).json(venue);
//   });

//   app.patch("/api/admin/venues/:id", requireAdmin, async (req, res) => {
//     const schema = z.object({
//       name: z.string().min(1).max(200).optional(),
//       address: z.string().max(500).optional(),
//       description: z.string().max(2000).optional(),
//       mapUrl: z.string().max(500).optional(),
//       mapEmbedUrl: z.string().max(500).optional(),
//       directions: z.string().max(2000).optional(),
//       accommodation: z.string().max(2000).optional(),
//       contactInfo: z.string().max(500).optional(),
//       imageUrl: z.string().max(500).optional(),
//       sortOrder: z.number().int().optional(),
//     });

//     const parsed = schema.safeParse(req.body);
//     if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

//     const updated = await storage.updateVenue(String(req.params.id), parsed.data);
//     if (!updated) return res.status(404).json({ error: "Venue not found" });
//     res.json(updated);
//   });

//   app.delete("/api/admin/venues/:id", requireAdmin, async (req, res) => {
//     await storage.deleteVenue(String(req.params.id));
//     res.json({ success: true });
//   });

//   app.get("/api/admin/faqs", requireAdmin, async (_req, res) => {
//     const faqList = await storage.getFaqs();
//     res.json(faqList);
//   });

//   app.post("/api/admin/faqs", requireAdmin, async (req, res) => {
//     const schema = z.object({
//       question: z.string().min(1).max(500),
//       answer: z.string().min(1).max(2000),
//       category: z.string().max(100).default("general"),
//       sortOrder: z.number().int().default(0),
//     });

//     const parsed = schema.safeParse(req.body);
//     if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

//     const faq = await storage.createFaq(parsed.data);
//     res.status(201).json(faq);
//   });

//   app.patch("/api/admin/faqs/:id", requireAdmin, async (req, res) => {
//     const schema = z.object({
//       question: z.string().min(1).max(500).optional(),
//       answer: z.string().min(1).max(2000).optional(),
//       category: z.string().max(100).optional(),
//       sortOrder: z.number().int().optional(),
//     });

//     const parsed = schema.safeParse(req.body);
//     if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

//     const updated = await storage.updateFaq(String(req.params.id), parsed.data);
//     if (!updated) return res.status(404).json({ error: "FAQ not found" });
//     res.json(updated);
//   });

//   app.delete("/api/admin/faqs/:id", requireAdmin, async (req, res) => {
//     await storage.deleteFaq(String(req.params.id));
//     res.json({ success: true });
//   });

//   return httpServer;
// }
