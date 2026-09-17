#!/usr/bin/env bash
# TSD Blueprint installer — auto-detect AI coding tool(s) in target project and wire up the adapter.
# Usage:
#   ./install.sh [target-dir] [--tool claude|antigravity|kiro|cursor|codex] [--all]
# Default target-dir: current directory. Without --tool/--all, auto-detects by existing folders
# and falls back to asking interactively if nothing is detected.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="."
TOOLS=()
ALL=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tool) TOOLS+=("$2"); shift 2 ;;
    --all) ALL=true; shift ;;
    *) TARGET="$1"; shift ;;
  esac
done

TARGET="$(cd "$TARGET" && pwd)"
echo "Target project: $TARGET"

# 1. Copy core + template (always, merge — never delete unrelated files)
mkdir -p "$TARGET/_blueprint"
cp -r "$SCRIPT_DIR/core" "$TARGET/_blueprint/"
cp -r "$SCRIPT_DIR/template" "$TARGET/_blueprint/"
echo "core/ + template/ copied to $TARGET/_blueprint/"

# 2. Detect tools if not explicitly given
if [[ ${#TOOLS[@]} -eq 0 && "$ALL" == false ]]; then
  [[ -d "$TARGET/.claude" ]] && TOOLS+=("claude")
  [[ -d "$TARGET/.agents" ]] && TOOLS+=("antigravity")
  [[ -d "$TARGET/.kiro" ]] && TOOLS+=("kiro")
  [[ -d "$TARGET/.cursor" ]] && TOOLS+=("cursor")
  [[ -f "$TARGET/AGENTS.md" ]] && TOOLS+=("codex")

  if [[ ${#TOOLS[@]} -eq 0 ]]; then
    echo "Gak kedetek tool AI coding apapun di $TARGET."
    echo "Pilih manual (pisah spasi) dari: claude antigravity kiro cursor codex"
    read -r -p "> " -a TOOLS
  else
    echo "Kedetek tool: ${TOOLS[*]}"
  fi
fi
[[ "$ALL" == true ]] && TOOLS=(claude antigravity kiro cursor codex)

# 3. Install adapter per tool
for tool in "${TOOLS[@]}"; do
  case "$tool" in
    claude)
      mkdir -p "$TARGET/.claude/skills/tsd-blueprint"
      cp "$SCRIPT_DIR/adapters/claude-code/SKILL.md" "$TARGET/.claude/skills/tsd-blueprint/SKILL.md"
      echo "[claude] .claude/skills/tsd-blueprint/SKILL.md"
      ;;
    antigravity)
      mkdir -p "$TARGET/.agents/skills/tsd-blueprint" "$TARGET/.agents/workflows"
      cp "$SCRIPT_DIR/adapters/antigravity/.agents/skills/tsd-blueprint/SKILL.md" "$TARGET/.agents/skills/tsd-blueprint/SKILL.md"
      cp "$SCRIPT_DIR/adapters/antigravity/.agents/workflows/tsd_blueprint.md" "$TARGET/.agents/workflows/tsd_blueprint.md"
      echo "[antigravity] .agents/skills/tsd-blueprint/, .agents/workflows/tsd_blueprint.md"
      ;;
    kiro)
      mkdir -p "$TARGET/.kiro/steering"
      cp "$SCRIPT_DIR/adapters/kiro/.kiro/steering/tsd-blueprint.md" "$TARGET/.kiro/steering/tsd-blueprint.md"
      echo "[kiro] .kiro/steering/tsd-blueprint.md"
      ;;
    cursor)
      mkdir -p "$TARGET/.cursor/rules"
      cp "$SCRIPT_DIR/adapters/cursor/.cursor/rules/tsd-blueprint.mdc" "$TARGET/.cursor/rules/tsd-blueprint.mdc"
      echo "[cursor] .cursor/rules/tsd-blueprint.mdc"
      ;;
    codex)
      MARKER="<!-- tsd-blueprint:start -->"
      if [[ -f "$TARGET/AGENTS.md" ]] && grep -qF "$MARKER" "$TARGET/AGENTS.md"; then
        echo "[codex] AGENTS.md already has tsd-blueprint block, skipped"
      else
        {
          echo ""
          echo "$MARKER"
          cat "$SCRIPT_DIR/adapters/codex/AGENTS.md"
          echo "<!-- tsd-blueprint:end -->"
        } >> "$TARGET/AGENTS.md"
        echo "[codex] appended block to AGENTS.md"
      fi
      ;;
    *)
      echo "Tool gak dikenal: $tool (skip)"
      ;;
  esac
done

echo ""
echo "Selesai. Baca $TARGET/_blueprint/core/tsd-blueprint-core.md buat metodologi lengkap."
