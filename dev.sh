#!/usr/bin/env bash
# ─────────────────────────────────────────────
#  CodeReview AI — Entorno de desarrollo local
# ─────────────────────────────────────────────
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${BOLD}${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║   CodeReview AI — Dev Server         ║${NC}"
echo -e "${BOLD}${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# ── 1. Comprobar Node.js ───────────────────────
if ! command -v node &>/dev/null; then
  echo -e "${RED}✗ Node.js no encontrado. Instala Node 18+${NC}"
  exit 1
fi
NODE_VER=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VER}${NC}"

# ── 2. Comprobar .env.local ────────────────────
if [ ! -f ".env.local" ]; then
  echo -e "${RED}✗ .env.local no encontrado${NC}"
  echo -e "  Copia .env.example y rellena las claves"
  exit 1
fi
echo -e "${GREEN}✓ .env.local encontrado${NC}"

# ── 3. Validar variables de entorno críticas ───
REQUIRED_VARS=(
  "ANTHROPIC_API_KEY"
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
  "STRIPE_SECRET_KEY"
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  "RESEND_API_KEY"
)

MISSING=0
for VAR in "${REQUIRED_VARS[@]}"; do
  VALUE=$(grep "^${VAR}=" .env.local | cut -d '=' -f2-)
  if [ -z "$VALUE" ] || [ "$VALUE" = "PENDIENTE" ] || [[ "$VALUE" == *"PENDIENTE"* ]]; then
    echo -e "${YELLOW}⚠ ${VAR} — falta o sin configurar${NC}"
    MISSING=$((MISSING + 1))
  else
    # Mask the value for display
    MASKED="${VALUE:0:8}..."
    echo -e "${GREEN}✓ ${VAR} = ${MASKED}${NC}"
  fi
done

if [ $MISSING -gt 0 ]; then
  echo ""
  echo -e "${YELLOW}⚠ ${MISSING} variable(s) sin configurar. Algunas funciones pueden fallar.${NC}"
fi

# ── 4. Comprobar node_modules ──────────────────
echo ""
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}→ node_modules no encontrado. Instalando dependencias...${NC}"
  npm install
  echo -e "${GREEN}✓ Dependencias instaladas${NC}"
else
  echo -e "${GREEN}✓ node_modules presente${NC}"
fi

# ── 5. Comprobar puerto 3000 ───────────────────
if command -v lsof &>/dev/null; then
  if lsof -i:3000 -t &>/dev/null; then
    echo -e "${YELLOW}⚠ Puerto 3000 ocupado. Next.js usará 3001 u otro disponible${NC}"
  else
    echo -e "${GREEN}✓ Puerto 3000 libre${NC}"
  fi
fi

# ── 6. Mostrar rutas principales ───────────────
echo ""
echo -e "${CYAN}${BOLD}Rutas disponibles:${NC}"
echo -e "  ${CYAN}http://localhost:3000${NC}           → Landing"
echo -e "  ${CYAN}http://localhost:3000/dashboard${NC}  → Dashboard"
echo -e "  ${CYAN}http://localhost:3000/blog${NC}       → Blog"
echo -e "  ${CYAN}http://localhost:3000/admin${NC}      → Admin (requiere is_admin=true)"
echo -e "  ${CYAN}http://localhost:3000/pricing${NC}    → Precios"
echo -e "  ${CYAN}http://localhost:3000/comparar${NC}   → Comparativa"
echo -e "  ${CYAN}http://localhost:3000/account${NC}    → Área personal"
echo ""
echo -e "${BOLD}Arrancando servidor...${NC}"
echo -e "  Ctrl+C para parar"
echo ""

# ── 7. Arrancar Next.js ────────────────────────
npm run dev
