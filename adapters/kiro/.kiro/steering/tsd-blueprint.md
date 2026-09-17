---
version: "1.0.0"
category: "documentation"
description: "Metodologi generate Technical Spec Document (TSD) per-module dari source code + live DB verification"
inclusion: "manual"
---

# TSD Blueprint

Aktifkan steering ini dengan `#tsd-blueprint` saat user minta dibuatkan TSD/dokumentasi teknis
untuk sebuah module.

Metodologi lengkap ada di `_blueprint/core/tsd-blueprint-core.md` (root project atau path yang
user tunjuk) — baca file itu dulu sebelum eksekusi apapun. Ringkasan aturan paling penting:

1. Setiap klaim di TSD wajib terverifikasi dari source code aktual dan/atau live database query
   (pakai MCP DB tools kalau tersedia). Dilarang menebak.
2. Struktur baku 16 section (00 Riwayat Revisi s/d 15 Appendix Koneksi Database) — urutan lengkap
   ada di core doc, section 2.
3. Gap yang genuinely terverifikasi masuk section "Room of Improvement (ROI)" — tone tenang +
   selalu ada rekomendasi, bukan label "Bug"/alarm.
4. Jangan narasikan kesalahan investigasi sendiri di dalam dokumen final.
5. Pakai scaffold `_blueprint/template/` (html/css/js sudah generic — lightbox diagram, copy-as-
   markdown, print, scroll-reveal) — isi placeholder-nya saja, jangan tulis ulang JS/CSS.

Kalau module/project yang dimaksud belum jelas, tanya user dulu sebelum mulai investigasi.
