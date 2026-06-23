import {
  BankConnector,
  ConnectorPaymentPayload,
  ConnectorResponse,
} from "./bankConnector";

export const swiftConnector: BankConnector = {
  providerName: "SWIFT_PLACEHOLDER",

  async sendPayment(payload: ConnectorPaymentPayload): Promise<ConnectorResponse> {
    return {
      ok: false,
      provider: "SWIFT_PLACEHOLDER",
      providerReference: undefined,
      status: "PENDING",
      message:
        "SWIFT connector is not live yet. This placeholder requires SWIFT network access and bank sponsorship.",
      raw: {
        referenceNo: payload.referenceNo,
        isoMessageType: payload.isoMessageType,
      },
    };
  },

  async checkStatus(providerReference: string): Promise<ConnectorResponse> {
    return {
      ok: false,
      provider: "SWIFT_PLACEHOLDER",
      providerReference,
      status: "PENDING",
      message: "SWIFT status check is not connected yet.",
    };
  },
};