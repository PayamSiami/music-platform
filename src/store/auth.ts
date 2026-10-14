import { create } from "zustand";
import type { User } from "firebase/auth";

import {
  isFirebaseConfigured,
  signInWithFirebase,
  signOutOfFirebase,
} from "@/api/firebase";

/** Resolved session state; "loading" until Firebase reports in. */
export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  user: User | null;
  session: SessionStatus;
  /** True while a sign-in request is in flight. */
  submitting: boolean;
  /** Message for the most recent failed sign-in attempt. */
  error: string | null;
  /** False when EXPO_PUBLIC_FIREBASE_* env values are missing. */
  configured: boolean;

  /** Called by the session hook whenever Firebase auth state changes. */
  setSession: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

/** Maps a Firebase error to a short, user-facing message. */
function friendlyError(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  switch (code) {
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return error instanceof Error && error.message
        ? error.message
        : "Unable to sign in. Please try again.";
  }
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  session: isFirebaseConfigured ? "loading" : "unauthenticated",
  submitting: false,
  error: null,
  configured: isFirebaseConfigured,

  setSession: (user) =>
    set({
      user,
      session: user ? "authenticated" : "unauthenticated",
    }),

  signIn: async (email, password) => {
    set({ submitting: true, error: null });
    try {
      const credential = await signInWithFirebase(email.trim(), password);
      set({ user: credential.user, submitting: false });
      return true;
    } catch (error) {
      set({ error: friendlyError(error), submitting: false });
      return false;
    }
  },

  signOut: async () => {
    // onFirebaseAuthChanged will flip the session back to "unauthenticated".
    await signOutOfFirebase();
  },

  clearError: () => set({ error: null }),
}));
