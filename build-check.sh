#!/usr/bin/env bash
# ─────────────────────────────────────────────
#  CodeReview AI — Build check (TypeScript + lint)
#  Detecta errores antes de desplegar
# ─────────────────────────────────────────────
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${BOLD}${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║   CodeReview AI — Build Check        ║${NC}"
echo -e "${BOLD}${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# ── TypeScript ─────────────────────────────────
echo -e "${BOLD}1. TypeScript type check...${NC}"
if npx tsc --noEmit 2>&1; then
  echo -e "${GREEN}✓ Sin errores de TypeScript${NC}"
else
  echo -e "${RED}✗ Errores de TypeScript encontrados${NC}"
  exit 1
fi

echo ""

# ── Next.js build ──────────────────────────────
echo -e "${BOLD}2. Next.js build...${NC}"
echo -e "${YELLOW}  (puede tardar 1-2 minutos)${NC}"
echo ""

if npm run build 2>&1; then
  echo ""
  echo -e "${GREEN}${BOLD}✓ Build exitoso — listo para desplegar${NC}"
else
  echo ""
  echo -e "${RED}${BOLD}✗ Build fallido — revisa los errores arriba${NC}"
  exit 1
fi

echo ""
echo -e "${BOLD}Para iniciar en producción local:${NC}"
echo -e "  npm start"
echo ""
