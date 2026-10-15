import { create } from "zustand";
import type { User } from "firebase/auth";

import {
  isFirebaseConfigured,
  signInWithFirebase,
  signUpWithFirebase,
  signOutOfFirebase,
} from "@/api/firebase";

export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  user: User | null;
  session: SessionStatus;
  submitting: boolean;
  error: string | null;
  configured: boolean;

  setSession: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

function friendlyError(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;

  switch (code) {
    case "auth/invalid-email":
      return "That email address doesn't look right.";

    case "auth/email-already-in-use":
      return "An account with this email already exists.";

    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";

    case "auth/operation-not-allowed":
      return "Email and password registration is not enabled.";

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
        : "Something went wrong. Please try again.";
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

      set({
        user: credential.user,
        session: "authenticated",
        submitting: false,
      });

      return true;
    } catch (error) {
      set({
        error: friendlyError(error),
        submitting: false,
      });

      return false;
    }
  },

  signUp: async (email, password) => {
    set({ submitting: true, error: null });

    try {
      const credential = await signUpWithFirebase(email.trim(), password);

      set({
        user: credential.user,
        session: "authenticated",
        submitting: false,
      });

      return true;
    } catch (error) {
      set({
        error: friendlyError(error),
        submitting: false,
      });

      return false;
    }
  },

  signOut: async () => {
    await signOutOfFirebase();
  },

  clearError: () => set({ error: null }),
}));
