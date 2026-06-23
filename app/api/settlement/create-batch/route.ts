import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { currency = "PHP" } = body;

    const batchReference = `SETTLE-${Date.now()}`;

    const { data, error } = await supabase
      .from("settlement_batches")
      .insert({
        batch_reference: batchReference,
        currency,
        total_amount: 0,
        total_items: 0,
        status: "OPEN",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "Settlement batch created.",
      batch: data,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}