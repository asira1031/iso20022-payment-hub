import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { buildPacs008 } from "@/lib/iso20022/pacs008";
import { buildPain001 } from "@/lib/iso20022/pain001";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      payment_intent_id,
      iso_type = "pacs.008",
      notes = "Queued for SWIFT processing.",
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
        { ok: false, error: "Only EXECUTED payments can be queued for SWIFT." },
        { status: 400 }
      );
    }

    const isoXml =
      iso_type === "pain.001" ? buildPain001(payment) : buildPacs008(payment);

    const swiftReference = `SWIFT-${Date.now()}`;

    const { data: swiftMessage, error: queueError } = await supabase
      .from("swift_messages")
      .insert({
        payment_intent_id: payment.id,
        payment_reference: payment.reference_no,
        swift_reference: swiftReference,
        iso_type,
        iso_xml: isoXml,
        receiver_bank: payment.receiver_bank,
        amount: Number(payment.amount || 0),
        currency: payment.currency || "PHP",
        status: "READY_FOR_SWIFT",
        notes,
      })
      .select()
      .single();

    if (queueError) {
      return NextResponse.json(
        { ok: false, error: queueError.message },
        { status: 500 }
      );
    }

    await supabase.from("swift_delivery_logs").insert({
      swift_message_id: swiftMessage.id,
      old_status: null,
      new_status: "READY_FOR_SWIFT",
      provider: "SWIFT_PLACEHOLDER",
      provider_reference: swiftReference,
      remarks: "Message queued for future SWIFT delivery.",
    });

    return NextResponse.json({
      ok: true,
      message: "Payment queued for SWIFT.",
      swift_message: swiftMessage,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}