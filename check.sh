#!/usr/bin/env bash
# ─────────────────────────────────────────────
#  CodeReview AI — Health check del servidor
#  Ejecuta con el servidor arrancado: bash check.sh
# ─────────────────────────────────────────────

BASE="http://localhost:3000"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

PASS=0
FAIL=0
WARN=0

echo ""
echo -e "${BOLD}${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║   CodeReview AI — Health Check       ║${NC}"
echo -e "${BOLD}${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# Helper: check HTTP status
check_page() {
  local NAME="$1"
  local URL="$2"
  local EXPECTED="${3:-200}"

  STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "$URL" 2>/dev/null)

  if [ "$STATUS" = "$EXPECTED" ]; then
    echo -e "  ${GREEN}✓ ${NAME}${NC} ${CYAN}(${STATUS})${NC}"
    PASS=$((PASS + 1))
  elif [ "$STATUS" = "000" ]; then
    echo -e "  ${RED}✗ ${NAME}${NC} — servidor no responde (¿está arrancado?)"
    FAIL=$((FAIL + 1))
  else
    echo -e "  ${YELLOW}⚠ ${NAME}${NC} — esperaba ${EXPECTED}, recibió ${CYAN}${STATUS}${NC}"
    WARN=$((WARN + 1))
  fi
}

# Helper: check API JSON response
check_api() {
  local NAME="$1"
  local URL="$2"
  local METHOD="${3:-GET}"

  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 -X "$METHOD" \
    -H "Content-Type: application/json" "$URL" 2>/dev/null)

  if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "201" ]; then
    echo -e "  ${GREEN}✓ ${NAME}${NC} ${CYAN}(${RESPONSE})${NC}"
    PASS=$((PASS + 1))
  elif [ "$RESPONSE" = "401" ]; then
    echo -e "  ${GREEN}✓ ${NAME}${NC} — protegido correctamente ${CYAN}(401)${NC}"
    PASS=$((PASS + 1))
  elif [ "$RESPONSE" = "405" ]; then
    echo -e "  ${GREEN}✓ ${NAME}${NC} — método correcto rechazado ${CYAN}(405)${NC}"
    PASS=$((PASS + 1))
  else
    echo -e "  ${RED}✗ ${NAME}${NC} ${CYAN}(${RESPONSE})${NC}"
    FAIL=$((FAIL + 1))
  fi
}

# ── Páginas públicas ───────────────────────────
echo -e "${BOLD}Páginas públicas:${NC}"
check_page "Landing /"                  "$BASE/"
check_page "Login /login"               "$BASE/login"
check_page "Registro /signup"           "$BASE/signup"
check_page "Precios /pricing"           "$BASE/pricing"
check_page "Comparar /comparar"         "$BASE/comparar"
check_page "Blog /blog"                 "$BASE/blog"
check_page "Privacidad /privacy"        "$BASE/privacy"
check_page "Forgot password"            "$BASE/forgot-password"

echo ""
echo -e "${BOLD}Páginas protegidas (deben redirigir a login):${NC}"
check_page "Dashboard /dashboard"       "$BASE/dashboard" "307"
check_page "Cuenta /account"           "$BASE/account"   "307"
check_page "Admin /admin"              "$BASE/admin"      "307"

echo ""
echo -e "${BOLD}API routes (sin auth → 401):${NC}"
check_api  "Blog list"                  "$BASE/api/blog/list"      "GET"
check_api  "Blog generate (POST)"       "$BASE/api/blog/generate"  "POST"
check_api  "Blog publish (POST)"        "$BASE/api/blog/publish"   "POST"

echo ""
echo -e "${BOLD}API routes públicas:${NC}"

# Newsletter: espera 400 con email inválido (correcto)
NL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid"}' "$BASE/api/newsletter" 2>/dev/null)
if [ "$NL_STATUS" = "400" ]; then
  echo -e "  ${GREEN}✓ Newsletter (email inválido → 400 correcto)${NC}"
  PASS=$((PASS + 1))
else
  echo -e "  ${RED}✗ Newsletter${NC} — esperaba 400, recibió ${CYAN}${NL_STATUS}${NC}"
  FAIL=$((FAIL + 1))
fi

check_api  "Stripe checkout"            "$BASE/api/stripe/checkout" "POST"

echo ""
echo -e "${BOLD}Recursos estáticos:${NC}"
check_page "Favicon"                    "$BASE/favicon.ico"

# ── Resumen ────────────────────────────────────
echo ""
echo -e "─────────────────────────────────────"
echo -e "${BOLD}Resultado:${NC}"
echo -e "  ${GREEN}✓ OK:      ${PASS}${NC}"
[ $WARN -gt 0 ] && echo -e "  ${YELLOW}⚠ Avisos:  ${WARN}${NC}"
[ $FAIL -gt 0 ] && echo -e "  ${RED}✗ Fallos:  ${FAIL}${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}${BOLD}✓ Todos los checks pasaron.${NC}"
else
  echo -e "${RED}${BOLD}✗ ${FAIL} check(s) fallaron. Revisa el servidor.${NC}"
fi
echo ""
