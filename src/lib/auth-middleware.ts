/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends NextRequest {
  user: AuthenticatedUser;
}

export async function authenticateRequest(
  request: NextRequest
): Promise<{ user: AuthenticatedUser } | NextResponse> {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify the token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Verify user exists in PostgreSQL database
    const { prisma } = await import("@/lib/prisma");
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      try {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email || "",
            password: "",
          },
        });
      } catch (createError) {
        console.error("Error creating user in database:", createError);
        return NextResponse.json(
          { error: "User not found in database" },
          { status: 401 }
        );
      }
    }

    return {
      user: {
        id: user.id,
        email: user.email || "",
      },
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to create authenticated API handlers
export function withAuth(
  handler: (
    request: AuthenticatedRequest,
    user: AuthenticatedUser,
    context?: any
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    const authResult = await authenticateRequest(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = authResult.user;

    return handler(authenticatedRequest, authResult.user, context);
  };
}
