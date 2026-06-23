"use client";

import { useEffect, useState } from "react";

export default function ProviderConfigsPage() {
  const [configs, setConfigs] = useState<any[]>([]);
  const [result, setResult] = useState("");

  const [providerName, setProviderName] = useState("UnionBank");
  const [connectorType, setConnectorType] = useState("BANK_CONNECTOR");
  const [environment, setEnvironment] = useState("SANDBOX");
  const [baseUrl, setBaseUrl] = useState("");
  const [clientId, setClientId] = useState("");

  async function loadConfigs() {
    const res = await fetch("/api/provider-configs/list");
    const data = await res.json();
    setConfigs(data.provider_configs || []);
  }

  useEffect(() => {
    loadConfigs();
  }, []);

  async function createConfig() {
    const res = await fetch("/api/provider-configs/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider_name: providerName,
        connector_type: connectorType,
        environment,
        base_url: baseUrl,
        client_id: clientId,
        status: "ACTIVE",
      }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
    await loadConfigs();
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Provider Configuration Center</h1>
          <p className="text-gray-400 mt-2">
            Configure real connector settings for bank, SWIFT, and open banking providers.
          </p>
        </div>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold">Create Provider Config</h2>

          <input
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
            placeholder="Provider Name"
          />

          <select
            value={connectorType}
            onChange={(e) => setConnectorType(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
          >
            <option value="BANK_CONNECTOR">BANK_CONNECTOR</option>
            <option value="SWIFT_CONNECTOR">SWIFT_CONNECTOR</option>
            <option value="OPEN_BANKING_CONNECTOR">OPEN_BANKING_CONNECTOR</option>
          </select>

          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
          >
            <option value="SANDBOX">SANDBOX</option>
            <option value="PRODUCTION">PRODUCTION</option>
          </select>

          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
            placeholder="Base URL"
          />

          <input
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
            placeholder="Client ID only. Do not store client secret here."
          />

          <div className="flex gap-3">
            <button
              onClick={createConfig}
              className="bg-blue-600 px-6 py-3 rounded-xl font-semibold"
            >
              SAVE CONFIG
            </button>

            <button
              onClick={loadConfigs}
              className="bg-zinc-700 px-6 py-3 rounded-xl font-semibold"
            >
              REFRESH
            </button>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Provider Configs</h2>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left py-3">Provider</th>
                  <th className="text-left py-3">Connector</th>
                  <th className="text-left py-3">Environment</th>
                  <th className="text-left py-3">Base URL</th>
                  <th className="text-left py-3">Client ID</th>
                  <th className="text-left py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {configs.map((config) => (
                  <tr key={config.id} className="border-t border-zinc-800">
                    <td className="py-3">{config.provider_name}</td>
                    <td className="py-3 text-blue-400">{config.connector_type}</td>
                    <td className="py-3">{config.environment}</td>
                    <td className="py-3 break-all">{config.base_url || "N/A"}</td>
                    <td className="py-3 break-all">{config.client_id || "N/A"}</td>
                    <td className="py-3 text-green-400">{config.status}</td>
                  </tr>
                ))}

                {configs.length === 0 && (
                  <tr>
                    <td className="py-6 text-gray-500" colSpan={6}>
                      No provider configs yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Provider Config Response</h2>
          <pre className="text-sm overflow-auto whitespace-pre-wrap min-h-[250px]">
            {result || "Provider config responses will appear here..."}
          </pre>
        </section>
      </div>
    </main>
  );
}