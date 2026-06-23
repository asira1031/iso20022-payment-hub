import {
  BankConnector,
  ConnectorPaymentPayload,
  ConnectorResponse,
} from "./bankConnector";

export const openBankingConnector: BankConnector = {
  providerName: "OPEN_BANKING_PLACEHOLDER",

  async sendPayment(payload: ConnectorPaymentPayload): Promise<ConnectorResponse> {
    return {
      ok: false,
      provider: "OPEN_BANKING_PLACEHOLDER",
      providerReference: undefined,
      status: "PENDING",
      message:
        "Open Banking connector is not live yet. Add a regulated provider or aggregator API here.",
      raw: {
        referenceNo: payload.referenceNo,
        isoMessageType: payload.isoMessageType,
      },
    };
  },

  async checkStatus(providerReference: string): Promise<ConnectorResponse> {
    return {
      ok: false,
      provider: "OPEN_BANKING_PLACEHOLDER",
      providerReference,
      status: "PENDING",
      message: "Open Banking status check is not connected yet.",
    };
  },
};