"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SwiftQueuePage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [swiftMessages, setSwiftMessages] = useState<any[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [isoType, setIsoType] = useState("pacs.008");
  const [result, setResult] = useState("");

  async function loadData() {
    const { data: paymentData } = await supabase
      .from("payment_intents")
      .select("*")
      .eq("status", "EXECUTED")
      .order("created_at", { ascending: false });

    const { data: swiftData } = await supabase
      .from("swift_messages")
      .select("*")
      .order("created_at", { ascending: false });

    setPayments(paymentData || []);
    setSwiftMessages(swiftData || []);

    if (paymentData && paymentData.length > 0 && !selectedPaymentId) {
      setSelectedPaymentId(paymentData[0].id);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function queueForSwift() {
    if (!selectedPaymentId) {
      alert("Select an executed payment first.");
      return;
    }

    const res = await fetch("/api/swift/queue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_intent_id: selectedPaymentId,
        iso_type: isoType,
        notes: "Queued from SWIFT Queue Dashboard.",
      }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
    await loadData();
  }

  async function viewStatus(swiftMessageId: string) {
    const res = await fetch(
      `/api/swift/status?swift_message_id=${swiftMessageId}`
    );

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  }

  const selectedPayment = payments.find((p) => p.id === selectedPaymentId);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">SWIFT Message Queue</h1>
          <p className="text-gray-400 mt-2">
            Queue executed ISO 20022 payments for future SWIFT delivery.
          </p>
        </div>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold">Queue New SWIFT Message</h2>

          <label className="block text-sm text-gray-400">Executed Payment</label>
          <select
            value={selectedPaymentId}
            onChange={(e) => setSelectedPaymentId(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white"
          >
            {payments.length === 0 && (
              <option value="">No executed payments found</option>
            )}

            {payments.map((payment) => (
              <option key={payment.id} value={payment.id}>
                {payment.reference_no} — {payment.sender_name} to{" "}
                {payment.receiver_name} — ₱
                {Number(payment.amount || 0).toLocaleString()}
              </option>
            ))}
          </select>

          <label className="block text-sm text-gray-400">ISO Message Type</label>
          <select
            value={isoType}
            onChange={(e) => setIsoType(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white"
          >
            <option value="pacs.008">pacs.008</option>
            <option value="pain.001">pain.001</option>
          </select>

          {selectedPayment && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Reference</p>
                <p className="text-yellow-400 mt-1">
                  {selectedPayment.reference_no}
                </p>
              </div>

              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Receiver Bank</p>
                <p className="mt-1">{selectedPayment.receiver_bank || "N/A"}</p>
              </div>

              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Amount</p>
                <p className="text-green-400 mt-1">
                  ₱{Number(selectedPayment.amount || 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Status</p>
                <p className="text-purple-400 mt-1">{selectedPayment.status}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={queueForSwift}
              className="bg-blue-600 px-6 py-3 rounded-xl font-semibold"
            >
              QUEUE FOR SWIFT
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
          <h2 className="text-2xl font-bold mb-4">SWIFT Message Queue</h2>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left py-3">SWIFT Ref</th>
                  <th className="text-left py-3">Payment Ref</th>
                  <th className="text-left py-3">ISO Type</th>
                  <th className="text-left py-3">Bank</th>
                  <th className="text-left py-3">Amount</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {swiftMessages.map((message) => (
                  <tr key={message.id} className="border-t border-zinc-800">
                    <td className="py-3">{message.swift_reference}</td>
                    <td className="py-3">{message.payment_reference}</td>
                    <td className="py-3">{message.iso_type}</td>
                    <td className="py-3">{message.receiver_bank || "N/A"}</td>
                    <td className="py-3">
                      ₱{Number(message.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-yellow-400">{message.status}</td>
                    <td className="py-3">
                      <button
                        onClick={() => viewStatus(message.id)}
                        className="bg-zinc-700 px-4 py-2 rounded-lg"
                      >
                        VIEW STATUS
                      </button>
                    </td>
                  </tr>
                ))}

                {swiftMessages.length === 0 && (
                  <tr>
                    <td className="py-6 text-gray-500" colSpan={7}>
                      No SWIFT messages queued yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">SWIFT Response / Status</h2>
          <pre className="text-sm overflow-auto whitespace-pre-wrap min-h-[300px]">
            {result || "Queue response and delivery logs will appear here..."}
          </pre>
        </section>
      </div>
    </main>
  );
}