# JaaS — System Architecture

> **Jurisprudence-as-a-Service**: An agentic economy platform on Arc that charges
> sub-cent USDC micropayments for AI-powered legal reasoning.

---

## High-Level Architecture

```
┌────────────────────┐     x402 Payment      ┌──────────────────────┐
│                    │    ─────────────────►   │                      │
│   Client (Next.js) │                        │   Server (Express)   │
│   Premium Legal UI │    ◄─────────────────   │   + x402 Middleware  │
│   Glassmorphism    │     Legal Analysis     │                      │
└────────────────────┘                        └──────────┬───────────┘
                                                         │
                                              ┌──────────┴───────────┐
                                              │                      │
                                    ┌─────────▼────────┐  ┌─────────▼────────┐
                                    │   Orchestrator   │  │  Circle Gateway  │
                                    │   (Gemini 3 Pro) │  │  (x402 / USDC)   │
                                    └─────────┬────────┘  └──────────────────┘
                                              │
                                    ┌─────────▼────────┐
                                    │   Sub-Agents     │
                                    │  (Featherless)   │
                                    │  Entity Extract  │
                                    └──────────────────┘
```

## Payment Flow (x402 Protocol)

1. Client sends legal query to `POST /api/legal/analyze`
2. Server responds with `402 Payment Required` + payment instructions
3. Client signs USDC micropayment ($0.01) on Arc testnet
4. Client re-sends request with payment proof in headers
5. x402 middleware verifies on-chain payment via Circle
6. Orchestrator processes the legal query
7. Server returns structured legal analysis

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 | Premium legal analysis interface |
| Backend | Express + TypeScript | API server with x402 middleware |
| Orchestrator | Gemini 3 Pro | Legal reasoning engine |
| Sub-Agents | Featherless AI | Entity extraction (laws, courts, dates) |
| Payments | Circle + x402 | USDC micropayments on Arc |
| Validation | Zod | Input sanitization (RULE 10) |
| Blockchain | Arc Testnet | On-chain payment settlement |

## Security Model

- **RULE 3**: Fail-fast error handling — no silent fallbacks
- **RULE 8**: Zero credential leakage — all keys via `.env`
- **RULE 10**: Zod input sanitization — prevents prompt injection
- **RULE 19**: Rate limiting with exponential backoff
- **RULE 26**: Token usage tracking for cost analysis
