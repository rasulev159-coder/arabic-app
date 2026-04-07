#!/bin/bash
set -e

# ═══════════════════════════════════════════════════════
#  AI Crew Pipeline — Arabic Alphabet Platform
#  Пайплайн с human-in-the-loop на каждом этапе
# ═══════════════════════════════════════════════════════

CREW_DIR="$(cd "$(dirname "$0")" && pwd)"
OUTPUT_DIR="$CREW_DIR/output/$(date +%Y-%m-%d)"
mkdir -p "$OUTPUT_DIR"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

ask_approval() {
    echo ""
    echo -e "${YELLOW}═══════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  ✋ ТВОЁ ПОДТВЕРЖДЕНИЕ${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════════${NC}"
    echo ""
    echo -e "Результат сохранён: ${BLUE}$1${NC}"
    echo ""
    echo "Открой файл, проверь и выбери:"
    echo "  [enter] — ок, продолжить"
    echo "  [e]     — открыть в редакторе и поправить"
    echo "  [r]     — переделать этот этап"
    echo "  [q]     — остановить пайплайн"
    echo ""
    read -p "Твой выбор: " choice

    case "$choice" in
        e|E)
            ${EDITOR:-nano} "$1"
            echo -e "${GREEN}Файл обновлён. Продолжаем...${NC}"
            ;;
        r|R)
            return 1
            ;;
        q|Q)
            echo -e "${RED}Пайплайн остановлен.${NC}"
            exit 0
            ;;
        *)
            echo -e "${GREEN}Принято! Переходим к следующему этапу...${NC}"
            ;;
    esac
    return 0
}

# ─── ЭТАП 1: Аналитик ───────────────────────────────
run_analyst() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo -e "${BLUE}  🔍 ЭТАП 1/3 — Маркетинговый аналитик${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo ""

    local prompt
    prompt=$(cat "$CREW_DIR/agents/analyst.md")

    claude -p "$prompt" \
        --allowedTools 'WebSearch,WebFetch' \
        > "$OUTPUT_DIR/01-analysis.md" 2>/dev/null

    echo -e "${GREEN}Анализ готов!${NC}"
}

# ─── ЭТАП 2: Контент-планер ──────────────────────────
run_planner() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo -e "${BLUE}  📅 ЭТАП 2/3 — Контент-планер${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo ""

    local system_prompt
    system_prompt=$(cat "$CREW_DIR/agents/content-planner.md")

    local analysis
    analysis=$(cat "$OUTPUT_DIR/01-analysis.md")

    claude -p "Вот результаты анализа:

$analysis

---

Теперь составь контент-план на неделю на основе этого анализа." \
        --system-prompt "$system_prompt" \
        > "$OUTPUT_DIR/02-content-plan.md" 2>/dev/null

    echo -e "${GREEN}Контент-план готов!${NC}"
}

# ─── ЭТАП 3: Копирайтер ─────────────────────────────
run_copywriter() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo -e "${BLUE}  ✍️  ЭТАП 3/3 — Копирайтер${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo ""

    local system_prompt
    system_prompt=$(cat "$CREW_DIR/agents/copywriter.md")

    local plan
    plan=$(cat "$OUTPUT_DIR/02-content-plan.md")

    claude -p "Вот утверждённый контент-план:

$plan

---

Напиши готовые тексты для КАЖДОГО пункта контент-плана." \
        --system-prompt "$system_prompt" \
        > "$OUTPUT_DIR/03-posts.md" 2>/dev/null

    echo -e "${GREEN}Тексты готовы!${NC}"
}

# ═══════════════════════════════════════════════════════
#  MAIN
# ═══════════════════════════════════════════════════════

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     AI CREW — Arabic Alphabet Platform    ║${NC}"
echo -e "${GREEN}║                                           ║${NC}"
echo -e "${GREEN}║  Аналитик → Планер → Копирайтер          ║${NC}"
echo -e "${GREEN}║  С твоим подтверждением на каждом шаге    ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo -e "Результаты будут в: ${BLUE}$OUTPUT_DIR${NC}"
echo ""

# Этап 1
while true; do
    run_analyst
    if ask_approval "$OUTPUT_DIR/01-analysis.md"; then
        break
    fi
    echo -e "${YELLOW}Переделываю анализ...${NC}"
done

# Этап 2
while true; do
    run_planner
    if ask_approval "$OUTPUT_DIR/02-content-plan.md"; then
        break
    fi
    echo -e "${YELLOW}Переделываю контент-план...${NC}"
done

# Этап 3
while true; do
    run_copywriter
    if ask_approval "$OUTPUT_DIR/03-posts.md"; then
        break
    fi
    echo -e "${YELLOW}Переделываю тексты...${NC}"
done

# Итог
echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ ПАЙПЛАЙН ЗАВЕРШЁН!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo "Результаты:"
echo -e "  📊 Анализ:        ${BLUE}$OUTPUT_DIR/01-analysis.md${NC}"
echo -e "  📅 Контент-план:  ${BLUE}$OUTPUT_DIR/02-content-plan.md${NC}"
echo -e "  ✍️  Тексты постов: ${BLUE}$OUTPUT_DIR/03-posts.md${NC}"
echo ""
echo "Следующий шаг: скопируй тексты в Telegram/Instagram и опубликуй!"
