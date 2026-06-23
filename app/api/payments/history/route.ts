import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentIntentId = searchParams.get("payment_intent_id");

  if (!paymentIntentId) {
    return NextResponse.json(
      { ok: false, error: "payment_intent_id is required." },
      { status: 400 }
    );
  }

  const { data: payment, error: paymentError } = await supabase
    .from("payment_intents")
    .select("*")
    .eq("id", paymentIntentId)
    .single();

  if (paymentError || !payment) {
    return NextResponse.json(
      { ok: false, error: "Payment intent not found." },
      { status: 404 }
    );
  }

  const { data: history } = await supabase
    .from("payment_status_history")
    .select("*")
    .eq("payment_intent_id", paymentIntentId)
    .order("created_at", { ascending: false });

  const { data: executions } = await supabase
    .from("payment_executions")
    .select("*")
    .eq("payment_intent_id", paymentIntentId)
    .order("executed_at", { ascending: false });

  const { data: ledger } = await supabase
    .from("ledger_entries")
    .select("*")
    .eq("payment_intent_id", paymentIntentId)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    ok: true,
    payment,
    history: history || [],
    executions: executions || [],
    ledger: ledger || [],
  });
}