import Link from "next/link";

const links = [
  { label: "Monitoring", href: "/dashboard/monitoring" },
  { label: "Wallet Test", href: "/wallet-test" },
  { label: "Payment Test", href: "/payment-test" },
  { label: "Treasury", href: "/treasury" },
  { label: "Audit Center", href: "/dashboard/audit" },
  { label: "Routing", href: "/dashboard/routing" },
  { label: "Provider Configs", href: "/dashboard/provider-configs" },
  { label: "ISO Center", href: "/dashboard/iso-center" },
  { label: "SWIFT Queue", href: "/dashboard/swift-queue" },
  { label: "Settlement", href: "/dashboard/settlement" },
  { label: "Reconciliation", href: "/dashboard/reconciliation" },
  { label: "Operations", href: "/dashboard/operations" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex">
      <aside className="w-72 bg-zinc-950 border-r border-zinc-800 p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-6">TDI Hub</h2>

        <nav className="space-y-2">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            TDI ISO 20022 Payment Hub
          </h1>

          <p className="text-gray-400 text-xl">
            Universal Payment Infrastructure
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard/monitoring"
              className="px-8 py-4 rounded-xl bg-green-600 hover:bg-green-500 font-semibold"
            >
              SYSTEM ONLINE
            </Link>

            <Link
              href="/payment-test"
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold"
            >
              PAYMENT TEST
            </Link>

            <Link
              href="/dashboard/provider-configs"
              className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold"
            >
              PROVIDER CONFIG
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:hidden">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}