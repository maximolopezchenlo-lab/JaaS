/**
 * JaaS — Immutable Constants
 * Arc blockchain and protocol configuration values.
 * These are public, non-secret values safe to commit.
 */

// Arc Testnet RPC
export const ARC_TESTNET_RPC = "https://rpc.testnet.arc.network";

// USDC Contract on Arc (ERC-20)
export const USDC_CONTRACT_ADDRESS =
  "0x3600000000000000000000000000000000000000";
export const USDC_DECIMALS = 6;
export const NATIVE_GAS_DECIMALS = 18;

// Circle Faucet (for testnet USDC)
export const CIRCLE_FAUCET_URL = "https://faucet.circle.com/";

// x402 Protocol
export const X402_STATUS_CODE = 402;
export const DEFAULT_MICROPAYMENT_USDC = 0.01; // $0.01 per legal query

// Featherless AI
export const FEATHERLESS_API_BASE = "https://api.featherless.ai/v1";
export const FEATHERLESS_MODELS_ENDPOINT = "/v1/models";

// AI/ML API
export const AIML_API_BASE = "https://api.aimlapi.com/v1";

// Server Defaults
export const DEFAULT_PORT = 9546;
export const API_PREFIX = "/api";

// Token Usage Tracking (RULE 26)
export const MAX_INPUT_TOKENS = 4096;
export const MAX_OUTPUT_TOKENS = 2048;

// Rate Limiting (RULE 19)
export const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 30;
export const BACKOFF_BASE_MS = 1000;
export const BACKOFF_MAX_MS = 32_000;
