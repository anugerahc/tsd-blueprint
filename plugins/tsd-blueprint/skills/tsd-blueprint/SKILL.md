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
> operasi copy/read mengarah ke path itu, bukan ke path lain yang "kebetulan ketemu". Ini juga
> berlaku buat KONTEN, bukan cuma file scaffold — jangan browse project/dokumen TSD lain di disk
> yang sama buat "referensi konsistensi" (warna, gaya tulisan, dll). Semua yang dibutuhkan sudah
> ada di `core/tsd-blueprint-core.md`.
>
> **Read-only terhadap diri sendiri.** `${CLAUDE_PLUGIN_ROOT}/core` dan `${CLAUDE_PLUGIN_ROOT}/template`
> TIDAK BOLEH ditulis/diedit — itu bundle plugin, bukan folder kerja. Selalu COPY `template/` ke
> folder output di project user dulu, baru edit salinannya di sana.

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
   relevan lewat MCP DB tools yang tersedia di project user. Kalau gak ada MCP yang cocok buat
   database module ini, ikuti alur discovery di core doc bagian 1a SEBELUM nyerah ke fallback:
   cek `appsettings.json`/config setara buat nemuin KEY connection string + engine-nya, lalu
   **tanya user dulu** kalau mau dibantu setup MCP server baru (install tooling + tambah config —
   dua-duanya WAJIB izin eksplisit, jangan pernah jalan diam-diam, dan connection string
   ciphertext-nya jangan pernah ditempel ke user/dokumen). Kalau user gak mau/gak sempat, baru
   fallback ke source-code-only (tetap boleh jalan, tandai eksplisit mana yang belum live-verified).
5. Copy `${CLAUDE_PLUGIN_ROOT}/template/` (path yang sudah di-resolve di langkah 1, bukan hasil
   pencarian lain) ke folder output di project user — kalau folder output udah ada isi TSD
   sebelumnya, tanya user dulu (overwrite total atau update section tertentu), jangan timpa
   diam-diam. Isi section demi section di SALINAN itu, bukan di `${CLAUDE_PLUGIN_ROOT}/template/`.
6. Query database cuma read-only (SELECT/describe) — jangan pernah write/DDL walau tool-nya
   secara teknis mengizinkan. Jangan tempel data mentah sensitif (nama/email/harga asli) dari hasil
   query ke dokumen — generalisasi kalau butuh contoh baris data.
7. Sebelum declare selesai: grep hasil akhir cari `{{` yang kelewat, cek 16 section baku ada semua
   (kecuali yang disetujui user buat dihapus), dan verifikasi render (Mermaid/lightbox/copy-MD/print
   jalan tanpa modifikasi JS/CSS).

Jangan eksekusi kalau scope module/project ambigu — tanya user dulu.
