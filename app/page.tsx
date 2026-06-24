import Image from "next/image";
import Link from "next/link";

const solutions = [
  {
    title: "ISO 20022 Payment Hub",
    text: "Standards-based payment processing for secure and interoperable transactions.",
  },
  {
    title: "Bank Connector Framework",
    text: "Flexible integration layer for banks, wallets, and financial institutions.",
  },
  {
    title: "Remittance Infrastructure",
    text: "Reliable cross-border transfer systems with operational controls.",
  },
  {
    title: "SoftPOS & QR Payments",
    text: "Digital payment acceptance tools for merchants and partners.",
  },
  {
    title: "Settlement & Reconciliation",
    text: "Automated settlement, reconciliation, and exception management.",
  },
  {
    title: "Audit & Monitoring",
    text: "Real-time monitoring, audit logs, and compliance-ready workflows.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src="/kyc/hero-bg.png"
          alt="TDI financial technology background"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020817] via-[#020817]/80 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/kyc/tdi-logo.png"
                alt="TDI Logo"
                width={90}
                height={90}
                className="h-auto w-[90px]"
              />

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-blue-300">
                  Technological Digital
                </p>
                <h1 className="text-lg font-black tracking-wide">
                  Innovations Inc.
                </h1>
              </div>
            </div>

            <Link
              href="/dashboard/monitoring"
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-bold shadow-lg shadow-blue-900/40 hover:bg-blue-500"
            >
              View Operations
            </Link>
          </header>

          <div className="grid min-h-[78vh] items-center py-16">
            <div className="max-w-3xl">
              <p className="mb-5 text-sm font-black uppercase tracking-[0.35em] text-blue-300">
                SEC Registered Technology Company
              </p>

              <h2 className="text-5xl font-black leading-tight md:text-7xl">
                Financial Technology & Digital Infrastructure
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                TDI builds secure payment systems, ISO 20022 infrastructure,
                banking integrations, remittance platforms, settlement tools,
                and compliance-ready digital operations.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/dashboard/monitoring"
                  className="rounded-2xl bg-blue-600 px-8 py-4 font-black hover:bg-blue-500"
                >
                  Open Operations
                </Link>

                <Link
                  href="/dashboard/iso-center"
                  className="rounded-2xl border border-white/25 bg-white/10 px-8 py-4 font-black backdrop-blur hover:bg-white/20"
                >
                  ISO Center
                </Link>

                <Link
                  href="/dashboard/provider-configs"
                  className="rounded-2xl border border-white/25 bg-white/10 px-8 py-4 font-black backdrop-blur hover:bg-white/20"
                >
                  Provider Config
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 pb-10 md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/15 bg-[#06111f]/80 p-6 shadow-xl backdrop-blur"
              >
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#020817] px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-2xl font-black">
              Technological Digital Innovations Inc.
            </h3>
            <p className="mt-4 leading-7 text-slate-400">
              A Philippine technology company focused on financial technology,
              payment infrastructure, and secure digital platforms.
            </p>
          </div>

          <div>
            <h4 className="font-black text-blue-300">Core Capabilities</h4>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li>ISO 20022 Messaging</li>
              <li>Bank API Integrations</li>
              <li>Settlement & Reconciliation</li>
              <li>Audit & Monitoring</li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-blue-300">Company</h4>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li>SEC Registered Corporation</li>
              <li>Website: tdi.com.ph</li>
              <li>Financial Technology Solutions</li>
              <li>Digital Infrastructure Development</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black px-6 py-6 text-center text-sm text-slate-500">
        © 2026 Technological Digital Innovations Inc. All rights reserved.
      </footer>
    </main>
  );
}