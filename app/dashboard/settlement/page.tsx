"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SettlementPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [swiftMessages, setSwiftMessages] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedSwiftId, setSelectedSwiftId] = useState("");
  const [result, setResult] = useState("");

  async function loadData() {
    const { data: batchData } = await supabase
      .from("settlement_batches")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: swiftData } = await supabase
      .from("swift_messages")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: itemData } = await supabase
      .from("settlement_items")
      .select("*")
      .order("created_at", { ascending: false });

    setBatches(batchData || []);
    setSwiftMessages(swiftData || []);
    setItems(itemData || []);

    if (batchData && batchData.length > 0 && !selectedBatchId) {
      setSelectedBatchId(batchData[0].id);
    }

    if (swiftData && swiftData.length > 0 && !selectedSwiftId) {
      setSelectedSwiftId(swiftData[0].id);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createBatch() {
    const res = await fetch("/api/settlement/create-batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currency: "PHP" }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));

    if (data?.batch?.id) {
      setSelectedBatchId(data.batch.id);
    }

    await loadData();
  }

  async function addItem() {
    if (!selectedBatchId || !selectedSwiftId) {
      alert("Select batch and SWIFT message first.");
      return;
    }

    const res = await fetch("/api/settlement/add-item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        batch_id: selectedBatchId,
        swift_message_id: selectedSwiftId,
      }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
    await loadData();
  }

  async function closeBatch() {
    if (!selectedBatchId) {
      alert("Select batch first.");
      return;
    }

    const res = await fetch("/api/settlement/close-batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batch_id: selectedBatchId }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
    await loadData();
  }

  const selectedBatch = batches.find((b) => b.id === selectedBatchId);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Settlement Engine</h1>
          <p className="text-gray-400 mt-2">
            Batch SWIFT-ready messages for settlement and reconciliation.
          </p>
        </div>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold">Settlement Control</h2>

          <label className="block text-sm text-gray-400">Settlement Batch</label>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white"
          >
            {batches.length === 0 && <option value="">No batches yet</option>}
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.batch_reference} — {batch.status} — ₱
                {Number(batch.total_amount || 0).toLocaleString()}
              </option>
            ))}
          </select>

          <label className="block text-sm text-gray-400">SWIFT Message</label>
          <select
            value={selectedSwiftId}
            onChange={(e) => setSelectedSwiftId(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white"
          >
            {swiftMessages.length === 0 && (
              <option value="">No SWIFT messages yet</option>
            )}

            {swiftMessages.map((message) => (
              <option key={message.id} value={message.id}>
                {message.swift_reference} — {message.payment_reference} — ₱
                {Number(message.amount || 0).toLocaleString()}
              </option>
            ))}
          </select>

          {selectedBatch && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Batch Ref</p>
                <p className="text-yellow-400 mt-1">
                  {selectedBatch.batch_reference}
                </p>
              </div>

              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Total Items</p>
                <p className="mt-1">{selectedBatch.total_items}</p>
              </div>

              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Total Amount</p>
                <p className="text-green-400 mt-1">
                  ₱{Number(selectedBatch.total_amount || 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Status</p>
                <p className="text-purple-400 mt-1">{selectedBatch.status}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={createBatch}
              className="bg-blue-600 px-6 py-3 rounded-xl font-semibold"
            >
              CREATE BATCH
            </button>

            <button
              onClick={addItem}
              className="bg-green-600 px-6 py-3 rounded-xl font-semibold"
            >
              ADD SWIFT ITEM
            </button>

            <button
              onClick={closeBatch}
              className="bg-red-600 px-6 py-3 rounded-xl font-semibold"
            >
              CLOSE BATCH
            </button>

            <button
              onClick={loadData}
              className="bg-zinc-700 px-6 py-3 rounded-xl font-semibold"
            >
              REFRESH
            </button>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Settlement Batches</h2>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left py-3">Batch Ref</th>
                  <th className="text-left py-3">Date</th>
                  <th className="text-left py-3">Currency</th>
                  <th className="text-left py-3">Items</th>
                  <th className="text-left py-3">Total</th>
                  <th className="text-left py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr key={batch.id} className="border-t border-zinc-800">
                    <td className="py-3">{batch.batch_reference}</td>
                    <td className="py-3">{batch.settlement_date}</td>
                    <td className="py-3">{batch.currency}</td>
                    <td className="py-3">{batch.total_items}</td>
                    <td className="py-3">
                      ₱{Number(batch.total_amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-yellow-400">{batch.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Settlement Items</h2>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left py-3">Payment Ref</th>
                  <th className="text-left py-3">SWIFT Ref</th>
                  <th className="text-left py-3">Amount</th>
                  <th className="text-left py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-zinc-800">
                    <td className="py-3">{item.payment_reference}</td>
                    <td className="py-3">{item.swift_reference}</td>
                    <td className="py-3">
                      ₱{Number(item.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-green-400">{item.status}</td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td className="py-6 text-gray-500" colSpan={4}>
                      No settlement items yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Settlement Response</h2>
          <pre className="text-sm overflow-auto whitespace-pre-wrap min-h-[250px]">
            {result || "Settlement responses will appear here..."}
          </pre>
        </section>
      </div>
    </main>
  );
}