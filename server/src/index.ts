import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { API_PREFIX } from "./config/constants";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";
import healthRouter from "./routes/health";

/**
 * JaaS — Server Entry Point
 * Bootstraps Express with security middleware, routes, and
 * the global error handler. Env validation happens at import
 * time via config/env.ts (fail-fast per RULE 3).
 */

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Routes
app.use(API_PREFIX, healthRouter);

// Global error handler (RULE 3: no silent fallbacks)
app.use(errorHandler);

// Start server
const port = env.PORT;
app.listen(port, () => {
  logger.info("JaaS server started", {
    port,
    environment: env.NODE_ENV,
    apiPrefix: API_PREFIX,
    endpoints: [`GET ${API_PREFIX}/health`],
  });
});

export default app;
