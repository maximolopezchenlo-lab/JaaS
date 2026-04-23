import { Router, Request, Response } from "express";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { HealthResponse } from "../schemas/response";

/**
 * JaaS — Health Check Route
 * GET /api/health
 * Returns service status and dependency connectivity.
 */

const router = Router();
const startTime = Date.now();

router.get("/health", async (_req: Request, res: Response) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  const response: HealthResponse = {
    success: true,
    data: {
      status: "healthy",
      version: "1.0.0",
      uptime: uptimeSeconds,
      services: {
        circle: env.CIRCLE_API_KEY ? "unchecked" : "error",
        gemini: env.GEMINI_API_KEY ? "unchecked" : "error",
        featherless: env.FEATHERLESS_API_KEY ? "unchecked" : "error",
        aiml: env.AIML_API_KEY ? "unchecked" : "error",
      },
    },
    timestamp: new Date().toISOString(),
  };

  logger.info("Health check requested", { uptime: uptimeSeconds });
  res.status(200).json(response);
});

export default router;
