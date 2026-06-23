import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { batch_id } = body;

    if (!batch_id) {
      return NextResponse.json(
        { ok: false, error: "batch_id is required." },
        { status: 400 }
      );
    }

    const { data: batch, error: batchError } = await supabase
      .from("settlement_batches")
      .select("*")
      .eq("id", batch_id)
      .single();

    if (batchError || !batch) {
      return NextResponse.json(
        { ok: false, error: "Batch not found." },
        { status: 404 }
      );
    }

    if (batch.status !== "OPEN") {
      return NextResponse.json(
        { ok: false, error: "Only OPEN batches can be closed." },
        { status: 400 }
      );
    }

    const { data: updatedBatch, error: updateError } = await supabase
      .from("settlement_batches")
      .update({
        status: "CLOSED",
        updated_at: new Date().toISOString(),
      })
      .eq("id", batch_id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { ok: false, error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Settlement batch closed.",
      batch: updatedBatch,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}