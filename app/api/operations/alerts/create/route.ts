import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      alert_type,
      severity = "INFO",
      source_module,
      source_reference,
      title,
      message,
    } = body;

    if (!alert_type || !source_module || !title) {
      return NextResponse.json(
        {
          ok: false,
          error: "alert_type, source_module and title are required.",
        },
        { status: 400 }
      );
    }

    const alertReference = `ALERT-${Date.now()}`;

    const { data, error } = await supabase
      .from("system_alerts")
      .insert({
        alert_reference: alertReference,
        alert_type,
        severity,
        source_module,
        source_reference,
        title,
        message,
        status: "OPEN",
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
      message: "Alert created.",
      alert: data,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}