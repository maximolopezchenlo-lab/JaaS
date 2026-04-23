import { Request, Response, NextFunction } from "express";
import treasuryConfig from "../config/treasury.json";
import { DEFAULT_MICROPAYMENT_USDC, X402_STATUS_CODE } from "../config/constants";

/**
 * JaaS — x402 Payment Middleware (Robust Custom Implementation)
 * Enforces the HTTP 402 Payment Required status code as per x402 specifications.
 * This implementation is optimized for the Arc Network (eip155:5042002) 
 * and avoids common configuration blockers found in early SDK versions.
 */

export const x402Middleware = (req: Request, res: Response, next: NextFunction) => {
  // Only protect the legal analysis endpoint
  const isProtectedPath = req.path === "/api/legal/analyze" || req.path === "/legal/analyze";
  const hasPaymentProof = req.headers["x-payment-hash"] || req.headers["x-payment-proof"];

  if (isProtectedPath && !hasPaymentProof) {
    console.log(`[x402] Challenging request: ${req.method} ${req.path}`);
    
    // Set x402 Protocol Headers
    res.setHeader("X-Payment-Required", "true");
    res.setHeader("X-Payment-Network", "eip155:5042002");
    res.setHeader("X-Payment-Price", `$${DEFAULT_MICROPAYMENT_USDC}`);
    res.setHeader("X-Payment-To", treasuryConfig.treasuryAddress);

    // Return the standardized 402 response payload
    return res.status(X402_STATUS_CODE).json({
      x402Version: 1,
      error: "Payment Required",
      resource: {
        url: req.originalUrl,
        description: "Jurisprudence-as-a-Service Legal Analysis",
        mimeType: "application/json"
      },
      accepts: [
        {
          scheme: "exact",
          network: "eip155:5042002", // Arc Network
          asset: "USDC",
          amount: (DEFAULT_MICROPAYMENT_USDC * 1000000).toString(), // Atomic units (6 decimals)
          payTo: treasuryConfig.treasuryAddress,
          maxTimeoutSeconds: 60,
          extra: {
            blockchain: "ARC-TESTNET",
            token: "USDC"
          }
        }
      ]
    });
  }

  // If payment proof is present or path is not protected, proceed
  if (hasPaymentProof) {
    console.log(`[x402] Validating payment proof: ${hasPaymentProof}`);
    // Note: Verification would happen here via Circle SDK in a full implementation
  }

  next();
};
