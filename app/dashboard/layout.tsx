import Link from "next/link";

const nav = [
  { label: "Dashboard", href: "/dashboard/monitoring" },
  { label: "Wallet Center", href: "/dashboard/wallet" },
  { label: "Virtual Accounts", href: "/dashboard/virtual-accounts" },
  { label: "Merchant Center", href: "/dashboard/merchants" },
  { label: "QR Payments", href: "/dashboard/qr-payments" },
  { label: "SoftPOS Devices", href: "/dashboard/softpos-devices" },
  { label: "NFC Center", href: "/dashboard/nfc" },
  { label: "Remittance Center", href: "/dashboard/remittance" },
  { label: "Settlement", href: "/dashboard/settlement" },
  { label: "Treasury", href: "/treasury" },
  { label: "Audit Center", href: "/dashboard/audit" },
  { label: "Compliance Center", href: "/dashboard/compliance" },
  { label: "Provider Config", href: "/dashboard/provider-configs" },
  { label: "Card Center", href: "/dashboard/cards" },
  { label: "Reports", href: "/dashboard/reports" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-black/40 p-5 lg:block">
          <Link href="/" className="block">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-300">
              TDI Hub
            </p>
            <h1 className="mt-1 text-xl font-black">Financial OS</h1>
          </Link>

          <nav className="mt-8 space-y-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-200 hover:border-blue-400/50 hover:bg-blue-600/20"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="flex-1 p-5 lg:p-8">
          <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5 lg:hidden">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-300">
              TDI Hub
            </p>
            <h1 className="mt-1 text-xl font-black">Financial OS</h1>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs font-bold"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {children}
        </section>
      </div>
    </main>
  );
}