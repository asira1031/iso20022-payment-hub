import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { batch_id, swift_message_id } = body;

    if (!batch_id || !swift_message_id) {
      return NextResponse.json(
        { ok: false, error: "batch_id and swift_message_id are required." },
        { status: 400 }
      );
    }

    const { data: batch, error: batchError } = await supabase
      .from("settlement_batches")
      .select("*")
      .eq("id", batch_id)
      .single();

    if (batchError || !batch) {
      return NextResponse.json({ ok: false, error: "Batch not found." }, { status: 404 });
    }

    if (batch.status !== "OPEN") {
      return NextResponse.json(
        { ok: false, error: "Only OPEN batches can accept items." },
        { status: 400 }
      );
    }

    const { data: swiftMessage, error: swiftError } = await supabase
      .from("swift_messages")
      .select("*")
      .eq("id", swift_message_id)
      .single();

    if (swiftError || !swiftMessage) {
      return NextResponse.json(
        { ok: false, error: "SWIFT message not found." },
        { status: 404 }
      );
    }

    const { data: item, error: itemError } = await supabase
      .from("settlement_items")
      .insert({
        batch_id,
        swift_message_id,
        payment_reference: swiftMessage.payment_reference,
        swift_reference: swiftMessage.swift_reference,
        amount: Number(swiftMessage.amount || 0),
        currency: swiftMessage.currency || "PHP",
        status: "INCLUDED",
      })
      .select()
      .single();

    if (itemError) {
      return NextResponse.json({ ok: false, error: itemError.message }, { status: 500 });
    }

    const newTotalAmount =
      Number(batch.total_amount || 0) + Number(swiftMessage.amount || 0);

    const newTotalItems = Number(batch.total_items || 0) + 1;

    const { data: updatedBatch, error: updateError } = await supabase
      .from("settlement_batches")
      .update({
        total_amount: newTotalAmount,
        total_items: newTotalItems,
        updated_at: new Date().toISOString(),
      })
      .eq("id", batch_id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "SWIFT message added to settlement batch.",
      item,
      batch: updatedBatch,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}