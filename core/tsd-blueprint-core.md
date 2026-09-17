# TSD Blueprint — Core Methodology

Metodologi buat generate Technical Spec Document (TSD) per-module dari codebase nyata.
Dokumen ini tool-agnostic — dipanggil dari Skill (Claude Code), `.agents/skills` (Antigravity),
steering doc (Kiro), rule (Cursor), atau `AGENTS.md` (Codex CLI). Isinya sama, cuma cara aktivasinya beda.

## 0. Kapan dipakai

User minta dibuatkan TSD / dokumentasi teknis buat 1 module tertentu dalam sebuah project.
Kalau module-nya belum jelas atau scope-nya ambigu (lebih dari 1 module, atau "seluruh sistem"),
STOP dan tanya dulu module mana yang dimaksud — jangan asumsi.

## 1. Aturan Keras (non-negotiable)

1. **Setiap klaim WAJIB diverifikasi dari source code aktual dan/atau live database query.**
   Dilarang menebak nama fungsi, nama kolom, isi enum, behavior — semua harus dibaca langsung
   dari file atau di-query langsung dari DB (pakai MCP DB tools kalau tersedia: postgres/mssql/oracle).
   Kalau gak ada akses buat verifikasi sesuatu, tulis eksplisit "belum terverifikasi" — jangan diam-diam
   ditulis seolah pasti.
   - **Kalau MCP DB server belum di-install/di-setup di environment ini:** tetap boleh jalan,
     verifikasi cukup dari source code (entity class, ModelBuilder/migration file, stored procedure
     script kalau ada di repo). Tapi section ERD/Database WAJIB dikasih catatan eksplisit
     (`.callout.warn`) bahwa skema & FK constraint diambil dari kode, BUKAN live-verified ke
     database fisik — supaya pembaca tau ini bisa saja beda dari kondisi DB production sebenarnya
     (migration drift, FK yang di-drop manual, dll). Begitu MCP DB tersedia di kemudian hari,
     dokumen harus di-upgrade jadi live-verified.
2. **Kalau ternyata tebakan salah (ketauan pas verifikasi lanjut), diam-diam koreksi ke user
   dan revisi dokumen — TAPI JANGAN narasikan kesalahan investigasi sendiri di dalam dokumen.**
   Dokumen final harus baca seolah semua temuan didapat langsung dengan benar. Proses trial-error
   investigasi itu urusan percakapan dengan user, bukan konten deliverable.
3. **Gap/kelemahan yang genuinely terverifikasi (race condition, validasi cuma di client, dead code,
   dll) WAJIB tetap dimasukkan** — tapi framing-nya tenang & profesional, bukan alarm. Section ini
   namanya **"Room of Improvement (ROI)"**, bukan "Gap" atau "Bug". Tiap item ROI wajib: (a) penjelasan
   konkret masalahnya + bukti (nama fungsi/file/query), (b) skenario kapan itu jadi masalah nyata,
   (c) rekomendasi perbaikan yang actionable. Jangan pakai kata-kata dramatis ("BAHAYA", "FATAL").
4. **Jangan masukkan item yang di luar scope tim/project ini** (misal: validasi token gateway pihak
   lain, infra yang bukan tanggung jawab dev team). Kalau ragu itu in-scope atau bukan, tanya user.
5. **Jangan tambahkan temuan yang user sudah eksplisit bilang "gausah dimasukin"** — walau itu valid,
   cukup catat internal, jangan taruh di dokumen.
6. Kalau user kasih koreksi fakta (misal: "department itu bukan fixed value, itu di-set per row di
   master data") — treat sebagai ground truth, re-verifikasi ke DB kalau perlu, dan jangan ulangi
   kesalahan yang sama untuk section lain yang serupa.
7. **Self-contained — jangan ambil referensi dari luar bundle skill ini.** Semua yang dibutuhkan
   (metodologi + scaffold) sudah lengkap di `core/` dan `template/` skill ini. Dilarang browse/Glob
   folder lain di disk yang sama buat "nyari contoh TSD lain", "ngecek konsistensi warna/gaya",
   atau alasan referensi apapun — walau kebetulan ketemu (misal di mesin dev yang sama ada TSD
   project lain). Kalau mau contoh konkret, cukup baca struktur di dokumen ini, jangan cari file
   nyata di luar scope project yang lagi dikerjakan.
8. **Jangan pernah menulis/mengedit file di dalam skill/plugin itu sendiri** (`core/`, `template/`
   di lokasi asal instalasi skill — baik itu source repo dev maupun cache hasil install plugin).
   Itu read-only source-of-truth buat semua project yang makai skill ini. Selalu COPY dulu
   `template/` ke folder output di project user, baru edit salinannya di sana. Kalau memang niatnya
   menambah fitur baru ke scaffold itu sendiri (bukan mengisi konten 1 TSD), itu kerjaan maintainer
   blueprint di source repo aslinya (GitHub), bukan sesuatu yang dilakukan saat generate TSD biasa.
9. **Query database cuma boleh read-only** (`SELECT`, `DESCRIBE`, `information_schema`, dst) —
   walau tool MCP yang tersedia secara teknis mengizinkan write/DDL, jangan pernah pakai buat
   INSERT/UPDATE/DELETE/ALTER/DROP. Tujuan live-query di sini murni verifikasi, bukan mengubah data.
10. **Jangan tempelkan data mentah yang sensitif/personal dari live-query ke dalam dokumen** — nama
    user asli, email, nomor telepon, harga transaksi, data customer, dsb. Kalau butuh contoh baris
    data buat ilustrasi, generalisasi/redact isinya (mis. ganti nama jadi "User A", tanggal jadi
    format umum). Yang boleh ditulis apa adanya: nama kolom, tipe data, constraint, definisi
    enum/status code, nama tabel/view — bukan isi baris data pribadi.

## 1b. Checklist Sebelum Declare Selesai

Sebelum bilang ke user dokumennya kelar, cek dulu:

- [ ] Gak ada `{{...}}` placeholder yang kelewat belum diganti (grep file output cari `{{`).
- [ ] Kalau folder output TSD-nya udah ada isi sebelumnya (bukan folder baru kosong), sudah
      konfirmasi ke user dulu apa mau full-overwrite atau cuma update section tertentu — jangan
      timpa diam-diam.
- [ ] Semua section baku (00-15, lihat bagian 2) ada, kecuali yang eksplisit disetujui user buat
      dihapus/diganti.
- [ ] Rendering dicek jalan (Mermaid gak error, lightbox/copy-MD/print gak crash).

## 2. Struktur Section (urutan baku)

Urutan ini hasil evolusi dari revisi berulang (query dari kode dipindah dari akhir ke tengah,
use-case-end-to-end section dihapus karena redundan dengan alur bisnis) — pertahankan urutan
ini kecuali module yang didokumentasikan punya alasan struktural buat beda:

00. Riwayat Revisi
01. Latar Belakang & Tujuan (business background, objectives, scope in/out, glossary)
02. Alur Bisnis / Proses (flow diagram, state machine, transisi & trigger, side-effect tiap perubahan status)
03. Modul Input Data (field per form/tab, auto-generate logic, format nomor dokumen)
04. Modul Validasi / Business Rule (generation logic, perhitungan, validasi — tandai mana yang cuma client-side)
05. Query & Business Logic dari Kode (kutipan LINQ/kode asli + terjemahan raw SQL buat DB editor + penjelasan)
06. API Endpoint Specification (per controller/API class, method/action/param/return/catatan)
07. Notifikasi & Template Komunikasi
08. Technical Specification (tech stack table, RBAC/access matrix)
09. Database Architecture (ERD) — full column, real FK constraints (cek live, jangan cuma baca ModelBuilder), definisi view/SP yang dipakai
10. Integrasi Sistem Eksternal
11. Field Dictionary
12. Tombol Aksi & Perilaku
13. Audit Trail & Access
14. Room of Improvement (ROI)
15. Appendix — Koneksi Database (nama KEY connection string per environment, method decrypt-nya — JANGAN taruh ciphertext/credential asli)

Section boleh ditambah/dikurangi kalau module-nya emang beda karakter (misal gak ada notifikasi
email sama sekali) — tapi diskusikan dulu ke user sebelum menghapus section baku.

## 3. Alur Kerja Investigasi

1. Baca controller/entrypoint module → petakan controller, service, entity/DAL yang terlibat.
2. Baca service layer (business logic) — catat semua query LINQ/SP penting apa adanya (verbatim,
   jangan parafrase logic-nya).
3. Identifikasi semua DbContext/database yang dipakai module ini. Kalau ada MCP DB tools yang
   nyambung ke masing-masing, live-query buat verifikasi: skema kolom, FK constraint asli
   (`information_schema.table_constraints`, bukan cuma baca ModelBuilder — ModelBuilder bisa
   incomplete/beda dari constraint fisik di DB), definisi view (`sys.sql_modules` / `pg_get_viewdef`
   / `dbms_metadata.get_ddl`), dan distinct value kolom yang critical (status enum, department code, dst).
4. Grep JS/frontend buat validasi client-side, cross-check dengan validasi server — kalau server
   gak re-validasi hal yang sama, itu calon ROI item.
5. Cross-check istilah/asumsi bisnis (nama department, role, dsb) ke MASTER DATA asli, bukan ke
   nama tab UI atau dugaan dari konteks kode.
6. Tulis section demi section pakai scaffold `../template/`. Isi tiap `{{PLACEHOLDER}}` dengan
   konten module ini.

## 4. Fitur Interaktif Scaffold (jangan dihapus, jangan reimplement dari nol)

Scaffold `../template/` (index.html + css/style.css + js/script.js) sudah include, generic,
tool-agnostic, tinggal pakai:

- **Sidebar TOC + scroll-spy** — otomatis highlight section aktif saat scroll.
- **Scroll-reveal animation** — section fade-in pas masuk viewport (`IntersectionObserver`).
- **Diagram zoom/pan lightbox** — klik `.diagram-card` manapun → buka lightbox, scroll buat zoom,
  drag buat pan, Esc/klik-luar/tombol ✕ buat tutup.
- **Copy as Markdown** (`#btn-copy-md`) — convert seluruh dokumen (termasuk diagram Mermaid) ke
  Markdown siap paste ke Notion/Confluence/dll.
- **Print/PDF** (`#btn-print`) — CSS print rules sudah ada (`break-inside:avoid` di tabel/diagram/callout).
- Tema warna: ubah CSS var di `:root` (`--primary`, dst) kalau module/brand butuh warna beda dari hijau default.

Jangan tulis ulang lightbox/markdown-exporter/dst dari nol — itu kerjaan mekanis yang udah selesai
dan teruji; cukup isi konten HTML-nya. Kalau scaffold-nya sendiri butuh fitur baru, itu perubahan
di source repo TSD Blueprint aslinya (GitHub, di luar sesi generate TSD biasa) — BUKAN dengan
mengedit `template/` di lokasi skill yang lagi aktif sekarang (source repo dev maupun cache plugin
terinstall keduanya read-only buat keperluan generate TSD sehari-hari, lihat aturan 8).

## 5. Class HTML Penting (dipakai konsisten semua TSD)

- `<section id="...">` — 1 section = 1 nomor TOC.
- `<h2><span class="num">NN</span>Judul Section</h2>` — heading section, nomor 2-digit.
- `.table-wrap > table` — tabel biasa.
- `.diagram-card > pre.mermaid` + `.diagram-caption` — diagram Mermaid, otomatis dapat lightbox.
- `.callout` + modifier: `.warn` (perhatian netral), `.danger` (dipakai buat ROI item lama —
  pertimbangkan ganti ke `.roi` biar konsisten tone-nya kalem), `.roi` (Room of Improvement,
  warna beda dari danger, tone lebih tenang), `.ok` (klarifikasi/update positif dari analisis awal).
  **`.callout` WAJIB dipakai sebagai block-level element sendiri (`<div class="callout ...">`),
  JANGAN PERNAH di-inline di tengah kalimat/bullet** (misal `<span class="callout roi"
  style="display:inline">...</span>` di dalam `<li>`) — CSS-nya didesain buat blok dengan
  border-left+padding, kalau dipaksa inline hasilnya visual glitch (garis vertikal motong tengah
  teks). Kalau cuma butuh cross-reference singkat ke item ROI dari dalam kalimat/bullet, cukup
  tulis plain text: `(lihat ROI §14)` — tanpa class/span apapun.
- `.badge.get` / `.badge.post` — badge HTTP method di tabel API endpoint.

## 6. Bahasa & Tone

Ikuti bahasa yang diminta user untuk dokumen ini (default: Bahasa Indonesia formal-teknis,
istilah teknis/nama kode tetap bahasa asli). Tone: netral, faktual, seperti dokumentasi internal
dev team — bukan laporan audit atau presentasi ke manajemen. Kalimat ROI selalu ditutup rekomendasi
konkret, bukan cuma keluhan.

## 7. Cross-tool Portability

Metodologi ini SAMA untuk semua AI coding tool. Yang beda cuma cara load instruksi ini:
lihat `../adapters/<tool>/` untuk versi teradaptasi per tool. Kalau merevisi aturan/struktur di
sini, jangan lupa cek apakah adapter lain perlu di-sync (adapter seharusnya cuma nunjuk balik ke
file ini, bukan duplikat isi — kalau ada tool yang gak bisa `include` file lain, salin ringkas
dan tulis komentar "sumber: core/tsd-blueprint-core.md, cek situ kalau ada revisi").
