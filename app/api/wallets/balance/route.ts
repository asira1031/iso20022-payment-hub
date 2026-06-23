import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const walletId = searchParams.get("id");

  if (!walletId) {
    return NextResponse.json(
      { ok: false, error: "Wallet id is required." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("wallets")
    .select("id, owner_name, owner_type, currency, balance, status")
    .eq("id", walletId)
    .single();

  if (error || !data) {
    return NextResponse.json({ ok: false, error: "Wallet not found." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    wallet: data,
  });
}