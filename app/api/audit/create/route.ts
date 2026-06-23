import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      module,
      action,
      reference_id,
      performed_by = "SYSTEM",
      details = {},
    } = body;

    if (!module || !action) {
      return NextResponse.json(
        { ok: false, error: "module and action are required." },
        { status: 400 }
      );
    }

    const auditReference = `AUDIT-${Date.now()}`;

    const { data, error } = await supabase
      .from("audit_logs")
      .insert({
        audit_reference: auditReference,
        module,
        action,
        reference_id,
        performed_by,
        details,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "Audit log created.",
      audit: data,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}