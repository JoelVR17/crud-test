"use client";

import { AuthForm } from "./AuthForm";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { VerifyEmailCard } from "@/modules/auth/VerifyEmailCard";
import Link from "next/link";
import { useState } from "react";

export default function AuthView({ mode }: { mode: "login" | "signup" }) {
  const { handleLogin, handleSignUp } = useAuth();
  const [done, setDone] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  const handleSubmit = async (values: { email: string; password: string }) => {
    if (mode === "signup") {
      await handleSignUp(values);
      setUserEmail(values.email);
      setDone(true);
    } else {
      await handleLogin(values);
      // Login will redirect automatically, no need to set done
    }
  };

  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center">
      <div className="w-full max-w-sm">
        {done ? (
          <VerifyEmailCard email={userEmail} />
        ) : (
          <AuthForm mode={mode} onSubmit={handleSubmit} />
        )}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <Link className="underline" href="/login">
                Login
              </Link>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Link className="underline" href="/signup">
                Create account
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center justify-center">
          <Link href="/" className=" mt-3 underline text-sm">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
