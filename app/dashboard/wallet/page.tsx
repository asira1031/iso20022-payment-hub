"use client";

import { useEffect, useMemo, useState } from "react";

export default function SmartCashCenterPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [ownerName, setOwnerName] = useState("Janica Maldives");
  const [amount, setAmount] = useState("100");
  const [result, setResult] = useState("Ready.");
  const [loading, setLoading] = useState(false);

  const selectedWallet = wallets.find((w) => w.id === selectedWalletId);

  const totalBalance = useMemo(
    () => wallets.reduce((sum, w) => sum + Number(w.balance || 0), 0),
    [wallets]
  );

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetch("/api/wallets/list", { cache: "no-store" });
      const text = await res.text();
      const data = JSON.parse(text);

      setResult(JSON.stringify(data, null, 2));

      if (!res.ok || !data.ok) {
        alert(data.error || "Failed to load wallets.");
        return;
      }

      setWallets(data.wallets || []);
      setLedger(data.ledger || []);

      if (data.wallets?.length && !selectedWalletId) {
        setSelectedWalletId(data.wallets[0].id);
      }
    } catch (err: any) {
      setResult(String(err?.message || err));
      alert("Load failed. Check API response.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createWallet() {
    try {
      if (!ownerName.trim()) {
        alert("Owner name is required.");
        return;
      }

      setLoading(true);
      setResult("Creating wallet...");

      const res = await fetch("/api/wallets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_name: ownerName.trim(),
          owner_type: "BUSINESS",
          currency: "PHP",
        }),
      });

      const text = await res.text();
      const data = JSON.parse(text);
      setResult(JSON.stringify(data, null, 2));

      if (!res.ok || !data.ok) {
        alert(data.error || "Create wallet failed.");
        return;
      }

      if (data.wallet?.id) {
        setSelectedWalletId(data.wallet.id);
      }

      await loadData();
      alert("Wallet created.");
    } catch (err: any) {
      setResult(String(err?.message || err));
      alert("Create wallet failed. Check response box.");
    } finally {
      setLoading(false);
    }
  }

  async function addCash() {
    try {
      if (!selectedWalletId) {
        alert("Create/select wallet first.");
        return;
      }

      if (!amount || Number(amount) <= 0) {
        alert("Enter valid amount.");
        return;
      }

      setLoading(true);
      setResult("Adding cash...");

      const res = await fetch("/api/wallets/fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_id: selectedWalletId,
          amount: Number(amount),
          description: "SmartCash funding",
        }),
      });

      const text = await res.text();
      const data = JSON.parse(text);
      setResult(JSON.stringify(data, null, 2));

      if (!res.ok || !data.ok) {
        alert(data.error || "Add cash failed.");
        return;
      }

      await loadData();
      alert("Cash added.");
    } catch (err: any) {
      setResult(String(err?.message || err));
      alert("Add cash failed. Check response box.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflowY: "auto",
        background: "linear-gradient(135deg,#020817,#071a36,#020817)",
        color: "white",
        padding: 40,
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <section style={{ maxWidth: 1400, margin: "0 auto" }}>
        <p style={{ color: "#60a5fa", fontWeight: 900, letterSpacing: 4 }}>
          TDI FINANCIAL OS
        </p>

        <h1 style={{ fontSize: 64, fontWeight: 900, margin: "16px 0" }}>
          SmartCash Center
        </h1>

        <p style={{ color: "#cbd5e1", fontSize: 18, maxWidth: 850 }}>
          Real SmartCash wallet engine connected to Supabase wallets and ledger entries.
        </p>

        <p style={{ marginTop: 15, color: loading ? "#facc15" : "#22c55e", fontWeight: 900 }}>
          {loading ? "Processing..." : "Ready"}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 20, marginTop: 30 }}>
          <Card label="Total SmartCash" value={`₱${totalBalance.toLocaleString()}`} />
          <Card label="Wallets" value={String(wallets.length)} />
          <Card label="Selected Balance" value={`₱${Number(selectedWallet?.balance || 0).toLocaleString()}`} />
          <Card label="Ledger Entries" value={String(ledger.length)} />
        </div>

        <section style={panelStyle}>
          <h2 style={titleStyle}>Create / Select Wallet</h2>

          <input
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Owner Name"
            style={inputStyle}
          />

          <button type="button" disabled={loading} onClick={createWallet} style={buttonStyle}>
            CREATE WALLET
          </button>

          <select
            value={selectedWalletId}
            onChange={(e) => setSelectedWalletId(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select wallet</option>
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.owner_name} — {wallet.currency} — ₱{Number(wallet.balance || 0).toLocaleString()}
              </option>
            ))}
          </select>
        </section>

        <section style={panelStyle}>
          <h2 style={titleStyle}>Add Cash</h2>

          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            type="number"
            style={inputStyle}
          />

          <button type="button" disabled={loading} onClick={addCash} style={buttonStyle}>
            ADD CASH
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={loadData}
            style={{ ...buttonStyle, background: "#334155" }}
          >
            REFRESH
          </button>
        </section>

        <section style={panelStyle}>
          <h2 style={titleStyle}>SmartCash Ledger</h2>

          <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Reference</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Balance After</th>
                <th style={thStyle}>Description</th>
              </tr>
            </thead>

            <tbody>
              {ledger.map((entry) => (
                <tr key={entry.id}>
                  <td style={tdStyle}>{entry.reference_no || "-"}</td>
                  <td style={tdStyle}>{entry.entry_type || "-"}</td>
                  <td style={tdStyle}>₱{Number(entry.amount || 0).toLocaleString()}</td>
                  <td style={tdStyle}>₱{Number(entry.balance_after || 0).toLocaleString()}</td>
                  <td style={tdStyle}>{entry.description || "-"}</td>
                </tr>
              ))}

              {ledger.length === 0 && (
                <tr>
                  <td style={tdStyle} colSpan={5}>
                    No ledger entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section style={panelStyle}>
          <h2 style={titleStyle}>API Response / Error Debug</h2>
          <pre style={{ color: "#cbd5e1", whiteSpace: "pre-wrap", minHeight: 180 }}>
            {result}
          </pre>
        </section>
      </section>
    </main>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 24, padding: 24 }}>
      <p style={{ color: "#93c5fd" }}>{label}</p>
      <h2 style={{ fontSize: 38, fontWeight: 900 }}>{value}</h2>
    </div>
  );
}

const panelStyle = {
  marginTop: 30,
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: 28,
  padding: 28,
};

const titleStyle = { fontSize: 30, fontWeight: 900 };

const inputStyle = {
  display: "block",
  width: "100%",
  marginTop: 14,
  background: "#020817",
  border: "1px solid #1e293b",
  color: "white",
  borderRadius: 16,
  padding: 14,
};

const buttonStyle = {
  marginTop: 14,
  marginRight: 12,
  background: "#2563eb",
  color: "white",
  border: 0,
  borderRadius: 16,
  padding: "14px 28px",
  fontWeight: 900,
  cursor: "pointer",
};

const thStyle = {
  textAlign: "left" as const,
  padding: 14,
  borderBottom: "1px solid #334155",
  color: "#93c5fd",
};

const tdStyle = {
  padding: 14,
  borderBottom: "1px solid #1e293b",
};