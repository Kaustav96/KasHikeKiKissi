/**
 * WhatsApp Cloud API Service
 *
 * Handles sending WhatsApp messages via Meta's WhatsApp Business Cloud API.
 * All messages use pre-approved templates to comply with WhatsApp policy.
 * Includes retry logic, duplicate prevention, and message logging.
 */

import axios from "axios";
import { storage } from "../storage";

const WHATSAPP_API_VERSION = "v18.0";
const MAX_RETRY_COUNT = 3;
const RETRY_DELAY_MS = 2000;

interface WhatsAppTemplateComponent {
  type: "body" | "header" | "button";
  parameters?: Array<{ type: "text"; text: string }>;
  sub_type?: string;
  index?: number;
}

interface SendMessageOptions {
  guestId: string;
  guestName: string;
  phone: string;
  templateName: string;
  messageType: string;
  components?: WhatsAppTemplateComponent[];
  languageCode?: string;
}

interface WhatsAppApiResponse {
  messages?: Array<{ id: string }>;
  error?: { message: string; code: number };
}

/**
 * Normalizes a phone number to WhatsApp's required format (E.164 without +).
 * WhatsApp expects numbers like: 919876543210 (country code + number, no +)
 */
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").replace(/^0+/, "");
}

/**
 * Adds a delay — used for retry backoff.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Core function: sends a WhatsApp template message via Cloud API.
 * Returns the WhatsApp message ID on success.
 */
async function sendWhatsAppTemplate(
  toPhone: string,
  templateName: string,
  components: WhatsAppTemplateComponent[] = [],
  languageCode = "en_US"
): Promise<string> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    throw new Error("WhatsApp credentials not configured");
  }

  const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`;
  const normalizedPhone = normalizePhone(toPhone);

  const payload = {
    messaging_product: "whatsapp",
    to: normalizedPhone,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      ...(components.length > 0 ? { components } : {}),
    },
  };

  const response = await axios.post<WhatsAppApiResponse>(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });

  const messageId = response.data.messages?.[0]?.id;
  if (!messageId) {
    throw new Error("No message ID returned from WhatsApp API");
  }

  return messageId;
}

/**
 * High-level function: sends a message with duplicate prevention, logging,
 * and automatic retry up to MAX_RETRY_COUNT times.
 */
export async function sendMessage(options: SendMessageOptions): Promise<void> {
  const {
    guestId,
    guestName,
    phone,
    templateName,
    messageType,
    components = [],
    languageCode = "en_US",
  } = options;

  // Check if WhatsApp automation is globally enabled
  const config = await storage.getWeddingConfig();
  if (!config?.whatsappEnabled) {
    console.log(`[WhatsApp] Automation disabled. Skipping message to ${guestName}.`);
    return;
  }

  // Duplicate prevention: skip if this message type was already sent/pending
  const isDuplicate = await storage.checkDuplicateMessage(guestId, messageType);
  if (isDuplicate) {
    console.log(`[WhatsApp] Duplicate detected. Skipping ${messageType} for ${guestName}.`);
    return;
  }

  // Create an initial "pending" log entry
  const logEntry = await storage.createMessageLog({
    guestId,
    guestName,
    phone,
    templateName,
    messageType,
    status: "pending",
    whatsappMessageId: "",
    errorMessage: "",
    retryCount: 0,
    metadata: {},
    sentAt: null,
  });

  let lastError = "";
  let messageId = "";

  // Attempt to send with retries
  for (let attempt = 0; attempt < MAX_RETRY_COUNT; attempt++) {
    try {
      messageId = await sendWhatsAppTemplate(phone, templateName, components, languageCode);

      // Success — update log with sent status
      await storage.updateMessageLog(logEntry.id, {
        status: "sent",
        whatsappMessageId: messageId,
        retryCount: attempt,
        sentAt: new Date(),
      });

      console.log(`[WhatsApp] Sent ${messageType} to ${guestName} (${phone}). ID: ${messageId}`);
      return;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      console.error(
        `[WhatsApp] Attempt ${attempt + 1}/${MAX_RETRY_COUNT} failed for ${guestName}: ${lastError}`
      );

      if (attempt < MAX_RETRY_COUNT - 1) {
        await sleep(RETRY_DELAY_MS * (attempt + 1));
      }
    }
  }

  // All retries exhausted — mark as failed
  await storage.updateMessageLog(logEntry.id, {
    status: "failed",
    errorMessage: lastError,
    retryCount: MAX_RETRY_COUNT,
  });

  console.error(`[WhatsApp] Failed to send ${messageType} to ${guestName} after ${MAX_RETRY_COUNT} attempts.`);
}

/**
 * Builds body components for a template with text parameters.
 */
export function buildBodyComponents(variables: string[]): WhatsAppTemplateComponent[] {
  return [
    {
      type: "body",
      parameters: variables.map((v) => ({ type: "text", text: v })),
    },
  ];
}

// ─── Pre-defined message helpers ─────────────────────────────────────────────

export async function sendRsvpConfirmation(guest: {
  id: string;
  name: string;
  phone: string;
}): Promise<void> {
  await sendMessage({
    guestId: guest.id,
    guestName: guest.name,
    phone: guest.phone,
    templateName: "hello_world", // Temporary: using hello_world for testing
    messageType: "rsvp_confirmation",
    components: [], // hello_world template has no parameters
  });
}

export async function sendReminder(
  guest: { id: string; name: string; phone: string },
  messageType: "reminder_30d" | "reminder_7d" | "reminder_1d" | "morning" | "start" | "thankyou",
  templateName: string,
  additionalVars: string[] = []
): Promise<void> {
  await sendMessage({
    guestId: guest.id,
    guestName: guest.name,
    phone: guest.phone,
    templateName,
    messageType,
    components: buildBodyComponents([guest.name, ...additionalVars]),
  });
}

/**
 * Verifies the webhook signature from Meta's servers.
 * Used to validate incoming webhook payloads.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const crypto = require("crypto");
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) return false;

  const expectedSignature = crypto
    .createHmac("sha256", appSecret)
    .update(rawBody)
    .digest("hex");

  return `sha256=${expectedSignature}` === signature;
}
