"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [result, setResult] = useState("");

  async function loadData() {
    const { data } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false });

    setLogs(data || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createTestAudit() {
    const res = await fetch("/api/audit/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        module: "AUDIT_CENTER",
        action: "TEST_AUDIT_CREATED",
        reference_id: "TEST",
        performed_by: "SYSTEM",
        details: {
          note: "This is a test audit log from Audit Center.",
        },
      }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
    await loadData();
  }

  const paymentLogs = logs.filter((l) => l.module?.includes("PAYMENT"));
  const swiftLogs = logs.filter((l) => l.module?.includes("SWIFT"));
  const opsLogs = logs.filter(
    (l) =>
      l.module?.includes("OPERATIONS") ||
      l.module?.includes("RETRY") ||
      l.module?.includes("EXCEPTION") ||
      l.module?.includes("ALERT")
  );

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Audit Center</h1>
          <p className="text-gray-400 mt-2">
            Review immutable-style operational logs across the TDI ISO 20022 Hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Total Audit Logs</p>
            <h2 className="text-3xl font-bold mt-2">{logs.length}</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Payment Logs</p>
            <h2 className="text-3xl font-bold mt-2 text-blue-400">
              {paymentLogs.length}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">SWIFT Logs</p>
            <h2 className="text-3xl font-bold mt-2 text-purple-400">
              {swiftLogs.length}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Operations Logs</p>
            <h2 className="text-3xl font-bold mt-2 text-yellow-400">
              {opsLogs.length}
            </h2>
          </div>
        </div>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
            <h2 className="text-2xl font-bold">Audit Logs</h2>

            <div className="flex gap-3">
              <button
                onClick={createTestAudit}
                className="bg-blue-600 px-5 py-3 rounded-xl font-semibold"
              >
                CREATE TEST AUDIT
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
                  <th className="text-left py-3">Module</th>
                  <th className="text-left py-3">Action</th>
                  <th className="text-left py-3">Reference ID</th>
                  <th className="text-left py-3">Performed By</th>
                  <th className="text-left py-3">Created</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t border-zinc-800">
                    <td className="py-3">{log.audit_reference}</td>
                    <td className="py-3 text-blue-400">{log.module}</td>
                    <td className="py-3">{log.action}</td>
                    <td className="py-3">{log.reference_id || "N/A"}</td>
                    <td className="py-3">{log.performed_by || "SYSTEM"}</td>
                    <td className="py-3">
                      {log.created_at
                        ? new Date(log.created_at).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}

                {logs.length === 0 && (
                  <tr>
                    <td className="py-6 text-gray-500" colSpan={6}>
                      No audit logs yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Audit Response</h2>
          <pre className="text-sm overflow-auto whitespace-pre-wrap min-h-[250px]">
            {result || "Audit responses will appear here..."}
          </pre>
        </section>
      </div>
    </main>
  );
}