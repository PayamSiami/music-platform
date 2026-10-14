import { onFirebaseAuthChanged } from "@/api/firebase";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";

/**
 * Resolves the initial session and keeps the auth store in sync with Firebase.
 * Mount it once, near the root of the tree.
 */
export function useAuthSession() {
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => onFirebaseAuthChanged(setSession), [setSession]);
}
