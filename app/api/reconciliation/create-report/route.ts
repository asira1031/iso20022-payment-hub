import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { settlement_batch_id } = body;

    if (!settlement_batch_id) {
      return NextResponse.json(
        { ok: false, error: "settlement_batch_id is required." },
        { status: 400 }
      );
    }

    const { data: batch, error: batchError } = await supabase
      .from("settlement_batches")
      .select("*")
      .eq("id", settlement_batch_id)
      .single();

    if (batchError || !batch) {
      return NextResponse.json(
        { ok: false, error: "Settlement batch not found." },
        { status: 404 }
      );
    }

    const reportReference = `RECON-${Date.now()}`;

    const { data: report, error } = await supabase
      .from("reconciliation_reports")
      .insert({
        report_reference: reportReference,
        settlement_batch_id: batch.id,
        batch_reference: batch.batch_reference,
        expected_amount: Number(batch.total_amount || 0),
        actual_amount: 0,
        difference_amount: Number(batch.total_amount || 0),
        total_items: Number(batch.total_items || 0),
        matched_items: 0,
        exception_items: 0,
        status: "DRAFT",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "Reconciliation report created.",
      report,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}