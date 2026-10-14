import {
  disableNetwork,
  enableNetwork,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
  type Firestore,
} from "firebase/firestore";

import { getFirebaseApp, isFirebaseConfigured } from "./firebase";

/** Cached Firestore instance (JS SDK). */
let cachedDb: Firestore | null = null;

/**
 * Returns the Firestore instance (JS SDK), initializing once.
 * Returns null if Firebase is not configured (missing .env values).
 */
export function getFirestoreDb(): Firestore | null {
  if (!isFirebaseConfigured) {
    if (__DEV__)
      console.warn("[firestore] Firebase not configured — check .env");
    return null;
  }
  if (cachedDb) return cachedDb;

  const app = getFirebaseApp();
  if (!app) return null;

  // ✅ Persistent cache — modern API handles persistence automatically.
  // Do NOT call enableIndexedDbPersistence() after this — it will conflict.
  cachedDb = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentSingleTabManager({}),
    }),
  });

  return cachedDb;
}

/** Enable network access (resume sync). */
export async function enableFirestoreNetwork(): Promise<void> {
  const db = getFirestoreDb();
  if (db) await enableNetwork(db);
}

/** Disable network access (pause sync, use cache only). */
export async function disableFirestoreNetwork(): Promise<void> {
  const db = getFirestoreDb();
  if (db) await disableNetwork(db);
}

/** Re-export commonly used Firestore functions for convenience. */
export {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FieldValue,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
  type CollectionReference,
  type DocumentReference,
  type DocumentSnapshot,
  type Query,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
  type Transaction,
  type WriteBatch,
} from "firebase/firestore";
