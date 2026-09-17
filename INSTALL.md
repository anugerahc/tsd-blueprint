# Cara Pasang TSD Blueprint di Project/Mesin Lain

Semua isi `_blueprint/` (folder ini) adalah file teks polos (markdown/html/css/js) — gak ada
dependency ke mesin ini, gak butuh install apapun secara khusus.

## Cara cepat (otomatis)

Dari root project TARGET (project yang mau dipasangin blueprint ini):

```bash
# Linux / macOS / Git Bash / WSL
bash /path/to/tsd-blueprint/install.sh
```

```powershell
# Windows PowerShell
& "C:\path\to\tsd-blueprint\install.ps1"
```

Script otomatis: (1) copy `core/` + `template/` ke `_blueprint/` di project target, (2) deteksi
tool AI coding apa yang kepake dari folder yang udah ada (`.claude/`, `.agents/`, `.kiro/`,
`.cursor/`, `AGENTS.md`), (3) pasang adapter yang cocok ke lokasi yang bener. Kalau gak kedetek
tool apapun, script nanya interaktif. Bisa juga paksa tool tertentu: `--tool claude --tool cursor`,
atau pasang semua sekaligus: `--all`.

Aman dijalankan berkali-kali (idempotent) — gak nimpa file lain yang gak berkaitan, dan untuk
`AGENTS.md` (Codex) nambah blok baru bukan nimpa isi existing.

## Cara manual (kalau gak mau/gak bisa jalanin script)

1. **Copy seluruh folder `_blueprint/`** (isinya `core/` + `template/`) ke root project target.
2. **Copy adapter yang sesuai tool** ke lokasi yang tool itu baca:

   | Tool | Copy dari | Copy ke (root project target) |
   |---|---|---|
   | Claude Code | `adapters/claude-code/SKILL.md` | `.claude/skills/tsd-blueprint/SKILL.md` |
   | Antigravity | `adapters/antigravity/.agents/` | `.agents/` (merge, jangan timpa isi lain) |
   | Kiro | `adapters/kiro/.kiro/` | `.kiro/` (merge) |
   | Cursor | `adapters/cursor/.cursor/` | `.cursor/` (merge) |
   | Codex CLI | isi `adapters/codex/AGENTS.md` | append ke `AGENTS.md` project (buat baru kalau belum ada) |

3. Pastikan `_blueprint/core/tsd-blueprint-core.md` dan `_blueprint/template/` tetap bisa dijangkau
   dari path relatif yang dipakai di adapter (default: `_blueprint/...` dari root project). Kalau
   struktur foldernya beda, sesuaikan path di adapter masing-masing.

## Setelah terpasang (manual atau via script)

Kalau project target punya database, setup MCP DB server yang sesuai (postgres/mssql/oracle,
   dst) di config MCP tool itu SEBELUM mulai generate TSD — supaya aturan "wajib live-verify" bisa
   benar-benar dijalankan, bukan cuma verifikasi dari kode doang. Kalau belum sempat setup, tetap
   bisa jalan (lihat fallback rule di `core/tsd-blueprint-core.md` bagian 1) tapi hasilnya kurang kuat.

## Ini BUKAN plugin/extension resmi yang tinggal "Install" dari marketplace

Blueprint ini sekarang bentuknya file mentah yang di-copy manual. Kalau mau upgrade jadi
"instalable" via marketplace resmi masing-masing tool, lihat catatan per-tool di bawah — beberapa
bisa, beberapa belum ada mekanismenya sama sekali.

| Tool | Ada marketplace/install resmi? | Catatan |
|---|---|---|
| Claude Code | ✅ Ya | Bisa dibungkus jadi Plugin (`.claude-plugin/marketplace.json` + `plugin.json`), didistribusikan lewat GitHub repo, diinstall user lain dengan `/plugin marketplace add <owner>/<repo>` lalu `/plugin install tsd-blueprint@<marketplace>`. |
| Antigravity | ✅ Ya | Skill bisa didaftarkan ke marketplace Antigravity/`npx skills` (package manager cross-tool by Vercel Labs) untuk one-click install. Minimal tanpa marketplace pun tinggal copy folder ke `.agents/skills/`. |
| Cursor | ⚠️ Terbatas | Ada Marketplace resmi tapi publish plugin/skill ke situ baru kebuka penuh untuk akun Team/Enterprise (personal skill di `~/.cursor/skills/` → publish ke marketplace tim). Untuk individual user, distribusi ya manual copy `.cursor/rules/`. |
| Kiro | ⚠️ Via extension pihak ketiga | Ada community extension (`kiro-steering-docs-extension`) yang bisa install steering docs dari GitHub — bukan mekanisme resmi AWS, tapi jalan. Tanpa extension itu, manual copy ke `.kiro/steering/`. |
| Codex CLI | ❌ Tidak ada | `AGENTS.md` murni file konvensi, gak ada sistem plugin/install sama sekali. Selalu manual copy/append. |

Kalau mau, langkah lanjutan yang bisa dikerjakan: bikin `.claude-plugin/marketplace.json` +
`plugin.json` biar Claude Code punya instalasi resmi satu-perintah — itu satu-satunya tool di
daftar ini yang mekanismenya udah lengkap & terverifikasi jelas dari dokumentasi resmi.
