export default function ConnectorsPage() {
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">Connector Center</h1>
        <p className="text-gray-400">
          Provider connector hub for Bank Connector, SWIFT Connector, Open Banking Connector, and Mock Connector.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold">Bank Connector</h2>
            <p className="text-gray-400 mt-2">Local bank transfer connector readiness.</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold">SWIFT Connector</h2>
            <p className="text-gray-400 mt-2">International payment routing and SWIFT readiness.</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold">Open Banking Connector</h2>
            <p className="text-gray-400 mt-2">OAuth and open banking integration preparation.</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold">Mock Connector</h2>
            <p className="text-gray-400 mt-2">Testing connector for payment hub development.</p>
          </div>
        </div>
      </div>
    </main>
  );
}