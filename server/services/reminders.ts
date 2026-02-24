/**
 * Wedding Reminder Engine
 *
 * Uses node-cron to schedule hourly checks for upcoming wedding events.
 * Sends personalized WhatsApp reminders to confirmed, opted-in guests at:
 *   - 30 days before the wedding
 *   - 7 days before the wedding
 *   - 1 day before the wedding
 *   - Morning of the wedding (6 AM)
 *   - At event start time
 *   - Day after wedding (thank-you message)
 *
 * All message types are checked against MessageLogs to prevent duplicates.
 */

import cron from "node-cron";
import { storage } from "../storage";
import { sendReminder } from "./whatsapp";

interface ReminderTiming {
  messageType: "reminder_30d" | "reminder_7d" | "reminder_1d" | "morning" | "start" | "thankyou";
  templateName: string;
  label: string;
  /** Returns true if this reminder should fire given the current time and the wedding date */
  shouldFire(now: Date, weddingDate: Date): boolean;
}

const REMINDER_TIMINGS: ReminderTiming[] = [
  {
    messageType: "reminder_30d",
    templateName: "wedding_reminder_30days",
    label: "30-day reminder",
    shouldFire(now, wedding) {
      const diffMs = wedding.getTime() - now.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      // Fire when between 29.5 and 30.5 days away
      return diffDays >= 29.5 && diffDays <= 30.5;
    },
  },
  {
    messageType: "reminder_7d",
    templateName: "wedding_reminder_7days",
    label: "7-day reminder",
    shouldFire(now, wedding) {
      const diffMs = wedding.getTime() - now.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      return diffDays >= 6.5 && diffDays <= 7.5;
    },
  },
  {
    messageType: "reminder_1d",
    templateName: "wedding_reminder_1day",
    label: "1-day reminder",
    shouldFire(now, wedding) {
      const diffMs = wedding.getTime() - now.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      return diffDays >= 0.5 && diffDays <= 1.5;
    },
  },
  {
    messageType: "morning",
    templateName: "wedding_morning_message",
    label: "Wedding morning message",
    shouldFire(now, wedding) {
      // Fire at 6 AM on wedding day
      const weddingDay = new Date(wedding);
      weddingDay.setHours(6, 0, 0, 0);
      const diffMs = Math.abs(now.getTime() - weddingDay.getTime());
      return diffMs <= 30 * 60 * 1000; // Within 30 minutes of 6 AM on wedding day
    },
  },
  {
    messageType: "start",
    templateName: "wedding_starts_now",
    label: "Event start reminder",
    shouldFire(now, wedding) {
      const diffMs = Math.abs(now.getTime() - wedding.getTime());
      return diffMs <= 30 * 60 * 1000; // Within 30 minutes of ceremony start
    },
  },
  {
    messageType: "thankyou",
    templateName: "wedding_thank_you",
    label: "Thank-you message",
    shouldFire(now, wedding) {
      // Fire the morning after (between 9-10 AM next day)
      const nextDay = new Date(wedding);
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(9, 0, 0, 0);
      const diffMs = Math.abs(now.getTime() - nextDay.getTime());
      return diffMs <= 30 * 60 * 1000;
    },
  },
];

/**
 * Main reminder processing function.
 * Called hourly by node-cron.
 * Fetches all confirmed, WhatsApp-opted-in guests and checks if any reminders should be sent.
 */
async function processReminders(): Promise<void> {
  console.log("[Reminders] Running reminder check at", new Date().toISOString());

  try {
    const config = await storage.getWeddingConfig();
    if (!config) {
      console.log("[Reminders] No wedding config found. Skipping.");
      return;
    }

    if (!config.whatsappEnabled) {
      console.log("[Reminders] WhatsApp automation is disabled. Skipping.");
      return;
    }

    if (!config.dateConfirmed) {
      console.log("[Reminders] Wedding date not confirmed. Skipping reminders.");
      return;
    }

    const weddingDate = new Date(config.weddingDate);
    const now = new Date();

    // Fetch all confirmed guests who opted in to WhatsApp
    const allGuests = await storage.getGuests();
    const eligibleGuests = allGuests.filter(
      (g) => g.rsvpStatus === "confirmed" && g.whatsappOptIn && g.phone
    );

    console.log(`[Reminders] Checking ${eligibleGuests.length} eligible guests...`);

    for (const timing of REMINDER_TIMINGS) {
      if (!timing.shouldFire(now, weddingDate)) {
        continue;
      }

      console.log(`[Reminders] Firing: ${timing.label} for ${eligibleGuests.length} guests`);

      // Send to all eligible guests concurrently (with duplicate protection inside sendReminder)
      const promises = eligibleGuests.map((guest) =>
        sendReminder(
          { id: guest.id, name: guest.name, phone: guest.phone },
          timing.messageType,
          timing.templateName,
          [weddingDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })]
        ).catch((err) => {
          console.error(`[Reminders] Failed for guest ${guest.name}:`, err);
        })
      );

      await Promise.allSettled(promises);
    }

    console.log("[Reminders] Check complete.");
  } catch (error) {
    console.error("[Reminders] Unexpected error during reminder check:", error);
  }
}

/**
 * Initializes the reminder engine.
 * Runs the cron job every hour at minute 0.
 * Call this once during server startup.
 */
export function initReminderEngine(): void {
  console.log("[Reminders] Initializing reminder engine (hourly schedule)...");

  // Run every hour at minute 0
  cron.schedule("0 * * * *", processReminders, {
    timezone: "Asia/Kolkata", // Adjust to the wedding's timezone
  });

  console.log("[Reminders] Reminder engine started.");
}

// Export for testing / manual triggers
export { processReminders };
