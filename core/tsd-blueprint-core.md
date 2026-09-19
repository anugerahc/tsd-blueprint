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
   - **Sebelum declare "MCP DB gak ada/gak cocok" — cek dulu apa memang benar gak ada jalan lain**,
     ikuti alur discovery di bagian 1a sebelum jatuh ke fallback code-only.

### 1a. Discovery & Setup MCP DB kalau belum konek ke database yang relevan

1. Cek MCP DB tools yang SUDAH tersambung di sesi ini — kalau ada yang engine & scope-nya cocok
   buat database module yang lagi diinvestigasi, pakai itu, selesai di sini.
2. Kalau belum ada yang cocok: baca file config koneksi project (`appsettings.json` /
   `appsettings.*.json` / `.env` / config setara tergantung stack) buat nemuin KEY connection
   string yang relevan sama module ini (biasanya per-DbContext atau per-service), dan dari situ
   tentuin engine database-nya (Postgres/MSSQL/Oracle/MySQL/dll — biasanya kelihatan dari nama
   provider di kode, mis. `UseNpgsql`/`UseSqlServer`/nama library Oracle). **Jangan pernah
   decrypt/tempel isi ciphertext connection string ke user atau ke dokumen** — cukup nama KEY dan
   engine-nya.
3. Kalau ketemu kandidat database yang relevan tapi belum ada MCP server yang connect ke situ:
   **WAJIB tanya user dulu secara eksplisit sebelum lanjut** — jangan install/ubah config apapun
   diam-diam. Sampaikan: nama KEY connection string yang ketemu, engine-nya, dan bahwa lanjut
   berarti (a) mungkin perlu install tooling MCP server buat engine itu kalau belum ada di mesin,
   dan (b) menulis entry config MCP baru (biasanya file config global tool AI yang dipakai, di luar
   folder project) yang isinya bisa termasuk connection detail/credential.
4. Begitu user setuju:
   a. Cek dulu apa tooling MCP buat engine itu udah ke-install di mesin (cek binary di PATH, atau
      pola entry MCP config yang sudah ada buat engine sama tapi database beda — kalau ada, itu
      tandanya tooling-nya sudah terpasang, tinggal tiru pola confignya). Kalau belum ke-install,
      cari tahu dulu nama package resmi MCP server buat engine itu (jangan asal tebak nama
      package), lalu install via package manager yang sesuai (npm/pip/dll) — tunjukkan command
      yang bakal dijalankan sebelum eksekusi.
   b. Kalau di config MCP yang sudah ada ketemu entry lain dengan engine yang sama (mis. sudah ada
      `mssql` buat database lain), tiru struktur entry itu persis dan minta user cuma kasih detail
      koneksi yang beda (host/port/nama database/username/password) buat database baru ini.
   c. Tambahkan entry baru ke config MCP tool yang dipakai (lokasinya beda-beda per tool — cari
      tahu konvensi tool yang sedang aktif, jangan asumsi satu lokasi berlaku untuk semua).
   d. Kasih tahu user: MCP server baru biasanya baru bisa dipakai setelah restart sesi/tool — gak
      langsung aktif di sesi yang sedang berjalan sekarang.
5. Kalau user menolak atau belum sempat setup MCP baru saat itu: fallback normal — lanjut dari
   source code saja, tandai eksplisit "belum live-verified" sesuai aturan 1.
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

Urutan & nomor di bawah SUDAH final grouped — 3 blok angka nyambung (00-02, 03-08, 09-15),
selaras sama 3 grup sidebar collapsible di §5. **Jangan pernah bikin section yang nomornya
melompat keluar rentang grup-nya sendiri** (nomor section HARUS naik terus dari section pertama
sampai terakhir tanpa loncat — kalau grouping visual gak sinkron sama urutan angka fisik, sidebar
bakal keliatan buggy walau isinya bener):

**Grup 1 — Overview & Proses Bisnis**
00. Riwayat Revisi
01. Latar Belakang & Tujuan (business background, objectives, scope in/out, glossary)
02. Alur Bisnis / Proses (flow diagram, state machine, transisi & trigger, side-effect tiap perubahan status)

**Grup 2 — Spesifikasi Fungsional**
03. Modul Input Data (field per form/tab, auto-generate logic, format nomor dokumen)
04. Modul Validasi / Business Rule (generation logic, perhitungan, validasi — tandai mana yang cuma client-side)
05. Notifikasi & Template Komunikasi
06. Field Dictionary
07. Tombol Aksi & Perilaku
08. Audit Trail & Access

**Grup 3 — Spesifikasi Teknis & Referensi**
09. Query & Business Logic dari Kode (kutipan LINQ/kode asli + terjemahan raw SQL buat DB editor + penjelasan)
10. API Endpoint Specification (per controller/API class, method/action/param/return/catatan)
11. Technical Specification (tech stack table, RBAC/access matrix)
12. Database Architecture (ERD) — full column, real FK constraints (cek live, jangan cuma baca ModelBuilder), definisi view/SP yang dipakai
13. Integrasi Sistem Eksternal
14. Room of Improvement (ROI)
15. Appendix — Koneksi Database (nama KEY connection string per environment, method decrypt-nya — JANGAN taruh ciphertext/credential asli)

Section boleh ditambah/dikurangi kalau module-nya emang beda karakter (misal gak ada notifikasi
email sama sekali) — tapi diskusikan dulu ke user sebelum menghapus section baku, dan kalau ada
section yang dihapus/ditambah, **renumber ulang section sesudahnya** supaya tiap grup tetap
punya rentang angka nyambung (jangan cuma hapus section-nya terus biarin ada lubang di angka).

Kalau ada cross-reference tertulis di prose (mis. `(lihat §09)`, `(lihat ROI §14)`) dan section-nya
di-renumber, WAJIB update semua cross-reference itu juga di seluruh dokumen — jangan cuma ganti
nomor section-nya doang.

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
- **Sidebar TOC dikelompokkan jadi 3 grup collapsible** (`.toc-group` > `.toc-group-toggle` +
  `.toc-sub`), bukan 1 daftar 16 item flat — biar sidebar gak keliatan gamplang. Grouping baku
  (nomor section SUDAH direnumber biar nyambung per grup — lihat §2, JANGAN pakai nomor lama
  yang loncat-loncat):
  1. **📘 Overview & Proses Bisnis** — 00 Riwayat Revisi, 01 Latar Belakang, 02 Alur Bisnis.
  2. **🧩 Spesifikasi Fungsional** — 03 Input Data, 04 Business Rule, 05 Notifikasi,
     06 Field Dictionary, 07 Tombol & Perilaku, 08 Audit & Access.
  3. **⚙️ Spesifikasi Teknis & Referensi** — 09 Query dari Kode, 10 API Endpoint,
     11 Tech Spec & RBAC, 12 Database/ERD, 13 Integrasi Eksternal, 14 Room of Improvement,
     15 Appendix Koneksi Database.
  Grup 1 default expanded (`aria-expanded="true"`, `.toc-sub` tanpa class `collapsed`), grup 2 & 3
  default collapsed (`aria-expanded="false"`, `.toc-sub.collapsed`). JS (`script.js`) otomatis
  expand grup yang lagi berisi section aktif pas discroll — jangan hapus logic `expandGroupOf()` itu.
  Kalau section baku ditambah/dikurangi (lihat §2), sesuaikan section itu masuk grup mana yang
  paling relevan (business/functional/technical) — jangan bikin grup ke-4 kecuali user minta.

## 5b. Evidence Link ke File Source Code (kalau mau nunjuk ke file, bukan cuma kutip verbatim)

Kutipan kode verbatim di §09 (Query & Business Logic) itu sudah cukup dan portable dengan sendirinya
— gak butuh link apapun. Tapi kalau mau nambah evidence/traceability berupa link ke file source
(mis. "lihat GtProdukService.cs baris 241-249"), WAJIB pilih salah satu dari 2 cara ini — JANGAN
pernah pakai link relative filesystem lokal (`<a href="../../path/ke/File.cs">`):

1. **Kalau project punya remote git yang bisa diakses (GitHub/GitLab, dst):** pakai URL hosted
   repo yang di-pin ke commit SHA saat itu, plus anchor baris kalau platform-nya support (GitHub:
   `#L241-L249`). Contoh: `https://github.com/org/repo/blob/<commit-sha>/path/File.cs#L241-L249`.
   Ini tetap valid diklik dari device/folder manapun selama ada akses internet ke repo itu — gak
   bergantung struktur folder lokal sama sekali.
2. **Kalau gak ada remote yang bisa diakses (repo private tanpa akses publik, atau gak yakin
   dokumen ini bakal dibuka dari mana):** JANGAN pakai `<a href>` sama sekali. Cukup teks polos:
   `<code>path/relatif/dari/root/repo/File.cs</code> · baris 241-249`. Informatif tanpa janjiin
   link yang bisa jadi 404 begitu dokumen dipindah keluar dari lokasi asalnya.

Alasan larangan relative filesystem path: link kayak `../../MAVEN.Services/...` cuma valid selama
dokumennya nangkring persis di kedalaman folder yang sama relatif ke root repo aslinya. Begitu
folder TSD-nya di-copy/di-share ke device lain atau lokasi lain (yang notabene skenario paling
umum buat dokumen yang niatnya dibagi ke tim), SEMUA link itu putus jadi 404 — padahal dokumennya
sendiri (HTML+CSS+JS) tetap portable. Jangan buat 1 bagian dokumen jadi gak portable gara-gara ini.

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
