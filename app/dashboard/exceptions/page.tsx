"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ExceptionsPage() {
  const [exceptions, setExceptions] = useState<any[]>([]);
  const [result, setResult] = useState("");

  async function loadData() {
    const { data } = await supabase
      .from("exception_queue")
      .select("*")
      .order("created_at", { ascending: false });

    setExceptions(data || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createTestException() {
    const res = await fetch("/api/operations/exceptions/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_module: "RECONCILIATION",
        source_reference: "TEST",
        severity: "HIGH",
        title: "Test reconciliation exception",
        description: "Expected and actual amount did not match.",
      }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
    await loadData();
  }

  async function resolveException(exceptionId: string) {
    const res = await fetch("/api/operations/exceptions/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exception_id: exceptionId }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
    await loadData();
  }

  const openExceptions = exceptions.filter((e) => e.status === "OPEN");
  const resolvedExceptions = exceptions.filter((e) => e.status === "RESOLVED");

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Exception Queue</h1>
          <p className="text-gray-400 mt-2">
            Track operational exceptions from reconciliation, SWIFT, settlement,
            and provider connectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Open Exceptions</p>
            <h2 className="text-3xl font-bold mt-2 text-red-400">
              {openExceptions.length}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Resolved Exceptions</p>
            <h2 className="text-3xl font-bold mt-2 text-green-400">
              {resolvedExceptions.length}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Total Exceptions</p>
            <h2 className="text-3xl font-bold mt-2">{exceptions.length}</h2>
          </div>
        </div>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
            <h2 className="text-2xl font-bold">Exception Queue</h2>

            <div className="flex gap-3">
              <button
                onClick={createTestException}
                className="bg-red-600 px-5 py-3 rounded-xl font-semibold"
              >
                CREATE TEST EXCEPTION
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
                {exceptions.map((item) => (
                  <tr key={item.id} className="border-t border-zinc-800">
                    <td className="py-3">{item.exception_reference}</td>
                    <td className="py-3 text-red-400">{item.severity}</td>
                    <td className="py-3">{item.source_module}</td>
                    <td className="py-3">{item.title}</td>
                    <td className="py-3 text-yellow-400">{item.status}</td>
                    <td className="py-3">
                      {item.status === "OPEN" ? (
                        <button
                          onClick={() => resolveException(item.id)}
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

                {exceptions.length === 0 && (
                  <tr>
                    <td className="py-6 text-gray-500" colSpan={6}>
                      No exceptions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Exception Response</h2>
          <pre className="text-sm overflow-auto whitespace-pre-wrap min-h-[250px]">
            {result || "Exception responses will appear here..."}
          </pre>
        </section>
      </div>
    </main>
  );
}