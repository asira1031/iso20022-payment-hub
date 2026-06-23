export type ConnectorDecision = {
  selected_connector: "MOCK_CONNECTOR" | "BANK_CONNECTOR" | "SWIFT_CONNECTOR" | "OPEN_BANKING_CONNECTOR";
  route_reason: string;
};

export type RoutablePayment = {
  receiver_bank?: string | null;
  receiver_account?: string | null;
  amount?: number | string | null;
  currency?: string | null;
};

export function decideConnector(payment: RoutablePayment): ConnectorDecision {
  const bank = String(payment.receiver_bank || "").toUpperCase();
  const currency = String(payment.currency || "PHP").toUpperCase();
  const amount = Number(payment.amount || 0);

  if (!bank) {
    return {
      selected_connector: "MOCK_CONNECTOR",
      route_reason: "No receiver bank provided. Routed to mock connector for testing.",
    };
  }

  if (currency !== "PHP") {
    return {
      selected_connector: "SWIFT_CONNECTOR",
      route_reason: "Non-PHP currency detected. Routed to SWIFT connector.",
    };
  }

  if (bank.includes("SWIFT") || bank.includes("INTERNATIONAL")) {
    return {
      selected_connector: "SWIFT_CONNECTOR",
      route_reason: "International/SWIFT bank keyword detected.",
    };
  }

  if (bank.includes("OPEN") || bank.includes("OB")) {
    return {
      selected_connector: "OPEN_BANKING_CONNECTOR",
      route_reason: "Open Banking keyword detected.",
    };
  }

  if (amount >= 500000) {
    return {
      selected_connector: "SWIFT_CONNECTOR",
      route_reason: "Large-value payment threshold reached.",
    };
  }

  return {
    selected_connector: "BANK_CONNECTOR",
    route_reason: "Local PHP bank transfer. Routed to bank connector.",
  };
}