# TSD Blueprint installer (Windows PowerShell) — auto-detect AI coding tool(s) in target project
# and wire up the adapter.
# Usage:
#   .\install.ps1 [-Target <path>] [-Tools claude,cursor,...] [-All]
param(
    [string]$Target = ".",
    [string[]]$Tools = @(),
    [switch]$All
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Target = (Resolve-Path $Target).Path
Write-Host "Target project: $Target"

# 1. Copy core + template (always, merge)
New-Item -ItemType Directory -Force -Path "$Target\_blueprint" | Out-Null
Copy-Item "$ScriptDir\core" "$Target\_blueprint\" -Recurse -Force
Copy-Item "$ScriptDir\template" "$Target\_blueprint\" -Recurse -Force
Write-Host "core/ + template/ copied to $Target\_blueprint\"

# 2. Detect tools if not explicitly given
if ($Tools.Count -eq 0 -and -not $All) {
    if (Test-Path "$Target\.claude") { $Tools += "claude" }
    if (Test-Path "$Target\.agents") { $Tools += "antigravity" }
    if (Test-Path "$Target\.kiro") { $Tools += "kiro" }
    if (Test-Path "$Target\.cursor") { $Tools += "cursor" }
    if (Test-Path "$Target\AGENTS.md") { $Tools += "codex" }

    if ($Tools.Count -eq 0) {
        Write-Host "Gak kedetek tool AI coding apapun di $Target."
        $input = Read-Host "Pilih manual (pisah spasi) dari: claude antigravity kiro cursor codex"
        $Tools = $input -split '\s+' | Where-Object { $_ -ne "" }
    } else {
        Write-Host "Kedetek tool: $($Tools -join ', ')"
    }
}
if ($All) { $Tools = @("claude", "antigravity", "kiro", "cursor", "codex") }

# 3. Install adapter per tool
foreach ($tool in $Tools) {
    switch ($tool) {
        "claude" {
            New-Item -ItemType Directory -Force -Path "$Target\.claude\skills\tsd-blueprint" | Out-Null
            Copy-Item "$ScriptDir\adapters\claude-code\SKILL.md" "$Target\.claude\skills\tsd-blueprint\SKILL.md" -Force
            Write-Host "[claude] .claude/skills/tsd-blueprint/SKILL.md"
        }
        "antigravity" {
            New-Item -ItemType Directory -Force -Path "$Target\.agents\skills\tsd-blueprint" | Out-Null
            New-Item -ItemType Directory -Force -Path "$Target\.agents\workflows" | Out-Null
            Copy-Item "$ScriptDir\adapters\antigravity\.agents\skills\tsd-blueprint\SKILL.md" "$Target\.agents\skills\tsd-blueprint\SKILL.md" -Force
            Copy-Item "$ScriptDir\adapters\antigravity\.agents\workflows\tsd_blueprint.md" "$Target\.agents\workflows\tsd_blueprint.md" -Force
            Write-Host "[antigravity] .agents/skills/tsd-blueprint/, .agents/workflows/tsd_blueprint.md"
        }
        "kiro" {
            New-Item -ItemType Directory -Force -Path "$Target\.kiro\steering" | Out-Null
            Copy-Item "$ScriptDir\adapters\kiro\.kiro\steering\tsd-blueprint.md" "$Target\.kiro\steering\tsd-blueprint.md" -Force
            Write-Host "[kiro] .kiro/steering/tsd-blueprint.md"
        }
        "cursor" {
            New-Item -ItemType Directory -Force -Path "$Target\.cursor\rules" | Out-Null
            Copy-Item "$ScriptDir\adapters\cursor\.cursor\rules\tsd-blueprint.mdc" "$Target\.cursor\rules\tsd-blueprint.mdc" -Force
            Write-Host "[cursor] .cursor/rules/tsd-blueprint.mdc"
        }
        "codex" {
            $marker = "<!-- tsd-blueprint:start -->"
            $agentsPath = "$Target\AGENTS.md"
            $already = (Test-Path $agentsPath) -and (Select-String -Path $agentsPath -Pattern ([regex]::Escape($marker)) -Quiet)
            if ($already) {
                Write-Host "[codex] AGENTS.md already has tsd-blueprint block, skipped"
            } else {
                $block = "`n$marker`n" + (Get-Content "$ScriptDir\adapters\codex\AGENTS.md" -Raw) + "`n<!-- tsd-blueprint:end -->`n"
                Add-Content -Path $agentsPath -Value $block
                Write-Host "[codex] appended block to AGENTS.md"
            }
        }
        default {
            Write-Host "Tool gak dikenal: $tool (skip)"
        }
    }
}

Write-Host ""
Write-Host "Selesai. Baca $Target\_blueprint\core\tsd-blueprint-core.md buat metodologi lengkap."
