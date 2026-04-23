import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger";

/**
 * JaaS — Global Error Handler Middleware
 * RULE 3: Fail-fast architecture. No silent fallbacks.
 * All errors are captured with structured logs and explicit HTTP responses.
 */

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const timestamp = new Date().toISOString();

  // Zod validation errors → 400 Bad Request
  if (err instanceof ZodError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Input validation failed (RULE 10)",
        details: err.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      },
      timestamp,
    };

    logger.warn("Input validation failed", {
      errorCount: err.issues.length,
      fields: err.issues.map((i) => i.path.join(".")),
    });

    res.status(400).json(response);
    return;
  }

  // API auth errors → 401
  if (err.message.includes("UNAUTHORIZED") || err.message.includes("API_KEY")) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: "AUTH_ERROR",
        message: "Authentication failed with external service",
      },
      timestamp,
    };

    logger.error("Authentication error", {
      errorMessage: err.message,
      stack: err.stack,
    });

    res.status(401).json(response);
    return;
  }

  // Catch-all → 500 Internal Server Error
  const response: ErrorResponse = {
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message:
        process.env.NODE_ENV === "production"
          ? "An internal error occurred"
          : err.message,
    },
    timestamp,
  };

  logger.error("Unhandled server error", {
    errorMessage: err.message,
    stack: err.stack,
  });

  res.status(500).json(response);
}
