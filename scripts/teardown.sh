#!/usr/bin/env bash
# ============================================
# JaaS — Teardown Protocol (RULE 27)
# Post-hackathon cleanup script.
# Revokes local tokens and warns about
# active AI/ML API subscriptions.
# Usage: npm run teardown
# ============================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DOCS_DIR="$PROJECT_ROOT/docs"
LOG_FILE="$DOCS_DIR/teardown-log.md"

RED='\033[1;31m'
YELLOW='\033[1;33m'
GREEN='\033[1;32m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo ""
echo -e "${RED}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║                                                            ║${NC}"
echo -e "${RED}║   ⚠️  JaaS TEARDOWN PROTOCOL — POST-HACKATHON CLEANUP      ║${NC}"
echo -e "${RED}║                                                            ║${NC}"
echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Clear local .env credentials
echo -e "${YELLOW}[1/4] Clearing local credentials...${NC}"
if [ -f "$PROJECT_ROOT/.env" ]; then
  cp "$PROJECT_ROOT/.env" "$PROJECT_ROOT/.env.backup.$(date +%s)"
  echo "  → Backed up .env before clearing"
  # Replace values with placeholders
  sed -i 's/=.*/=REVOKED_BY_TEARDOWN/' "$PROJECT_ROOT/.env"
  echo -e "  ${GREEN}✓ .env credentials revoked${NC}"
else
  echo "  → No .env file found (already clean)"
fi

# Step 2: Clear node_modules cache
echo ""
echo -e "${YELLOW}[2/4] Clearing build artifacts and caches...${NC}"
if [ -d "$PROJECT_ROOT/node_modules" ]; then
  rm -rf "$PROJECT_ROOT/node_modules"
  echo -e "  ${GREEN}✓ node_modules removed${NC}"
fi
if [ -d "$PROJECT_ROOT/server/dist" ]; then
  rm -rf "$PROJECT_ROOT/server/dist"
  echo -e "  ${GREEN}✓ server/dist removed${NC}"
fi
if [ -d "$PROJECT_ROOT/client/.next" ]; then
  rm -rf "$PROJECT_ROOT/client/.next"
  echo -e "  ${GREEN}✓ client/.next removed${NC}"
fi

# Step 3: Display cancellation checklist
echo ""
echo -e "${RED}[3/4] ⚠️  CRITICAL: MANUAL CANCELLATION REQUIRED${NC}"
echo ""
echo -e "${RED}  ┌─────────────────────────────────────────────────────────┐${NC}"
echo -e "${RED}  │  You MUST manually cancel these services to avoid      │${NC}"
echo -e "${RED}  │  post-hackathon charges:                               │${NC}"
echo -e "${RED}  │                                                        │${NC}"
echo -e "${RED}  │  [ ] Circle Developer Console                         │${NC}"
echo -e "${RED}  │      → https://console.circle.com/api-keys            │${NC}"
echo -e "${RED}  │      → Revoke API keys and entity secrets             │${NC}"
echo -e "${RED}  │                                                        │${NC}"
echo -e "${RED}  │  [ ] Featherless AI                                   │${NC}"
echo -e "${RED}  │      → https://featherless.ai/dashboard               │${NC}"
echo -e "${RED}  │      → Cancel inference credit subscriptions          │${NC}"
echo -e "${RED}  │                                                        │${NC}"
echo -e "${RED}  │  [ ] Google AI Studio / Gemini API                    │${NC}"
echo -e "${RED}  │      → https://aistudio.google.com/apikey             │${NC}"
echo -e "${RED}  │      → Delete or disable API key billing              │${NC}"
echo -e "${RED}  │                                                        │${NC}"
echo -e "${RED}  │  [ ] AI/ML API                                        │${NC}"
echo -e "${RED}  │      → Review your provider dashboard                 │${NC}"
echo -e "${RED}  │      → Cancel any active subscriptions                │${NC}"
echo -e "${RED}  │                                                        │${NC}"
echo -e "${RED}  │  [ ] Figma Personal Access Token                      │${NC}"
echo -e "${RED}  │      → https://www.figma.com/settings                 │${NC}"
echo -e "${RED}  │      → Revoke the JaaS token                         │${NC}"
echo -e "${RED}  └─────────────────────────────────────────────────────────┘${NC}"
echo ""

# Step 4: Log teardown event
echo -e "${YELLOW}[4/4] Logging teardown event...${NC}"
mkdir -p "$DOCS_DIR"
cat >> "$LOG_FILE" << EOF

## Teardown Event

- **Timestamp**: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
- **Local Time**: $(date +"%Y-%m-%d %H:%M:%S %Z")
- **User**: $(whoami)
- **Machine**: $(hostname)
- **Status**: Credentials revoked, caches cleared, manual cancellation pending

EOF
echo -e "  ${GREEN}✓ Event logged to docs/teardown-log.md${NC}"

echo ""
echo -e "${RED}══════════════════════════════════════════════════════════════${NC}"
echo -e "${RED}  ALERT: Remember to cancel any active AI/ML API            ${NC}"
echo -e "${RED}  subscriptions to avoid post-hackathon charges.            ${NC}"
echo -e "${RED}══════════════════════════════════════════════════════════════${NC}"
echo ""
