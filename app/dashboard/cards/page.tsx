export default function CardCenterPage() {
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
          Card Center
        </h1>

        <p style={{ marginTop: 12, color: "#cbd5e1", fontSize: 18, maxWidth: 900, lineHeight: 1.8 }}>
          Manage virtual cards, debit cards, credit cards, card controls, issuing partners,
          BIN sponsorship readiness, cardholder funding, limits, and card transaction monitoring.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 20, marginTop: 35 }}>
          <Card title="Virtual Cards" value="0" />
          <Card title="Debit Cards" value="0" />
          <Card title="Credit Cards" value="0" />
          <Card title="Card Providers" value="0" />
        </div>

        <div style={{ marginTop: 30, display: "flex", gap: 15, flexWrap: "wrap" }}>
          <ActionButton text="Issue Virtual Card" />
          <ActionButton text="Order Physical Card" />
          <ActionButton text="Freeze / Unfreeze" />
          <ActionButton text="Set Card Limits" />
        </div>

        <Panel title="Card Product Roadmap">
          <Grid
            items={[
              "SmartCash Virtual Card",
              "TDI Debit Card",
              "TDI Credit Card",
              "Physical Card Printing",
              "Card Tokenization",
              "BIN Sponsor Integration",
              "Card Processor Routing",
              "NFC Wallet Provisioning",
            ]}
          />
        </Panel>

        <Panel title="Card Controls">
          <Grid
            items={[
              "Freeze Card",
              "Unfreeze Card",
              "Daily Limit",
              "Monthly Limit",
              "ATM Control",
              "Online Payments",
              "Merchant Category Rules",
              "Risk Alerts",
            ]}
          />
        </Panel>

        <Panel title="Issuance Queue">
          <table style={{ width: "100%", marginTop: 25, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Cardholder</th>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Provider</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={tdStyle}>No card requests yet</td>
                <td style={tdStyle}>-</td>
                <td style={tdStyle}>-</td>
                <td style={tdStyle}>-</td>
                <td style={tdStyle}>-</td>
              </tr>
            </tbody>
          </table>
        </Panel>

        <Panel title="Card Transaction Monitor">
          <table style={{ width: "100%", marginTop: 25, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Card</th>
                <th style={thStyle}>Merchant</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={tdStyle}>No card transactions yet</td>
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