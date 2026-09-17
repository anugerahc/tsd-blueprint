# TSD Blueprint

Metodologi + scaffold buat generate **Technical Spec Document (TSD)** per-module dari codebase
nyata — wajib terverifikasi dari source code aktual dan/atau live database query, bukan asumsi.
Tool-agnostic: jalan di Claude Code, Google Antigravity, Cursor, Kiro, dan Codex CLI.

## Isi repo

```
core/tsd-blueprint-core.md   ← metodologi lengkap (sumber kebenaran tunggal)
template/                    ← scaffold TSD siap pakai (html/css/js, interaktif)
adapters/                    ← file aktivasi per tool (Claude Code, Antigravity, Kiro, Cursor, Codex)
install.sh / install.ps1     ← installer otomatis, deteksi tool & pasang adapter yang cocok
INSTALL.md                   ← panduan instalasi manual (kalau gak mau pakai script)
PROMPTS.md                   ← contoh prompt optimal buat hasil generate TSD paling maksimal
```

## Quick start

### Claude Code — install plugin (cara resmi, 1x setup)

1. Buka Claude Code di project mana pun (interactive terminal atau desktop app).
2. Tambahkan marketplace-nya:
   ```
   /plugin marketplace add anugerahc/tsd-blueprint
   ```
3. Install plugin-nya dari marketplace tadi:
   ```
   /plugin install tsd-blueprint@tsd-blueprint-marketplace
   ```
4. Kalau muncul `Run /reload-plugins to activate.`, jalankan:
   ```
   /reload-plugins
   ```
   (biasanya otomatis dijalankan Claude Code sendiri setelah install.)
5. Verifikasi ke-install dengan benar:
   ```
   /plugin
   ```
   → tab **Installed**, cari `tsd-blueprint` — pastikan skill `tsd-blueprint` kelihatan di component inventory-nya.
6. Selesai. Skill otomatis aktif — tinggal minta di chat: *"buatkan TSD untuk module X"*, atau
   panggil eksplisit dengan `/tsd-blueprint:tsd-blueprint`. Buat hasil paling maksimal, pakai
   template prompt di [PROMPTS.md](PROMPTS.md) — bukan asal sebut nama module doang.

Gak perlu clone repo atau copy file manual sama sekali — plugin sudah bundle `core/` +
`template/`-nya sendiri.

> Update ke versi terbaru: `/plugin marketplace update tsd-blueprint-marketplace` lalu install
> ulang. Uninstall: `/plugin uninstall tsd-blueprint@tsd-blueprint-marketplace`.

### Tool lain (Antigravity, Cursor, Kiro, Codex CLI) — installer script

```bash
git clone https://github.com/anugerahc/tsd-blueprint.git
cd /path/to/your-project
bash /path/to/tsd-blueprint/install.sh
```

Lihat [INSTALL.md](INSTALL.md) untuk detail & instalasi manual per tool.

## Kenapa ini ada

TSD yang dibikin asal tebak dari nama fitur gampang salah dan gak kepercaya tim dev. Blueprint
ini maksa alur kerja: baca controller → service → entity/DAL, live-query database yang relevan
buat verifikasi skema/FK/enum, baru tulis dokumen — section demi section, termasuk temuan celah
(namanya **Room of Improvement**, bukan "Bug/Gap") dengan rekomendasi konkret, bukan cuma keluhan.

Scaffold-nya udah include fitur interaktif siap pakai: sidebar TOC + scroll-spy, animasi
scroll-reveal, lightbox zoom/pan buat diagram Mermaid, tombol "Copy as Markdown" (buat paste ke
Notion/Confluence), dan print/PDF-ready CSS.

## Lisensi

Internal use — sesuaikan dengan kebijakan lu sebelum di-share lebih luas.
