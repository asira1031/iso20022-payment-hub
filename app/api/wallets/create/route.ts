import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { owner_name, owner_type = "BUSINESS", currency = "PHP" } = body;

    if (!owner_name) {
      return NextResponse.json(
        { ok: false, error: "owner_name is required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("wallets")
      .insert({
        owner_name,
        owner_type,
        currency,
        balance: 0,
        status: "ACTIVE",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "Wallet created.",
      wallet: data,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}