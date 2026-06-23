import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { wallet_id, amount, currency = "PHP", description = "Wallet funding" } = body;

    if (!wallet_id || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { ok: false, error: "wallet_id and positive amount are required." },
        { status: 400 }
      );
    }

    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("*")
      .eq("id", wallet_id)
      .single();

    if (walletError || !wallet) {
      return NextResponse.json({ ok: false, error: "Wallet not found." }, { status: 404 });
    }

    const newBalance = Number(wallet.balance) + Number(amount);
    const referenceNo = `FUND-${Date.now()}`;

    const { data: updatedWallet, error: updateError } = await supabase
      .from("wallets")
      .update({
        balance: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq("id", wallet_id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });
    }

    const { error: ledgerError } = await supabase.from("ledger_entries").insert({
      wallet_id,
      reference_no: referenceNo,
      entry_type: "CREDIT",
      amount: Number(amount),
      currency,
      balance_after: newBalance,
      description,
    });

    if (ledgerError) {
      return NextResponse.json({ ok: false, error: ledgerError.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "Wallet funded.",
      wallet: updatedWallet,
      ledger_reference: referenceNo,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}