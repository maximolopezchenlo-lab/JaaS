"use client";

import React, { useEffect, useState } from "react";

interface PaymentOverlayProps {
  amountAtomic: string;
  network: string;
  payTo: string;
  onSuccess: (paymentHash: string) => void;
  onCancel: () => void;
}

export function PaymentOverlay({ amountAtomic, network, payTo, onSuccess, onCancel }: PaymentOverlayProps) {
  const [status, setStatus] = useState<"pending" | "settling" | "success">("pending");

  const handlePay = () => {
    setStatus("settling");
    
    // Simulate Arc Network settlement (2.5 seconds per RULE 13 & 7)
    setTimeout(() => {
      setStatus("success");
      // Simulate confirmation before closing the overlay
      setTimeout(() => {
        onSuccess(`0x${Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')}`);
      }, 800);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="glass glass-card max-w-md w-full relative">
        <button 
          onClick={onCancel}
          disabled={status !== "pending"}
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-white disabled:opacity-30"
        >
          ✕
        </button>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-[var(--surface-hover)] rounded-full flex items-center justify-center border border-[var(--border)]">
            <span className="text-3xl text-[var(--accent)]">◈</span>
          </div>
          
          <h2 className="text-2xl mb-2">x402 Payment Required</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            This premium jurisprudence resource requires a nanopayment to proceed.
          </p>

          <div className="bg-black/50 p-4 rounded-lg mb-6 border border-[var(--border)] text-left">
            <div className="flex justify-between mb-2">
              <span className="text-[var(--text-dim)] uppercase text-xs font-bold tracking-widest">Network</span>
              <span className="text-[var(--text-primary)] text-sm">{network}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[var(--text-dim)] uppercase text-xs font-bold tracking-widest">Amount</span>
              <span className="text-[var(--accent)] font-bold">{Number(amountAtomic) / 1000000} USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-dim)] uppercase text-xs font-bold tracking-widest">Pay To</span>
              <span className="text-[var(--text-primary)] text-xs truncate max-w-[150px]">{payTo || "0x..."}</span>
            </div>
          </div>

          <button 
            onClick={handlePay}
            disabled={status !== "pending"}
            className="btn-premium w-full flex items-center justify-center gap-2"
          >
            {status === "pending" && "Approve in Arc Wallet"}
            {status === "settling" && (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                Settling on Arc Testnet...
              </>
            )}
            {status === "success" && "Payment Confirmed ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}
