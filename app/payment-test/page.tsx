"use client";

import { useState } from "react";

export default function PaymentTestPage() {
  const [walletId, setWalletId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [result, setResult] = useState("");

  async function createWallet() {
    const res = await fetch("/api/wallets/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner_name: "TDI Payment Test Wallet" }),
    });

    const data = await res.json();
    if (data?.wallet?.id) setWalletId(data.wallet.id);
    setResult(JSON.stringify(data, null, 2));
  }

  async function fundWallet() {
    const res = await fetch("/api/wallets/fund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet_id: walletId, amount: 50000 }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  }

  async function createPayment() {
    const res = await fetch("/api/payments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_name: "TDI",
        sender_account: "TDI-TREASURY",
        receiver_name: "Juan Dela Cruz",
        receiver_account: "1234567890",
        receiver_bank: "BPI",
        amount: 1000,
        currency: "PHP",
        purpose: "Test payment execution",
      }),
    });

    const data = await res.json();
    if (data?.payment?.id) setPaymentId(data.payment.id);
    setResult(JSON.stringify(data, null, 2));
  }

  async function executePayment() {
    const res = await fetch("/api/payments/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_intent_id: paymentId, wallet_id: walletId }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  }

  async function cancelPayment() {
    const res = await fetch("/api/payments/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_intent_id: paymentId }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  }

  async function getHistory() {
    const res = await fetch(`/api/payments/history?payment_intent_id=${paymentId}`);
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">Payment Execution Test</h1>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-2">
          <p className="text-sm text-gray-400">Wallet ID</p>
          <p className="break-all text-green-400">{walletId || "None"}</p>

          <p className="text-sm text-gray-400 mt-4">Payment Intent ID</p>
          <p className="break-all text-yellow-400">{paymentId || "None"}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={createWallet} className="bg-blue-600 px-5 py-3 rounded-xl">
            1. CREATE WALLET
          </button>

          <button onClick={fundWallet} className="bg-green-600 px-5 py-3 rounded-xl">
            2. FUND WALLET
          </button>

          <button onClick={createPayment} className="bg-yellow-600 px-5 py-3 rounded-xl">
            3. CREATE PAYMENT
          </button>

          <button onClick={executePayment} className="bg-purple-600 px-5 py-3 rounded-xl">
            4. EXECUTE PAYMENT
          </button>

          <button onClick={getHistory} className="bg-zinc-700 px-5 py-3 rounded-xl">
            5. GET HISTORY
          </button>

          <button onClick={cancelPayment} className="bg-red-600 px-5 py-3 rounded-xl">
            CANCEL PAYMENT
          </button>
        </div>

        <pre className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 overflow-auto text-sm min-h-[300px]">
          {result || "Result will appear here..."}
        </pre>
      </div>
    </main>
  );
}