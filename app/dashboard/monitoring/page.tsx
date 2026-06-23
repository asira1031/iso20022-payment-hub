"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function MonitoringPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [swiftMessages, setSwiftMessages] = useState<any[]>([]);
  const [settlements, setSettlements] = useState<any[]>([]);
  const [recons, setRecons] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [exceptions, setExceptions] = useState<any[]>([]);
  const [retries, setRetries] = useState<any[]>([]);
  const [audits, setAudits] = useState<any[]>([]);

  async function loadData() {
    const { data: walletData } = await supabase.from("wallets").select("*");
    const { data: paymentData } = await supabase.from("payment_intents").select("*");
    const { data: swiftData } = await supabase.from("swift_messages").select("*");
    const { data: settlementData } = await supabase.from("settlement_batches").select("*");
    const { data: reconData } = await supabase.from("reconciliation_reports").select("*");
    const { data: alertData } = await supabase.from("system_alerts").select("*");
    const { data: exceptionData } = await supabase.from("exception_queue").select("*");
    const { data: retryData } = await supabase.from("retry_queue").select("*");
    const { data: auditData } = await supabase.from("audit_logs").select("*");

    setWallets(walletData || []);
    setPayments(paymentData || []);
    setSwiftMessages(swiftData || []);
    setSettlements(settlementData || []);
    setRecons(reconData || []);
    setAlerts(alertData || []);
    setExceptions(exceptionData || []);
    setRetries(retryData || []);
    setAudits(auditData || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  const totalWalletBalance = wallets.reduce(
    (sum, wallet) => sum + Number(wallet.balance || 0),
    0
  );

  const executedPayments = payments.filter((p) => p.status === "EXECUTED");
  const cancelledPayments = payments.filter((p) => p.status === "CANCELLED");
  const pendingSwift = swiftMessages.filter((m) => m.status === "READY_FOR_SWIFT");
  const closedSettlements = settlements.filter((s) => s.status === "CLOSED");
  const reconciledReports = recons.filter((r) => r.status === "RECONCILED");
  const openAlerts = alerts.filter((a) => a.status === "OPEN");
  const openExceptions = exceptions.filter((e) => e.status === "OPEN");
  const pendingRetries = retries.filter((r) => r.status === "PENDING");

  const healthScore =
    openAlerts.length === 0 &&
    openExceptions.length === 0 &&
    pendingRetries.length === 0
      ? "HEALTHY"
      : "ATTENTION REQUIRED";

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Monitoring Dashboard</h1>
            <p className="text-gray-400 mt-2">
              Live operational overview of the TDI ISO 20022 Payment Hub.
            </p>
          </div>

          <button
            onClick={loadData}
            className="bg-zinc-700 px-6 py-3 rounded-xl font-semibold"
          >
            REFRESH
          </button>
        </div>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">System Health</p>
          <h2
            className={`text-4xl font-bold mt-2 ${
              healthScore === "HEALTHY" ? "text-green-400" : "text-yellow-400"
            }`}
          >
            {healthScore}
          </h2>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Card title="Wallets" value={wallets.length} />
          <Card title="Total Balance" value={`₱${totalWalletBalance.toLocaleString()}`} />
          <Card title="Payments" value={payments.length} />
          <Card title="Executed Payments" value={executedPayments.length} color="text-green-400" />

          <Card title="Cancelled Payments" value={cancelledPayments.length} color="text-red-400" />
          <Card title="SWIFT Messages" value={swiftMessages.length} />
          <Card title="Pending SWIFT" value={pendingSwift.length} color="text-blue-400" />
          <Card title="Settlements" value={settlements.length} />

          <Card title="Closed Settlements" value={closedSettlements.length} color="text-green-400" />
          <Card title="Recon Reports" value={recons.length} />
          <Card title="Reconciled Reports" value={reconciledReports.length} color="text-green-400" />
          <Card title="Open Alerts" value={openAlerts.length} color="text-yellow-400" />

          <Card title="Open Exceptions" value={openExceptions.length} color="text-red-400" />
          <Card title="Pending Retries" value={pendingRetries.length} color="text-yellow-400" />
          <Card title="Audit Logs" value={audits.length} />
          <Card title="Operations Tables" value={4} />
        </div>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Activity Snapshot</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ActivityBox
              title="Latest Payment"
              value={payments[0]?.reference_no || "No payment yet"}
              subtitle={payments[0]?.status || ""}
            />

            <ActivityBox
              title="Latest SWIFT"
              value={swiftMessages[0]?.swift_reference || "No SWIFT message yet"}
              subtitle={swiftMessages[0]?.status || ""}
            />

            <ActivityBox
              title="Latest Audit"
              value={audits[0]?.audit_reference || "No audit yet"}
              subtitle={audits[0]?.action || ""}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({
  title,
  value,
  color = "text-white",
}: {
  title: string;
  value: any;
  color?: string;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className={`text-3xl font-bold mt-2 ${color}`}>{value}</h2>
    </div>
  );
}

function ActivityBox({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="bg-black border border-zinc-800 rounded-xl p-5">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-yellow-400 mt-2 break-all">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
    </div>
  );
}