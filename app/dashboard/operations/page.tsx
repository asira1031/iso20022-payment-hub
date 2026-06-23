"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function OperationsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [swiftMessages, setSwiftMessages] = useState<any[]>([]);
  const [settlements, setSettlements] = useState<any[]>([]);
  const [recons, setRecons] = useState<any[]>([]);
  const [result, setResult] = useState("");

  async function loadData() {
    const { data: alertData } = await supabase
      .from("system_alerts")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: swiftData } = await supabase
      .from("swift_messages")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: settlementData } = await supabase
      .from("settlement_batches")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: reconData } = await supabase
      .from("reconciliation_reports")
      .select("*")
      .order("created_at", { ascending: false });

    setAlerts(alertData || []);
    setSwiftMessages(swiftData || []);
    setSettlements(settlementData || []);
    setRecons(reconData || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createTestAlert() {
    const res = await fetch("/api/operations/alerts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alert_type: "SYSTEM_TEST",
        severity: "WARNING",
        source_module: "OPERATIONS_CENTER",
        source_reference: "TEST",
        title: "Test operations alert",
        message: "This is a test alert generated from Operations Center.",
      }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
    await loadData();
  }

  async function resolveAlert(alertId: string) {
    const res = await fetch("/api/operations/alerts/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alert_id: alertId }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
    await loadData();
  }

  const openAlerts = alerts.filter((a) => a.status === "OPEN");
  const resolvedAlerts = alerts.filter((a) => a.status === "RESOLVED");
  const criticalAlerts = alerts.filter(
    (a) => a.status === "OPEN" && a.severity === "CRITICAL"
  );

  const pendingSwift = swiftMessages.filter(
    (m) => m.status === "READY_FOR_SWIFT"
  );

  const openSettlements = settlements.filter((s) => s.status === "OPEN");
  const draftRecons = recons.filter((r) => r.status === "DRAFT");
  const exceptionRecons = recons.filter((r) => r.status === "EXCEPTION");

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Operations Command Center</h1>
          <p className="text-gray-400 mt-2">
            Monitor alerts, SWIFT queue, settlements, reconciliation, and operational risk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Open Alerts</p>
            <h2 className="text-3xl font-bold mt-2 text-yellow-400">
              {openAlerts.length}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Critical Alerts</p>
            <h2 className="text-3xl font-bold mt-2 text-red-400">
              {criticalAlerts.length}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Pending SWIFT</p>
            <h2 className="text-3xl font-bold mt-2 text-blue-400">
              {pendingSwift.length}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Recon Exceptions</p>
            <h2 className="text-3xl font-bold mt-2 text-purple-400">
              {exceptionRecons.length}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Resolved Alerts</p>
            <h2 className="text-3xl font-bold mt-2">{resolvedAlerts.length}</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Open Settlements</p>
            <h2 className="text-3xl font-bold mt-2">{openSettlements.length}</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Draft Recons</p>
            <h2 className="text-3xl font-bold mt-2">{draftRecons.length}</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Total Alerts</p>
            <h2 className="text-3xl font-bold mt-2">{alerts.length}</h2>
          </div>
        </div>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <h2 className="text-2xl font-bold">System Alerts</h2>

            <div className="flex gap-3">
              <button
                onClick={createTestAlert}
                className="bg-yellow-600 px-5 py-3 rounded-xl font-semibold"
              >
                CREATE TEST ALERT
              </button>

              <button
                onClick={loadData}
                className="bg-zinc-700 px-5 py-3 rounded-xl font-semibold"
              >
                REFRESH
              </button>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left py-3">Reference</th>
                  <th className="text-left py-3">Severity</th>
                  <th className="text-left py-3">Module</th>
                  <th className="text-left py-3">Title</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.id} className="border-t border-zinc-800">
                    <td className="py-3">{alert.alert_reference}</td>
                    <td className="py-3">{alert.severity}</td>
                    <td className="py-3">{alert.source_module}</td>
                    <td className="py-3">{alert.title}</td>
                    <td className="py-3 text-yellow-400">{alert.status}</td>
                    <td className="py-3">
                      {alert.status === "OPEN" ? (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="bg-green-600 px-4 py-2 rounded-lg"
                        >
                          RESOLVE
                        </button>
                      ) : (
                        <span className="text-gray-500">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}

                {alerts.length === 0 && (
                  <tr>
                    <td className="py-6 text-gray-500" colSpan={6}>
                      No alerts yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Operations Response</h2>
          <pre className="text-sm overflow-auto whitespace-pre-wrap min-h-[250px]">
            {result || "Operations responses will appear here..."}
          </pre>
        </section>
      </div>
    </main>
  );
}