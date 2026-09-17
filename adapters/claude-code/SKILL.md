---
name: tsd-blueprint
description: Generate Technical Spec Document (TSD) untuk 1 module project dari investigasi source code + live database. Pakai saat user minta dibuatkan TSD/dokumentasi teknis module tertentu.
---

# TSD Blueprint

Sumber metodologi lengkap (WAJIB dibaca dulu sebelum eksekusi): `../../core/tsd-blueprint-core.md`

Scaffold html/css/js siap pakai: `../../template/` (copy folder ini ke lokasi output, isi
`{{PLACEHOLDER}}` dengan hasil investigasi module yang diminta — jangan tulis ulang JS/CSS-nya).

## Ringkasan alur

1. Baca `core/tsd-blueprint-core.md` — pegang aturan verifikasi, struktur 16 section, dan tone ROI.
2. Konfirmasi ke user: module mana, project mana, output ditaruh di mana.
3. Investigasi source code module (controller → service → entity/DAL) + live-query database
   yang relevan lewat MCP DB tools yang tersedia di project ini.
4. Copy `template/` ke folder output, isi section demi section.
5. Verifikasi hasil: buka di browser, cek Mermaid render tanpa error, cek lightbox/copy-MD/print
   jalan (fitur ini sudah generic, harusnya langsung jalan tanpa modifikasi JS/CSS).

Jangan eksekusi kalau scope module/project ambigu — tanya user dulu.
