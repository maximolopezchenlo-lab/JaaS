import { z } from "zod";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env from the monorepo root (one level up from /server)
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

/**
 * Zod schema for environment validation.
 * RULE 3: Fail-fast — if any required variable is missing, the server
 * crashes immediately with a structured error instead of failing silently.
 * RULE 8: All credentials are loaded exclusively from .env.
 */
const envSchema = z.object({
  // Circle Web3
  CIRCLE_API_KEY: z
    .string()
    .min(1, "CIRCLE_API_KEY is required for x402 payment verification"),
  CIRCLE_ENTITY_SECRET: z
    .string()
    .length(64, "CIRCLE_ENTITY_SECRET must be a 64-character hex string"),

  // AI Models
  FEATHERLESS_API_KEY: z
    .string()
    .min(1, "FEATHERLESS_API_KEY is required for sub-agent extraction"),
  GEMINI_API_KEY: z
    .string()
    .min(1, "GEMINI_API_KEY is required for the orchestrator agent"),
  AIML_API_KEY: z
    .string()
    .min(1, "AIML_API_KEY is required for AI/ML API access"),

  // Figma (optional at runtime — only needed during design phase)
  FIGMA_PERSONAL_ACCESS_TOKEN: z.string().optional(),

  // Server
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(9546),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables.
 * Throws a structured ZodError with per-field messages on failure.
 */
function loadEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formattedErrors = result.error.issues
      .map((issue) => `  ✗ ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    console.error(
      [
        "",
        "╔══════════════════════════════════════════════════════════╗",
        "║  FATAL: Environment Validation Failed (RULE 3/8)       ║",
        "╚══════════════════════════════════════════════════════════╝",
        "",
        formattedErrors,
        "",
        "Action: Copy .env.example to .env and fill in all values.",
        "",
      ].join("\n")
    );

    process.exit(1);
  }

  return result.data;
}

export const env = loadEnv();
