# JaaS — Jurisprudence-as-a-Service

> **Agentic Economy on Arc**: AI-powered legal reasoning with sub-cent USDC micropayments.

[![Built for](https://img.shields.io/badge/Hackathon-Agentic%20Economy%20on%20Arc-blueviolet)]()
[![Payments](https://img.shields.io/badge/Payments-Circle%20x402-00D395)]()
[![AI](https://img.shields.io/badge/AI-Gemini%203%20Pro-4285F4)]()

---

## What is JaaS?

JaaS is a **Jurisprudence-as-a-Service** platform that enables AI agents (and humans)
to access sophisticated legal analysis through micropayments. Each query costs
≤ $0.01 USDC, settled on the **Arc blockchain** using the **x402 protocol**.

### Key Features

- **x402 Nanopayments** — Pay-per-query legal reasoning at $0.01 USDC
- **Multi-Agent Architecture** — Gemini 3 Pro orchestrates, Featherless extracts entities
- **Premium Legal UI** — Neo-skeuomorphic, glassmorphism interface
- **Immutable API** — JSON schemas that never break downstream consumers

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- Circle Developer Console account (Sandbox)

### Setup

```bash
# Clone and install
git clone <repository-url>
cd JaaS
cp .env.example .env
# Fill in your API keys in .env

# Install dependencies
npm install

# Validate environment
npm run validate-env

# Start the server
npm run dev:server
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev:server` | Start Express backend in dev mode |
| `npm run dev:client` | Start Next.js frontend in dev mode |
| `npm run validate-env` | Check all required environment variables |
| `npm run build` | Build all workspaces for production |
| `npm run test` | Run test suites |
| `npm run teardown` | Post-hackathon cleanup (RULE 27) |

## Architecture

See [docs/architecture.md](docs/architecture.md) for the full system design.

## Environment Variables

See [.env.example](.env.example) for the complete list of required credentials.

> ⚠️ **Never commit `.env`** — all secrets are loaded at runtime per RULE 8.

## License

Built for the **Agentic Economy on Arc** hackathon.
