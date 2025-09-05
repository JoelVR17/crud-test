import { http } from "@/lib/axios";
import {
  CreateTaskPayload,
  TasksResponse,
  UpdateTaskPayload,
} from "@/types/Tasks";
import axios from "axios";

class TasksService {
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

  async getTasks(): Promise<TasksResponse> {
    return this.handleRequest(() => http.get("/tasks").then((res) => res.data));
  }

  async getTask(id: string) {
    return this.handleRequest(() =>
      http.get(`/tasks/${id}`).then((res) => res.data)
    );
  }

  async createTask(payload: CreateTaskPayload) {
    return this.handleRequest(() =>
      http.post("/tasks", payload).then((res) => res.data)
    );
  }

  async updateTask(id: string, payload: UpdateTaskPayload) {
    return this.handleRequest(() =>
      http.put(`/tasks/${id}`, payload).then((res) => res.data)
    );
  }

  async deleteTask(id: string) {
    return this.handleRequest(() =>
      http.delete(`/tasks/${id}`).then((res) => res.data)
    );
  }

  async toggleTask(id: string, isCompleted: boolean) {
    return this.updateTask(id, { isCompleted });
  }
}

export const tasksService = new TasksService();
