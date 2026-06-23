import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      source_module,
      source_reference,
      retry_type,
      max_retries = 3,
    } = body;

    if (!source_module || !retry_type) {
      return NextResponse.json(
        { ok: false, error: "source_module and retry_type are required." },
        { status: 400 }
      );
    }

    const retryReference = `RETRY-${Date.now()}`;

    const nextRetryAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("retry_queue")
      .insert({
        retry_reference: retryReference,
        source_module,
        source_reference,
        retry_type,
        retry_count: 0,
        max_retries,
        next_retry_at: nextRetryAt,
        status: "PENDING",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "Retry item created.",
      retry: data,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}