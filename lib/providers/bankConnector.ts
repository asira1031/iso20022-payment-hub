export type ConnectorPaymentPayload = {
  paymentId: string;
  referenceNo: string;
  amount: number;
  currency: string;
  senderName: string;
  senderAccount?: string | null;
  receiverName: string;
  receiverAccount?: string | null;
  receiverBank?: string | null;
  isoMessageType: "pain.001" | "pacs.008" | "camt.053";
  isoXml: string;
};

export type ConnectorResponse = {
  ok: boolean;
  provider: string;
  providerReference?: string;
  status: "ACCEPTED" | "REJECTED" | "PENDING" | "FAILED";
  message: string;
  raw?: any;
};

export interface BankConnector {
  providerName: string;
  sendPayment(payload: ConnectorPaymentPayload): Promise<ConnectorResponse>;
  checkStatus(providerReference: string): Promise<ConnectorResponse>;
}