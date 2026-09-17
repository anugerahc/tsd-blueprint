---
name: tsd-blueprint
description: Generate Technical Spec Document (TSD) untuk 1 module project dari investigasi source code + live database. Pakai saat user minta dibuatkan TSD/dokumentasi teknis module tertentu.
---

# TSD Blueprint

> **PENTING — sumber file WAJIB dari plugin, bukan dari hasil pencarian disk.**
> Semua file yang dibutuhkan skill ini (metodologi + scaffold) sudah dibundle DI DALAM plugin ini
> sendiri, di path `${CLAUDE_PLUGIN_ROOT}`. JANGAN pernah Glob/Grep/cari folder bernama
> `_blueprint`, `template`, atau `tsd-blueprint` di lokasi lain di filesystem — kalau kebetulan ada
> folder dengan nama mirip di mesin ini (misal sisa clone/dev folder lama), itu BUKAN sumber yang
> dipakai skill ini dan isinya bisa beda/basi. Selalu resolve `${CLAUDE_PLUGIN_ROOT}` dulu (contoh:
> `echo ${CLAUDE_PLUGIN_ROOT}` atau langsung pakai di command `ls "${CLAUDE_PLUGIN_ROOT}"`) dan pastikan
> operasi copy/read mengarah ke path itu, bukan ke path lain yang "kebetulan ketemu".

Sumber metodologi lengkap (WAJIB dibaca dulu sebelum eksekusi): `${CLAUDE_PLUGIN_ROOT}/core/tsd-blueprint-core.md`

Scaffold html/css/js siap pakai: `${CLAUDE_PLUGIN_ROOT}/template/` (copy folder ini ke lokasi output
di project user, isi `{{PLACEHOLDER}}` dengan hasil investigasi module yang diminta — jangan tulis
ulang JS/CSS-nya, itu sudah generic dan fungsional).

## Ringkasan alur

1. Resolve `${CLAUDE_PLUGIN_ROOT}` dan konfirmasi lewat shell (`ls "${CLAUDE_PLUGIN_ROOT}"`) bahwa
   isinya ada `core/` dan `template/` sebelum lanjut — ini sumber satu-satunya yang valid.
2. Baca `${CLAUDE_PLUGIN_ROOT}/core/tsd-blueprint-core.md` — pegang aturan verifikasi, struktur 16
   section, dan tone Room of Improvement (ROI).
3. Konfirmasi ke user: module mana, project mana, output ditaruh di mana. Kalau ambigu, tanya dulu
   — jangan asumsi.
4. Investigasi source code module (controller → service → entity/DAL) + live-query database yang
   relevan lewat MCP DB tools yang tersedia di project user (kalau belum ada MCP DB, ikuti fallback
   rule di core doc bagian 1 — tetap boleh jalan dari source code saja, tapi tandai eksplisit mana
   yang belum live-verified).
5. Copy `${CLAUDE_PLUGIN_ROOT}/template/` (path yang sudah di-resolve di langkah 1, bukan hasil
   pencarian lain) ke folder output di project user, isi section demi section.
6. Verifikasi hasil: buka di browser, cek Mermaid render tanpa error, cek lightbox/copy-MD/print
   jalan (fitur ini sudah generic, harusnya langsung jalan tanpa modifikasi JS/CSS).

Jangan eksekusi kalau scope module/project ambigu — tanya user dulu.
