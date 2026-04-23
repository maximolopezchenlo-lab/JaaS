import { z } from "zod";

/**
 * JaaS — Request Schemas
 * RULE 10: Strict input sanitization to prevent prompt injection
 * and excessive token consumption.
 * RULE 20: Immutable JSON schemas.
 */

export const LegalAnalysisRequestSchema = z.object({
  query: z
    .string()
    .min(10, "Legal query must be at least 10 characters")
    .max(4000, "Legal query cannot exceed 4000 characters")
    .trim(),

  jurisdiction: z
    .enum(["AR", "US", "EU", "BR", "LATAM"])
    .default("AR"),

  depth: z
    .enum(["summary", "detailed", "exhaustive"])
    .default("detailed"),

  language: z
    .enum(["en", "es"])
    .default("en"),
});

export type LegalAnalysisRequest = z.infer<typeof LegalAnalysisRequestSchema>;

export const HealthCheckRequestSchema = z.object({
  verbose: z.coerce.boolean().optional().default(false),
});

export type HealthCheckRequest = z.infer<typeof HealthCheckRequestSchema>;
