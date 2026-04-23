import { z } from "zod";

/**
 * JaaS — Response Schemas
 * RULE 20: All API responses follow an immutable JSON schema.
 * External consumers (n8n workflows, third-party agents) must
 * never encounter unexpected structure changes.
 */

export const LegalAnalysisResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    analysisId: z.string().uuid(),
    query: z.string(),
    jurisdiction: z.string(),
    reasoning: z.string(),
    citations: z.array(
      z.object({
        source: z.string(),
        title: z.string(),
        relevance: z.number().min(0).max(1),
        excerpt: z.string().optional(),
      })
    ),
    entities: z.array(
      z.object({
        name: z.string(),
        type: z.enum(["person", "organization", "law", "court", "date", "concept"]),
        confidence: z.number().min(0).max(1),
      })
    ),
    tokenUsage: z.object({
      inputTokens: z.number().int(),
      outputTokens: z.number().int(),
      costUsd: z.number(),
    }),
  }),
  payment: z.object({
    transactionHash: z.string(),
    amountUsdc: z.number(),
    network: z.string(),
  }),
  timestamp: z.string().datetime(),
});

export type LegalAnalysisResponse = z.infer<typeof LegalAnalysisResponseSchema>;

export const HealthResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    status: z.enum(["healthy", "degraded"]),
    version: z.string(),
    uptime: z.number(),
    services: z.object({
      circle: z.enum(["ok", "error", "unchecked"]),
      gemini: z.enum(["ok", "error", "unchecked"]),
      featherless: z.enum(["ok", "error", "unchecked"]),
      aiml: z.enum(["ok", "error", "unchecked"]),
    }),
  }),
  timestamp: z.string().datetime(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
  timestamp: z.string().datetime(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
