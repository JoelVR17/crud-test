import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, handleDatabaseError } from "@/lib/prisma";

const RegisterUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = RegisterUserSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    const { id, email } = parseResult.data;

    const user = await prisma.user.upsert({
      where: { id },
      update: { email },
      create: { id, email, password: "" },
    });

    return NextResponse.json({
      success: true,
      data: { id: user.id, email: user.email },
    });
  } catch (error) {
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
