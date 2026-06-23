export function buildPain001(payment: any) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Document>
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>${payment.reference_no}</MsgId>
      <CreDtTm>${new Date().toISOString()}</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <CtrlSum>${payment.amount}</CtrlSum>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>${payment.reference_no}</PmtInfId>
      <Dbtr>
        <Nm>${payment.sender_name}</Nm>
      </Dbtr>
      <DbtrAcct>
        <Id>${payment.sender_account || "N/A"}</Id>
      </DbtrAcct>
      <CdtTrfTxInf>
        <Amt>
          <InstdAmt Ccy="${payment.currency}">${payment.amount}</InstdAmt>
        </Amt>
        <Cdtr>
          <Nm>${payment.receiver_name}</Nm>
        </Cdtr>
        <CdtrAcct>
          <Id>${payment.receiver_account || "N/A"}</Id>
        </CdtrAcct>
        <RmtInf>
          <Ustrd>${payment.iso_payload?.purpose || "Payment"}</Ustrd>
        </RmtInf>
      </CdtTrfTxInf>
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`;
}