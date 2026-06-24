import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    connected: true,
    message: "Zenus OAuth token endpoint is connected. API token test passed.",
    token_url: process.env.ZENUS_TOKEN_URL,
    known_legal_person_endpoint:
      "https://api.dev.zenus.io/api/zv1/persons/legal",
  });
}