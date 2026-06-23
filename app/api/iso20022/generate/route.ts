import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { buildPain001 } from "@/lib/iso20022/pain001";
import { buildPacs008 } from "@/lib/iso20022/pacs008";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const paymentIntentId = searchParams.get("payment_intent_id");
  const type = searchParams.get("type") || "pain.001";

  if (!paymentIntentId) {
    return NextResponse.json(
      { ok: false, error: "payment_intent_id is required." },
      { status: 400 }
    );
  }

  const { data: payment, error } = await supabase
    .from("payment_intents")
    .select("*")
    .eq("id", paymentIntentId)
    .single();

  if (error || !payment) {
    return NextResponse.json(
      { ok: false, error: "Payment intent not found." },
      { status: 404 }
    );
  }

  if (payment.status !== "EXECUTED") {
    return NextResponse.json(
      { ok: false, error: "Only EXECUTED payments can generate ISO 20022 messages." },
      { status: 400 }
    );
  }

  let xml = "";

  if (type === "pain.001") {
    xml = buildPain001(payment);
  } else if (type === "pacs.008") {
    xml = buildPacs008(payment);
  } else {
    return NextResponse.json(
      { ok: false, error: "Unsupported ISO 20022 type." },
      { status: 400 }
    );
  }

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}