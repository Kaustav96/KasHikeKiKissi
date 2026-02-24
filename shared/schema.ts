import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ─── Wedding Configuration (singleton) ───────────────────────────────────────
export const weddingConfig = pgTable("wedding_config", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  weddingDate: timestamp("wedding_date").notNull().default(sql`NOW() + interval '1 year'`),
  dateConfirmed: boolean("date_confirmed").notNull().default(false),
  venueName: text("venue_name").notNull().default("To Be Announced"),
  venueAddress: text("venue_address").notNull().default(""),
  venueMapUrl: text("venue_map_url").notNull().default(""),
  coupleStory: text("couple_story").notNull().default(""),
  whatsappEnabled: boolean("whatsapp_enabled").notNull().default(false),
  adminPasswordHash: text("admin_password_hash").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().default(sql`NOW()`),
});

export const insertWeddingConfigSchema = createInsertSchema(weddingConfig).omit({
  id: true,
  updatedAt: true,
});
export type InsertWeddingConfig = z.infer<typeof insertWeddingConfigSchema>;
export type WeddingConfig = typeof weddingConfig.$inferSelect;

// ─── Guests ──────────────────────────────────────────────────────────────────
export const guests = pgTable("guests", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  whatsappOptIn: boolean("whatsapp_opt_in").notNull().default(false),
  rsvpStatus: text("rsvp_status").notNull().default("pending"), // pending | confirmed | declined
  plusOne: boolean("plus_one").notNull().default(false),
  plusOneName: text("plus_one_name").notNull().default(""),
  dietaryRequirements: text("dietary_requirements").notNull().default(""),
  message: text("message").notNull().default(""),
  inviteSlug: text("invite_slug").notNull().unique(),
  side: text("side").notNull().default("both"), // bride | groom | both
  tableNumber: integer("table_number"),
  createdAt: timestamp("created_at").notNull().default(sql`NOW()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`NOW()`),
});

export const insertGuestSchema = createInsertSchema(guests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertGuest = z.infer<typeof insertGuestSchema>;
export type Guest = typeof guests.$inferSelect;

// ─── RSVP submission schema (used for public form) ────────────────────────────
export const rsvpSubmitSchema = z.object({
  slug: z.string().min(1),
  rsvpStatus: z.enum(["confirmed", "declined"]),
  plusOne: z.boolean().default(false),
  plusOneName: z.string().max(100).default(""),
  dietaryRequirements: z.string().max(500).default(""),
  message: z.string().max(1000).default(""),
  whatsappOptIn: z.boolean().default(false),
  phone: z.string().max(20).default(""),
  email: z.string().email().optional().or(z.literal("")),
});
export type RsvpSubmit = z.infer<typeof rsvpSubmitSchema>;

// ─── Wedding Events ──────────────────────────────────────────────────────────
export const weddingEvents = pgTable("wedding_events", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  venueName: text("venue_name").notNull().default(""),
  venueAddress: text("venue_address").notNull().default(""),
  venueMapUrl: text("venue_map_url").notNull().default(""),
  isMainEvent: boolean("is_main_event").notNull().default(false),
  dressCode: text("dress_code").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`NOW()`),
});

export const insertWeddingEventSchema = createInsertSchema(weddingEvents).omit({
  id: true,
  createdAt: true,
});
export type InsertWeddingEvent = z.infer<typeof insertWeddingEventSchema>;
export type WeddingEvent = typeof weddingEvents.$inferSelect;

// ─── Message Logs ────────────────────────────────────────────────────────────
export const messageLogs = pgTable("message_logs", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  guestId: varchar("guest_id", { length: 36 }).notNull(),
  guestName: text("guest_name").notNull(),
  phone: text("phone").notNull(),
  templateName: text("template_name").notNull(),
  messageType: text("message_type").notNull(), // reminder_30d | reminder_7d | reminder_1d | morning | start | thankyou | custom
  status: text("status").notNull().default("pending"), // pending | sent | failed | duplicate
  whatsappMessageId: text("whatsapp_message_id").notNull().default(""),
  errorMessage: text("error_message").notNull().default(""),
  retryCount: integer("retry_count").notNull().default(0),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").notNull().default(sql`NOW()`),
});

export const insertMessageLogSchema = createInsertSchema(messageLogs).omit({
  id: true,
  createdAt: true,
});
export type InsertMessageLog = z.infer<typeof insertMessageLogSchema>;
export type MessageLog = typeof messageLogs.$inferSelect;

// ─── Admin user schema ────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
