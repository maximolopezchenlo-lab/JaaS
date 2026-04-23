"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:9546/api/legal/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Payment-Hash": "0xrama5_frontend_test", // Simulated payment hash
        },
        body: JSON.stringify({ query }),
      });

      if (response.status === 402) {
        setError("Payment Required: This legal resource requires a USDC nanopayment on Arc.");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch legal analysis.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 max-w-6xl mx-auto w-full">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 title-gradient">
          Jurisprudence as a Service
        </h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          Institutional-grade legal orchestration. Access real-time jurisprudence
          powered by Gemini 2.0 and Llama 3.2, secured by Arc Testnet.
        </p>
      </div>

      {/* Query Card */}
      <div className="glass glass-card w-full mb-8">
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--accent)] mb-2 uppercase tracking-widest">
              Legal Query / Case Reference
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Analysis of the responsibilities of the Chief of Cabinet under Law 26.122..."
              className="w-full bg-black/40 border border-[var(--border)] rounded-lg p-4 text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none min-h-[120px] transition-all"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={loading || !query}
              className="btn-premium flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                  Orchestrating...
                </>
              ) : (
                "Execute Legal Analysis"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="w-full p-4 rounded-lg bg-red-900/20 border border-red-500/50 text-red-200 mb-8 animate-shake">
          <p className="font-bold mb-1">System Exception</p>
          <p>{error}</p>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="w-full space-y-6 animate-slide-up">
          <div className="glass glass-card">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-[var(--accent)]">⚖️</span>
              Legal Intelligence Report
            </h2>
            
            <div className="prose prose-invert max-w-none text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
              {result.analysis}
            </div>
          </div>

          {result.metadata && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass glass-card !p-6">
                <h3 className="text-sm uppercase tracking-widest text-[var(--accent)] mb-3">Extracted Entities</h3>
                <div className="flex flex-wrap gap-2">
                  {result.metadata.entities?.map((entity: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] text-xs">
                      {entity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass glass-card !p-6">
                <h3 className="text-sm uppercase tracking-widest text-[var(--accent)] mb-3">Agent Orchestration</h3>
                <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                  <div className="flex justify-between">
                    <span>Orchestrator</span>
                    <span className="text-[var(--accent)]">Gemini 2.0 Flash</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Extraction Layer</span>
                    <span className="text-[var(--accent)]">Llama 3.2 3B (Featherless)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protocol</span>
                    <span className="text-[var(--accent)]">x402 Payment-Gated</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </main>
  );
}
