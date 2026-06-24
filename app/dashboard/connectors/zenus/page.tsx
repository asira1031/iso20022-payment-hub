import Link from "next/link";

export default function ZenusConnectorPage() {
  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-blue-400 hover:underline">
          ← Back to TDI Home
        </Link>

        <h1 className="mt-8 text-4xl font-bold">Zenus Bank Connector</h1>
        <p className="mt-3 text-gray-400">
          OAuth, KYC, legal person onboarding, relationships, and virtual account readiness.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            "OAuth Token",
            "Legal Person",
            "Private Person",
            "Relationship",
            "KYC Upload",
            "Activation",
            "Virtual Account",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}