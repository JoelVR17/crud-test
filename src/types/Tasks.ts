export type Task = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type CreateTaskPayload = {
  title: string;
  description: string;
};

export type UpdateTaskPayload = {
  title?: string;
  description?: string;
  isCompleted?: boolean;
};

export type TasksResponse = {
  success: boolean;
  data?: {
    tasks: Task[];
  };
  error?: string;
};

export type TaskResponse = {
  task: Task;
};
