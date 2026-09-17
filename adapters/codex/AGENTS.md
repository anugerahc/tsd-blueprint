<!--
  Snippet ini ditujukan buat di-append ke AGENTS.md project (root atau home directory), bukan
  dipakai berdiri sendiri. Codex CLI membaca AGENTS.md sebagai standing instruction tiap session.
-->

## TSD Blueprint (generate Technical Spec Document per-module)

Saat user minta dibuatkan TSD/dokumentasi teknis untuk sebuah module:

1. Baca `_blueprint/core/tsd-blueprint-core.md` dulu — itu sumber metodologi lengkap (aturan
   verifikasi, struktur 16 section baku, tone Room of Improvement/ROI, alur investigasi).
2. Wajib verifikasi tiap klaim dari source code aktual dan/atau live database query (pakai MCP DB
   tools kalau tersedia) — dilarang menebak nama fungsi/kolom/enum/behavior.
3. Pakai scaffold `_blueprint/template/` (index.html + css/style.css + js/script.js) — sudah
   generic dan fungsional (lightbox diagram, copy-as-markdown, print, scroll-reveal). Isi
   `{{PLACEHOLDER}}` saja, jangan tulis ulang JS/CSS-nya.
4. Temuan gap yang genuinely terverifikasi masuk section ROI dengan tone tenang + rekomendasi
   konkret — bukan label "Bug"/"Gap" yang alarming.
5. Jangan narasikan kesalahan/koreksi proses investigasi sendiri di dalam dokumen final.
6. Kalau module/project yang dimaksud ambigu, tanya user dulu sebelum mulai.
