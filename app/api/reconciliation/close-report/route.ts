import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reconciliation_report_id } = body;

    if (!reconciliation_report_id) {
      return NextResponse.json(
        { ok: false, error: "reconciliation_report_id is required." },
        { status: 400 }
      );
    }

    const { data: report, error: reportError } = await supabase
      .from("reconciliation_reports")
      .select("*")
      .eq("id", reconciliation_report_id)
      .single();

    if (reportError || !report) {
      return NextResponse.json(
        { ok: false, error: "Reconciliation report not found." },
        { status: 404 }
      );
    }

    if (report.status !== "DRAFT") {
      return NextResponse.json(
        { ok: false, error: "Only DRAFT reports can be closed." },
        { status: 400 }
      );
    }

    const finalStatus =
      Number(report.difference_amount || 0) === 0 &&
      Number(report.exception_items || 0) === 0
        ? "RECONCILED"
        : "EXCEPTION";

    const { data: updatedReport, error: updateError } = await supabase
      .from("reconciliation_reports")
      .update({
        status: finalStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reconciliation_report_id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { ok: false, error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Reconciliation report closed.",
      report: updatedReport,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}