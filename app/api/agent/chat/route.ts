import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { runOrchestrator, Message } from "@/lib/agents/orchestrator";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message, history } = await request.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const response = await runOrchestrator(message, history ?? []);

  return NextResponse.json({ response });
}
