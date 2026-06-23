"use client";

export default function TestPage() {
  async function createPayment() {
    const res = await fetch("/api/payments/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_name: "TDI",
        receiver_name: "Juan Dela Cruz",
        amount: 1000,
        currency: "PHP",
      }),
    });

    const data = await res.json();

    console.log(data);
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <button
        onClick={createPayment}
        className="bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        CREATE TEST PAYMENT
      </button>
    </div>
  );
}