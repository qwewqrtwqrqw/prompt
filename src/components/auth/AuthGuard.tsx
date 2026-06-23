"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !user) {
      router.replace("/login");
    }
  }, [isReady, user, router]);

  if (!isReady) {
    return (
      <p className="text-sm text-zinc-500" role="status" aria-live="polite">
        Загрузка...
      </p>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
