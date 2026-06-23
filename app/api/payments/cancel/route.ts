import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { payment_intent_id, remarks = "Payment cancelled." } = body;

    if (!payment_intent_id) {
      return NextResponse.json(
        { ok: false, error: "payment_intent_id is required." },
        { status: 400 }
      );
    }

    const { data: payment, error: paymentError } = await supabase
      .from("payment_intents")
      .select("*")
      .eq("id", payment_intent_id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { ok: false, error: "Payment intent not found." },
        { status: 404 }
      );
    }

    if (payment.status !== "CREATED") {
      return NextResponse.json(
        { ok: false, error: `Only CREATED payments can be cancelled. Current status: ${payment.status}` },
        { status: 400 }
      );
    }

    const { data: updatedPayment, error: updateError } = await supabase
      .from("payment_intents")
      .update({
        status: "CANCELLED",
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment_intent_id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { ok: false, error: updateError.message },
        { status: 500 }
      );
    }

    await supabase.from("payment_status_history").insert({
      payment_intent_id,
      old_status: payment.status,
      new_status: "CANCELLED",
      remarks,
    });

    return NextResponse.json({
      ok: true,
      message: "Payment cancelled.",
      payment: updatedPayment,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}