"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ProviderTestPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentId, setPaymentId] = useState("");
  const [provider, setProvider] = useState("mock");
  const [isoType, setIsoType] = useState("pacs.008");
  const [result, setResult] = useState("");

  async function loadPayments() {
    const { data } = await supabase
      .from("payment_intents")
      .select("*")
      .eq("status", "EXECUTED")
      .order("created_at", { ascending: false });

    setPayments(data || []);

    if (data && data.length > 0 && !paymentId) {
      setPaymentId(data[0].id);
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  async function sendToProvider() {
    if (!paymentId) {
      alert("Select executed payment first.");
      return;
    }

    const res = await fetch("/api/providers/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_intent_id: paymentId,
        provider,
        iso_type: isoType,
      }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  }

  const selectedPayment = payments.find((p) => p.id === paymentId);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Provider Connector Test</h1>
          <p className="text-gray-400 mt-2">
            Send executed ISO 20022 payments to provider connectors.
          </p>
        </div>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold">Connector Request</h2>

          <label className="block text-sm text-gray-400">Executed Payment</label>
          <select
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white"
          >
            {payments.map((payment) => (
              <option key={payment.id} value={payment.id}>
                {payment.reference_no} — {payment.sender_name} to{" "}
                {payment.receiver_name} — ₱
                {Number(payment.amount || 0).toLocaleString()}
              </option>
            ))}
          </select>

          <label className="block text-sm text-gray-400">Provider</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white"
          >
            <option value="mock">MOCK BANK</option>
            <option value="swift">SWIFT PLACEHOLDER</option>
            <option value="open_banking">OPEN BANKING PLACEHOLDER</option>
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
                <p className="text-gray-400 text-sm">Receiver</p>
                <p className="mt-1">{selectedPayment.receiver_name}</p>
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
              onClick={sendToProvider}
              className="bg-blue-600 px-6 py-3 rounded-xl font-semibold"
            >
              SEND TO PROVIDER
            </button>

            <button
              onClick={loadPayments}
              className="bg-zinc-700 px-6 py-3 rounded-xl font-semibold"
            >
              REFRESH
            </button>
          </div>
        </section>

        <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Provider Response</h2>
          <pre className="text-sm overflow-auto whitespace-pre-wrap min-h-[300px]">
            {result || "Provider response will appear here..."}
          </pre>
        </section>
      </div>
    </main>
  );
}