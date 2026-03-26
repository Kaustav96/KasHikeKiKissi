import { z } from "zod";

/* =========================================================
   WEDDING CONFIG
========================================================= */

export const weddingConfigSchema = z.object({
  id: z.string(),
  weddingDate: z.date().nullable().optional(),
  venueName: z.string().default("To Be Announced"),
  venueAddress: z.string().default(""),
  venueMapUrl: z.string().default(""),
  coupleStory: z.string().default(""),
  adminPasswordHash: z.string().default(""),
  upiId: z.string().default(""),
  backgroundMusicUrl: z.array(z.object({
    name: z.string(),
    url: z.string(),
  })).default([]),
  groomMusicUrls: z.array(z.object({
    name: z.string(),
    url: z.string(),
  })).default([]),
  brideMusicUrls: z.array(z.object({
    name: z.string(),
    url: z.string(),
  })).default([]),
  viewCount: z.number().int().default(0),
  updatedAt: z.date().optional(),
});

export const insertWeddingConfigSchema = weddingConfigSchema.omit({
  id: true,
  updatedAt: true,
});

export type InsertWeddingConfig = z.infer<typeof insertWeddingConfigSchema>;
export type WeddingConfig = z.infer<typeof weddingConfigSchema>;

/* =========================================================
   GUESTS
========================================================= */

export const guestSchema = z.object({
  id: z.string(),
  name: z.string(),
  rsvpStatus: z.enum(["pending", "confirmed", "declined"]).default("pending"),
  adultsCount: z.number().int().default(1),
  childrenCount: z.number().int().default(0),
  foodPreference: z.enum(["vegetarian", "non-vegetarian"]).default("vegetarian"),
  eventsAttending: z.array(z.string()).default([]),
  dietaryRequirements: z.string().default(""),
  message: z.string().default(""),
  accommodationRequired: z.boolean().default(false),
  inviteSlug: z.string(),
  side: z.enum(["groom", "bride", "both"]).default("both"),
  tableNumber: z.number().int().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const insertGuestSchema = guestSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertGuest = z.infer<typeof insertGuestSchema>;
export type Guest = z.infer<typeof guestSchema>;

/* =========================================================
   RSVP SCHEMAS
========================================================= */

export const rsvpSubmitSchema = z.object({
  slug: z.string().min(1),
  rsvpStatus: z.enum(["confirmed", "declined"]),
  adultsCount: z.number().int().min(1).max(20).default(1),
  childrenCount: z.number().int().min(0).max(20).default(0),
  foodPreference: z.enum(["vegetarian", "non-vegetarian"]).optional(),
  eventsAttending: z.array(z.string()).default([]),
  dietaryRequirements: z.string().max(500).default(""),
  message: z.string().max(1000).default(""),
  accommodationRequired: z.boolean().optional(),
});

export const publicRsvpSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(200),
  rsvpStatus: z.enum(["confirmed", "declined"]),
  adultsCount: z.number().int().min(1).max(20).default(1),
  childrenCount: z.number().int().min(0).max(20).default(0),
  foodPreference: z.enum(["vegetarian", "non-vegetarian"]).optional(),
  eventsAttending: z.array(z.string()).default([]),
  dietaryRequirements: z.string().max(500).default(""),
  message: z.string().max(1000).default(""),
  side: z.enum(["groom", "bride", "both"]).default("both"),
  accommodationRequired: z.boolean().optional(),
});

export type PublicRsvp = z.infer<typeof publicRsvpSchema>;

/* =========================================================
   EVENTS
========================================================= */

export const weddingEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().default(""),
  startTime: z.date(),
  endTime: z.date().nullable().optional(),
  venueName: z.string().default(""),
  venueAddress: z.string().default(""),
  venueMapUrl: z.string().default(""),
  isMainEvent: z.boolean().default(false),
  dressCode: z.string().default(""),
  howToReach: z.string().default(""),
  accommodation: z.string().default(""),
  distanceInfo: z.string().default(""),
  contactPerson: z.string().default(""),
  side: z.enum(["groom", "bride", "both"]).default("both"),
  sortOrder: z.number().int().default(0),
  createdAt: z.date().optional(),
});

export const insertWeddingEventSchema = weddingEventSchema.omit({
  id: true,
  createdAt: true,
});

export type InsertWeddingEvent = z.infer<typeof insertWeddingEventSchema>;
export type WeddingEvent = z.infer<typeof weddingEventSchema>;

/* =========================================================
   STORY MILESTONES
========================================================= */

export const storyMilestoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  description: z.string(),
  imageUrl: z.string().default(""),
  sortOrder: z.number().int().default(0),
  createdAt: z.date().optional(),
});

export const insertStoryMilestoneSchema = storyMilestoneSchema.omit({
  id: true,
  createdAt: true,
});

export type InsertStoryMilestone = z.infer<typeof insertStoryMilestoneSchema>;
export type StoryMilestone = z.infer<typeof storyMilestoneSchema>;

/* =========================================================
   VENUES
========================================================= */

export const venueSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string().default(""),
  description: z.string().default(""),
  mapUrl: z.string().default(""),
  mapEmbedUrl: z.string().default(""),
  directions: z.string().default(""),
  accommodation: z.string().default(""),
  contactInfo: z.string().default(""),
  imageUrl: z.string().default(""),
  sortOrder: z.number().int().default(0),
  createdAt: z.date().optional(),
});

export const insertVenueSchema = venueSchema.omit({
  id: true,
  createdAt: true,
});

export type InsertVenue = z.infer<typeof insertVenueSchema>;
export type Venue = z.infer<typeof venueSchema>;

/* =========================================================
   FAQ
========================================================= */

export const faqSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  category: z.string().default("general"),
  sortOrder: z.number().int().default(0),
  createdAt: z.date().optional(),
});

export const insertFaqSchema = faqSchema.omit({
  id: true,
  createdAt: true,
});

export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = z.infer<typeof faqSchema>;

/* =========================================================
   MESSAGE LOGS
========================================================= */

export const messageLogSchema = z.object({
  id: z.string(),
  guestId: z.string(),
  guestName: z.string(),
  phone: z.string(),
  templateName: z.string(),
  messageType: z.string(),
  status: z.string().default("pending"),
  whatsappMessageId: z.string().default(""),
  errorMessage: z.string().default(""),
  retryCount: z.number().int().default(0),
  metadata: z.record(z.unknown()).default({}),
  sentAt: z.date().nullable().optional(),
  createdAt: z.date().optional(),
});

export const insertMessageLogSchema = messageLogSchema.omit({
  id: true,
  createdAt: true,
});

export type InsertMessageLog = z.infer<typeof insertMessageLogSchema>;
export type MessageLog = z.infer<typeof messageLogSchema>;

/* =========================================================
   USERS
========================================================= */

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
});

export const insertUserSchema = userSchema.omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof userSchema>;

// import { sql } from "drizzle-orm";
// import {
//   pgTable,
//   text,
//   varchar,
//   boolean,
//   timestamp,
//   integer,
//   jsonb,
//   index
// } from "drizzle-orm/pg-core";
// import { createInsertSchema } from "drizzle-zod";
// import { z } from "zod";

// export const weddingConfig = pgTable("wedding_config", {
//   id: varchar("id", { length: 36 })
//     .primaryKey()
//     .default(sql`gen_random_uuid()`),
//   weddingDate: timestamp("wedding_date"),
//   dateConfirmed: boolean("date_confirmed").notNull().default(false),
//   venueName: text("venue_name").notNull().default("To Be Announced"),
//   venueAddress: text("venue_address").notNull().default(""),
//   venueMapUrl: text("venue_map_url").notNull().default(""),
//   coupleStory: text("couple_story").notNull().default(""),
//   adminPasswordHash: text("admin_password_hash").notNull().default(""),
//   upiId: text("upi_id").notNull().default(""),
//   backgroundMusicUrl: text("background_music_url").notNull().default(""),
//   groomMusicUrls: jsonb("groom_music_urls").notNull().default(sql`'[]'::jsonb`),
//   brideMusicUrls: jsonb("bride_music_urls").notNull().default(sql`'[]'::jsonb`),
//   viewCount: integer("view_count").notNull().default(0),
//   updatedAt: timestamp("updated_at").notNull().default(sql`NOW()`),
// });

// export const insertWeddingConfigSchema = createInsertSchema(weddingConfig).omit({
//   id: true,
//   updatedAt: true,
// });
// export type InsertWeddingConfig = z.infer<typeof insertWeddingConfigSchema>;
// export type WeddingConfig = typeof weddingConfig.$inferSelect;

// export const guests = pgTable("guests", {
//   id: varchar("id", { length: 36 })
//     .primaryKey()
//     .default(sql`gen_random_uuid()`),
//   name: text("name").notNull(),
//   rsvpStatus: text("rsvp_status").notNull().default("pending"),
//   adultsCount: integer("adults_count").notNull().default(1),
//   childrenCount: integer("children_count").notNull().default(0),
//   foodPreference: text("food_preference").notNull().default("vegetarian"),
//   eventsAttending: text("events_attending").notNull().default(""),
//   dietaryRequirements: text("dietary_requirements").notNull().default(""),
//   message: text("message").notNull().default(""),
//   inviteSlug: text("invite_slug").notNull().unique(),
//   side: text("side").notNull().default("both"),
//   tableNumber: integer("table_number"),
//   createdAt: timestamp("created_at").notNull().default(sql`NOW()`),
//   updatedAt: timestamp("updated_at").notNull().default(sql`NOW()`),
// });

// export const insertGuestSchema = createInsertSchema(guests).omit({
//   id: true,
//   createdAt: true,
//   updatedAt: true,
// });
// export type InsertGuest = z.infer<typeof insertGuestSchema>;
// export type Guest = typeof guests.$inferSelect;

// export const rsvpSubmitSchema = z.object({
//   slug: z.string().min(1),
//   rsvpStatus: z.enum(["confirmed", "declined"]),
//   adultsCount: z.number().int().min(1).max(20).default(1),
//   childrenCount: z.number().int().min(0).max(20).default(0),
//   foodPreference: z.enum(["vegetarian", "non-vegetarian"], {
//     errorMap: () => ({ message: "Please select your food preference" }),
//   }).optional(),
//   eventsAttending: z.string().default(""),
//   dietaryRequirements: z.string().max(500).default(""),
//   message: z.string().max(1000).default(""),
// }).refine(
//   (data) => {
//     if (data.rsvpStatus === "confirmed") {
//       return data.eventsAttending && data.eventsAttending.length > 0;
//     }
//     return true;
//   },
//   {
//     message: "Please select at least one event to attend",
//     path: ["eventsAttending"],
//   }
// ).refine(
//   (data) => {
//     if (data.rsvpStatus === "confirmed") {
//       return !!data.foodPreference;
//     }
//     return true;
//   },
//   {
//     message: "Please select your food preference",
//     path: ["foodPreference"],
//   }
// );
// export type RsvpSubmit = z.infer<typeof rsvpSubmitSchema>;

// export const publicRsvpSchema = z.object({
//   name: z.string().min(1, "Name is required").max(200),
//   rsvpStatus: z.enum(["confirmed", "declined"]),
//   adultsCount: z.number().int().min(1).max(20).default(1),
//   childrenCount: z.number().int().min(0).max(20).default(0),
//   foodPreference: z.enum(["vegetarian", "non-vegetarian"], {
//     errorMap: () => ({ message: "Please select your food preference" }),
//   }).optional(),
//   eventsAttending: z.string().default(""),
//   dietaryRequirements: z.string().max(500).default(""),
//   message: z.string().max(1000).default(""),
//   side: z.enum(["groom", "bride", "both"]).default("both"),
// }).refine(
//   (data) => {
//     if (data.rsvpStatus === "confirmed") {
//       return data.eventsAttending && data.eventsAttending.length > 0;
//     }
//     return true;
//   },
//   {
//     message: "Please select at least one event to attend",
//     path: ["eventsAttending"],
//   }
// ).refine(
//   (data) => {
//     if (data.rsvpStatus === "confirmed") {
//       return !!data.foodPreference;
//     }
//     return true;
//   },
//   {
//     message: "Please select your food preference",
//     path: ["foodPreference"],
//   }
// );
// export type PublicRsvp = z.infer<typeof publicRsvpSchema>;

// export const weddingEvents = pgTable("wedding_events", {
//   id: varchar("id", { length: 36 })
//     .primaryKey()
//     .default(sql`gen_random_uuid()`),
//   title: text("title").notNull(),
//   description: text("description").notNull().default(""),
//   startTime: timestamp("start_time").notNull(),
//   endTime: timestamp("end_time"),
//   venueName: text("venue_name").notNull().default(""),
//   venueAddress: text("venue_address").notNull().default(""),
//   venueMapUrl: text("venue_map_url").notNull().default(""),
//   isMainEvent: boolean("is_main_event").notNull().default(false),
//   dressCode: text("dress_code").notNull().default(""),
//   side: text("side").notNull().default("both"),
//   sortOrder: integer("sort_order").notNull().default(0),
//   howToReach: text("how_to_reach").notNull().default(""),
//   accommodation: text("accommodation").notNull().default(""),
//   distanceInfo: text("distance_info").notNull().default(""),
//   contactPerson: text("contact_person").notNull().default(""),
//   createdAt: timestamp("created_at").notNull().default(sql`NOW()`),
// });

// export const insertWeddingEventSchema = createInsertSchema(weddingEvents).omit({
//   id: true,
//   createdAt: true,
// });
// export type InsertWeddingEvent = z.infer<typeof insertWeddingEventSchema>;
// export type WeddingEvent = typeof weddingEvents.$inferSelect;

// export const storyMilestones = pgTable("story_milestones", {
//   id: varchar("id", { length: 36 })
//     .primaryKey()
//     .default(sql`gen_random_uuid()`),
//   title: text("title").notNull(),
//   date: text("date").notNull(),
//   description: text("description").notNull(),
//   imageUrl: text("image_url").notNull().default(""),
//   sortOrder: integer("sort_order").notNull().default(0),
//   createdAt: timestamp("created_at").notNull().default(sql`NOW()`),
// });

// export const insertStoryMilestoneSchema = createInsertSchema(storyMilestones).omit({
//   id: true,
//   createdAt: true,
// });
// export type InsertStoryMilestone = z.infer<typeof insertStoryMilestoneSchema>;
// export type StoryMilestone = typeof storyMilestones.$inferSelect;

// export const venues = pgTable("venues", {
//   id: varchar("id", { length: 36 })
//     .primaryKey()
//     .default(sql`gen_random_uuid()`),
//   name: text("name").notNull(),
//   address: text("address").notNull().default(""),
//   description: text("description").notNull().default(""),
//   mapUrl: text("map_url").notNull().default(""),
//   mapEmbedUrl: text("map_embed_url").notNull().default(""),
//   directions: text("directions").notNull().default(""),
//   accommodation: text("accommodation").notNull().default(""),
//   contactInfo: text("contact_info").notNull().default(""),
//   imageUrl: text("image_url").notNull().default(""),
//   sortOrder: integer("sort_order").notNull().default(0),
//   createdAt: timestamp("created_at").notNull().default(sql`NOW()`),
// });

// export const insertVenueSchema = createInsertSchema(venues).omit({
//   id: true,
//   createdAt: true,
// });
// export type InsertVenue = z.infer<typeof insertVenueSchema>;
// export type Venue = typeof venues.$inferSelect;

// export const faqs = pgTable("faqs", {
//   id: varchar("id", { length: 36 })
//     .primaryKey()
//     .default(sql`gen_random_uuid()`),
//   question: text("question").notNull(),
//   answer: text("answer").notNull(),
//   category: text("category").notNull().default("general"),
//   sortOrder: integer("sort_order").notNull().default(0),
//   createdAt: timestamp("created_at").notNull().default(sql`NOW()`),
// });

// export const insertFaqSchema = createInsertSchema(faqs).omit({
//   id: true,
//   createdAt: true,
// });
// export type InsertFaq = z.infer<typeof insertFaqSchema>;
// export type Faq = typeof faqs.$inferSelect;

// export const messageLogs = pgTable("message_logs", {
//   id: varchar("id", { length: 36 })
//     .primaryKey()
//     .default(sql`gen_random_uuid()`),
//   guestId: varchar("guest_id", { length: 36 }).notNull(),
//   guestName: text("guest_name").notNull(),
//   phone: text("phone").notNull(),
//   templateName: text("template_name").notNull(),
//   messageType: text("message_type").notNull(),
//   status: text("status").notNull().default("pending"),
//   whatsappMessageId: text("whatsapp_message_id").notNull().default(""),
//   errorMessage: text("error_message").notNull().default(""),
//   retryCount: integer("retry_count").notNull().default(0),
//   metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
//   sentAt: timestamp("sent_at"),
//   createdAt: timestamp("created_at").notNull().default(sql`NOW()`),
// });

// export const insertMessageLogSchema = createInsertSchema(messageLogs).omit({
//   id: true,
//   createdAt: true,
// });
// export type InsertMessageLog = z.infer<typeof insertMessageLogSchema>;
// export type MessageLog = typeof messageLogs.$inferSelect;

// export const users = pgTable("users", {
//   id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
//   username: text("username").notNull().unique(),
//   password: text("password").notNull(),
// });

// export const insertUserSchema = createInsertSchema(users).pick({
//   username: true,
//   password: true,
// });
// export type InsertUser = z.infer<typeof insertUserSchema>;
// export type User = typeof users.$inferSelect;
