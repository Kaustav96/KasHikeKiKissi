import {
  type Guest,
  type InsertGuest,
  type WeddingConfig,
  type InsertWeddingConfig,
  type WeddingEvent,
  type InsertWeddingEvent,
  type MessageLog,
  type InsertMessageLog,
  type User,
  type InsertUser,
  type StoryMilestone,
  type InsertStoryMilestone,
  type Venue,
  type InsertVenue,
  type Faq,
  type InsertFaq,
  guests,
  weddingConfig,
  weddingEvents,
  messageLogs,
  users,
  storyMilestones,
  venues,
  faqs,
} from "../shared/schema.js";

import { db } from "./db";
import { eq, desc, asc, like, and, sql } from "drizzle-orm";

/* =========================================================
   Interface
========================================================= */

export interface IStorage {
  getWeddingConfig(): Promise<WeddingConfig | undefined>;
  upsertWeddingConfig(config: Partial<InsertWeddingConfig>): Promise<WeddingConfig>;

  getGuests(limit?: number, offset?: number): Promise<Guest[]>;
  countGuests(): Promise<number>;
  getGuestById(id: string): Promise<Guest | undefined>;
  getGuestBySlug(slug: string): Promise<Guest | undefined>;
  getGuestByName(name: string): Promise<Guest | undefined>;
  createGuest(guest: InsertGuest): Promise<Guest>;
  updateGuest(id: string, guest: Partial<InsertGuest>): Promise<Guest | undefined>;
  deleteGuest(id: string): Promise<void>;

  getWeddingEvents(): Promise<WeddingEvent[]>;
  getWeddingEventById(id: string): Promise<WeddingEvent | undefined>;
  createWeddingEvent(event: InsertWeddingEvent): Promise<WeddingEvent>;
  updateWeddingEvent(id: string, event: Partial<InsertWeddingEvent>): Promise<WeddingEvent | undefined>;
  deleteWeddingEvent(id: string): Promise<void>;

  getStoryMilestones(): Promise<StoryMilestone[]>;
  createStoryMilestone(milestone: InsertStoryMilestone): Promise<StoryMilestone>;
  updateStoryMilestone(id: string, milestone: Partial<InsertStoryMilestone>): Promise<StoryMilestone | undefined>;
  deleteStoryMilestone(id: string): Promise<void>;

  getVenues(): Promise<Venue[]>;
  createVenue(venue: InsertVenue): Promise<Venue>;
  updateVenue(id: string, venue: Partial<InsertVenue>): Promise<Venue | undefined>;
  deleteVenue(id: string): Promise<void>;

  getFaqs(): Promise<Faq[]>;
  createFaq(faq: InsertFaq): Promise<Faq>;
  updateFaq(id: string, faq: Partial<InsertFaq>): Promise<Faq | undefined>;
  deleteFaq(id: string): Promise<void>;

  getMessageLogs(limit?: number): Promise<MessageLog[]>;
  getMessageLogsByGuest(guestId: string): Promise<MessageLog[]>;
  createMessageLog(log: InsertMessageLog): Promise<MessageLog>;
  updateMessageLog(id: string, log: Partial<InsertMessageLog>): Promise<MessageLog | undefined>;
  checkDuplicateMessage(guestId: string, messageType: string): Promise<boolean>;

  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

/* =========================================================
   Database Storage
========================================================= */

export class DatabaseStorage implements IStorage {

  /* ================= CONFIG ================= */

  async getWeddingConfig(): Promise<WeddingConfig | undefined> {
    const [config] = await db.select().from(weddingConfig).limit(1);
    return config;
  }

  async upsertWeddingConfig(config: Partial<InsertWeddingConfig>): Promise<WeddingConfig> {
    const existing = await this.getWeddingConfig();

    if (existing) {
      const [updated] = await db
        .update(weddingConfig)
        .set({ ...config, updatedAt: new Date() })
        .where(eq(weddingConfig.id, existing.id))
        .returning();

      return updated;
    }

    const [created] = await db
      .insert(weddingConfig)
      .values(config as InsertWeddingConfig)
      .returning();

    return created;
  }

  /* ================= GUESTS ================= */

  async getGuests(limit = 50, offset = 0): Promise<Guest[]> {
    return db
      .select()
      .from(guests)
      .orderBy(desc(guests.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async countGuests(): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(guests);

    return Number(result.count);
  }

  async getGuestById(id: string): Promise<Guest | undefined> {
    const [guest] = await db.select().from(guests).where(eq(guests.id, id));
    return guest;
  }

  async getGuestBySlug(slug: string): Promise<Guest | undefined> {
    const [guest] = await db
      .select()
      .from(guests)
      .where(eq(guests.inviteSlug, slug));

    return guest;
  }

  async getGuestByName(name: string): Promise<Guest | undefined> {
    const [guest] = await db
      .select()
      .from(guests)
      .where(like(guests.name, `%${name}%`))
      .limit(1);

    return guest;
  }

  async createGuest(guest: InsertGuest): Promise<Guest> {
    const [created] = await db
      .insert(guests)
      .values(guest)
      .returning();

    return created;
  }

  async updateGuest(id: string, guest: Partial<InsertGuest>): Promise<Guest | undefined> {
    const [updated] = await db
      .update(guests)
      .set({ ...guest, updatedAt: new Date() })
      .where(eq(guests.id, id))
      .returning();

    return updated;
  }

  async deleteGuest(id: string): Promise<void> {
    await db.delete(guests).where(eq(guests.id, id));
  }

  /* ================= EVENTS ================= */

  async getWeddingEvents(): Promise<WeddingEvent[]> {
    return db
      .select()
      .from(weddingEvents)
      .orderBy(asc(weddingEvents.sortOrder), asc(weddingEvents.startTime));
  }

  async getWeddingEventById(id: string): Promise<WeddingEvent | undefined> {
    const [event] = await db
      .select()
      .from(weddingEvents)
      .where(eq(weddingEvents.id, id));

    return event;
  }

  async createWeddingEvent(event: InsertWeddingEvent): Promise<WeddingEvent> {
    const [created] = await db
      .insert(weddingEvents)
      .values(event)
      .returning();

    return created;
  }

  async updateWeddingEvent(id: string, event: Partial<InsertWeddingEvent>): Promise<WeddingEvent | undefined> {
    const [updated] = await db
      .update(weddingEvents)
      .set(event)
      .where(eq(weddingEvents.id, id))
      .returning();

    return updated;
  }

  async deleteWeddingEvent(id: string): Promise<void> {
    await db.delete(weddingEvents).where(eq(weddingEvents.id, id));
  }

  /* ================= STORIES ================= */

  async getStoryMilestones(): Promise<StoryMilestone[]> {
    return db
      .select()
      .from(storyMilestones)
      .orderBy(asc(storyMilestones.sortOrder));
  }

  async createStoryMilestone(milestone: InsertStoryMilestone): Promise<StoryMilestone> {
    const [created] = await db
      .insert(storyMilestones)
      .values(milestone)
      .returning();

    return created;
  }

  async updateStoryMilestone(id: string, milestone: Partial<InsertStoryMilestone>): Promise<StoryMilestone | undefined> {
    const [updated] = await db
      .update(storyMilestones)
      .set(milestone)
      .where(eq(storyMilestones.id, id))
      .returning();

    return updated;
  }

  async deleteStoryMilestone(id: string): Promise<void> {
    await db.delete(storyMilestones).where(eq(storyMilestones.id, id));
  }

  /* ================= VENUES ================= */

  async getVenues(): Promise<Venue[]> {
    return db
      .select()
      .from(venues)
      .orderBy(asc(venues.sortOrder));
  }

  async createVenue(venue: InsertVenue): Promise<Venue> {
    const [created] = await db
      .insert(venues)
      .values(venue)
      .returning();

    return created;
  }

  async updateVenue(id: string, venue: Partial<InsertVenue>): Promise<Venue | undefined> {
    const [updated] = await db
      .update(venues)
      .set(venue)
      .where(eq(venues.id, id))
      .returning();

    return updated;
  }

  async deleteVenue(id: string): Promise<void> {
    await db.delete(venues).where(eq(venues.id, id));
  }

  /* ================= FAQ ================= */

  async getFaqs(): Promise<Faq[]> {
    return db
      .select()
      .from(faqs)
      .orderBy(asc(faqs.sortOrder));
  }

  async createFaq(faq: InsertFaq): Promise<Faq> {
    const [created] = await db.insert(faqs).values(faq).returning();
    return created;
  }

  async updateFaq(id: string, faq: Partial<InsertFaq>): Promise<Faq | undefined> {
    const [updated] = await db
      .update(faqs)
      .set(faq)
      .where(eq(faqs.id, id))
      .returning();

    return updated;
  }

  async deleteFaq(id: string): Promise<void> {
    await db.delete(faqs).where(eq(faqs.id, id));
  }

  /* ================= MESSAGE LOGS ================= */

  async getMessageLogs(limit = 100): Promise<MessageLog[]> {
    return db
      .select()
      .from(messageLogs)
      .orderBy(desc(messageLogs.createdAt))
      .limit(limit);
  }

  async getMessageLogsByGuest(guestId: string): Promise<MessageLog[]> {
    return db
      .select()
      .from(messageLogs)
      .where(eq(messageLogs.guestId, guestId))
      .orderBy(desc(messageLogs.createdAt));
  }

  async createMessageLog(log: InsertMessageLog): Promise<MessageLog> {
    const [created] = await db.insert(messageLogs).values(log).returning();
    return created;
  }

  async updateMessageLog(id: string, log: Partial<InsertMessageLog>): Promise<MessageLog | undefined> {
    const [updated] = await db
      .update(messageLogs)
      .set(log)
      .where(eq(messageLogs.id, id))
      .returning();

    return updated;
  }

  async checkDuplicateMessage(guestId: string, messageType: string): Promise<boolean> {
    const [existing] = await db
      .select()
      .from(messageLogs)
      .where(
        and(
          eq(messageLogs.guestId, guestId),
          eq(messageLogs.messageType, messageType),
          sql`${messageLogs.status} IN ('sent','pending')`
        )
      )
      .limit(1);

    return !!existing;
  }

  /* ================= USERS ================= */

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
// import {
//   type Guest,
//   type InsertGuest,
//   type WeddingConfig,
//   type InsertWeddingConfig,
//   type WeddingEvent,
//   type InsertWeddingEvent,
//   type MessageLog,
//   type InsertMessageLog,
//   type User,
//   type InsertUser,
//   type StoryMilestone,
//   type InsertStoryMilestone,
//   type Venue,
//   type InsertVenue,
//   type Faq,
//   type InsertFaq,
//   guests,
//   weddingConfig,
//   weddingEvents,
//   messageLogs,
//   users,
//   storyMilestones,
//   venues,
//   faqs,
// } from "../shared/schema.js";
// import { db } from "./db";
// import { eq, desc, asc, like } from "drizzle-orm";

// export interface IStorage {
//   getWeddingConfig(): Promise<WeddingConfig | undefined>;
//   upsertWeddingConfig(config: Partial<InsertWeddingConfig>): Promise<WeddingConfig>;

//   getGuests(): Promise<Guest[]>;
//   getGuestById(id: string): Promise<Guest | undefined>;
//   getGuestBySlug(slug: string): Promise<Guest | undefined>;
//   getGuestByName(name: string): Promise<Guest | undefined>;
//   createGuest(guest: InsertGuest): Promise<Guest>;
//   updateGuest(id: string, guest: Partial<InsertGuest>): Promise<Guest | undefined>;
//   deleteGuest(id: string): Promise<void>;

//   getWeddingEvents(): Promise<WeddingEvent[]>;
//   getWeddingEventById(id: string): Promise<WeddingEvent | undefined>;
//   createWeddingEvent(event: InsertWeddingEvent): Promise<WeddingEvent>;
//   updateWeddingEvent(id: string, event: Partial<InsertWeddingEvent>): Promise<WeddingEvent | undefined>;
//   deleteWeddingEvent(id: string): Promise<void>;

//   getStoryMilestones(): Promise<StoryMilestone[]>;
//   getStoryMilestoneById(id: string): Promise<StoryMilestone | undefined>;
//   createStoryMilestone(milestone: InsertStoryMilestone): Promise<StoryMilestone>;
//   updateStoryMilestone(id: string, milestone: Partial<InsertStoryMilestone>): Promise<StoryMilestone | undefined>;
//   deleteStoryMilestone(id: string): Promise<void>;

//   getVenues(): Promise<Venue[]>;
//   getVenueById(id: string): Promise<Venue | undefined>;
//   createVenue(venue: InsertVenue): Promise<Venue>;
//   updateVenue(id: string, venue: Partial<InsertVenue>): Promise<Venue | undefined>;
//   deleteVenue(id: string): Promise<void>;

//   getFaqs(): Promise<Faq[]>;
//   getFaqById(id: string): Promise<Faq | undefined>;
//   createFaq(faq: InsertFaq): Promise<Faq>;
//   updateFaq(id: string, faq: Partial<InsertFaq>): Promise<Faq | undefined>;
//   deleteFaq(id: string): Promise<void>;

//   getMessageLogs(limit?: number): Promise<MessageLog[]>;
//   getMessageLogsByGuest(guestId: string): Promise<MessageLog[]>;
//   createMessageLog(log: InsertMessageLog): Promise<MessageLog>;
//   updateMessageLog(id: string, log: Partial<InsertMessageLog>): Promise<MessageLog | undefined>;
//   checkDuplicateMessage(guestId: string, messageType: string): Promise<boolean>;

//   getUser(id: string): Promise<User | undefined>;
//   getUserByUsername(username: string): Promise<User | undefined>;
//   createUser(user: InsertUser): Promise<User>;
// }

// export class DatabaseStorage implements IStorage {
//   async getWeddingConfig(): Promise<WeddingConfig | undefined> {
//     const [config] = await db.select().from(weddingConfig).limit(1);
//     return config;
//   }

//   async upsertWeddingConfig(config: Partial<InsertWeddingConfig>): Promise<WeddingConfig> {
//     const existing = await this.getWeddingConfig();
//     if (existing) {
//       const [updated] = await db
//         .update(weddingConfig)
//         .set({ ...config, updatedAt: new Date() })
//         .where(eq(weddingConfig.id, existing.id))
//         .returning();
//       return updated;
//     } else {
//       const [created] = await db
//         .insert(weddingConfig)
//         .values({ ...(config as InsertWeddingConfig) })
//         .returning();
//       return created;
//     }
//   }

//   // async getGuests(): Promise<Guest[]> {
//   //   return db.select().from(guests).orderBy(asc(guests.createdAt));
//   // }
//   async getGuests(limit = 200): Promise<Guest[]> {
//     return db
//       .select()
//       .from(guests)
//       .orderBy(asc(guests.createdAt))
//       .limit(limit);
//   }

//   async getGuestById(id: string): Promise<Guest | undefined> {
//     const [guest] = await db.select().from(guests).where(eq(guests.id, id));
//     return guest;
//   }

//   async getGuestBySlug(slug: string): Promise<Guest | undefined> {
//     const [guest] = await db.select().from(guests).where(eq(guests.inviteSlug, slug));
//     return guest;
//   }

//   async getGuestByName(name: string): Promise<Guest | undefined> {
//     const [guest] = await db.select().from(guests).where(like(guests.name, `%${name}%`));
//     return guest;
//   }

//   async createGuest(guest: InsertGuest): Promise<Guest> {
//     const [created] = await db.insert(guests).values(guest).returning();
//     return created;
//   }

//   async updateGuest(id: string, guest: Partial<InsertGuest>): Promise<Guest | undefined> {
//     const [updated] = await db
//       .update(guests)
//       .set({ ...guest, updatedAt: new Date() })
//       .where(eq(guests.id, id))
//       .returning();
//     return updated;
//   }

//   async deleteGuest(id: string): Promise<void> {
//     await db.delete(guests).where(eq(guests.id, id));
//   }

//   async getWeddingEvents(): Promise<WeddingEvent[]> {
//     return db.select().from(weddingEvents).orderBy(asc(weddingEvents.sortOrder), asc(weddingEvents.startTime));
//   }

//   async getWeddingEventById(id: string): Promise<WeddingEvent | undefined> {
//     const [event] = await db.select().from(weddingEvents).where(eq(weddingEvents.id, id));
//     return event;
//   }

//   async createWeddingEvent(event: InsertWeddingEvent): Promise<WeddingEvent> {
//     const [created] = await db.insert(weddingEvents).values(event).returning();
//     return created;
//   }

//   async updateWeddingEvent(id: string, event: Partial<InsertWeddingEvent>): Promise<WeddingEvent | undefined> {
//     const [updated] = await db
//       .update(weddingEvents)
//       .set(event)
//       .where(eq(weddingEvents.id, id))
//       .returning();
//     return updated;
//   }

//   async deleteWeddingEvent(id: string): Promise<void> {
//     await db.delete(weddingEvents).where(eq(weddingEvents.id, id));
//   }

//   async getStoryMilestones(): Promise<StoryMilestone[]> {
//     return db.select().from(storyMilestones).orderBy(asc(storyMilestones.sortOrder));
//   }

//   async getStoryMilestoneById(id: string): Promise<StoryMilestone | undefined> {
//     const [m] = await db.select().from(storyMilestones).where(eq(storyMilestones.id, id));
//     return m;
//   }

//   async createStoryMilestone(milestone: InsertStoryMilestone): Promise<StoryMilestone> {
//     const [created] = await db.insert(storyMilestones).values(milestone).returning();
//     return created;
//   }

//   async updateStoryMilestone(id: string, milestone: Partial<InsertStoryMilestone>): Promise<StoryMilestone | undefined> {
//     const [updated] = await db
//       .update(storyMilestones)
//       .set(milestone)
//       .where(eq(storyMilestones.id, id))
//       .returning();
//     return updated;
//   }

//   async deleteStoryMilestone(id: string): Promise<void> {
//     await db.delete(storyMilestones).where(eq(storyMilestones.id, id));
//   }

//   async getVenues(): Promise<Venue[]> {
//     return db.select().from(venues).orderBy(asc(venues.sortOrder));
//   }

//   async getVenueById(id: string): Promise<Venue | undefined> {
//     const [v] = await db.select().from(venues).where(eq(venues.id, id));
//     return v;
//   }

//   async createVenue(venue: InsertVenue): Promise<Venue> {
//     const [created] = await db.insert(venues).values(venue).returning();
//     return created;
//   }

//   async updateVenue(id: string, venue: Partial<InsertVenue>): Promise<Venue | undefined> {
//     const [updated] = await db
//       .update(venues)
//       .set(venue)
//       .where(eq(venues.id, id))
//       .returning();
//     return updated;
//   }

//   async deleteVenue(id: string): Promise<void> {
//     await db.delete(venues).where(eq(venues.id, id));
//   }

//   async getFaqs(): Promise<Faq[]> {
//     return db.select().from(faqs).orderBy(asc(faqs.sortOrder));
//   }

//   async getFaqById(id: string): Promise<Faq | undefined> {
//     const [f] = await db.select().from(faqs).where(eq(faqs.id, id));
//     return f;
//   }

//   async createFaq(faq: InsertFaq): Promise<Faq> {
//     const [created] = await db.insert(faqs).values(faq).returning();
//     return created;
//   }

//   async updateFaq(id: string, faq: Partial<InsertFaq>): Promise<Faq | undefined> {
//     const [updated] = await db
//       .update(faqs)
//       .set(faq)
//       .where(eq(faqs.id, id))
//       .returning();
//     return updated;
//   }

//   async deleteFaq(id: string): Promise<void> {
//     await db.delete(faqs).where(eq(faqs.id, id));
//   }

//   async getMessageLogs(limit = 100): Promise<MessageLog[]> {
//     return db
//       .select()
//       .from(messageLogs)
//       .orderBy(desc(messageLogs.createdAt))
//       .limit(limit);
//   }

//   async getMessageLogsByGuest(guestId: string): Promise<MessageLog[]> {
//     return db
//       .select()
//       .from(messageLogs)
//       .where(eq(messageLogs.guestId, guestId))
//       .orderBy(desc(messageLogs.createdAt));
//   }

//   async createMessageLog(log: InsertMessageLog): Promise<MessageLog> {
//     const [created] = await db.insert(messageLogs).values(log).returning();
//     return created;
//   }

//   async updateMessageLog(id: string, log: Partial<InsertMessageLog>): Promise<MessageLog | undefined> {
//     const [updated] = await db
//       .update(messageLogs)
//       .set(log)
//       .where(eq(messageLogs.id, id))
//       .returning();
//     return updated;
//   }

//   async checkDuplicateMessage(guestId: string, messageType: string): Promise<boolean> {
//     const [existing] = await db
//       .select()
//       .from(messageLogs)
//       .where(eq(messageLogs.guestId, guestId))
//       .limit(1);

//     if (!existing) return false;

//     return (
//       existing.messageType === messageType &&
//       (existing.status === "sent" || existing.status === "pending")
//     );
//   }

//   async getUser(id: string): Promise<User | undefined> {
//     const [user] = await db.select().from(users).where(eq(users.id, id));
//     return user;
//   }

//   async getUserByUsername(username: string): Promise<User | undefined> {
//     const [user] = await db.select().from(users).where(eq(users.username, username));
//     return user;
//   }

//   async createUser(user: InsertUser): Promise<User> {
//     const [created] = await db.insert(users).values(user).returning();
//     return created;
//   }
// }

// export const storage = new DatabaseStorage();
