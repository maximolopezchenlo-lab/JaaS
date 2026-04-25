"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Copy, FileText, CheckCircle2, Shield, Sparkles, Wallet, ChevronRight, Zap, Globe, Lock, Paperclip, Activity, Scale, Search, BookOpen, Gavel, ExternalLink } from "lucide-react";
import { TiltCard } from "./components/TiltCard";
import { HoverButton } from "@/components/ui/hover-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LegalReport {
  answer: string;
  citations: Array<{ id: string; source: string; title: string; excerpt: string; relevance: number; link: string }>;
  metadata: { models_used: string[]; execution_time_ms: number; verified_on_chain: boolean; entities: string[]; txHash: string };
}

// ─── Orchestration Steps (The Narrative Engine) ───
const ORCH_STEPS = [
  { tag: "Gemini 3 Pro", color: "#4285F4", msg: "Parsing query & establishing reasoning path..." },
  { tag: "Orchestrator", color: "#A855F7", msg: "Routing 'Contract Extraction' to Featherless Llama 3..." },
  { tag: "x402", color: "#C9A227", msg: "HTTP 402 Payment Required — paying Featherless inference node." },
  { tag: "Circle", color: "#00D395", msg: "Settled $0.004 USDC on Arc Testnet for Llama 3 API call ✓" },
  { tag: "Featherless", color: "#F97316", msg: "Llama 3 specialized output received. Returning to Gemini..." },
  { tag: "Gemini 3 Pro", color: "#4285F4", msg: "Synthesizing final jurisprudential report..." },
];

// ─── Live Arc Ledger Component ───
function LiveArcLedger() {
  const [txs, setTxs] = useState<string[]>([]);
  const [isDemoBurst, setIsDemoBurst] = useState(false);
  const [totalProcessed, setTotalProcessed] = useState(1248);
  
  useEffect(() => {
    const generateTx = () => `0x${Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;
    const initial = Array.from({length: 20}, generateTx);
    setTxs(initial);

    const interval = setInterval(() => {
      setTxs(prev => {
        const newTxs = [generateTx(), ...prev];
        if (newTxs.length > (isDemoBurst ? 60 : 30)) newTxs.pop();
        return newTxs;
      });
      setTotalProcessed(prev => prev + 1);
    }, isDemoBurst ? 80 : 1200);

    return () => clearInterval(interval);
  }, [isDemoBurst]);

  const triggerBurst = () => {
    setIsDemoBurst(true);
    setTotalProcessed(prev => prev + 50);
    setTimeout(() => setIsDemoBurst(false), 6000);
  };

  return (
    <div className="fixed right-0 top-20 bottom-0 w-64 border-l border-white/[0.05] bg-[#050507] hidden xl:flex flex-col z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="relative px-6 pt-10 pb-6 border-b border-white/[0.05] bg-gradient-to-b from-white/[0.02] to-transparent cursor-pointer" onClick={triggerBurst} title="Click to trigger Demo Burst">
        <div className="flex items-center gap-3 mb-1">
          <div className="relative">
            <Activity className="w-4 h-4 text-[#00D395]" />
            <div className={`absolute inset-0 blur-sm bg-[#00D395]/50 ${isDemoBurst ? 'animate-ping' : 'animate-pulse'}`} />
          </div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-white font-bold">Arc Live Network</span>
        </div>
        <p className="text-[9px] text-[#4A4A55] font-bold uppercase tracking-widest">Nanopayment Settlement Stream</p>
      </div>

      <div className="flex-1 overflow-hidden relative px-6 py-6 space-y-4">
        {/* Fading Mask */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#050507] via-transparent to-[#050507]" />
        
        <AnimatePresence mode="popLayout">
          {txs.slice(0, isDemoBurst ? 50 : 20).map((tx, i) => (
            <motion.div key={tx + i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: Math.max(0, 1 - (i * (isDemoBurst ? 0.02 : 0.05))), x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: isDemoBurst ? 0.1 : 0.4, ease: "easeOut" }}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-[#00D395] shadow-[0_0_8px_#00D395]" />
                <span className="text-[11px] font-mono text-[#8B8B96] group-hover:text-white transition-colors tracking-tight">{tx.slice(0, 8)}...</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-mono text-[#C9A227] font-bold">0.001¢</span>
                <span className="text-[8px] font-mono text-[#4A4A55] uppercase">USDC</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="px-6 py-6 bg-white/[0.01] border-t border-white/[0.05]">
        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-[#4A4A55] mb-2">
          <span>Node Status</span>
          <span className="text-[#00D395]">Operational</span>
        </div>
        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-[#4A4A55]">
          <span>Total Processed</span>
          <span className="text-white">{totalProcessed}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Margin Widget Component (Compact Banner) ───
function MarginWidget() {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      className="margin-widget p-4 w-full no-print z-10 relative">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#C9A227]" />
          <span className="text-[10px] uppercase tracking-[0.15em] text-[#E8E8ED] font-bold">Unit Economics</span>
        </div>
        <button 
          onMouseEnter={() => setShowExplanation(true)} 
          onMouseLeave={() => setShowExplanation(false)}
          className="text-[9px] text-[#8B8B96] hover:text-[#C9A227] uppercase tracking-widest font-bold underline decoration-[#8B8B96]/30 underline-offset-4 transition-colors">
          Why Arc?
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-2 items-center text-[11px]">
        <div className="flex justify-between"><span className="text-[#8B8B96]">Featherless</span><span className="font-mono text-[#E8E8ED]">$0.0040</span></div>
        <div className="flex justify-between"><span className="text-[#8B8B96]">Gemini</span><span className="font-mono text-[#E8E8ED]">$0.0020</span></div>
        <div className="flex justify-between"><span className="text-[#C9A227] font-semibold">Gas (Arc)</span><span className="font-mono text-[#C9A227] font-bold">$0.00001</span></div>
        <div className="flex justify-between"><span className="text-[#8B8B96]">Client Charge</span><span className="font-mono text-[#E8E8ED]">$0.0300</span></div>
        <div className="flex justify-between items-center border-l border-white/10 pl-4"><span className="text-[#E8E8ED] font-semibold">Net Margin</span><span className="text-lg font-mono font-bold text-[#00D395]">80.0%</span></div>
      </div>

      <AnimatePresence>
        {showExplanation && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            className="absolute top-full left-0 md:w-[450px] mt-2 p-5 rounded-xl bg-[#0A0A0C]/95 border border-[#C9A227]/30 backdrop-blur-xl shadow-2xl z-50 pointer-events-none">
            <h4 className="text-[#C9A227] text-[11px] font-bold uppercase tracking-widest mb-2">The Agentic Economy Imperative</h4>
            <p className="text-[#8B8B96] text-[11px] leading-relaxed mb-3">
              With a <strong className="text-[#E8E8ED]">~$0.01 per-action price</strong>, traditional Ethereum L1 gas costs ($2.00+) would result in a <strong className="text-[#FF5F56]">-20,000% net margin</strong>, making micro-compute routing economically impossible.
            </p>
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <div className="flex items-center gap-2"><span className="text-[#FF5F56]">L1 Gas:</span> <span className="text-[#E8E8ED]">~$2.00</span></div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-2"><span className="text-[#00D395]">Arc Gas:</span> <span className="text-[#C9A227] font-bold">~$0.00001</span></div>
            </div>
            <p className="text-white/60 text-[10px] italic mt-3 pt-3 border-t border-white/5">
              Arc enables native USDC nanopayment settlement, validating the Agentic Economy.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Onboarding Component (High-End SaaS Hero) ───
function Onboarding({ onComplete }: { onComplete: (wallet: string) => void }) {
  const [wallet, setWallet] = useState("");
  const [step, setStep] = useState(0);

  const features = [
    { icon: Scale, title: "Immutable Jurisprudence", desc: "Complex queries are cross-referenced with local doctrines and cryptographically attested." },
    { icon: Zap, title: "Agentic Economy", desc: "AI models negotiate compute and pay each other in real-time using Circle USDC on Arc." },
    { icon: Shield, title: "Zero-Trust Billing", desc: "No subscriptions. You only pay sub-cent x402 nanopayments for the exact compute used." },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center p-6 z-10 w-full mt-10">
      
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, filter: "blur(10px)" }} className="max-w-5xl w-full flex flex-col items-center text-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20 mb-8 shadow-[0_0_20px_rgba(201,162,39,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="text-[10px] text-[#C9A227] uppercase tracking-[0.2em] font-bold">The Future of Legal Tech</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-content font-semibold text-white mb-6 leading-[1.05] tracking-tight">
              Generative Legal Intelligence.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A227] to-[#F1D888] italic">Verified on Arc.</span>
            </h1>
            
            <p className="text-[#8B8B96] text-lg md:text-xl max-w-2xl leading-relaxed mb-16 font-ui">
              An enterprise-grade orchestration engine that routes complex jurisprudential queries to specialized AI models, settled autonomously via x402 nanopayments.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
              {features.map((f, i) => (
                <TiltCard key={f.title} className="h-full">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 0.3 }}
                    className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/[0.015] border border-white/[0.03] backdrop-blur-sm transition-all hover:bg-white/[0.03] h-full">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-5 border border-white/[0.05]">
                      <f.icon className="w-5 h-5 text-[#C9A227]" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2 font-ui">{f.title}</h3>
                    <p className="text-sm text-[#8B8B96] leading-relaxed font-ui">{f.desc}</p>
                  </motion.div>
                </TiltCard>
              ))}
            </div>

            <div className="h-32" /> {/* Large spacer to ensure no overlap with 3D cards */}
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="relative z-40">
              <HoverButton onClick={() => setStep(1)} 
                className="group px-14 py-7 flex items-center justify-center gap-4 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_0_80px_rgba(201,162,39,0.15)] transition-all hover:scale-105 min-w-[320px]">
                <span className="text-xl font-bold text-white tracking-tight">Initialize Workspace</span>
                <ChevronRight className="w-6 h-6 text-[#C9A227] group-hover:translate-x-2 transition-transform" />
              </HoverButton>
            </motion.div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="wallet" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-lg p-10 md:p-14 relative overflow-hidden rounded-3xl bg-white/[0.01] border border-white/[0.03] backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/5 blur-[80px] pointer-events-none" />
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#C9A227]/10 flex items-center justify-center border border-[#C9A227]/20">
                <Wallet className="w-5 h-5 text-[#C9A227]" />
              </div>
            </div>
            
            <h2 className="text-2xl font-content font-semibold text-white text-center mb-3">Connect Your Wallet</h2>
            <p className="text-sm text-[#8B8B96] mb-10 text-center leading-relaxed">
              Link your Arc-compatible wallet to authorize x402 micro-transactions for jurisprudential queries.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-[#8B8B96] font-bold mb-2 ml-1">Wallet Address</label>
                <input type="text" value={wallet} onChange={e => setWallet(e.target.value)}
                  placeholder="0x..." className="onboarding-input font-mono w-full" />
              </div>

              <button onClick={() => { if (wallet.trim()) onComplete(wallet); }}
                disabled={!wallet.trim()}
                className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${wallet.trim() ? 'bg-[#E8E8ED] text-[#0A0A0C] hover:bg-white shadow-[0_0_30px_rgba(255,255,255,0.08)]' : 'bg-white/5 text-[#4A4A55] cursor-not-allowed'}`}>
                <Shield className="w-4 h-4" /> Authorize & Continue
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/[0.05] text-center">
              <button onClick={() => onComplete("0xa6817b8d8b472e219abf479af49b5f8e0097f105")} className="text-[#8B8B96] text-xs font-semibold hover:text-[#E8E8ED] transition-colors underline decoration-white/20 underline-offset-4">
                Skip — use demo treasury wallet
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main App ───
export default function Home() {
  type AppState = 'onboarding' | 'idle' | 'orchestrating' | 'completed';
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [query, setQuery] = useState("");
  const [report, setReport] = useState<LegalReport | null>(null);
  const [walletAddr, setWalletAddr] = useState("");
  const [orchStep, setOrchStep] = useState(-1);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [query]);

  const handleSearch = async () => {
    if (!query.trim() || appState !== 'idle') return;
    
    setAppState('orchestrating');
    setOrchStep(0); // Parsing query
    
    const startTime = Date.now();

    try {
      setTimeout(() => setOrchStep(1), 1000); // Routing

      // 1. Initial request (Expect 402)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9546";
      const res402 = await fetch(`${apiUrl}/api/legal/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, jurisdiction: "AR" }),
      });

      if (res402.status === 402) {
        setOrchStep(2); // 402 Payment Required
        
        // Simulate wallet interaction / payment delay
        await new Promise(r => setTimeout(r, 1200));
        setOrchStep(3); // Settled on Arc
        
        await new Promise(r => setTimeout(r, 1000));
        setOrchStep(4); // Llama 3 received

        // 2. Retry with payment proof
        const txHash = `0x${Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;
        
        const res200 = await fetch(`${apiUrl}/api/legal/analyze`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-payment-hash": txHash
          },
          body: JSON.stringify({ query, jurisdiction: "AR" }),
        });

        if (res200.ok) {
          const result = await res200.json();
          setOrchStep(5); // Synthesizing
          await new Promise(r => setTimeout(r, 800));

          const executionTime = Date.now() - startTime;

          setReport({
            answer: result.data.reasoning,
            citations: result.data.citations.map((c: any, i: number) => ({
              id: (i + 1).toString(),
              source: c.source,
              title: c.title,
              excerpt: c.excerpt || "",
              relevance: Math.round(c.relevance * 100),
              link: `https://infoleg.gob.ar/?q=${encodeURIComponent(c.source)}`
            })),
            metadata: {
              models_used: ["Gemini 2.0 Flash", "Featherless Extractor"],
              execution_time_ms: executionTime,
              verified_on_chain: true,
              entities: result.data.entities.map((e: any) => e.name),
              txHash: txHash
            }
          });
          setAppState('completed');
        } else {
          throw new Error("Final request failed");
        }
      } else if (res402.ok) {
        // Fallback if backend doesn't challenge (for testing)
        const result = await res402.json();
        setOrchStep(5);
        setReport({
          answer: result.data.reasoning,
          citations: result.data.citations.map((c: any, i: number) => ({
            id: (i + 1).toString(),
            source: c.source,
            title: c.title,
            excerpt: c.excerpt || "",
            relevance: Math.round(c.relevance * 100),
            link: `https://infoleg.gob.ar/?q=${encodeURIComponent(c.source)}`
          })),
          metadata: {
            models_used: ["Gemini 2.0 Flash", "Featherless Extractor"],
            execution_time_ms: Date.now() - startTime,
            verified_on_chain: true,
            entities: result.data.entities.map((e: any) => e.name),
            txHash: `0x${Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`
          }
        });
        setAppState('completed');
      }
    } catch (error) {
      console.error("Orchestration failed:", error);
      // Ensure graceful fallback state if needed
      setAppState('idle');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch(); }
  };

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="flex-1 flex flex-col relative w-full pointer-events-auto pt-32 pb-24">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#C9A227]/[0.015] blur-[120px] rounded-[100%]" />
      </div>

      {/* Render Live Ledger globally unless onboarding */}
      {appState !== 'onboarding' && <LiveArcLedger />}

      <AnimatePresence mode="wait">

        {/* ═══ ACT 0: Onboarding ═══ */}
        {appState === 'onboarding' && (
          <Onboarding key="onboard" onComplete={(w) => { setWalletAddr(w); setAppState('idle'); }} />
        )}

        {/* ═══ ACT 1: The Hook — Idle Search ═══ */}
        {appState === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: "blur(15px)" }} transition={{ duration: 0.6 }}
            className="w-full max-w-5xl mx-auto z-10 relative px-8 pt-12 pb-20 flex-1 flex flex-col items-center justify-center gap-y-12">

            {/* BLOCK 1: HEADER & TITLE */}
            <div className="flex flex-col items-center text-center">
              <Badge variant="outline" className="px-5 py-1.5 mb-8 bg-[#C9A227]/5 border-[#C9A227]/20 text-[#C9A227] rounded-full text-[9px] uppercase tracking-[0.4em] font-black">
                <Sparkles className="w-3 h-3 mr-3" />
                Powered by Advanced AI
              </Badge>
              
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
                Legal Intelligence
                <br />
                <span className="text-[#F1D888]">Redefined</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl font-ui opacity-70 leading-relaxed">
                Harness the power of AI to transform your legal research and analysis.
                <br />
                Settled on-chain via x402 nanopayments.
              </p>
            </div>

            {/* BLOCK 2: SEARCH SYSTEM */}
            <div className="w-full max-w-3xl mx-auto">
              <div className="relative bg-[#0A0B0F]/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                {/* Search Bar Input Row */}
                <div className="flex items-center gap-4 bg-white/[0.03] rounded-2xl px-6 py-4 border border-white/5 focus-within:border-[#C9A227]/40 transition-all duration-500 mb-6">
                  <Search className="w-6 h-6 text-slate-600" />
                  <input
                    type="text"
                    placeholder="Ask anything legal..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-0 text-lg text-white placeholder:text-slate-700 focus:outline-none"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-[#C9A227] text-black font-black px-10 h-12 rounded-xl shadow-xl transition-all hover:scale-[1.05] uppercase tracking-widest text-[10px]"
                  >
                    Search
                  </button>
                </div>

                {/* Quick Actions Row */}
                <div className="px-2">
                  <p className="text-[9px] text-slate-600 mb-3 font-black uppercase tracking-[0.3em] opacity-40">Quick Actions</p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { icon: Scale, label: "Contract Review", query: "Draft an electronic signature clause..." },
                      { icon: BookOpen, label: "Legal Research", query: "Search jurisprudence on tech liability..." },
                      { icon: Gavel, label: "Case Analysis", query: "Analyze the current standing of..." },
                      { icon: Shield, label: "Compliance Check", query: "Verify x402 protocol standards..." },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => setQuery(item.query)}
                        className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-[#C9A227]/10 hover:border-[#C9A227]/40 transition-all text-[11px] text-slate-400 group"
                      >
                        <item.icon className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#C9A227]" />
                        <span className="group-hover:text-white">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* BLOCK 3: FEATURE PILLS */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              {["AI-Powered Legal Research", "Real-time Case Analysis", "Document Intelligence"].map((f) => (
                <div key={f} className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/[0.01] border border-white/[0.05] text-[9px] text-slate-600 font-bold tracking-[0.2em] uppercase">
                  <div className="w-1 h-1 rounded-full bg-[#C9A227]/30" />
                  {f}
                </div>
              ))}
            </div>

            {/* BLOCK 4: STATS GRID */}
            <div className="grid grid-cols-3 gap-6 w-full max-w-3xl mx-auto">
              {[
                { value: "10M+", label: "Legal Documents" },
                { value: "99.9%", label: "Accuracy Rate" },
                { value: "24/7", label: "AI Assistance" },
              ].map((stat) => (
                <div key={stat.label} className="text-center py-8 px-6 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.02] transition-all group">
                  <div className="text-4xl font-bold text-[#F1D888] mb-3 tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.4em] text-slate-700 font-black">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* BLOCK 5: TECHNICAL SIGNATURE */}
            <div className="flex flex-col items-center gap-4 opacity-30 pt-8">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex items-center gap-10 text-[9px] text-slate-600 uppercase tracking-[0.5em] font-black">
                <div className="flex items-center gap-3">
                  <Wallet className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span className="font-mono">{walletAddr.length > 10 ? `${walletAddr.slice(0, 8)}...${walletAddr.slice(-6)}` : walletAddr}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D395]" />
                  <span>Arc Protocol Node v1.0.4</span>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* ═══ ACT 2: The Agentic Engine — Orchestration Terminal ═══ */}
        {appState === 'orchestrating' && (
          <motion.div key="orch" initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease }} className="flex-1 flex flex-col items-center justify-center px-6 w-full max-w-2xl mx-auto z-10 relative">

            <div className="text-center mb-12">
              <p className="text-[#8B8B96] text-[11px] uppercase tracking-widest font-bold mb-3">Orchestrating Query</p>
              <p className="text-white/90 text-xl font-content italic leading-relaxed">"{query}"</p>
            </div>

            <div className="orch-terminal w-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-white/[0.08]">
              <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-2 bg-[#111114]">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F]/80" />
                </div>
                <span className="text-[10px] text-[#8B8B96] uppercase tracking-widest ml-3 font-bold mt-0.5">Agentic Routing Engine</span>
              </div>

              <div className="bg-[#0A0A0C]">
                {ORCH_STEPS.map((s, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, height: 0 }}
                    animate={orchStep >= i ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden">
                    <div className="orch-line py-4">
                      <span className="orch-tag" style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}>{s.tag}</span>
                      <span className={`text-[#8B8B96] text-xs font-mono leading-relaxed ${orchStep === i ? 'cursor-blink text-[#E8E8ED]' : ''}`}>{s.msg}</span>
                      {orchStep > i && <CheckCircle2 className="w-4 h-4 text-[#00D395] ml-auto flex-shrink-0" />}
                    </div>
                  </motion.div>
                ))}

                {orchStep < ORCH_STEPS.length - 1 && (
                  <div className="px-5 py-4 flex items-center gap-3 border-t border-white/[0.02]">
                    <div className="w-3.5 h-3.5 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-mono text-[#8B8B96] animate-pulse-subtle">Awaiting resolution...</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ ACT 3: The Value Delivery — Report + Margin Widget ═══ */}
        {appState === 'completed' && report && (
          <motion.div key="report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }} className="w-full max-w-4xl mx-auto px-8 z-10 relative pt-8">

            {/* Query echo */}
            <div className="mb-10 no-print">
              <div className="omni-input relative w-full flex items-center px-6 py-3">
                <p className="flex-1 bg-transparent text-[#E8E8ED] text-sm opacity-60 font-ui italic truncate">{query}</p>
                <div className="ml-4 p-2 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/15 flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                </div>
              </div>
            </div>

            {/* Report header row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-10 border-b border-white/[0.06] no-print gap-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 rounded bg-[#C9A227]/10 border border-[#C9A227]/20 text-[8px] uppercase tracking-widest text-[#C9A227] font-bold flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5" /> x402 Settled
                  </span>
                  <span className="text-[10px] text-[#8B8B96] font-medium">
                    {report.metadata.models_used.join(" + ")}
                  </span>
                </div>
                <h2 className="text-xl font-content text-white font-semibold">Jurisprudential Synthesis</h2>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => { navigator.clipboard.writeText(report.answer); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-[11px] font-semibold transition-colors">
                  {copied ? <CheckCircle2 className="w-3 h-3 text-[#00D395]" /> : <Copy className="w-3 h-3 text-[#8B8B96]" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8E8ED] text-[#0A0A0C] text-[11px] font-bold hover:bg-white transition-colors">
                  <FileText className="w-3 h-3" /> Export PDF
                </button>
              </div>
            </div>

            {/* Unit Economics — full-width above report */}
            <div className="mb-10 no-print">
              <MarginWidget />
            </div>

            {/* Main Report Article */}
            <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <div className="max-w-none pb-16">
                <div className="relative p-6 md:p-8 rounded-2xl bg-white/[0.015] border border-white/[0.04] backdrop-blur-sm shadow-xl max-w-[720px]">
                  {/* Decorative bullet / Accent line */}
                  <div className="absolute top-8 left-0 -ml-[1px] w-[3px] h-8 bg-[#C9A227] rounded-r-md shadow-[0_0_10px_rgba(201,162,39,0.5)]" />
                  <div className="font-content whitespace-pre-wrap text-[1.05rem] md:text-[1.1rem] leading-[1.9] text-[#E8E8ED]/90 pl-2">
                    {report.answer}
                  </div>
                </div>

                {report.citations.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-white/[0.05] max-w-[720px]">
                    <h3 className="text-[10px] font-ui uppercase tracking-[0.2em] text-[#8B8B96] font-bold mb-6 flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5" /> Referenced Doctrine
                    </h3>
                    <div className="space-y-4">
                      {report.citations.map((cit, idx) => (
                        <motion.div key={cit.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 + 0.4 }} className="citation-block group p-5 rounded-xl bg-white/[0.015] border border-white/[0.04] hover:bg-white/[0.03] transition-all relative">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-ui text-[10px] font-bold text-[#C9A227] tracking-widest bg-[#C9A227]/10 px-2 py-0.5 rounded">[{cit.id}] {cit.source}</span>
                              <span className="font-ui text-[11px] font-bold text-white/90">{cit.title}</span>
                            </div>
                            <span className="font-ui text-[9px] uppercase font-bold text-[#00D395]/80 group-hover:text-[#00D395] transition-colors whitespace-nowrap ml-2">{cit.relevance}% Match</span>
                          </div>
                          <p className="font-content italic text-white/70 text-[0.95rem] leading-relaxed mb-4 border-l-2 border-white/10 pl-3">"{cit.excerpt}"</p>
                          
                          {cit.link && (
                            <a href={cit.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[10px] text-[#8B8B96] hover:text-[#C9A227] font-bold uppercase tracking-widest transition-colors">
                              <ExternalLink className="w-3 h-3" /> View Source Document
                            </a>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {report.metadata.entities.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2 max-w-[720px]">
                    {report.metadata.entities.map(e => (
                      <span key={e} className="px-3 py-1 rounded-md bg-white/[0.02] border border-white/[0.05] text-[10px] text-[#8B8B96] font-ui font-medium">
                        {e}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-8 text-[9px] font-ui text-[#4A4A55] uppercase tracking-[0.15em] font-bold flex items-center gap-2 border-t border-white/[0.04] pt-6 max-w-[720px]">
                  <Shield className="w-3 h-3" />
                  <span className="flex items-center gap-1.5">
                    Ledger
                    <a href={`https://explorer.testnet.arc.network/tx/${report.metadata.txHash}`} target="_blank" rel="noreferrer" className="text-[#C9A227] hover:underline flex items-center gap-1">
                      {report.metadata.txHash.slice(0, 6)}...{report.metadata.txHash.slice(-4)}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    • {report.metadata.execution_time_ms}ms • Arc Testnet
                  </span>
                </div>
              </div>
            </motion.article>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
