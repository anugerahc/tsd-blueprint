---
description: Generate TSD untuk 1 module dari investigasi source code + live database
---

When the user types `/tsd-blueprint`, jalankan skill `tsd_blueprint` (`.agents/skills/tsd_blueprint.md`):
1. Kalau argumen module/project belum disebut di prompt, tanya dulu — jangan asumsi.
2. Ikuti Instructions di `tsd_blueprint.md` langkah demi langkah.
3. Laporkan ke user path folder TSD yang dihasilkan, dan ringkasan section yang butuh review manual
   (misal bagian yang belum sempat live-verified karena MCP DB server belum konek).
