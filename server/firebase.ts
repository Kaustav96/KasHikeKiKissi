import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
let serviceAccount;

try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        console.log('[Firebase] Using service account from environment variable');
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
        console.log('[Firebase] Using service account from firebase-service-account.json');
        const serviceAccountPath = join(__dirname, '../firebase-service-account.json');
        const serviceAccountFile = readFileSync(serviceAccountPath, 'utf-8');
        serviceAccount = JSON.parse(serviceAccountFile);
    }
} catch (error) {
    console.error('[Firebase] Failed to load service account:', error);
    throw new Error('Firebase service account not found. Please add firebase-service-account.json or set FIREBASE_SERVICE_ACCOUNT env var.');
}

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id,
        });
        console.log('[Firebase] Initialized successfully');
    } catch (error) {
        console.error('[Firebase] Initialization failed:', error);
        throw error;
    }
}

export const firestore = getFirestore();
firestore.settings({ ignoreUndefinedProperties: true });
export const auth = admin.auth();

// Collection names (replaces table names)
export const Collections = {
    WEDDING_CONFIG: 'wedding_config',
    GUESTS: 'guests',
    WEDDING_EVENTS: 'wedding_events',
    STORY_MILESTONES: 'story_milestones',
    VENUES: 'venues',
    FAQS: 'faqs',
    MESSAGE_LOGS: 'message_logs',
    USERS: 'users',
} as const;
