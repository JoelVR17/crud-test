import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, AuthenticatedRequest } from "@/lib/auth-middleware";

// GET /api/tasks/[id] - Get Task
export const GET = withAuth(
  async (
    request: AuthenticatedRequest,
    user,
    { params }: { params: { id: string } }
  ) => {
    try {
      const task = await prisma.todo.findFirst({
        where: {
          id: params.id,
          userId: user.id,
        },
      });

      if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }

      return NextResponse.json({ task });
    } catch (error) {
      console.error("Error fetching task:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
);

// PUT /api/tasks/[id] - Update Task
export const PUT = withAuth(
  async (
    request: AuthenticatedRequest,
    user,
    { params }: { params: { id: string } }
  ) => {
    try {
      const body = await request.json();
      const { title, description, isCompleted } = body;

      const existingTask = await prisma.todo.findFirst({
        where: {
          id: params.id,
          userId: user.id,
        },
      });

      if (!existingTask) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }

      const task = await prisma.todo.update({
        where: {
          id: params.id,
        },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(typeof isCompleted === "boolean" && { isCompleted }),
        },
      });

      return NextResponse.json({ task });
    } catch (error) {
      console.error("Error updating task:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
);

// DELETE /api/tasks/[id] - Delete Task
export const DELETE = withAuth(
  async (
    request: AuthenticatedRequest,
    user,
    { params }: { params: { id: string } }
  ) => {
    try {
      const existingTask = await prisma.todo.findFirst({
        where: {
          id: params.id,
          userId: user.id,
        },
      });

      if (!existingTask) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }

      await prisma.todo.delete({
        where: {
          id: params.id,
        },
      });

      return NextResponse.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
);
