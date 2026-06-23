"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function TreasuryPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  async function loadData() {
    const { data: walletData } = await supabase
      .from("wallets")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: ledgerData } = await supabase
      .from("ledger_entries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: paymentData } = await supabase
      .from("payment_intents")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    setWallets(walletData || []);
    setLedger(ledgerData || []);
    setPayments(paymentData || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  const totalBalance = wallets.reduce(
    (sum, wallet) => sum + Number(wallet.balance || 0),
    0
  );

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Treasury Dashboard</h1>
          <p className="text-gray-400 mt-2">
            TDI ISO 20022 Payment Hub Live Financial Control Center
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Total Wallets</p>
            <h2 className="text-3xl font-bold mt-2">{wallets.length}</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Total Balance</p>
            <h2 className="text-3xl font-bold mt-2">
              ₱{totalBalance.toLocaleString()}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Ledger Entries</p>
            <h2 className="text-3xl font-bold mt-2">{ledger.length}</h2>
          </div>
        </div>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Wallets</h2>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left py-3">Owner</th>
                  <th className="text-left py-3">Type</th>
                  <th className="text-left py-3">Currency</th>
                  <th className="text-left py-3">Balance</th>
                  <th className="text-left py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {wallets.map((wallet) => (
                  <tr key={wallet.id} className="border-t border-zinc-800">
                    <td className="py-3">{wallet.owner_name}</td>
                    <td className="py-3">{wallet.owner_type}</td>
                    <td className="py-3">{wallet.currency}</td>
                    <td className="py-3">
                      ₱{Number(wallet.balance || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-green-400">{wallet.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Ledger Entries</h2>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left py-3">Reference</th>
                  <th className="text-left py-3">Type</th>
                  <th className="text-left py-3">Amount</th>
                  <th className="text-left py-3">Balance After</th>
                  <th className="text-left py-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((entry) => (
                  <tr key={entry.id} className="border-t border-zinc-800">
                    <td className="py-3">{entry.reference_no}</td>
                    <td className="py-3 text-green-400">{entry.entry_type}</td>
                    <td className="py-3">
                      ₱{Number(entry.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3">
                      ₱{Number(entry.balance_after || 0).toLocaleString()}
                    </td>
                    <td className="py-3">{entry.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Payment Intents</h2>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left py-3">Reference</th>
                  <th className="text-left py-3">Sender</th>
                  <th className="text-left py-3">Receiver</th>
                  <th className="text-left py-3">Amount</th>
                  <th className="text-left py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-zinc-800">
                    <td className="py-3">{payment.reference_no}</td>
                    <td className="py-3">{payment.sender_name}</td>
                    <td className="py-3">{payment.receiver_name}</td>
                    <td className="py-3">
                      ₱{Number(payment.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-yellow-400">{payment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}