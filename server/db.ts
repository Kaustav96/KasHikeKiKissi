import { firestore } from "./firebase.js";

// Re-export firestore as db for compatibility
export const db = firestore;

// For backward compatibility, export as default too
export default db;

