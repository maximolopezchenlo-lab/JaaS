#!/usr/bin/env bash
# ============================================
# JaaS — Environment Validator (RULE 8)
# Run before server boot to ensure all
# required credentials are present.
# Usage: npm run validate-env
# ============================================

set -euo pipefail

ENV_FILE="$(dirname "$0")/../.env"
ERRORS=0

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  JaaS — Environment Variable Validator      ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

if [ ! -f "$ENV_FILE" ]; then
  echo "  ✗ FATAL: .env file not found at $ENV_FILE"
  echo "  → Copy .env.example to .env and fill in your keys."
  exit 1
fi

# Source the .env file
set -a
source "$ENV_FILE"
set +a

check_var() {
  local var_name="$1"
  local var_value="${!var_name:-}"

  if [ -z "$var_value" ] || [[ "$var_value" == *"your_"* ]]; then
    echo "  ✗ MISSING: $var_name"
    ERRORS=$((ERRORS + 1))
  else
    # Mask the value for security
    local masked="${var_value:0:4}****${var_value: -4}"
    echo "  ✓ $var_name = $masked"
  fi
}

echo "── Circle Web3 ──"
check_var "CIRCLE_API_KEY"
check_var "CIRCLE_ENTITY_SECRET"

echo ""
echo "── AI Models ──"
check_var "FEATHERLESS_API_KEY"
check_var "GEMINI_API_KEY"
check_var "AIML_API_KEY"

echo ""
echo "── Figma ──"
check_var "FIGMA_PERSONAL_ACCESS_TOKEN"

echo ""
echo "── Server ──"
echo "  ✓ PORT = ${PORT:-9546}"
echo "  ✓ NODE_ENV = ${NODE_ENV:-development}"

echo ""
if [ "$ERRORS" -gt 0 ]; then
  echo "═══════════════════════════════════════════════"
  echo "  RESULT: $ERRORS variable(s) missing or invalid."
  echo "  The server will NOT start until these are fixed."
  echo "═══════════════════════════════════════════════"
  exit 1
else
  echo "═══════════════════════════════════════════════"
  echo "  RESULT: All environment variables validated ✓"
  echo "═══════════════════════════════════════════════"
  exit 0
fi
