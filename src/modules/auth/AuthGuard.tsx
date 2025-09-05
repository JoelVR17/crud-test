"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're done loading and there's no user
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // If no user after loading, don't render anything (redirect is happening)
  if (!user) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}
