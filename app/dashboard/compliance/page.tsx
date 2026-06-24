export default function ComplianceCenterPage() {
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
      }}
    >
      <section style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <p style={{ color: "#60a5fa", fontWeight: 900, letterSpacing: 4 }}>
          TDI FINANCIAL OS
        </p>

        <h1 style={{ fontSize: 64, fontWeight: 900, marginTop: 12 }}>
          Compliance Center
        </h1>

        <p style={{ marginTop: 12, color: "#cbd5e1", fontSize: 18 }}>
          KYC, KYB, FATCA, Source of Funds, Risk Monitoring, AML and regulatory compliance management.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: 20,
            marginTop: 35,
          }}
        >
          <Card title="Pending KYC" value="0" />
          <Card title="Pending KYB" value="0" />
          <Card title="Risk Alerts" value="0" />
          <Card title="AML Reviews" value="0" />
        </div>

        <div
          style={{
            marginTop: 30,
            display: "flex",
            gap: 15,
            flexWrap: "wrap",
          }}
        >
          <Button text="Review KYC" />
          <Button text="Review KYB" />
          <Button text="FATCA Records" />
          <Button text="Source of Funds" />
        </div>

        <section
          style={{
            marginTop: 35,
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 28,
            padding: 30,
          }}
        >
          <h2 style={{ fontSize: 30, fontWeight: 900 }}>
            Compliance Checklist
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 15,
              marginTop: 20,
            }}
          >
            {[
              "Passport",
              "Proof of Address",
              "Source of Funds",
              "Occupation",
              "FATCA",
              "Biometric Verification",
              "KYB Documents",
              "AML Screening",
            ].map((item) => (
              <div
                key={item}
                style={{
                  background: "#020817",
                  border: "1px solid #1e293b",
                  borderRadius: 20,
                  padding: 20,
                  fontWeight: 700,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function Card({ title, value }: any) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: 24,
        padding: 24,
      }}
    >
      <p style={{ color: "#93c5fd" }}>{title}</p>
      <h2 style={{ fontSize: 42, fontWeight: 900 }}>{value}</h2>
    </div>
  );
}

function Button({ text }: any) {
  return (
    <button
      style={{
        background: "#2563eb",
        color: "white",
        border: 0,
        borderRadius: 16,
        padding: "14px 28px",
        fontWeight: 900,
      }}
    >
      {text}
    </button>
  );
}