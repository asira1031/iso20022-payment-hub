export default function MerchantCenterPage() {
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
      <section
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            color: "#60a5fa",
            fontWeight: 900,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          TDI Financial OS
        </p>

        <h1
          style={{
            fontSize: "64px",
            fontWeight: 900,
            marginTop: "12px",
          }}
        >
          Merchant Center
        </h1>

        <p
          style={{
            marginTop: "12px",
            color: "#cbd5e1",
            fontSize: "18px",
            maxWidth: "850px",
            lineHeight: 1.8,
          }}
        >
          Manage merchants, onboarding, QR acceptance, SoftPOS devices,
          settlement, commissions, NFC acceptance, and future card acceptance.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
            marginTop: "35px",
          }}
        >
          <Card title="Total Merchants" value="0" />
          <Card title="Active Merchants" value="0" />
          <Card title="Pending Review" value="0" />
          <Card title="Settlement Ready" value="0" />
        </div>

        <div
          style={{
            marginTop: "30px",
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <ActionButton text="Add Merchant" />
          <ActionButton text="Generate QR" />
          <ActionButton text="Merchant Ledger" />
          <ActionButton text="Settlement Queue" />
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
            Merchant Products
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            {[
              "Merchant Wallet",
              "Merchant QR",
              "SoftPOS",
              "NFC Acceptance",
              "Virtual Accounts",
              "Card Acceptance",
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
            Merchant Registry
          </h2>

          <table
            style={{
              width: "100%",
              marginTop: "25px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Merchant</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>QR</th>
                <th style={thStyle}>SoftPOS</th>
                <th style={thStyle}>Settlement</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={tdStyle}>No merchants yet</td>
                <td style={tdStyle}>-</td>
                <td style={tdStyle}>-</td>
                <td style={tdStyle}>-</td>
                <td style={tdStyle}>-</td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: "24px",
        padding: "24px",
      }}
    >
      <p style={{ color: "#93c5fd" }}>{title}</p>
      <h2
        style={{
          fontSize: "42px",
          fontWeight: 900,
          marginTop: "10px",
        }}
      >
        {value}
      </h2>
    </div>
  );
}

function ActionButton({
  text,
}: {
  text: string;
}) {
  return (
    <button
      style={{
        background: "#2563eb",
        color: "white",
        border: 0,
        borderRadius: "16px",
        padding: "14px 28px",
        fontWeight: 900,
        cursor: "pointer",
      }}
    >
      {text}
    </button>
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