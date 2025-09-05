import z from "zod";

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description must be less than 500 characters"),
});

export const UpdateTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be less than 100 characters")
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description must be less than 500 characters")
    .optional(),
  isCompleted: z.boolean().optional(),
});

export const ToggleTaskSchema = z.object({
  isCompleted: z.boolean(),
});

export type CreateTaskFormData = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof UpdateTaskSchema>;
export type ToggleTaskFormData = z.infer<typeof ToggleTaskSchema>;
