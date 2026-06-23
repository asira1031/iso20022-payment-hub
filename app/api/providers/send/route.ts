import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { buildPain001 } from "@/lib/iso20022/pain001";
import { buildPacs008 } from "@/lib/iso20022/pacs008";
import { getProvider, ProviderKey } from "@/lib/providers/providerRegistry";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      payment_intent_id,
      provider = "mock",
      iso_type = "pacs.008",
    }: {
      payment_intent_id?: string;
      provider?: ProviderKey;
      iso_type?: "pain.001" | "pacs.008";
    } = body;

    if (!payment_intent_id) {
      return NextResponse.json(
        { ok: false, error: "payment_intent_id is required." },
        { status: 400 }
      );
    }

    const { data: payment, error } = await supabase
      .from("payment_intents")
      .select("*")
      .eq("id", payment_intent_id)
      .single();

    if (error || !payment) {
      return NextResponse.json(
        { ok: false, error: "Payment intent not found." },
        { status: 404 }
      );
    }

    if (payment.status !== "EXECUTED") {
      return NextResponse.json(
        { ok: false, error: "Only EXECUTED payments can be sent to provider." },
        { status: 400 }
      );
    }

    const isoXml =
      iso_type === "pain.001" ? buildPain001(payment) : buildPacs008(payment);

    const connector = getProvider(provider);

    const providerResponse = await connector.sendPayment({
      paymentId: payment.id,
      referenceNo: payment.reference_no,
      amount: Number(payment.amount || 0),
      currency: payment.currency || "PHP",
      senderName: payment.sender_name,
      senderAccount: payment.sender_account,
      receiverName: payment.receiver_name,
      receiverAccount: payment.receiver_account,
      receiverBank: payment.receiver_bank,
      isoMessageType: iso_type,
      isoXml,
    });

    await supabase
      .from("payment_intents")
      .update({
        provider_response: providerResponse,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment_intent_id);

    const { error: providerLogError } = await supabase
      .from("provider_transactions")
      .insert({
        payment_intent_id: payment.id,
        provider: providerResponse.provider,
        provider_reference: providerResponse.providerReference || null,
        iso_type,
        payment_reference: payment.reference_no,
        amount: Number(payment.amount || 0),
        currency: payment.currency || "PHP",
        status: providerResponse.status,
        response: providerResponse,
      });

    if (providerLogError) {
      return NextResponse.json(
        { ok: false, error: providerLogError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Payment sent to provider connector and logged.",
      provider_response: providerResponse,
      iso_type,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}