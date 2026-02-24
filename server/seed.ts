/**
 * Database seeder
 * Creates initial admin user, wedding config, events, and sample guests.
 * Safe to run multiple times — checks for existing data before inserting.
 */

import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

function slugify(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 20);
  return `${base}-${randomUUID().split("-")[0]}`;
}

export async function seedDatabase(): Promise<void> {
  console.log("[Seed] Checking database...");

  // ─── Admin User ────────────────────────────────────────────────────────────
  const existingAdmin = await storage.getUserByUsername("admin");
  if (!existingAdmin) {
    const hash = await bcrypt.hash("wedding2025", 12);
    await storage.createUser({ username: "admin", password: hash });
    console.log("[Seed] Created admin user (username: admin, password: wedding2025)");
  }

  // ─── Wedding Config ────────────────────────────────────────────────────────
  const existingConfig = await storage.getWeddingConfig();
  if (!existingConfig) {
    const weddingDate = new Date("2025-12-14T10:30:00.000Z");
    await storage.upsertWeddingConfig({
      weddingDate,
      dateConfirmed: true,
      venueName: "The Grand Pavilion",
      venueAddress: "12 Marigold Lane, Kolkata, West Bengal 700001",
      venueMapUrl: "https://maps.google.com/?q=Kolkata+West+Bengal",
      coupleStory: `Kaustav and Himasree first met at a monsoon evening in Kolkata — over a shared umbrella and a debate about Tagore's poetry. What began as a spirited argument blossomed into countless evening walks, shared chai, and a love story written in laughter and letters.\n\nKaustav's quiet determination and Himasree's warmth made them inseparable. Through years of shared dreams and adventures, they knew they had found their forever in each other.\n\nToday, they invite you to witness the next beautiful chapter of their story.`,
      whatsappEnabled: false,
      adminPasswordHash: "",
    });
    console.log("[Seed] Created wedding config");
  }

  // ─── Wedding Events ────────────────────────────────────────────────────────
  const existingEvents = await storage.getWeddingEvents();
  if (existingEvents.length === 0) {
    const events = [
      {
        title: "Haldi & Sangeet",
        description: "A joyful evening of music, dance, and traditional rituals. Join us for the Haldi ceremony followed by an enchanting Sangeet night filled with family performances and celebrations.",
        startTime: new Date("2025-12-13T16:00:00.000Z"),
        endTime: new Date("2025-12-13T21:00:00.000Z"),
        venueName: "Chatterjee Family Home",
        venueAddress: "45 Rabindra Nagar, Kolkata, West Bengal 700019",
        venueMapUrl: "https://maps.google.com/?q=Kolkata+West+Bengal",
        isMainEvent: false,
        dressCode: "Casual Indian — Yellows & Greens",
        sortOrder: 1,
      },
      {
        title: "Wedding Ceremony",
        description: "The sacred union of Kaustav and Himasree in a traditional Bengali wedding ceremony. Witness the timeless rituals of Saptapadi and exchange of garlands as our couple begins their journey together.",
        startTime: new Date("2025-12-14T05:30:00.000Z"),
        endTime: new Date("2025-12-14T09:00:00.000Z"),
        venueName: "The Grand Pavilion",
        venueAddress: "12 Marigold Lane, Kolkata, West Bengal 700001",
        venueMapUrl: "https://maps.google.com/?q=Kolkata+West+Bengal",
        isMainEvent: true,
        dressCode: "Traditional Indian Formal",
        sortOrder: 2,
      },
      {
        title: "Wedding Reception",
        description: "Celebrate with the newlyweds at a grand reception featuring live music, gourmet dining, and heartfelt moments shared with family and friends. An evening of joy, laughter, and love.",
        startTime: new Date("2025-12-14T18:00:00.000Z"),
        endTime: new Date("2025-12-14T23:00:00.000Z"),
        venueName: "The Grand Pavilion",
        venueAddress: "12 Marigold Lane, Kolkata, West Bengal 700001",
        venueMapUrl: "https://maps.google.com/?q=Kolkata+West+Bengal",
        isMainEvent: false,
        dressCode: "Indian Formal — Sarees & Sherwanis",
        sortOrder: 3,
      },
    ];

    for (const ev of events) {
      await storage.createWeddingEvent(ev);
    }
    console.log("[Seed] Created wedding events");
  }

  // ─── Sample Guests ─────────────────────────────────────────────────────────
  const existingGuests = await storage.getGuests();
  if (existingGuests.length === 0) {
    const guestData = [
      { name: "Priya Sharma", email: "priya@example.com", phone: "9876543210", side: "bride" as const, rsvpStatus: "confirmed", tableNumber: 1 },
      { name: "Rohan Das", email: "rohan@example.com", phone: "9876543211", side: "groom" as const, rsvpStatus: "confirmed", tableNumber: 2 },
      { name: "Anjali Bose", email: "anjali@example.com", phone: "9876543212", side: "bride" as const, rsvpStatus: "pending", tableNumber: null },
      { name: "Subhash Mukherjee", email: "subhash@example.com", phone: "9876543213", side: "groom" as const, rsvpStatus: "pending", tableNumber: null },
      { name: "Ritu Chatterjee", email: "ritu@example.com", phone: "9876543214", side: "both" as const, rsvpStatus: "declined", tableNumber: null },
    ];

    for (const g of guestData) {
      await storage.createGuest({
        ...g,
        inviteSlug: slugify(g.name),
        whatsappOptIn: false,
        plusOne: false,
        plusOneName: "",
        dietaryRequirements: "",
        message: "",
      });
    }
    console.log("[Seed] Created sample guests");
  }

  console.log("[Seed] Database seeding complete.");
}
