"use client";

import { useQuery } from "@tanstack/react-query";
import { tasksService } from "../services/tasks.service";
import { useAuthContext } from "@/context/AuthContext";

export function useTasksQuery() {
  const { user } = useAuthContext();

  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
    isFetching,
    isStale,
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
    refetchOnWindowFocus: false,
  });

  return {
    tasks,
    isLoading,
    error,
    refetch,
    isFetching,
    isStale,
  };
}
