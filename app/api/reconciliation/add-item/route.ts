import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      reconciliation_report_id,
      settlement_item_id,
      actual_amount,
      notes = "Auto reconciliation item.",
    } = body;

    if (!reconciliation_report_id || !settlement_item_id) {
      return NextResponse.json(
        {
          ok: false,
          error: "reconciliation_report_id and settlement_item_id are required.",
        },
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
        { ok: false, error: "Only DRAFT reports can accept items." },
        { status: 400 }
      );
    }

    const { data: settlementItem, error: itemError } = await supabase
      .from("settlement_items")
      .select("*")
      .eq("id", settlement_item_id)
      .single();

    if (itemError || !settlementItem) {
      return NextResponse.json(
        { ok: false, error: "Settlement item not found." },
        { status: 404 }
      );
    }

    const expectedAmount = Number(settlementItem.amount || 0);
    const actualAmount =
      actual_amount !== undefined ? Number(actual_amount) : expectedAmount;

    const differenceAmount = actualAmount - expectedAmount;
    const status = differenceAmount === 0 ? "MATCHED" : "EXCEPTION";

    const { data: reconItem, error: insertError } = await supabase
      .from("reconciliation_items")
      .insert({
        reconciliation_report_id,
        settlement_item_id,
        payment_reference: settlementItem.payment_reference,
        swift_reference: settlementItem.swift_reference,
        expected_amount: expectedAmount,
        actual_amount: actualAmount,
        difference_amount: differenceAmount,
        status,
        notes,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { ok: false, error: insertError.message },
        { status: 500 }
      );
    }

    const currentActual = Number(report.actual_amount || 0);
    const currentMatched = Number(report.matched_items || 0);
    const currentExceptions = Number(report.exception_items || 0);

    const newActual = currentActual + actualAmount;
    const newDifference = newActual - Number(report.expected_amount || 0);

    const { data: updatedReport, error: updateError } = await supabase
      .from("reconciliation_reports")
      .update({
        actual_amount: newActual,
        difference_amount: newDifference,
        matched_items: status === "MATCHED" ? currentMatched + 1 : currentMatched,
        exception_items:
          status === "EXCEPTION" ? currentExceptions + 1 : currentExceptions,
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
      message: "Reconciliation item added.",
      item: reconItem,
      report: updatedReport,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}