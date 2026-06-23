import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { buildCamt053 } from "@/lib/iso20022/camt053";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const walletId = searchParams.get("wallet_id");

  if (!walletId) {
    return NextResponse.json(
      { ok: false, error: "wallet_id is required." },
      { status: 400 }
    );
  }

  const { data: wallet, error: walletError } = await supabase
    .from("wallets")
    .select("*")
    .eq("id", walletId)
    .single();

  if (walletError || !wallet) {
    return NextResponse.json(
      { ok: false, error: "Wallet not found." },
      { status: 404 }
    );
  }

  const { data: ledger, error: ledgerError } = await supabase
    .from("ledger_entries")
    .select("*")
    .eq("wallet_id", walletId)
    .order("created_at", { ascending: false });

  if (ledgerError) {
    return NextResponse.json(
      { ok: false, error: ledgerError.message },
      { status: 500 }
    );
  }

  const xml = buildCamt053(wallet, ledger || []);

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}