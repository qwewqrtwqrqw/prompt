"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { User } from "@/types";
import { clearSession, getStoredUser, getToken, saveSession } from "@/lib/auth-storage";

type Session = {
  user: User | null;
  token: string | null;
};

type AuthContextValue = Session & {
  isReady: boolean;
  setSession: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_EVENT = "prompt-studio-auth";

function readSession(): Session {
  return {
    user: getStoredUser(),
    token: getToken(),
  };
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = () => onStoreChange();
  window.addEventListener(AUTH_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(AUTH_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

function notifyAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useSyncExternalStore(
    subscribe,
    readSession,
    () => ({ user: null, token: null }),
  );

  const isReady = useSyncExternalStore(
    subscribe,
    () => typeof window !== "undefined",
    () => false,
  );

  const setSession = useCallback((nextToken: string, nextUser: User) => {
    saveSession(nextToken, nextUser);
    notifyAuthChange();
  }, []);

  const logout = useCallback(() => {
    clearSession();
    notifyAuthChange();
  }, []);

  const value = useMemo(
    () => ({ ...session, isReady, setSession, logout }),
    [session, isReady, setSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  return context;
}
