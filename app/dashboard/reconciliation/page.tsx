"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ReconciliationPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [settlementItems, setSettlementItems] = useState<any[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedReportId, setSelectedReportId] = useState("");
  const [selectedSettlementItemId, setSelectedSettlementItemId] = useState("");
  const [actualAmount, setActualAmount] = useState("1000");
  const [result, setResult] = useState("");

  async function loadData() {
    const { data: batchData } = await supabase
      .from("settlement_batches")
      .select("*")
      .eq("status", "CLOSED")
      .order("created_at", { ascending: false });

    const { data: reportData } = await supabase
      .from("reconciliation_reports")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: itemData } = await supabase
      .from("reconciliation_items")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: settlementItemData } = await supabase
      .from("settlement_items")
      .select("*")
      .order("created_at", { ascending: false });

    setBatches(batchData || []);
    setReports(reportData || []);
    setItems(itemData || []);
    setSettlementItems(settlementItemData || []);

    if (batchData && batchData.length > 0 && !selectedBatchId) {
      setSelectedBatchId(batchData[0].id);
    }

    if (reportData && reportData.length > 0 && !selectedReportId) {
      setSelectedReportId(reportData[0].id);
    }

    if (settlementItemData && settlementItemData.length > 0 && !selectedSettlementItemId) {
      setSelectedSettlementItemId(settlementItemData[0].id);
      setActualAmount(String(settlementItemData[0].amount || 0));
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createReport() {
    if (!selectedBatchId) {
      alert("Select closed settlement batch first.");
      return;
    }

    const res = await fetch("/api/reconciliation/create-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settlement_batch_id: selectedBatchId }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));

    if (data?.report?.id) {
      setSelectedReportId(data.report.id);
    }

    await loadData();
  }

  async function addItem() {
    if (!selectedReportId || !selectedSettlementItemId) {
      alert("Select report and settlement item first.");
      return;
    }

    const res = await fetch("/api/reconciliation/add-item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reconciliation_report_id: selectedReportId,
        settlement_item_id: selectedSettlementItemId,
        actual_amount: Number(actualAmount),
      }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
    await loadData();
  }

  async function closeReport() {
    if (!selectedReportId) {
      alert("Select report first.");
      return;
    }

    const res = await fetch("/api/reconciliation/close-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reconciliation_report_id: selectedReportId }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
    await loadData();
  }

  const selectedReport = reports.find((r) => r.id === selectedReportId);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Reconciliation Engine</h1>
          <p className="text-gray-400 mt-2">
            Compare settlement expectations against actual received/confirmed amounts.
          </p>
        </div>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold">Reconciliation Control</h2>

          <label className="block text-sm text-gray-400">Closed Settlement Batch</label>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white"
          >
            {batches.length === 0 && <option value="">No closed batches found</option>}
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.batch_reference} — ₱{Number(batch.total_amount || 0).toLocaleString()}
              </option>
            ))}
          </select>

          <label className="block text-sm text-gray-400">Reconciliation Report</label>
          <select
            value={selectedReportId}
            onChange={(e) => setSelectedReportId(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white"
          >
            {reports.length === 0 && <option value="">No reports yet</option>}
            {reports.map((report) => (
              <option key={report.id} value={report.id}>
                {report.report_reference} — {report.status} — Diff ₱
                {Number(report.difference_amount || 0).toLocaleString()}
              </option>
            ))}
          </select>

          <label className="block text-sm text-gray-400">Settlement Item</label>
          <select
            value={selectedSettlementItemId}
            onChange={(e) => {
              setSelectedSettlementItemId(e.target.value);
              const found = settlementItems.find((i) => i.id === e.target.value);
              if (found) setActualAmount(String(found.amount || 0));
            }}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white"
          >
            {settlementItems.length === 0 && <option value="">No settlement items found</option>}
            {settlementItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.payment_reference} — {item.swift_reference} — Expected ₱
                {Number(item.amount || 0).toLocaleString()}
              </option>
            ))}
          </select>

          <label className="block text-sm text-gray-400">Actual Amount</label>
          <input
            value={actualAmount}
            onChange={(e) => setActualAmount(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white"
            placeholder="Actual received amount"
          />

          {selectedReport && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Report Ref</p>
                <p className="text-yellow-400 mt-1">{selectedReport.report_reference}</p>
              </div>

              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Expected</p>
                <p className="text-green-400 mt-1">
                  ₱{Number(selectedReport.expected_amount || 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Actual</p>
                <p className="text-blue-400 mt-1">
                  ₱{Number(selectedReport.actual_amount || 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Difference</p>
                <p className="text-purple-400 mt-1">
                  ₱{Number(selectedReport.difference_amount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-4">
            <button onClick={createReport} className="bg-blue-600 px-6 py-3 rounded-xl font-semibold">
              CREATE REPORT
            </button>

            <button onClick={addItem} className="bg-green-600 px-6 py-3 rounded-xl font-semibold">
              ADD RECON ITEM
            </button>

            <button onClick={closeReport} className="bg-red-600 px-6 py-3 rounded-xl font-semibold">
              CLOSE REPORT
            </button>

            <button onClick={loadData} className="bg-zinc-700 px-6 py-3 rounded-xl font-semibold">
              REFRESH
            </button>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Reconciliation Reports</h2>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left py-3">Report Ref</th>
                  <th className="text-left py-3">Batch Ref</th>
                  <th className="text-left py-3">Expected</th>
                  <th className="text-left py-3">Actual</th>
                  <th className="text-left py-3">Diff</th>
                  <th className="text-left py-3">Matched</th>
                  <th className="text-left py-3">Exceptions</th>
                  <th className="text-left py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-t border-zinc-800">
                    <td className="py-3">{report.report_reference}</td>
                    <td className="py-3">{report.batch_reference}</td>
                    <td className="py-3">₱{Number(report.expected_amount || 0).toLocaleString()}</td>
                    <td className="py-3">₱{Number(report.actual_amount || 0).toLocaleString()}</td>
                    <td className="py-3">₱{Number(report.difference_amount || 0).toLocaleString()}</td>
                    <td className="py-3">{report.matched_items}</td>
                    <td className="py-3">{report.exception_items}</td>
                    <td className="py-3 text-yellow-400">{report.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Reconciliation Items</h2>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left py-3">Payment Ref</th>
                  <th className="text-left py-3">SWIFT Ref</th>
                  <th className="text-left py-3">Expected</th>
                  <th className="text-left py-3">Actual</th>
                  <th className="text-left py-3">Diff</th>
                  <th className="text-left py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-zinc-800">
                    <td className="py-3">{item.payment_reference}</td>
                    <td className="py-3">{item.swift_reference}</td>
                    <td className="py-3">₱{Number(item.expected_amount || 0).toLocaleString()}</td>
                    <td className="py-3">₱{Number(item.actual_amount || 0).toLocaleString()}</td>
                    <td className="py-3">₱{Number(item.difference_amount || 0).toLocaleString()}</td>
                    <td className="py-3 text-green-400">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Reconciliation Response</h2>
          <pre className="text-sm overflow-auto whitespace-pre-wrap min-h-[250px]">
            {result || "Reconciliation responses will appear here..."}
          </pre>
        </section>
      </div>
    </main>
  );
}