---
name: tsd-blueprint
description: Generate Technical Spec Document (TSD) untuk 1 module project dari investigasi source code + live database. Pakai saat user minta dibuatkan TSD/dokumentasi teknis module tertentu.
---

# TSD Blueprint

Sumber metodologi lengkap (WAJIB dibaca dulu sebelum eksekusi): `${CLAUDE_PLUGIN_ROOT}/core/tsd-blueprint-core.md`

Scaffold html/css/js siap pakai: `${CLAUDE_PLUGIN_ROOT}/template/` (copy folder ini ke lokasi output
di project user, isi `{{PLACEHOLDER}}` dengan hasil investigasi module yang diminta — jangan tulis
ulang JS/CSS-nya, itu sudah generic dan fungsional).

## Ringkasan alur

1. Baca `${CLAUDE_PLUGIN_ROOT}/core/tsd-blueprint-core.md` — pegang aturan verifikasi, struktur 16
   section, dan tone Room of Improvement (ROI).
2. Konfirmasi ke user: module mana, project mana, output ditaruh di mana. Kalau ambigu, tanya dulu
   — jangan asumsi.
3. Investigasi source code module (controller → service → entity/DAL) + live-query database yang
   relevan lewat MCP DB tools yang tersedia di project user (kalau belum ada MCP DB, ikuti fallback
   rule di core doc bagian 1 — tetap boleh jalan dari source code saja, tapi tandai eksplisit mana
   yang belum live-verified).
4. Copy `${CLAUDE_PLUGIN_ROOT}/template/` ke folder output di project user, isi section demi section.
5. Verifikasi hasil: buka di browser, cek Mermaid render tanpa error, cek lightbox/copy-MD/print
   jalan (fitur ini sudah generic, harusnya langsung jalan tanpa modifikasi JS/CSS).

Jangan eksekusi kalau scope module/project ambigu — tanya user dulu.
