import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const swiftMessageId = searchParams.get("swift_message_id");

  if (!swiftMessageId) {
    return NextResponse.json(
      { ok: false, error: "swift_message_id is required." },
      { status: 400 }
    );
  }

  const { data: swiftMessage, error } = await supabase
    .from("swift_messages")
    .select("*")
    .eq("id", swiftMessageId)
    .single();

  if (error || !swiftMessage) {
    return NextResponse.json(
      { ok: false, error: "SWIFT message not found." },
      { status: 404 }
    );
  }

  const { data: logs } = await supabase
    .from("swift_delivery_logs")
    .select("*")
    .eq("swift_message_id", swiftMessageId)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    ok: true,
    swift_message: swiftMessage,
    logs: logs || [],
  });
}