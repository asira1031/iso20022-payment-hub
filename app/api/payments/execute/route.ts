import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { payment_intent_id, wallet_id } = body;

    if (!payment_intent_id || !wallet_id) {
      return NextResponse.json(
        { ok: false, error: "payment_intent_id and wallet_id are required." },
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
        {
          ok: false,
          error: `Payment cannot be executed from status ${payment.status}.`,
        },
        { status: 400 }
      );
    }

    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("*")
      .eq("id", wallet_id)
      .single();

    if (walletError || !wallet) {
      return NextResponse.json(
        { ok: false, error: "Wallet not found." },
        { status: 404 }
      );
    }

    const walletBalance = Number(wallet.balance || 0);
    const paymentAmount = Number(payment.amount || 0);

    if (walletBalance < paymentAmount) {
      return NextResponse.json(
        { ok: false, error: "Insufficient wallet balance." },
        { status: 400 }
      );
    }

    const newBalance = walletBalance - paymentAmount;
    const executionReference = `EXEC-${Date.now()}`;

    const { error: walletUpdateError } = await supabase
      .from("wallets")
      .update({
        balance: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq("id", wallet_id);

    if (walletUpdateError) {
      return NextResponse.json(
        { ok: false, error: walletUpdateError.message },
        { status: 500 }
      );
    }

    const { error: ledgerError } = await supabase.from("ledger_entries").insert({
      wallet_id,
      payment_intent_id,
      reference_no: executionReference,
      entry_type: "DEBIT",
      amount: paymentAmount,
      currency: payment.currency || "PHP",
      balance_after: newBalance,
      description: `Payment executed: ${payment.reference_no}`,
    });

    if (ledgerError) {
      return NextResponse.json(
        { ok: false, error: ledgerError.message },
        { status: 500 }
      );
    }

    const { data: execution, error: executionError } = await supabase
      .from("payment_executions")
      .insert({
        payment_intent_id,
        wallet_id,
        reference_no: executionReference,
        amount: paymentAmount,
        currency: payment.currency || "PHP",
        status: "EXECUTED",
      })
      .select()
      .single();

    if (executionError) {
      return NextResponse.json(
        { ok: false, error: executionError.message },
        { status: 500 }
      );
    }

    const { data: updatedPayment, error: paymentUpdateError } = await supabase
      .from("payment_intents")
      .update({
        status: "EXECUTED",
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment_intent_id)
      .select()
      .single();

    if (paymentUpdateError) {
      return NextResponse.json(
        { ok: false, error: paymentUpdateError.message },
        { status: 500 }
      );
    }

    await supabase.from("payment_status_history").insert({
      payment_intent_id,
      old_status: "CREATED",
      new_status: "EXECUTED",
      remarks: "Payment executed and wallet debited.",
    });

    await createAuditLog({
      module: "PAYMENT",
      action: "PAYMENT_EXECUTED",
      reference_id: payment.reference_no,
      details: {
        payment_intent_id,
        wallet_id,
        amount: paymentAmount,
        old_balance: walletBalance,
        new_balance: newBalance,
        execution_reference: executionReference,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Payment executed.",
      payment: updatedPayment,
      execution,
      wallet: {
        id: wallet_id,
        old_balance: walletBalance,
        new_balance: newBalance,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}