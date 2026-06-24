import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET() {
  const { data: wallets, error: walletsError } = await supabase
    .from("wallets")
    .select("*")
    .order("created_at", { ascending: false });

  if (walletsError) {
    return NextResponse.json(
      { ok: false, error: walletsError.message },
      { status: 500 }
    );
  }

  const { data: ledger, error: ledgerError } = await supabase
    .from("ledger_entries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (ledgerError) {
    return NextResponse.json(
      { ok: false, error: ledgerError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    wallets: wallets || [],
    ledger: ledger || [],
  });
}