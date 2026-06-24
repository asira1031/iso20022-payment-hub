"use client";

export default function SmartCashCenterPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        background: "linear-gradient(135deg,#020817,#071a36,#020817)",
        color: "white",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <section style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ color: "#60a5fa", fontWeight: 900, letterSpacing: 4 }}>
          TDI FINANCIAL OS
        </p>

        <h1 style={{ fontSize: 64, fontWeight: 900, margin: "16px 0" }}>
          SmartCash Center
        </h1>

        <p style={{ color: "#cbd5e1", fontSize: 18, maxWidth: 780 }}>
          Central command center for SmartCash balances, wallet ledger,
          merchant funds, virtual account funding, transfers, and future card
          loading.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginTop: 40,
          }}
        >
          {["Total SmartCash", "Available Cash", "Pending Settlement"].map(
            (label) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 28,
                  padding: 28,
                }}
              >
                <p style={{ color: "#93c5fd" }}>{label}</p>
                <h2 style={{ fontSize: 42, fontWeight: 900 }}>₱0.00</h2>
              </div>
            )
          )}
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
          {["Add Cash", "Withdraw", "Transfer"].map((action) => (
            <button
              key={action}
              style={{
                background: "#2563eb",
                color: "white",
                border: 0,
                borderRadius: 18,
                padding: "16px 34px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              {action}
            </button>
          ))}
        </div>

        <section
          style={{
            marginTop: 34,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 28,
            padding: 28,
          }}
        >
          <h2 style={{ fontSize: 30, fontWeight: 900 }}>
            SmartCash Ledger
          </h2>
          <p style={{ marginTop: 12, color: "#94a3b8" }}>
            No SmartCash transactions yet.
          </p>
        </section>
      </section>
    </main>
  );
}