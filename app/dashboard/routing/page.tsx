"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function RoutingPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [result, setResult] = useState("");

  async function loadData() {
    const { data: paymentData } = await supabase
      .from("payment_intents")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: routeData } = await supabase
      .from("message_routes")
      .select("*")
      .order("created_at", { ascending: false });

    setPayments(paymentData || []);
    setRoutes(routeData || []);

    if (paymentData && paymentData.length > 0 && !selectedPaymentId) {
      setSelectedPaymentId(paymentData[0].id);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function decideRoute() {
    if (!selectedPaymentId) {
      alert("Select payment first.");
      return;
    }

    const res = await fetch("/api/routing/decide", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payment_intent_id: selectedPaymentId }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
    await loadData();
  }

  const selectedPayment = payments.find((p) => p.id === selectedPaymentId);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Message Routing Center</h1>
          <p className="text-gray-400 mt-2">
            Decide whether a payment should route to Bank Connector, SWIFT,
            Open Banking, or Mock Connector.
          </p>
        </div>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold">Routing Decision</h2>

          <label className="block text-sm text-gray-400">Payment</label>
          <select
            value={selectedPaymentId}
            onChange={(e) => setSelectedPaymentId(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white"
          >
            {payments.length === 0 && <option value="">No payments found</option>}

            {payments.map((payment) => (
              <option key={payment.id} value={payment.id}>
                {payment.reference_no} — {payment.receiver_bank || "NO BANK"} —{" "}
                {payment.currency || "PHP"} — ₱
                {Number(payment.amount || 0).toLocaleString()}
              </option>
            ))}
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
                <p className="text-gray-400 text-sm">Currency</p>
                <p className="mt-1">{selectedPayment.currency || "PHP"}</p>
              </div>

              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Amount</p>
                <p className="text-green-400 mt-1">
                  ₱{Number(selectedPayment.amount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={decideRoute}
              className="bg-blue-600 px-6 py-3 rounded-xl font-semibold"
            >
              DECIDE ROUTE
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
          <h2 className="text-2xl font-bold mb-4">Routing History</h2>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left py-3">Route Ref</th>
                  <th className="text-left py-3">Payment Ref</th>
                  <th className="text-left py-3">Bank</th>
                  <th className="text-left py-3">Currency</th>
                  <th className="text-left py-3">Amount</th>
                  <th className="text-left py-3">Connector</th>
                  <th className="text-left py-3">Reason</th>
                </tr>
              </thead>

              <tbody>
                {routes.map((route) => (
                  <tr key={route.id} className="border-t border-zinc-800">
                    <td className="py-3">{route.route_reference}</td>
                    <td className="py-3">{route.payment_reference}</td>
                    <td className="py-3">{route.receiver_bank || "N/A"}</td>
                    <td className="py-3">{route.currency}</td>
                    <td className="py-3">
                      ₱{Number(route.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-blue-400">
                      {route.selected_connector}
                    </td>
                    <td className="py-3">{route.route_reason}</td>
                  </tr>
                ))}

                {routes.length === 0 && (
                  <tr>
                    <td className="py-6 text-gray-500" colSpan={7}>
                      No routing history yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Routing Response</h2>
          <pre className="text-sm overflow-auto whitespace-pre-wrap min-h-[250px]">
            {result || "Routing response will appear here..."}
          </pre>
        </section>
      </div>
    </main>
  );
}