"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Check, X, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTasksMutations } from "./hooks/useTasks";
import { toast } from "sonner";
import { type Task } from "@/types/Tasks";
import {
  UpdateTaskSchema,
  type UpdateTaskFormData,
} from "./schemas/tasks.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    updateTask,
    deleteTask,
    toggleTask,
    updateError,
    deleteError,
    toggleError,
    isToggling,
  } = useTasksMutations();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(UpdateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
    },
  });

  const handleToggle = async () => {
    try {
      await toggleTask({ id: task.id, isCompleted: !task.isCompleted });
      toast.success(
        `Task ${!task.isCompleted ? "completed" : "marked as incomplete"}!`
      );
    } catch (error) {
      console.error("Toggle task error:", error);
      toast.error(toggleError?.message || "Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTask(task.id);
      toast.success("Task deleted successfully!");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Delete task error:", error);
      toast.error(deleteError?.message || "Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async (data: UpdateTaskFormData) => {
    try {
      setIsSubmitting(true);
      await updateTask({ id: task.id, payload: data });
      toast.success("Task updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Update task error:", error);
      toast.error(updateError?.message || "Failed to update task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    reset();
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`title-${task.id}`}>Title</Label>
              <Input
                id={`title-${task.id}`}
                {...register("title")}
                placeholder="Enter task title"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${task.id}`}>Description</Label>
              <Textarea
                id={`description-${task.id}`}
                {...register("description")}
                placeholder="Enter task description"
                className={errors.description ? "border-destructive" : ""}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                className="cursor-pointer"
                disabled={isSubmitting}
              >
                <Check className="w-4 h-4 mr-1" />
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleCancelEdit}
                className="cursor-pointer"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${task.isCompleted ? "opacity-60" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-8">
            <Checkbox
              checked={task.isCompleted}
              disabled={isToggling}
              onCheckedChange={handleToggle}
              className="mt-1 cursor-pointer"
            />
            <div className="flex-1">
              <CardTitle
                className={`text-lg ${task.isCompleted ? "line-through" : ""}`}
              >
                {task.title}
              </CardTitle>
              <Badge
                variant={task.isCompleted ? "default" : "secondary"}
                className="mt-1"
              >
                {task.isCompleted ? "Completed" : "Pending"}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={task.isCompleted}
              className="cursor-pointer"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-red-700 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Delete Task
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this task? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                    disabled={isDeleting}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="cursor-pointer"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Task
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p
          className={`text-sm text-muted-foreground ${
            task.isCompleted ? "line-through" : ""
          }`}
        >
          {task.description}
        </p>
        <div className="flex w-full justify-end">
          <p className="text-xs text-muted-foreground mt-2">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
