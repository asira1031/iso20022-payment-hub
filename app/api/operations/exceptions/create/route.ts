import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      source_module,
      source_reference,
      severity = "HIGH",
      title,
      description,
    } = body;

    if (!source_module || !title) {
      return NextResponse.json(
        { ok: false, error: "source_module and title are required." },
        { status: 400 }
      );
    }

    const exceptionReference = `EXC-${Date.now()}`;

    const { data, error } = await supabase
      .from("exception_queue")
      .insert({
        exception_reference: exceptionReference,
        source_module,
        source_reference,
        severity,
        title,
        description,
        status: "OPEN",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "Exception created.",
      exception: data,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}