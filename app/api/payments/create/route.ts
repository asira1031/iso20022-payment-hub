import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      sender_name,
      sender_account,
      receiver_name,
      receiver_account,
      receiver_bank,
      amount,
      currency = "PHP",
      purpose = "Payment",
    } = body;

    if (!sender_name || !receiver_name || !amount) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const reference_no = `TDI-${Date.now()}`;

    const iso_payload = {
      message_type: "pain.001",
      reference_no,
      debtor: {
        name: sender_name,
        account: sender_account || null,
      },
      creditor: {
        name: receiver_name,
        account: receiver_account || null,
        bank: receiver_bank || null,
      },
      amount: {
        value: Number(amount),
        currency,
      },
      purpose,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("payment_intents")
      .insert({
        reference_no,
        sender_name,
        sender_account: sender_account || null,
        receiver_name,
        receiver_account: receiver_account || null,
        receiver_bank: receiver_bank || null,
        amount: Number(amount),
        currency,
        status: "CREATED",
        iso_message_type: "pain.001",
        iso_payload,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Payment intent created and saved.",
      payment: data,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}