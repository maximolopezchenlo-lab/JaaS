"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Cpu, 
  Database, 
  ShieldCheck, 
  FileText, 
  Activity, 
  Zap,
  ArrowRight,
  AlertCircle,
  Tag,
  Printer,
  Copy,
  Check
} from "lucide-react";
import { PaymentOverlay } from "./components/PaymentOverlay";

export default function Home() {
  const [query, setQuery] = useState("");
  const [jurisdiction, setJurisdiction] = useState("AR");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Payment Overlay State
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  // Copy State
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fetchAnalysis = async (paymentHash?: string) => {
    setLoading(true);
    setError(null);
    if (!paymentHash) {
      // Don't clear result immediately for smoother transition
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (paymentHash) {
      headers["x-payment-proof"] = paymentHash;
    }

    try {
      const response = await fetch("/api/legal/analyze", {
        method: "POST",
        headers,
        body: JSON.stringify({ query }),
      });

      if (response.status === 402) {
        const payload = await response.json();
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
      setResult(data.data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = () => {
    if (!query) return;
    fetchAnalysis();
  };

  const handlePaymentSuccess = (paymentHash: string) => {
    setShowPayment(false);
    fetchAnalysis(paymentHash);
  };

  return (
    <div className="relative min-h-full">
      <AnimatePresence>
        {showPayment && paymentDetails && (
          <PaymentOverlay
            amountAtomic={paymentDetails.amount}
            network={paymentDetails.network}
            payTo={paymentDetails.payTo}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPayment(false)}
          />
        )}
      </AnimatePresence>

      <div className="space-y-12">
        {/* Hero & Query Selection */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`transition-all duration-700 ${result ? 'pt-0' : 'pt-20 text-center'}`}
        >
          {!result && (
            <div className="mb-12 space-y-4">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest"
              >
                <Zap className="w-3 h-3" />
                Live on Arc Testnet
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter gold-gradient">
                Jurisprudence <br className="hidden md:block" /> as a Service
              </h1>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                Secure, institutional-grade legal orchestration powered by high-performance agentic models.
              </p>
            </div>
          )}

          <div className={`max-w-4xl mx-auto relative group ${result ? 'mb-8' : ''}`}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent)] to-transparent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="dashboard-card p-2 relative flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-dim)]" />
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  placeholder="Enter legal query or case reference..."
                  className="w-full bg-transparent border-none py-6 pl-16 pr-6 text-white placeholder:text-[var(--text-dim)] focus:outline-none text-lg"
                />
              </div>
              <button 
                onClick={handleAnalyze}
                disabled={loading || !query}
                className="neo-button rounded-xl px-8 py-4 mr-2 flex items-center gap-2 font-bold uppercase tracking-widest text-xs disabled:opacity-50"
              >
                {loading ? (
                  <Activity className="w-4 h-4 animate-spin" />
                ) : (
                  <>Execute <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        </motion.section>

        {/* System Messages */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-4xl mx-auto overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 flex gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">Protocol Exception</p>
                  <p className="text-sm opacity-80">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Content */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Metadata & Status */}
              <div className="lg:col-span-4 space-y-6">
                <StatusPanel 
                  title="Orchestration Status" 
                  icon={<Cpu className="w-4 h-4 text-[var(--accent)]" />}
                  items={[
                    { label: "Orchestrator", value: "Gemini 3 Pro", status: "Active" },
                    { label: "Extraction", value: "Llama 3.2 3B", status: "Active" },
                    { label: "Verification", value: "Arc-x402", status: "Verified" }
                  ]}
                />

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="dashboard-card p-6 space-y-4"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-dim)]">
                    <Tag className="w-3 h-3" />
                    <span>Extracted Entities</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(result?.entities || []).map((ent: any, i: number) => (
                      <motion.span 
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * i }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white hover:border-[var(--accent)] transition-colors cursor-default"
                      >
                        {ent.name || ent}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                <div className="dashboard-card p-6">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-dim)] mb-4">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Integrity Hash</span>
                  </div>
                  <div className="bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-[10px] text-[var(--accent)] break-all opacity-80 leading-relaxed">
                    SHA256: 0x93f412a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6
                  </div>
                </div>
              </div>

              {/* Right Column: Analysis Manuscript */}
              <div className="lg:col-span-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass dashboard-card p-10 min-h-[600px] relative overflow-hidden group"
                >
                  {/* Luxury Texture Overlays */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)] rounded-full blur-[150px] opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-1000"></div>

                  <div className="relative space-y-8">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-[var(--accent)]" />
                        <div>
                          <h2 className="text-xl font-bold tracking-tight">Legal Intelligence Report</h2>
                          <p className="text-[10px] uppercase tracking-widest text-[var(--text-dim)]">Generated by JaaS Engine v4.2</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest">Confidential</p>
                          <p className="text-[9px] text-[var(--text-dim)] uppercase tracking-tighter">Copy No. 0xAF23</p>
                        </div>
                        <button 
                          onClick={() => window.print()}
                          className="no-print p-2 rounded-lg bg-white/5 border border-white/10 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all group"
                          title="Print / Save PDF"
                        >
                          <Printer className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent)]" />
                        </button>
                      </div>
                    </div>

                    <div className="manuscript-content">
                      <p className="manuscript-reasoning">
                        {result?.reasoning || "No analysis content available."}
                      </p>

                      <div className="space-y-6">
                        {(result?.citations || []).map((cite: any, i: number) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (i * 0.15) }}
                            className="citation-block relative"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-bold">
                                  {i + 1}
                                </div>
                                <h4 className="text-lg font-bold text-[var(--text-primary)]">{cite.title}</h4>
                              </div>
                              <button 
                                onClick={() => handleCopy(cite.excerpt, `cite-${i}`)}
                                className="no-print p-2 rounded hover:bg-white/10 transition-colors"
                                title="Copy citation"
                              >
                                {copiedId === `cite-${i}` ? (
                                  <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Copy className="w-4 h-4 text-[var(--text-dim)] hover:text-white" />
                                )}
                              </button>
                            </div>
                            <p className="text-[var(--text-secondary)] italic mb-4 border-l-2 border-[var(--accent)]/30 pl-4">
                              "{cite.excerpt}"
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                              <span className="text-[var(--text-dim)] uppercase tracking-widest">{cite.source}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-[var(--accent)]">Relevance: {Math.round((cite.relevance || 0) * 100)}%</span>
                                <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(cite.relevance || 0) * 100}%` }}
                                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                    className="h-full bg-gradient-to-r from-[var(--accent-muted)] to-[var(--accent)]"
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatusPanel({ title, icon, items }: { title: string, icon: React.ReactNode, items: { label: string, value: string, status: string }[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="dashboard-card p-6"
    >
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-dim)] mb-6">
        {icon}
        <span>{title}</span>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-tighter text-[var(--text-dim)]">{item.label}</p>
              <p className="text-xs font-bold text-white">{item.value}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-500/80">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
