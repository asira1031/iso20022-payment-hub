export default function VirtualAccountsPage() {
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
            letterSpacing: "4px",
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
            marginBottom: "16px",
          }}
        >
          Virtual Accounts
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            fontSize: "18px",
            maxWidth: "900px",
            lineHeight: 1.8,
          }}
        >
          Manage bank-linked virtual accounts for SmartCash funding,
          merchant settlements, collections, remittance processing,
          card funding, and future banking integrations.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
            marginTop: "40px",
          }}
        >
          <Card title="Total Accounts" value="2" />
          <Card title="Active Accounts" value="1" />
          <Card title="Pending Accounts" value="1" />
          <Card title="Primary Provider" value="Zenus" />
        </div>

        <div
          style={{
            marginTop: "35px",
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <ActionButton text="Create Virtual Account" />
          <ActionButton text="Link Provider" />
          <ActionButton text="Account Ledger" />
        </div>

        <div
          style={{
            marginTop: "40px",
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "28px",
            padding: "30px",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              fontWeight: 900,
              marginBottom: "10px",
            }}
          >
            Zenus Banking Readiness
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              lineHeight: 1.8,
            }}
          >
            OAuth, Legal Person, Private Person, Relationship,
            Passport KYC, and Domain Infrastructure are already
            completed. Remaining requirements include Occupation,
            FATCA, Source of Funds, and final account activation.
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >
            <Status text="OAuth Ready" />
            <Status text="Legal Person Ready" />
            <Status text="Private Person Ready" />
            <Status text="Relationship Ready" />
            <Status text="KYC Started" />
            <Status text="Account Pending" />
          </div>
        </div>

        <div
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
            Virtual Account Registry
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
                <th style={thStyle}>Provider</th>
                <th style={thStyle}>Account Name</th>
                <th style={thStyle}>Currency</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={tdStyle}>Zenus Bank</td>
                <td style={tdStyle}>TDI USD Virtual Account</td>
                <td style={tdStyle}>USD</td>
                <td style={tdStyle}>Pending</td>
              </tr>

              <tr>
                <td style={tdStyle}>TDI Internal</td>
                <td style={tdStyle}>SmartCash Funding Account</td>
                <td style={tdStyle}>PHP</td>
                <td style={tdStyle}>Ready</td>
              </tr>
            </tbody>
          </table>
        </div>
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
        padding: "25px",
      }}
    >
      <p style={{ color: "#93c5fd" }}>{title}</p>

      <h2
        style={{
          marginTop: "10px",
          fontSize: "44px",
          fontWeight: 900,
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
        border: 0,
        color: "white",
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

function Status({
  text,
}: {
  text: string;
}) {
  return (
    <span
      style={{
        background: "#1e293b",
        borderRadius: "999px",
        padding: "10px 16px",
        fontSize: "13px",
        fontWeight: 700,
      }}
    >
      {text}
    </span>
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