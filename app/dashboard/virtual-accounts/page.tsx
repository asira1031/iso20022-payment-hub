"use client";

import { useState } from "react";

export default function VirtualAccountsPage() {
  const [personId, setPersonId] = useState("ID-30629");
  const [masterAccountId, setMasterAccountId] = useState("ID-8630");
  const [accountName, setAccountName] = useState("TDI USD Virtual Account");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [accountClassCode, setAccountClassCode] = useState("CORPORATE_DDA");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("Ready.");

  async function createVirtualAccount() {
    try {
      setLoading(true);
      setResult("Creating Zenus virtual account...");

      const res = await fetch("/api/banks/zenus/create-virtual-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personId,
          masterAccountId,
          accountName,
          currencyCode,
          accountClassCode,
        }),
      });

      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult(error.message || "Failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={pageStyle}>
      <section style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <p style={eyebrow}>TDI Financial OS</p>
        <h1 style={h1}>Virtual Accounts</h1>
        <p style={desc}>
          Create and monitor Zenus-linked virtual accounts for SmartCash funding,
          merchant settlements, remittance, and future card loading.
        </p>

        <div style={grid4}>
          <Card title="Provider" value="Zenus" />
          <Card title="Currency" value={currencyCode} />
          <Card title="Person ID" value={personId} />
          <Card title="Status" value="Pending" />
        </div>

        <section style={panel}>
          <h2 style={h2}>Create Zenus Virtual Account</h2>

          <input style={input} value={personId} onChange={(e) => setPersonId(e.target.value)} />
          <input style={input} value={masterAccountId} onChange={(e) => setMasterAccountId(e.target.value)} />
          <input style={input} value={accountName} onChange={(e) => setAccountName(e.target.value)} />
          <input style={input} value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value)} />

          <select
            style={input}
            value={accountClassCode}
            onChange={(e) => setAccountClassCode(e.target.value)}
          >
            <option value="CORPORATE_DDA">CORPORATE_DDA</option>
            <option value="PERSONAL_DDA">PERSONAL_DDA</option>
            <option value="BUSINESS_DDA">BUSINESS_DDA</option>
            <option value="FI_CONCENTRATION_DDA">FI_CONCENTRATION_DDA</option>
          </select>

          <button disabled={loading} onClick={createVirtualAccount} style={button}>
            {loading ? "CREATING..." : "CREATE VIRTUAL ACCOUNT"}
          </button>
        </section>

        <section style={panel}>
          <h2 style={h2}>Zenus Response</h2>
          <pre style={pre}>{result}</pre>
        </section>
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div style={card}>
      <p style={{ color: "#93c5fd" }}>{title}</p>
      <h2 style={{ fontSize: 32, fontWeight: 900, wordBreak: "break-word" }}>
        {value}
      </h2>
    </div>
  );
}

const pageStyle = {
  position: "fixed" as const,
  inset: 0,
  overflowY: "auto" as const,
  background: "linear-gradient(135deg,#020817,#071a36,#020817)",
  color: "white",
  padding: "40px",
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box" as const,
};

const eyebrow = { color: "#60a5fa", fontWeight: 900, letterSpacing: "4px" };
const h1 = { fontSize: "64px", fontWeight: 900, marginTop: "12px" };
const h2 = { fontSize: "30px", fontWeight: 900 };
const desc = { color: "#cbd5e1", fontSize: "18px", maxWidth: "900px", lineHeight: 1.8 };
const grid4 = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "20px", marginTop: "35px" };
const panel = { marginTop: "35px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "28px", padding: "30px" };
const card = { background: "#0f172a", border: "1px solid #1e293b", borderRadius: "24px", padding: "24px" };
const input = { display: "block", width: "100%", marginTop: "14px", background: "#020817", border: "1px solid #1e293b", color: "white", borderRadius: "16px", padding: "14px" };
const button = { marginTop: "18px", background: "#2563eb", color: "white", border: 0, borderRadius: "16px", padding: "14px 28px", fontWeight: 900, cursor: "pointer" };
const pre = { marginTop: "20px", color: "#cbd5e1", whiteSpace: "pre-wrap" as const, minHeight: "220px" };