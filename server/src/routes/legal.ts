import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { LegalAnalysisRequestSchema } from "../schemas/request";
import { LegalAnalysisResponse } from "../schemas/response";
import { logger } from "../utils/logger";
import { OrchestratorAgent } from "../agents/orchestrator";
import { ExtractorAgent } from "../agents/extractor";
import { env } from "../config/env";
import { legalAnalysisCache } from "../utils/cache";
import crypto from "crypto";

/**
 * JaaS — Legal Analysis Route
 * POST /api/legal/analyze
 * Protected by x402 payment protocol.
 */

const router = Router();
const extractor = new ExtractorAgent(env.FEATHERLESS_API_KEY);
const orchestrator = new OrchestratorAgent(env.AIML_API_KEY, extractor);

router.post(
  "/analyze",
  async (req: Request, res: Response) => {
    try {
      // RULE 10: Input sanitization
      const validatedBody = LegalAnalysisRequestSchema.parse(req.body);

      logger.info("Processing legal analysis request", {
        query: validatedBody.query,
        jurisdiction: validatedBody.jurisdiction,
      });

      // Cache Optimization (RULE 15)
      const cacheKey = crypto.createHash("sha256").update(`${validatedBody.query}|${validatedBody.jurisdiction}`).digest("hex");
      let analysis = legalAnalysisCache.get(cacheKey);

      if (!analysis) {
        // Execute Gemini Orchestration (RAMA 3)
        analysis = await orchestrator.analyze({
          query: validatedBody.query,
          jurisdiction: validatedBody.jurisdiction,
        });
        
        legalAnalysisCache.set(cacheKey, analysis);
      } else {
        logger.info("Served analysis from RAM cache", { cacheKey });
      }

      const response: LegalAnalysisResponse = {
        success: true,
        data: {
          analysisId: uuidv4(),
          query: validatedBody.query,
          jurisdiction: validatedBody.jurisdiction,
          reasoning: analysis.reasoning,
          citations: analysis.citations,
          entities: analysis.entities,
          tokenUsage: analysis.tokenUsage,
        },
        payment: {
          transactionHash: req.headers["x-payment-hash"] as string || "mock-hash",
          amountUsdc: 0.01,
          network: "ARC-TESTNET",
        },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      // Error handler middleware will catch this (RULE 3)
      throw error;
    }
  }
);

export default router;
