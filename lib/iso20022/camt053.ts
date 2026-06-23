export function buildCamt053(wallet: any, ledger: any[]) {
  const entries = ledger
    .map(
      (entry) => `
    <Ntry>
      <Amt Ccy="${entry.currency}">${entry.amount}</Amt>
      <CdtDbtInd>${entry.entry_type === "CREDIT" ? "CRDT" : "DBIT"}</CdtDbtInd>
      <BookgDt>${entry.created_at}</BookgDt>
      <NtryRef>${entry.reference_no}</NtryRef>
      <AddtlNtryInf>${entry.description || ""}</AddtlNtryInf>
    </Ntry>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<Document>
  <BkToCstmrStmt>
    <GrpHdr>
      <MsgId>CAMT-${Date.now()}</MsgId>
      <CreDtTm>${new Date().toISOString()}</CreDtTm>
    </GrpHdr>
    <Stmt>
      <Id>${wallet.id}</Id>
      <Acct>
        <Id>${wallet.id}</Id>
        <Ccy>${wallet.currency}</Ccy>
      </Acct>
      <Bal>
        <Amt Ccy="${wallet.currency}">${wallet.balance}</Amt>
      </Bal>
      ${entries}
    </Stmt>
  </BkToCstmrStmt>
</Document>`;
}