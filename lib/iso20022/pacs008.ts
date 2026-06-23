export function buildPacs008(payment: any) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Document>
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>${payment.reference_no}</MsgId>
      <CreDtTm>${new Date().toISOString()}</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <CtrlSum>${payment.amount}</CtrlSum>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <EndToEndId>${payment.reference_no}</EndToEndId>
      </PmtId>
      <IntrBkSttlmAmt Ccy="${payment.currency}">${payment.amount}</IntrBkSttlmAmt>
      <Dbtr>
        <Nm>${payment.sender_name}</Nm>
      </Dbtr>
      <Cdtr>
        <Nm>${payment.receiver_name}</Nm>
      </Cdtr>
      <CdtrAcct>
        <Id>${payment.receiver_account || "N/A"}</Id>
      </CdtrAcct>
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>`;
}