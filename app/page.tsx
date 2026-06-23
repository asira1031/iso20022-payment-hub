export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">
          TDI ISO 20022 Payment Hub
        </h1>

        <p className="text-gray-400 text-xl">
          Universal Payment Infrastructure
        </p>

        <div className="mt-10">
          <div className="inline-block px-6 py-3 rounded-xl bg-green-600">
            SYSTEM ONLINE
          </div>
        </div>
      </div>
    </main>
  );
}