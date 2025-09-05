"use client";

import { http } from "@/lib/axios";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

type AuthUser = { id: string; email: string } | null;
type AuthSession = unknown | null;

type AuthContextValue = {
  user: AuthUser;
  session: AuthSession;
  setUser: (user: AuthUser) => void;
  setSession: (session: AuthSession) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser>(null);
  const [session, setSessionState] = useState<AuthSession>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = useCallback((u: AuthUser) => setUserState(u), []);
  const setSession = useCallback((s: AuthSession) => setSessionState(s), []);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("sb-access-token");

        if (token) {
          const response = await http.get("/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.success) {
            const userData = response.data;

            setUser({ id: userData.id, email: userData.email });
            setSession({ access_token: token });
          } else {
            localStorage.removeItem("sb-access-token");
            setUser(null);
            setSession(null);
          }
        } else {
          console.log("No token found");
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        localStorage.removeItem("sb-access-token");

        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [setUser, setSession]);

  const value = useMemo(
    () => ({ user, session, setUser, setSession, isLoading }),
    [user, session, setUser, setSession, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
