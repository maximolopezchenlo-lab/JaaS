"use client";

import { useState } from "react";
import { PaymentOverlay } from "./components/PaymentOverlay";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Payment Overlay State
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const fetchAnalysis = async (paymentHash?: string) => {
    setLoading(true);
    setError(null);
    if (!paymentHash) setResult(null); // only clear result on initial run

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (paymentHash) {
      headers["x-payment-proof"] = paymentHash;
    }

    try {
      // Proxied request via next.config.ts rewrites
      const response = await fetch("/api/legal/analyze", {
        method: "POST",
        headers,
        body: JSON.stringify({ query }),
      });

      if (response.status === 402) {
        const payload = await response.json();
        // Trigger x402 Optimistic Flow (RULE 7)
        if (payload.accepts && payload.accepts.length > 0) {
          setPaymentDetails(payload.accepts[0]);
          setShowPayment(true);
        } else {
          setError("Payment Required: No acceptable payment methods provided by server.");
        }
        setLoading(false);
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

  const handleAnalyze = () => fetchAnalysis();

  const handlePaymentSuccess = (paymentHash: string) => {
    setShowPayment(false);
    // Optimistic retry with the generated proof
    fetchAnalysis(paymentHash);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setError("Payment cancelled. Legal analysis aborted.");
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 max-w-6xl mx-auto w-full relative">
      {/* Payment Challenge Overlay */}
      {showPayment && paymentDetails && (
        <PaymentOverlay
          amountUsdc={paymentDetails.price}
          network={paymentDetails.network}
          payTo={paymentDetails.address}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}

      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in mt-12">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 title-gradient">
          Jurisprudence as a Service
        </h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          Institutional-grade legal orchestration. Access real-time jurisprudence
          powered by Gemini 2.0 and Llama 3.2, secured by Arc Testnet.
        </p>
      </div>

      {/* Query Card */}
      <div className="glass glass-card w-full mb-8 z-10">
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--accent)] mb-2 uppercase tracking-widest">
              Legal Query / Case Reference
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Analysis of the responsibilities of the Chief of Cabinet under Law 26.122..."
              className="w-full bg-black/40 border border-[var(--border)] shadow-inner rounded-lg p-4 text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none min-h-[120px] transition-all"
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
        <div className="w-full p-4 rounded-lg bg-red-900/20 border border-red-500/50 text-red-200 mb-8 animate-shake shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <p className="font-bold mb-1 tracking-wide">System Exception</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="w-full space-y-6 animate-slide-up pb-12">
          <div className="glass glass-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <span className="text-[var(--accent)] text-3xl">⚖️</span>
              Legal Intelligence Report
            </h2>
            
            <div className="prose prose-invert max-w-none text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
              {result.analysis}
            </div>
          </div>

          {result.metadata && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass glass-card !p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] rounded-full blur-[80px] opacity-[0.05] pointer-events-none"></div>
                <h3 className="text-sm uppercase tracking-widest text-[var(--accent)] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
                  Extracted Entities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.metadata.entities?.map((entity: string, idx: number) => (
                    <span key={idx} className="px-3 py-1.5 rounded-md bg-[var(--surface-hover)] border border-[var(--border)] text-xs text-[var(--text-primary)] shadow-sm">
                      {entity}
                    </span>
                  ))}
                  {(!result.metadata.entities || result.metadata.entities.length === 0) && (
                    <span className="text-sm text-[var(--text-secondary)] italic">No specific entities extracted.</span>
                  )}
                </div>
              </div>

              <div className="glass glass-card !p-6">
                <h3 className="text-sm uppercase tracking-widest text-[var(--accent)] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
                  Agent Orchestration
                </h3>
                <div className="space-y-3 text-sm text-[var(--text-secondary)]">
                  <div className="flex justify-between items-center p-2 rounded bg-black/20 border border-[var(--border)]">
                    <span>Orchestrator</span>
                    <span className="text-[var(--accent)] font-medium">Gemini 2.0 Flash</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-black/20 border border-[var(--border)]">
                    <span>Extraction Layer</span>
                    <span className="text-[var(--accent)] font-medium">Llama 3.2 3B (Featherless)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-black/20 border border-[var(--border)]">
                    <span>Protocol</span>
                    <span className="text-[var(--accent)] font-medium">x402 Payment-Gated</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-shake { animation: shake 0.3s ease-in-out 0s 2; }
      `}</style>
    </main>
  );
}
