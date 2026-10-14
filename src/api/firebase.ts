/**
 * Firebase Auth — app bootstrap and thin wrappers around the JS SDK.
 *
 * The divacast API authorizes every request with a Firebase ID token, so the
 * bearer-token provider from `./client` is wired to Firebase here. The SDK
 * refreshes a token that is close to expiry, so `getIdToken` is resolved per
 * request and the string is never cached.
 *
 * Configuration comes from the Web App registration in the Firebase console
 * and is inlined from `.env` at build time:
 *
 *     EXPO_PUBLIC_FIREBASE_API_KEY=...
 *     EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=divacast.firebaseapp.com
 *     EXPO_PUBLIC_FIREBASE_PROJECT_ID=divacast
 */

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type Auth,
  type User,
} from "firebase/auth";

import { setIdTokenGetter } from "./client";

/** Web App registration values (see the header comment). */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
};

/** True once every required config value is present. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId,
);

const CONFIG_ERROR =
  "Firebase is not configured. Add the EXPO_PUBLIC_FIREBASE_* values to your .env file.";

let cachedApp: FirebaseApp | null = null;

/** Initializes (once) and returns the app, or null when unconfigured. */
function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) {
    if (__DEV__) console.warn(`[firebase] ${CONFIG_ERROR}`);
    return null;
  }
  if (cachedApp) return cachedApp;
  // Reuse an existing app across Fast Refresh / HMR instead of re-initializing.
  cachedApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return cachedApp;
}

/** The Firebase Auth instance, or null when unconfigured. */
export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
}

/** Email + password sign-in. Resolves with the credential on success. */
export function signInWithFirebase(email: string, password: string) {
  const auth = getFirebaseAuth();
  if (!auth) return Promise.reject(new Error(CONFIG_ERROR));
  return signInWithEmailAndPassword(auth, email, password);
}

/** Signs the current user out. Safe to call when unconfigured. */
export function signOutOfFirebase(): Promise<void> {
  const auth = getFirebaseAuth();
  return auth ? firebaseSignOut(auth) : Promise.resolve();
}

/** Subscribes to auth-state changes; returns the unsubscribe function. */
export function onFirebaseAuthChanged(listener: (user: User | null) => void) {
  const auth = getFirebaseAuth();
  return auth ? onAuthStateChanged(auth, listener) : () => {};
}

/**
 * Bearer-token provider for the divacast API client. Called per request; the
 * Firebase SDK refreshes a token that is near expiry, so the string is never
 * cached. Returns null when signed out (only /v1/healthz will succeed then).
 */
export async function getIdToken(): Promise<string | null> {
  const auth = getFirebaseAuth();
  if (!auth?.currentUser) return null;
  return auth.currentUser.getIdToken();
}

// Wire the divacast client up to Firebase tokens.
setIdTokenGetter(getIdToken);
