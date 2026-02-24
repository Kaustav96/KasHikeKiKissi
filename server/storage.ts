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
  guests,
  weddingConfig,
  weddingEvents,
  messageLogs,
  users,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

export interface IStorage {
  // Wedding Config
  getWeddingConfig(): Promise<WeddingConfig | undefined>;
  upsertWeddingConfig(config: Partial<InsertWeddingConfig>): Promise<WeddingConfig>;

  // Guests
  getGuests(): Promise<Guest[]>;
  getGuestById(id: string): Promise<Guest | undefined>;
  getGuestBySlug(slug: string): Promise<Guest | undefined>;
  createGuest(guest: InsertGuest): Promise<Guest>;
  updateGuest(id: string, guest: Partial<InsertGuest>): Promise<Guest | undefined>;
  deleteGuest(id: string): Promise<void>;

  // Wedding Events
  getWeddingEvents(): Promise<WeddingEvent[]>;
  getWeddingEventById(id: string): Promise<WeddingEvent | undefined>;
  createWeddingEvent(event: InsertWeddingEvent): Promise<WeddingEvent>;
  updateWeddingEvent(id: string, event: Partial<InsertWeddingEvent>): Promise<WeddingEvent | undefined>;
  deleteWeddingEvent(id: string): Promise<void>;

  // Message Logs
  getMessageLogs(limit?: number): Promise<MessageLog[]>;
  getMessageLogsByGuest(guestId: string): Promise<MessageLog[]>;
  createMessageLog(log: InsertMessageLog): Promise<MessageLog>;
  updateMessageLog(id: string, log: Partial<InsertMessageLog>): Promise<MessageLog | undefined>;
  checkDuplicateMessage(guestId: string, messageType: string): Promise<boolean>;

  // Admin Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // ─── Wedding Config ───────────────────────────────────────────────────────
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
    } else {
      const [created] = await db
        .insert(weddingConfig)
        .values({ ...(config as InsertWeddingConfig) })
        .returning();
      return created;
    }
  }

  // ─── Guests ──────────────────────────────────────────────────────────────
  async getGuests(): Promise<Guest[]> {
    return db.select().from(guests).orderBy(asc(guests.createdAt));
  }

  async getGuestById(id: string): Promise<Guest | undefined> {
    const [guest] = await db.select().from(guests).where(eq(guests.id, id));
    return guest;
  }

  async getGuestBySlug(slug: string): Promise<Guest | undefined> {
    const [guest] = await db.select().from(guests).where(eq(guests.inviteSlug, slug));
    return guest;
  }

  async createGuest(guest: InsertGuest): Promise<Guest> {
    const [created] = await db.insert(guests).values(guest).returning();
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

  // ─── Wedding Events ───────────────────────────────────────────────────────
  async getWeddingEvents(): Promise<WeddingEvent[]> {
    return db.select().from(weddingEvents).orderBy(asc(weddingEvents.sortOrder), asc(weddingEvents.startTime));
  }

  async getWeddingEventById(id: string): Promise<WeddingEvent | undefined> {
    const [event] = await db.select().from(weddingEvents).where(eq(weddingEvents.id, id));
    return event;
  }

  async createWeddingEvent(event: InsertWeddingEvent): Promise<WeddingEvent> {
    const [created] = await db.insert(weddingEvents).values(event).returning();
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

  // ─── Message Logs ─────────────────────────────────────────────────────────
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
    const logs = await db
      .select()
      .from(messageLogs)
      .where(eq(messageLogs.guestId, guestId));
    return logs.some(
      (l) => l.messageType === messageType && (l.status === "sent" || l.status === "pending")
    );
  }

  // ─── Admin Users ─────────────────────────────────────────────────────────
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
