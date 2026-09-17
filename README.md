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
```

## Quick start

```bash
git clone <repo-url> tsd-blueprint
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
