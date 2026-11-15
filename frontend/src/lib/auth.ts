"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface StarkUser {
  email: string;
  name: string;
  role: string;
  workspace: string;
  token: string;
}

const AUTH_STORAGE_KEY = "stark_auth_user";
const AUTH_COOKIE_NAME = "stark_auth_token";

export function getStoredUser(): StarkUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: StarkUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  document.cookie = `${AUTH_COOKIE_NAME}=${user.token}; path=/; max-age=86400; SameSite=Lax`;
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const [user, setUser] = useState<StarkUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser && requireAuth) {
      router.replace("/login");
    } else if (currentUser && !requireAuth) {
      router.replace("/dashboard");
    } else {
      setUser(currentUser);
      setIsLoading(false);
    }
  }, [requireAuth, router]);

  const signOut = () => {
    clearStoredUser();
    setUser(null);
    router.replace("/login");
  };

  return { user, isLoading, signOut };
}
