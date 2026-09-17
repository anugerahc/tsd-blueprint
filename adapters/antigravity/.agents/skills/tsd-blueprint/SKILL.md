---
name: tsd-blueprint
description: Generate Technical Spec Document (TSD) untuk 1 module project dari investigasi source code + live database. Pakai saat user minta dibuatkan TSD/dokumentasi teknis module tertentu.
---

# TSD Blueprint

## When to use this skill
User minta dibuatkan TSD / dokumentasi teknis untuk 1 module tertentu dalam sebuah project.

## How to use it

1. Baca metodologi lengkap di `_blueprint/core/tsd-blueprint-core.md` (root project, atau path
   yang user tunjuk) SEBELUM mulai — semua aturan verifikasi, struktur 16 section baku, dan tone
   Room of Improvement (ROI) ada di situ.
2. Kalau module/project yang dimaksud belum jelas, tanya dulu — jangan asumsi.
3. Investigasi: controller → service → entity/DAL → grep frontend validasi client-side.
4. Kalau ada MCP DB server yang nyambung ke database module ini, live-query buat verifikasi skema,
   FK constraint asli, definisi view, dan distinct value kolom kritikal. Kalau MCP DB TIDAK
   tersedia/belum di-setup, tetap boleh jalan hanya dari source code — tapi tandai eksplisit di
   dokumen bagian mana yang "belum live-verified ke database, baru dari kode/migration" (jangan
   ditulis seolah sudah pasti).
5. Copy scaffold `_blueprint/template/` (index.html + css/style.css + js/script.js — sudah generic
   dan fungsional: lightbox diagram, copy-as-markdown, print, scroll-reveal) ke folder output, isi
   `{{PLACEHOLDER}}`-nya. Jangan reimplement JS/CSS-nya.
6. Temuan gap yang genuinely terverifikasi → section ROI, tenang + rekomendasi konkret, bukan
   "Bug/Gap" yang alarming.
7. Verifikasi hasil render sebelum lapor selesai ke user.
