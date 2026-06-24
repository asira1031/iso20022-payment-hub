export default function RemittanceCenterPage() {
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

        <h1 style={{ fontSize: 64, fontWeight: 900, marginTop: 12 }}>
          Remittance Center
        </h1>

        <p style={{ marginTop: 12, color: "#cbd5e1", fontSize: 18, maxWidth: 900, lineHeight: 1.8 }}>
          Manage cross-border transfers, payout corridors, provider routing,
          compliance checks, settlement tracking, and remittance operations.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 20, marginTop: 35 }}>
          <Card title="Transfers Today" value="0" />
          <Card title="Volume Today" value="₱0.00" />
          <Card title="Pending Payouts" value="0" />
          <Card title="Active Corridors" value="0" />
        </div>

        <div style={{ marginTop: 30, display: "flex", gap: 15, flexWrap: "wrap" }}>
          <ActionButton text="Create Transfer" />
          <ActionButton text="Payout Queue" />
          <ActionButton text="FX / Corridor Setup" />
          <ActionButton text="Compliance Review" />
        </div>

        <Panel title="Remittance Rails">
          <Grid
            items={[
              "Bank Payout",
              "Wallet Payout",
              "Cash Pickup",
              "Virtual Account Funding",
              "ISO 20022 Message",
              "Provider Routing",
              "Settlement Batch",
              "Compliance Screening",
            ]}
          />
        </Panel>

        <Panel title="Transfer Monitor">
          <table style={{ width: "100%", marginTop: 25, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Sender</th>
                <th style={thStyle}>Receiver</th>
                <th style={thStyle}>Corridor</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={tdStyle}>No transfers yet</td>
                <td style={tdStyle}>-</td>
                <td style={tdStyle}>-</td>
                <td style={tdStyle}>-</td>
                <td style={tdStyle}>-</td>
                <td style={tdStyle}>-</td>
              </tr>
            </tbody>
          </table>
        </Panel>
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 24, padding: 24 }}>
      <p style={{ color: "#93c5fd" }}>{title}</p>
      <h2 style={{ fontSize: 42, fontWeight: 900, marginTop: 10 }}>{value}</h2>
    </div>
  );
}

function ActionButton({ text }: { text: string }) {
  return (
    <button style={{ background: "#2563eb", color: "white", border: 0, borderRadius: 16, padding: "14px 28px", fontWeight: 900, cursor: "pointer" }}>
      {text}
    </button>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 35, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 28, padding: 30 }}>
      <h2 style={{ fontSize: 30, fontWeight: 900 }}>{title}</h2>
      {children}
    </section>
  );
}

function Grid({ items }: { items: string[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 15, marginTop: 20 }}>
      {items.map((item) => (
        <div key={item} style={{ background: "#020817", border: "1px solid #1e293b", borderRadius: 20, padding: 20, fontWeight: 700 }}>
          {item}
        </div>
      ))}
    </div>
  );
}

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