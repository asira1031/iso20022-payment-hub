"use client";

import { useState } from "react";

export default function WalletTestPage() {
  const [walletId, setWalletId] = useState("");
  const [result, setResult] = useState("");

  async function createWallet() {
    const res = await fetch("/api/wallets/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner_name: "TDI Treasury Wallet",
        owner_type: "BUSINESS",
        currency: "PHP",
      }),
    });

    const data = await res.json();

    if (data?.wallet?.id) {
      setWalletId(data.wallet.id);
    }

    setResult(JSON.stringify(data, null, 2));
  }

  async function fundWallet() {
    if (!walletId) {
      alert("Create wallet first.");
      return;
    }

    const res = await fetch("/api/wallets/fund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet_id: walletId,
        amount: 50000,
        currency: "PHP",
        description: "Initial treasury funding",
      }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  }

  async function checkBalance() {
    if (!walletId) {
      alert("Create wallet first.");
      return;
    }

    const res = await fetch(`/api/wallets/balance?id=${walletId}`);
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Wallet Engine Test</h1>
          <p className="text-gray-400 mt-2">
            TDI ISO 20022 Payment Hub Wallet + Ledger Testing
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-sm text-gray-400">Current Wallet ID</p>
          <p className="mt-2 break-all text-green-400">
            {walletId || "No wallet created yet"}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={createWallet}
            className="bg-blue-600 px-6 py-3 rounded-xl font-semibold"
          >
            CREATE WALLET
          </button>

          <button
            onClick={fundWallet}
            className="bg-green-600 px-6 py-3 rounded-xl font-semibold"
          >
            FUND WALLET ₱50,000
          </button>

          <button
            onClick={checkBalance}
            className="bg-yellow-600 px-6 py-3 rounded-xl font-semibold"
          >
            CHECK BALANCE
          </button>
        </div>

        <pre className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 overflow-auto text-sm">
          {result || "Result will appear here..."}
        </pre>
      </div>
    </main>
  );
}