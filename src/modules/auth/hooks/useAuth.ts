"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  authService,
  type LoginPayload,
  type SignUpPayload,
} from "@/modules/auth/services/auth.service";
import { useAuthContext } from "@/context/AuthContext";
import { useAuthError } from "./useAuthError";

export function useAuth() {
  const { setUser, setSession } = useAuthContext();
  const { handleError, handleSuccess } = useAuthError();
  const router = useRouter();

  const handleSignUp = useCallback(
    async (payload: SignUpPayload) => {
      const result = await authService.signUp(payload);

      if (!result.success) {
        const errorMessage = result.error || "Error in registration";
        handleError(errorMessage, "Registration");
        throw new Error(errorMessage);
      }

      const userId = result.data.data?.user?.id as string | undefined;
      const email = (result.data.data?.user?.email as string | undefined) || "";

      if (userId) {
        try {
          await authService.registerUser(userId, email);
        } catch (registerError) {
          handleError(registerError, "User registration");
        }
      }

      setUser(userId ? { id: userId, email } : null);
      handleSuccess(
        "Account created successfully!",
        "Check your email to confirm your account"
      );

      return result;
    },
    [setUser, handleError, handleSuccess]
  );

  const handleLogin = useCallback(
    async (payload: LoginPayload) => {
      const result = await authService.login(payload);

      if (!result.success) {
        const errorMessage = result.error || "Error in login";

        handleError(errorMessage, "Login");
        throw new Error(errorMessage);
      }

      const supabaseData = result.data?.data;
      const userId = supabaseData?.user?.id as string | undefined;
      const email = (supabaseData?.user?.email as string | undefined) || "";

      setUser(userId ? { id: userId, email } : null);
      setSession(supabaseData?.session || null);

      if (supabaseData?.session?.access_token) {
        localStorage.setItem(
          "sb-access-token",
          supabaseData.session.access_token
        );
      }

      router.push("/dashboard");

      return result;
    },
    [setSession, setUser, handleError, handleSuccess, router]
  );

  const handleLogout = useCallback(() => {
    setUser(null);
    setSession(null);

    localStorage.removeItem("sb-access-token");
    router.push("/login");
  }, [setUser, setSession, handleSuccess, router]);

  return { handleSignUp, handleLogin, handleLogout };
}
