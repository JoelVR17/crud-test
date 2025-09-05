import { http } from "@/lib/axios";
import axios from "axios";

export type SignUpPayload = { email: string; password: string };
export type LoginPayload = { email: string; password: string };

class AuthService {
  private async handleRequest<T>(
    requestFn: () => Promise<T>
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const data = await requestFn();
      return { success: true, data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Error de respuesta del servidor
        if (error.response) {
          const serverError =
            error.response.data?.error || error.response.data?.message;
          return {
            success: false,
            error:
              serverError ||
              `Error ${error.response.status}: ${error.response.statusText}`,
          };
        }
        // Network error
        if (error.request) {
          return {
            success: false,
            error: "Connection error. Please check your internet and try again",
          };
        }
        // Configuration error
        return {
          success: false,
          error: error.message || "Configuration error",
        };
      }
      // Error not related to axios
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async signUp(payload: SignUpPayload) {
    return this.handleRequest(() =>
      http.post("/auth/signup", payload).then((res) => res.data)
    );
  }

  async login(payload: LoginPayload) {
    return this.handleRequest(() =>
      http.post("/auth/login", payload).then((res) => res.data)
    );
  }

  async registerUser(id: string, email: string) {
    return this.handleRequest(() =>
      http.post("/users/register", { id, email }).then((res) => res.data)
    );
  }
}

export const authService = new AuthService();
