import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      provider_name,
      connector_type,
      environment = "SANDBOX",
      base_url,
      client_id,
      status = "ACTIVE",
    } = body;

    if (!provider_name || !connector_type) {
      return NextResponse.json(
        { ok: false, error: "provider_name and connector_type are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("provider_configs")
      .insert({
        provider_name,
        connector_type,
        environment,
        base_url,
        client_id,
        status,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    await createAuditLog({
      module: "PROVIDER_CONFIG",
      action: "PROVIDER_CONFIG_CREATED",
      reference_id: data.provider_name,
      details: data,
    });

    return NextResponse.json({
      ok: true,
      message: "Provider config created.",
      provider_config: data,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}