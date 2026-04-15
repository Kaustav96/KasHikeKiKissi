import { firestore, Collections } from './firebase.js';
import type {
  Guest,
  InsertGuest,
  WeddingConfig,
  InsertWeddingConfig,
  WeddingEvent,
  InsertWeddingEvent,
  MessageLog,
  InsertMessageLog,
  User,
  InsertUser,
  StoryMilestone,
  InsertStoryMilestone,
  Venue,
  InsertVenue,
  Faq,
  InsertFaq,
} from '../shared/schema.js';

/* =========================================================
   Interface (Unchanged - maintains API compatibility)
========================================================= */

export interface IStorage {
  getWeddingConfig(): Promise<WeddingConfig | undefined>;
  upsertWeddingConfig(config: Partial<InsertWeddingConfig>): Promise<WeddingConfig>;

  getGuests(limit?: number, offset?: number): Promise<Guest[]>;
  countGuests(): Promise<number>;
  getGuestById(id: string): Promise<Guest | undefined>;
  getGuestBySlug(slug: string): Promise<Guest | undefined>;
  getGuestByName(name: string): Promise<Guest | undefined>;
  searchGuestsByName(name: string): Promise<Guest[]>;
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
   Firestore Storage Implementation
========================================================= */

// Helper to convert Firestore Timestamp to Date
const convertTimestamps = (data: any): any => {
  if (!data) return data;
  
  const converted = { ...data };
  
  // Convert Firestore Timestamps to Date objects
  for (const key in converted) {
    if (converted[key] && typeof converted[key] === 'object') {
      // Check if it's a Firestore Timestamp
      if (converted[key].toDate && typeof converted[key].toDate === 'function') {
        converted[key] = converted[key].toDate();
      }
    }
  }
  
  return converted;
};

// Helper to remove undefined values (Firestore doesn't accept undefined)
const removeUndefined = (obj: any): any => {
  const cleaned: any = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  }
  return cleaned;
};

/**
 * Back-fill default values for fields added after initial deployment.
 * Existing Firestore documents won't have rsvpApprovalStatus — default to "approved"
 * so all previously-added (admin-invited) guests are treated as already approved.
 */
const hydrateGuest = (data: any): any => ({
  rsvpApprovalStatus: "approved", // old guests are pre-approved by default
  ...data,                        // real stored values win
});

export class FirestoreStorage implements IStorage {

  /* ================= CONFIG ================= */

  async getWeddingConfig(): Promise<WeddingConfig | undefined> {
    const snapshot = await firestore
      .collection(Collections.WEDDING_CONFIG)
      .limit(1)
      .get();
    
    if (snapshot.empty) return undefined;
    
    const doc = snapshot.docs[0];
    const data = convertTimestamps(doc.data());
    
    return {
      id: doc.id,
      ...data,
    } as WeddingConfig;
  }

  async upsertWeddingConfig(config: Partial<InsertWeddingConfig>): Promise<WeddingConfig> {
    const existing = await this.getWeddingConfig();
    
    if (existing) {
      const docRef = firestore.collection(Collections.WEDDING_CONFIG).doc(existing.id);
      const cleanedConfig = removeUndefined({
        ...config,
        updatedAt: new Date(),
      });
      await docRef.update(cleanedConfig);
      
      const updated = await docRef.get();
      const data = convertTimestamps(updated.data());
      return { id: updated.id, ...data } as WeddingConfig;
    } else {
      const docRef = firestore.collection(Collections.WEDDING_CONFIG).doc();
      const newConfig = removeUndefined({
        ...config,
        id: docRef.id,
        updatedAt: new Date(),
      });
      
      await docRef.set(newConfig);
      return newConfig as WeddingConfig;
    }
  }

  /* ================= GUESTS ================= */

  async getGuests(limit = 50, offset = 0): Promise<Guest[]> {
    const snapshot = await firestore
      .collection(Collections.GUESTS)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset(offset)
      .get();
    
    return snapshot.docs.map(doc => {
      const data = convertTimestamps(doc.data());
      return {
        id: doc.id,
        ...hydrateGuest(data),
      } as Guest;
    });
  }

  async countGuests(): Promise<number> {
    const snapshot = await firestore
      .collection(Collections.GUESTS)
      .count()
      .get();
    
    return snapshot.data().count;
  }

  async getGuestById(id: string): Promise<Guest | undefined> {
    const doc = await firestore
      .collection(Collections.GUESTS)
      .doc(id)
      .get();
    
    if (!doc.exists) return undefined;
    
    const data = convertTimestamps(doc.data());
    return { id: doc.id, ...hydrateGuest(data) } as Guest;
  }

  async getGuestBySlug(slug: string): Promise<Guest | undefined> {
    const snapshot = await firestore
      .collection(Collections.GUESTS)
      .where('inviteSlug', '==', slug)
      .limit(1)
      .get();
    
    if (snapshot.empty) return undefined;
    
    const doc = snapshot.docs[0];
    const data = convertTimestamps(doc.data());
    return { id: doc.id, ...hydrateGuest(data) } as Guest;
  }

  async getGuestByName(name: string): Promise<Guest | undefined> {
    const snapshot = await firestore
      .collection(Collections.GUESTS)
      .where('name', '==', name)
      .limit(1)
      .get();
    
    if (snapshot.empty) return undefined;
    
    const doc = snapshot.docs[0];
    const data = convertTimestamps(doc.data());
    return { id: doc.id, ...hydrateGuest(data) } as Guest;
  }

  async searchGuestsByName(name: string): Promise<Guest[]> {
    // Firestore doesn't support case-insensitive search or LIKE
    // We'll fetch all guests and filter in memory (for small datasets this is okay)
    const snapshot = await firestore
      .collection(Collections.GUESTS)
      .orderBy('name')
      .limit(100)
      .get();
    
    const searchLower = name.toLowerCase();
    
    return snapshot.docs
      .filter(doc => {
        const guestName = doc.data().name?.toLowerCase() || '';
        return guestName.includes(searchLower);
      })
      .slice(0, 20)
      .map(doc => {
        const data = convertTimestamps(doc.data());
        return { id: doc.id, ...hydrateGuest(data) } as Guest;
      });
  }

  async createGuest(guest: InsertGuest): Promise<Guest> {
    const docRef = firestore.collection(Collections.GUESTS).doc();
    const newGuest = {
      ...guest,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await docRef.set(newGuest);
    return newGuest as Guest;
  }

  async updateGuest(id: string, guest: Partial<InsertGuest>): Promise<Guest | undefined> {
    const docRef = firestore.collection(Collections.GUESTS).doc(id);
    
    const cleanedGuest = removeUndefined({
      ...guest,
      updatedAt: new Date(),
    });
    
    await docRef.update(cleanedGuest);
    
    const updated = await docRef.get();
    if (!updated.exists) return undefined;
    
    const data = convertTimestamps(updated.data());
    return { id: updated.id, ...hydrateGuest(data) } as Guest;
  }

  async deleteGuest(id: string): Promise<void> {
    await firestore.collection(Collections.GUESTS).doc(id).delete();
  }

  /* ================= EVENTS ================= */

  async getWeddingEvents(): Promise<WeddingEvent[]> {
    const snapshot = await firestore
      .collection(Collections.WEDDING_EVENTS)
      .orderBy('sortOrder', 'asc')
      .get();
    
    return snapshot.docs.map(doc => {
      const data = convertTimestamps(doc.data());
      return {
        id: doc.id,
        ...data,
      } as WeddingEvent;
    });
  }

  async getWeddingEventById(id: string): Promise<WeddingEvent | undefined> {
    const doc = await firestore
      .collection(Collections.WEDDING_EVENTS)
      .doc(id)
      .get();
    
    if (!doc.exists) return undefined;
    
    const data = convertTimestamps(doc.data());
    return { id: doc.id, ...data } as WeddingEvent;
  }

  async createWeddingEvent(event: InsertWeddingEvent): Promise<WeddingEvent> {
    const docRef = firestore.collection(Collections.WEDDING_EVENTS).doc();
    const newEvent = {
      ...event,
      id: docRef.id,
      createdAt: new Date(),
    };
    
    await docRef.set(newEvent);
    return newEvent as WeddingEvent;
  }

  async updateWeddingEvent(id: string, event: Partial<InsertWeddingEvent>): Promise<WeddingEvent | undefined> {
    const docRef = firestore.collection(Collections.WEDDING_EVENTS).doc(id);
    
    await docRef.update(removeUndefined(event));
    
    const updated = await docRef.get();
    if (!updated.exists) return undefined;
    
    const data = convertTimestamps(updated.data());
    return { id: updated.id, ...data } as WeddingEvent;
  }

  async deleteWeddingEvent(id: string): Promise<void> {
    await firestore.collection(Collections.WEDDING_EVENTS).doc(id).delete();
  }

  /* ================= STORIES ================= */

  async getStoryMilestones(): Promise<StoryMilestone[]> {
    const snapshot = await firestore
      .collection(Collections.STORY_MILESTONES)
      .orderBy('sortOrder', 'asc')
      .get();

    return snapshot.docs.map(doc => {
      const data = convertTimestamps(doc.data());
      return { id: doc.id, ...data } as StoryMilestone;
    });
  }

  async createStoryMilestone(milestone: InsertStoryMilestone): Promise<StoryMilestone> {
    const docRef = firestore.collection(Collections.STORY_MILESTONES).doc();
    const newMilestone = {
      ...milestone,
      id: docRef.id,
      createdAt: new Date(),
    };

    await docRef.set(newMilestone);
    return newMilestone as StoryMilestone;
  }

  async updateStoryMilestone(id: string, milestone: Partial<InsertStoryMilestone>): Promise<StoryMilestone | undefined> {
    const docRef = firestore.collection(Collections.STORY_MILESTONES).doc(id);
    
    await docRef.update(removeUndefined(milestone));
    
    const updated = await docRef.get();
    if (!updated.exists) return undefined;
    
    const data = convertTimestamps(updated.data());
    return { id: updated.id, ...data } as StoryMilestone;
  }

  async deleteStoryMilestone(id: string): Promise<void> {
    await firestore.collection(Collections.STORY_MILESTONES).doc(id).delete();
  }

  /* ================= VENUES ================= */

  async getVenues(): Promise<Venue[]> {
    const snapshot = await firestore
      .collection(Collections.VENUES)
      .orderBy('sortOrder', 'asc')
      .get();

    return snapshot.docs.map(doc => {
      const data = convertTimestamps(doc.data());
      return { id: doc.id, ...data } as Venue;
    });
  }

  async createVenue(venue: InsertVenue): Promise<Venue> {
    const docRef = firestore.collection(Collections.VENUES).doc();
    const newVenue = {
      ...venue,
      id: docRef.id,
      createdAt: new Date(),
    };

    await docRef.set(newVenue);
    return newVenue as Venue;
  }

  async updateVenue(id: string, venue: Partial<InsertVenue>): Promise<Venue | undefined> {
    const docRef = firestore.collection(Collections.VENUES).doc(id);
    
    await docRef.update(removeUndefined(venue));
    
    const updated = await docRef.get();
    if (!updated.exists) return undefined;
    
    const data = convertTimestamps(updated.data());
    return { id: updated.id, ...data } as Venue;
  }

  async deleteVenue(id: string): Promise<void> {
    await firestore.collection(Collections.VENUES).doc(id).delete();
  }

  /* ================= FAQ ================= */

  async getFaqs(): Promise<Faq[]> {
    const snapshot = await firestore
      .collection(Collections.FAQS)
      .orderBy('sortOrder', 'asc')
      .get();

    return snapshot.docs.map(doc => {
      const data = convertTimestamps(doc.data());
      return { id: doc.id, ...data } as Faq;
    });
  }

  async createFaq(faq: InsertFaq): Promise<Faq> {
    const docRef = firestore.collection(Collections.FAQS).doc();
    const newFaq = {
      ...faq,
      id: docRef.id,
      createdAt: new Date(),
    };

    await docRef.set(newFaq);
    return newFaq as Faq;
  }

  async updateFaq(id: string, faq: Partial<InsertFaq>): Promise<Faq | undefined> {
    const docRef = firestore.collection(Collections.FAQS).doc(id);
    
    await docRef.update(removeUndefined(faq));
    
    const updated = await docRef.get();
    if (!updated.exists) return undefined;
    
    const data = convertTimestamps(updated.data());
    return { id: updated.id, ...data } as Faq;
  }

  async deleteFaq(id: string): Promise<void> {
    await firestore.collection(Collections.FAQS).doc(id).delete();
  }

  /* ================= MESSAGE LOGS ================= */

  async getMessageLogs(limit = 100): Promise<MessageLog[]> {
    const snapshot = await firestore
      .collection(Collections.MESSAGE_LOGS)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => {
      const data = convertTimestamps(doc.data());
      return { id: doc.id, ...data } as MessageLog;
    });
  }

  async getMessageLogsByGuest(guestId: string): Promise<MessageLog[]> {
    const snapshot = await firestore
      .collection(Collections.MESSAGE_LOGS)
      .where('guestId', '==', guestId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => {
      const data = convertTimestamps(doc.data());
      return { id: doc.id, ...data } as MessageLog;
    });
  }

  async createMessageLog(log: InsertMessageLog): Promise<MessageLog> {
    const docRef = firestore.collection(Collections.MESSAGE_LOGS).doc();
    const newLog = {
      ...log,
      id: docRef.id,
      createdAt: new Date(),
    };

    await docRef.set(newLog);
    return newLog as MessageLog;
  }

  async updateMessageLog(id: string, log: Partial<InsertMessageLog>): Promise<MessageLog | undefined> {
    const docRef = firestore.collection(Collections.MESSAGE_LOGS).doc(id);
    
    await docRef.update(removeUndefined(log));
    
    const updated = await docRef.get();
    if (!updated.exists) return undefined;
    
    const data = convertTimestamps(updated.data());
    return { id: updated.id, ...data } as MessageLog;
  }

  async checkDuplicateMessage(guestId: string, messageType: string): Promise<boolean> {
    const snapshot = await firestore
      .collection(Collections.MESSAGE_LOGS)
      .where('guestId', '==', guestId)
      .where('messageType', '==', messageType)
      .where('status', 'in', ['sent', 'pending'])
      .limit(1)
      .get();
    
    return !snapshot.empty;
  }

  /* ================= USERS ================= */

  async getUserByUsername(username: string): Promise<User | undefined> {
    const snapshot = await firestore
      .collection(Collections.USERS)
      .where('username', '==', username)
      .limit(1)
      .get();
    
    if (snapshot.empty) return undefined;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const docRef = firestore.collection(Collections.USERS).doc();
    const newUser = {
      ...user,
      id: docRef.id,
    };
    
    await docRef.set(newUser);
    return newUser as User;
  }
}

export const storage = new FirestoreStorage();

