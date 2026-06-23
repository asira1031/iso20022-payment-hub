import {
  BankConnector,
  ConnectorPaymentPayload,
  ConnectorResponse,
} from "./bankConnector";

export const mockConnector: BankConnector = {
  providerName: "MOCK_BANK",

  async sendPayment(payload: ConnectorPaymentPayload): Promise<ConnectorResponse> {
    return {
      ok: true,
      provider: "MOCK_BANK",
      providerReference: `MOCK-${Date.now()}`,
      status: "ACCEPTED",
      message: "Payment accepted by mock connector.",
      raw: {
        referenceNo: payload.referenceNo,
        amount: payload.amount,
        currency: payload.currency,
        receiver: payload.receiverName,
        isoMessageType: payload.isoMessageType,
      },
    };
  },

  async checkStatus(providerReference: string): Promise<ConnectorResponse> {
    return {
      ok: true,
      provider: "MOCK_BANK",
      providerReference,
      status: "ACCEPTED",
      message: "Mock payment status confirmed.",
    };
  },
};