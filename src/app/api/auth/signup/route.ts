import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { SignUpSchema } from "@/modules/auth/schemas/auth.schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = SignUpSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    const origin =
      request.headers.get("origin") ||
      request.headers.get("referer") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin.replace(/\/$/, "")}/dashboard`,
      },
    });

    if (error) {
      console.error("Signup error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
