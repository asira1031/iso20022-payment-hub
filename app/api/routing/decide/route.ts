import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { decideConnector } from "@/lib/routing/messageRouter";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { payment_intent_id } = body;

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

    const decision = decideConnector(payment);
    const routeReference = `ROUTE-${Date.now()}`;

    const { data: route, error: routeError } = await supabase
      .from("message_routes")
      .insert({
        route_reference: routeReference,
        payment_intent_id: payment.id,
        payment_reference: payment.reference_no,
        receiver_bank: payment.receiver_bank,
        amount: Number(payment.amount || 0),
        currency: payment.currency || "PHP",
        selected_connector: decision.selected_connector,
        route_reason: decision.route_reason,
        status: "ROUTED",
      })
      .select()
      .single();

    if (routeError) {
      return NextResponse.json(
        { ok: false, error: routeError.message },
        { status: 500 }
      );
    }

    await createAuditLog({
      module: "ROUTING",
      action: "MESSAGE_ROUTED",
      reference_id: payment.reference_no,
      details: {
        payment_intent_id: payment.id,
        selected_connector: decision.selected_connector,
        route_reason: decision.route_reason,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Message route decided.",
      route,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}