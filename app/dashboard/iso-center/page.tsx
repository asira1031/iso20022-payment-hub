"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function IsoCenterPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [xml, setXml] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadPayments() {
    const { data, error } = await supabase
      .from("payment_intents")
      .select("*")
      .eq("status", "EXECUTED")
      .order("created_at", { ascending: false });

    if (!error) {
      setPayments(data || []);
      if (data && data.length > 0 && !selectedPaymentId) {
        setSelectedPaymentId(data[0].id);
      }
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  async function generateXml(type: "pain.001" | "pacs.008") {
    if (!selectedPaymentId) {
      alert("Please select an executed payment first.");
      return;
    }

    setLoading(true);
    setXml("");

    const res = await fetch(
      `/api/iso20022/generate?payment_intent_id=${selectedPaymentId}&type=${type}`
    );

    const text = await res.text();
    setXml(text);
    setLoading(false);
  }

  function downloadXml() {
    if (!xml) {
      alert("Generate XML first.");
      return;
    }

    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `tdi-iso20022-${Date.now()}.xml`;
    a.click();

    URL.revokeObjectURL(url);
  }

  const selectedPayment = payments.find((p) => p.id === selectedPaymentId);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">ISO 20022 Message Center</h1>
          <p className="text-gray-400 mt-2">
            Generate pain.001 and pacs.008 XML messages from executed payments.
          </p>
        </div>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold">Executed Payments</h2>

          <select
            value={selectedPaymentId}
            onChange={(e) => {
              setSelectedPaymentId(e.target.value);
              setXml("");
            }}
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

          {selectedPayment && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Reference</p>
                <p className="mt-1 text-yellow-400">
                  {selectedPayment.reference_no}
                </p>
              </div>

              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Sender</p>
                <p className="mt-1">{selectedPayment.sender_name}</p>
              </div>

              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Receiver</p>
                <p className="mt-1">{selectedPayment.receiver_name}</p>
              </div>

              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Amount</p>
                <p className="mt-1 text-green-400">
                  ₱{Number(selectedPayment.amount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => generateXml("pain.001")}
              className="bg-blue-600 px-6 py-3 rounded-xl font-semibold"
            >
              GENERATE pain.001
            </button>

            <button
              onClick={() => generateXml("pacs.008")}
              className="bg-purple-600 px-6 py-3 rounded-xl font-semibold"
            >
              GENERATE pacs.008
            </button>

            <button
              onClick={downloadXml}
              className="bg-green-600 px-6 py-3 rounded-xl font-semibold"
            >
              DOWNLOAD XML
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
          <h2 className="text-2xl font-bold mb-4">Generated XML</h2>

          <pre className="text-sm overflow-auto whitespace-pre-wrap min-h-[400px]">
            {loading
              ? "Generating XML..."
              : xml || "Select an executed payment and generate ISO XML."}
          </pre>
        </section>
      </div>
    </main>
  );
}