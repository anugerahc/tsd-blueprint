# Prompt Optimal buat Generate TSD

Skill `tsd-blueprint` bisa ke-trigger dari prompt natural yang sekadar nyebut "TSD"/"dokumentasi
teknis", tapi hasilnya jauh lebih akurat & lengkap kalau promptnya kasih konteks yang jelas di
depan — skill gak perlu nebak-nebak/nanya bolak-balik, langsung eksekusi presisi.

## Prompt cepat (cukup buat kasus sederhana)

```
Buatkan TSD untuk module [NAMA_MODULE] di project ini
```

## Prompt optimal (rekomendasi — isi context sebanyak yang lu tau)

```
Buatkan TSD (Technical Spec Document) untuk module [NAMA_MODULE] di [NAMA_PROJECT].

Konteks:
- Lokasi source code module: [path folder/namespace kalau tau, mis. "Controllers/Tiger/ISure*, Services/Tiger/ISure/*"]
- Database yang relevan: [sebutkan engine/nama DB kalau tau, mis. "PostgreSQL (ProductTrialDB) + Oracle EBS"]
- Output TSD ditaruh di: [path folder output, mis. "D:/Data ANU/TSD/[NAMA_MODULE]/"]
- Bahasa dokumen: [Bahasa Indonesia formal-teknis / English]

Ikuti metodologi lengkap di skill ini — wajib verifikasi tiap klaim dari source code aktual dan/atau
live database query (pakai MCP DB tools yang tersedia), jangan asumsi. Kalau ada MCP DB yang belum
konek ke database module ini, ikuti alur discovery (cek appsettings dulu, tanya saya sebelum
install/ubah config apapun). Kalau ada temuan gap/celah yang genuinely terverifikasi, masukkan ke
Room of Improvement dengan rekomendasi konkret — bukan cuma keluhan.
```

## Contoh yang sudah diisi

```
Buatkan TSD (Technical Spec Document) untuk module ItemSpecRM di IDC-System.

Konteks:
- Lokasi source code module: IDC-System.Services/RMPM/ItemSpecRM/*, Controllers/RMPM/ItemSpecRM*
- Database yang relevan: PostgreSQL (RMPM context) — kemungkinan ada lookup ke Oracle EBS juga
- Output TSD ditaruh di: D:/Data ANU/TSD/ItemSpecRM/
- Bahasa dokumen: Bahasa Indonesia formal-teknis

Ikuti metodologi lengkap di skill ini — wajib verifikasi tiap klaim dari source code aktual
dan/atau live database query, jangan asumsi. Kalau ada temuan gap/celah yang genuinely
terverifikasi, masukkan ke Room of Improvement dengan rekomendasi konkret.
```

## Kenapa prompt ini optimal

- **Nyebut lokasi source code** (kalau tau) — skill gak perlu Glob luas ke seluruh project buat
  nemuin controller/service yang relevan, langsung presisi ke folder yang benar. Kalau gak tau,
  gapapa dikosongin — skill tetap akan investigasi dari entry point (controller/menu) module itu.
- **Nyebut engine database** — mempercepat skill milih MCP DB tool yang tepat, dan kalau ternyata
  belum ada MCP yang connect, skill udah punya petunjuk mau cari KEY connection string apa di
  `appsettings.json`.
- **Nentuin lokasi output di depan** — menghindari skill nanya balik "mau ditaruh di mana" atau
  nebak lokasi yang salah.
- **Nentuin bahasa dokumen** — defaultnya Bahasa Indonesia formal-teknis, tapi kalau project/tim lu
  pakai English, tegasin di sini.
- **Negasin ulang aturan inti** (verifikasi wajib, ROI bukan komplain) — walau ini udah baked-in ke
  skill, menegaskan di prompt bikin skill "commit" lebih kuat ke aturan itu di awal percakapan.

## Tips tambahan

- **Pastikan MCP DB server yang relevan udah konek SEBELUM minta generate** (`/mcp` atau cek daftar
  tool yang tersedia) — kalau belum, skill akan coba alur discovery (baca appsettings, tanya izin
  setup), tapi hasil paling akurat tetap kalau MCP-nya udah siap dari awal.
- **Untuk update TSD yang sudah ada** (bukan generate baru), sebut eksplisit: *"Update TSD module X
  yang sudah ada di [path] — ada perubahan di [fitur/area apa], sinkronkan section [nomor section]
  aja"* — supaya skill tau ini mode update, bukan generate ulang dari nol (lihat aturan
  "jangan overwrite diam-diam" di `core/tsd-blueprint-core.md`).
- **Kalau mau exclude/tambah section** di luar 16 section baku, sebut eksplisit di prompt — skill
  akan tetap konfirmasi dulu sebelum menyimpang dari struktur baku.
- **Satu module per prompt.** Kalau minta "buatkan TSD untuk semua module", skill akan berhenti dan
  minta klarifikasi (sesuai aturan "kalau scope ambigu, tanya dulu") — lebih efisien kalau lu udah
  breakdown jadi 1 prompt per module dari awal.
