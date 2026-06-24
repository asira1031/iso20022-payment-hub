export default function SettingsPage() {
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

        <h1
          style={{
            fontSize: "64px",
            fontWeight: 900,
            marginTop: "12px",
          }}
        >
          Settings
        </h1>

        <p
          style={{
            marginTop: "12px",
            color: "#cbd5e1",
            fontSize: "18px",
            maxWidth: "900px",
          }}
        >
          Global platform settings for wallets, merchants, QR,
          SoftPOS, remittance, treasury, cards, providers,
          compliance and risk controls.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(320px,1fr))",
            gap: "20px",
            marginTop: "35px",
          }}
        >
          {[
            "Platform Settings",
            "Wallet Settings",
            "Merchant Settings",
            "Remittance Settings",
            "Card Settings",
            "Compliance Settings",
            "Treasury Settings",
            "Provider Settings",
          ].map((item) => (
            <div
              key={item}
              style={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "24px",
                padding: "24px",
              }}
            >
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 900,
                }}
              >
                {item}
              </h3>

              <p
                style={{
                  marginTop: "10px",
                  color: "#cbd5e1",
                }}
              >
                Configuration module ready.
              </p>
            </div>
          ))}
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
          <h2
            style={{
              fontSize: "30px",
              fontWeight: 900,
            }}
          >
            Financial OS Configuration
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(260px,1fr))",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            {[
              "Wallet Limits",
              "Transaction Limits",
              "Settlement Rules",
              "QR Rules",
              "SoftPOS Rules",
              "NFC Rules",
              "Provider Routing",
              "Card Controls",
              "Risk Controls",
              "Treasury Rules",
            ].map((item) => (
              <div
                key={item}
                style={{
                  background: "#020817",
                  border: "1px solid #1e293b",
                  borderRadius: "20px",
                  padding: "20px",
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