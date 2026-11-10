import { NextResponse } from "next/server";
import { addContactAndSendWelcome } from "@/lib/brevo";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid university email address." },
        { status: 400 }
      );
    }

    const result = await addContactAndSendWelcome({
      email: email.trim().toLowerCase(),
      name: name ? String(name).trim() : undefined,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[Waitlist API Error]", error);
    return NextResponse.json(
      { error: error.message || "Failed to process waitlist submission." },
      { status: 500 }
    );
  }
}
