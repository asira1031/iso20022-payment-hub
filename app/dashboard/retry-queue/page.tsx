"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function RetryQueuePage() {
  const [retries, setRetries] = useState<any[]>([]);
  const [result, setResult] = useState("");

  async function loadData() {
    const { data } = await supabase
      .from("retry_queue")
      .select("*")
      .order("created_at", { ascending: false });

    setRetries(data || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createTestRetry() {
    const res = await fetch("/api/operations/retry/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_module: "SWIFT_QUEUE",
        source_reference: "TEST",
        retry_type: "SWIFT_DELIVERY_RETRY",
        max_retries: 3,
      }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
    await loadData();
  }

  async function processRetry(retryId: string) {
    const res = await fetch("/api/operations/retry/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ retry_id: retryId }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
    await loadData();
  }

  const pending = retries.filter((r) => r.status === "PENDING");
  const completed = retries.filter((r) => r.status === "COMPLETED");
  const failed = retries.filter((r) => r.status === "FAILED");

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Retry Queue</h1>
          <p className="text-gray-400 mt-2">
            Manage failed provider, SWIFT, and connector retry attempts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Pending Retries</p>
            <h2 className="text-3xl font-bold mt-2 text-yellow-400">
              {pending.length}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Completed</p>
            <h2 className="text-3xl font-bold mt-2 text-green-400">
              {completed.length}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Failed</p>
            <h2 className="text-3xl font-bold mt-2 text-red-400">
              {failed.length}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Total Retries</p>
            <h2 className="text-3xl font-bold mt-2">{retries.length}</h2>
          </div>
        </div>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
            <h2 className="text-2xl font-bold">Retry Items</h2>

            <div className="flex gap-3">
              <button
                onClick={createTestRetry}
                className="bg-yellow-600 px-5 py-3 rounded-xl font-semibold"
              >
                CREATE TEST RETRY
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
                  <th className="text-left py-3">Type</th>
                  <th className="text-left py-3">Count</th>
                  <th className="text-left py-3">Max</th>
                  <th className="text-left py-3">Next Retry</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {retries.map((item) => (
                  <tr key={item.id} className="border-t border-zinc-800">
                    <td className="py-3">{item.retry_reference}</td>
                    <td className="py-3">{item.source_module}</td>
                    <td className="py-3">{item.retry_type}</td>
                    <td className="py-3">{item.retry_count}</td>
                    <td className="py-3">{item.max_retries}</td>
                    <td className="py-3">
                      {item.next_retry_at
                        ? new Date(item.next_retry_at).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="py-3 text-yellow-400">{item.status}</td>
                    <td className="py-3">
                      {item.status === "PENDING" ? (
                        <button
                          onClick={() => processRetry(item.id)}
                          className="bg-green-600 px-4 py-2 rounded-lg"
                        >
                          PROCESS
                        </button>
                      ) : (
                        <span className="text-gray-500">Done</span>
                      )}
                    </td>
                  </tr>
                ))}

                {retries.length === 0 && (
                  <tr>
                    <td className="py-6 text-gray-500" colSpan={8}>
                      No retry items yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Retry Response</h2>
          <pre className="text-sm overflow-auto whitespace-pre-wrap min-h-[250px]">
            {result || "Retry responses will appear here..."}
          </pre>
        </section>
      </div>
    </main>
  );
}