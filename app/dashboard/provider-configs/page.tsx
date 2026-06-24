"use client";

import { useEffect, useState } from "react";

const cardStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "24px",
  padding: "24px",
};

const valueStyle = {
  fontSize: "42px",
  fontWeight: 900,
};

const inputStyle = {
  background: "#020817",
  border: "1px solid #1e293b",
  color: "white",
  borderRadius: "16px",
  padding: "14px",
};

const buttonStyle = {
  background: "#2563eb",
  color: "white",
  border: 0,
  borderRadius: "16px",
  padding: "14px 28px",
  fontWeight: 900,
  cursor: "pointer",
};

const thStyle = {
  textAlign: "left" as const,
  padding: "14px",
  borderBottom: "1px solid #334155",
  color: "#93c5fd",
};

const tdStyle = {
  padding: "16px",
  borderBottom: "1px solid #1e293b",
};

export default function ProviderConfigsPage() {
  const [configs, setConfigs] = useState<any[]>([]);
  const [result, setResult] = useState("");

  const [providerName, setProviderName] = useState("Zenus Bank");
  const [connectorType, setConnectorType] = useState("BANK_CONNECTOR");
  const [environment, setEnvironment] = useState("SANDBOX");
  const [baseUrl, setBaseUrl] = useState("https://api.dev.zenus.io");
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
    <main
      style={{
        position: "fixed",
        inset: 0,
        overflowY: "auto",
        background: "linear-gradient(135deg,#020817,#071a36,#020817)",
        color: "white",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <section style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <p style={{ color: "#60a5fa", fontWeight: 900, letterSpacing: 4 }}>
          TDI FINANCIAL OS
        </p>

        <h1 style={{ fontSize: "64px", fontWeight: 900, marginTop: "12px" }}>
          Provider Configuration Center
        </h1>

        <p
          style={{
            marginTop: "12px",
            color: "#cbd5e1",
            fontSize: "18px",
            maxWidth: "900px",
            lineHeight: 1.8,
          }}
        >
          Configure banking partners, remittance providers, QR rails, settlement
          providers, card processors, and future BIN sponsors.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
            marginTop: "35px",
          }}
        >
          <div style={cardStyle}>
            <p style={{ color: "#93c5fd" }}>Providers</p>
            <h2 style={valueStyle}>{configs.length}</h2>
          </div>

          <div style={cardStyle}>
            <p style={{ color: "#93c5fd" }}>Bank Connectors</p>
            <h2 style={valueStyle}>
              {configs.filter((c) => c.connector_type === "BANK_CONNECTOR").length}
            </h2>
          </div>

          <div style={cardStyle}>
            <p style={{ color: "#93c5fd" }}>Open Banking</p>
            <h2 style={valueStyle}>
              {
                configs.filter(
                  (c) => c.connector_type === "OPEN_BANKING_CONNECTOR"
                ).length
              }
            </h2>
          </div>

          <div style={cardStyle}>
            <p style={{ color: "#93c5fd" }}>SWIFT</p>
            <h2 style={valueStyle}>
              {configs.filter((c) => c.connector_type === "SWIFT_CONNECTOR").length}
            </h2>
          </div>
        </div>

        <section
          style={{
            marginTop: "35px",
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "28px",
            padding: "30px",
          }}
        >
          <h2 style={{ fontSize: "30px", fontWeight: 900 }}>
            Create Provider Config
          </h2>

          <div style={{ display: "grid", gap: "12px", marginTop: "20px" }}>
            <input
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="Provider Name"
              style={inputStyle}
            />

            <select
              value={connectorType}
              onChange={(e) => setConnectorType(e.target.value)}
              style={inputStyle}
            >
              <option value="BANK_CONNECTOR">BANK_CONNECTOR</option>
              <option value="SWIFT_CONNECTOR">SWIFT_CONNECTOR</option>
              <option value="OPEN_BANKING_CONNECTOR">
                OPEN_BANKING_CONNECTOR
              </option>
            </select>

            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              style={inputStyle}
            >
              <option value="SANDBOX">SANDBOX</option>
              <option value="PRODUCTION">PRODUCTION</option>
            </select>

            <input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="Base URL"
              style={inputStyle}
            />

            <input
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Client ID only. Do not store client secret here."
              style={inputStyle}
            />

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={createConfig} style={buttonStyle}>
                SAVE CONFIG
              </button>

              <button onClick={loadConfigs} style={buttonStyle}>
                REFRESH
              </button>
            </div>
          </div>
        </section>

        <section
          style={{
            marginTop: "35px",
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "28px",
            padding: "30px",
          }}
        >
          <h2 style={{ fontSize: "30px", fontWeight: 900 }}>
            Provider Registry
          </h2>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                marginTop: "20px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>Provider</th>
                  <th style={thStyle}>Connector</th>
                  <th style={thStyle}>Environment</th>
                  <th style={thStyle}>Base URL</th>
                  <th style={thStyle}>Client ID</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>

              <tbody>
                {configs.map((config) => (
                  <tr key={config.id}>
                    <td style={tdStyle}>{config.provider_name}</td>
                    <td style={tdStyle}>{config.connector_type}</td>
                    <td style={tdStyle}>{config.environment}</td>
                    <td style={tdStyle}>{config.base_url || "N/A"}</td>
                    <td style={tdStyle}>{config.client_id || "N/A"}</td>
                    <td style={tdStyle}>{config.status}</td>
                  </tr>
                ))}

                {configs.length === 0 && (
                  <tr>
                    <td style={tdStyle} colSpan={6}>
                      No provider configs yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section
          style={{
            marginTop: "35px",
            background: "#020817",
            border: "1px solid #1e293b",
            borderRadius: "28px",
            padding: "30px",
          }}
        >
          <h2 style={{ fontSize: "30px", fontWeight: 900 }}>
            Provider Config Response
          </h2>

          <pre
            style={{
              marginTop: "20px",
              minHeight: "220px",
              whiteSpace: "pre-wrap",
              color: "#cbd5e1",
              overflowX: "auto",
            }}
          >
            {result || "Provider config responses will appear here..."}
          </pre>
        </section>
      </section>
    </main>
  );
}