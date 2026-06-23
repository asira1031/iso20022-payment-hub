import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { retry_id } = body;

    if (!retry_id) {
      return NextResponse.json(
        { ok: false, error: "retry_id is required." },
        { status: 400 }
      );
    }

    const { data: retry, error: retryError } = await supabase
      .from("retry_queue")
      .select("*")
      .eq("id", retry_id)
      .single();

    if (retryError || !retry) {
      return NextResponse.json(
        { ok: false, error: "Retry item not found." },
        { status: 404 }
      );
    }

    if (retry.status !== "PENDING") {
      return NextResponse.json(
        { ok: false, error: `Retry item is already ${retry.status}.` },
        { status: 400 }
      );
    }

    const newRetryCount = Number(retry.retry_count || 0) + 1;
    const maxRetries = Number(retry.max_retries || 3);

    const finalStatus =
      newRetryCount >= maxRetries ? "FAILED" : "COMPLETED";

    const { data, error } = await supabase
      .from("retry_queue")
      .update({
        retry_count: newRetryCount,
        status: finalStatus,
        completed_at: new Date().toISOString(),
      })
      .eq("id", retry_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message:
        finalStatus === "COMPLETED"
          ? "Retry processed successfully."
          : "Retry failed after max attempts.",
      retry: data,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}