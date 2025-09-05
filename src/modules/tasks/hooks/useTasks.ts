"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/context/AuthContext";
import { CreateTaskPayload, UpdateTaskPayload } from "@/types/Tasks";
import { tasksService } from "../services/tasks.service";

export function useTasksMutations() {
  const { user } = useAuthContext();

  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const result = await tasksService.getTasks();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch tasks");
      }
      return result.data?.tasks || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const createTaskMutation = useMutation({
    mutationFn: async (payload: CreateTaskPayload) => {
      const result = await tasksService.createTask(payload);
      if (!result.success) {
        throw new Error(result.error || "Failed to create task");
      }
      return result.data?.task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTaskPayload;
    }) => {
      const result = await tasksService.updateTask(id, payload);
      if (!result.success) {
        throw new Error(result.error || "Failed to update task");
      }
      return result.data?.task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await tasksService.deleteTask(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete task");
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async ({
      id,
      isCompleted,
    }: {
      id: string;
      isCompleted: boolean;
    }) => {
      const result = await tasksService.toggleTask(id, isCompleted);
      if (!result.success) {
        throw new Error(result.error || "Failed to toggle task");
      }
      return result.data?.task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    // Data
    tasks,
    isLoading,
    error,

    // Actions
    refetch,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
    toggleTask: toggleTaskMutation.mutateAsync,

    // Mutation states
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    isToggling: toggleTaskMutation.isPending,

    // Mutation errors
    createError: createTaskMutation.error,
    updateError: updateTaskMutation.error,
    deleteError: deleteTaskMutation.error,
    toggleError: toggleTaskMutation.error,
  };
}
