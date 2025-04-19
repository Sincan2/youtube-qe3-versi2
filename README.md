---

## 📂 Isi di Dalam ZIP:
- `controller.mjs` → Jalankan ini untuk mulai viewer farm
- `viewerInstance.mjs` → Worker per proxy
- `config.json` → Konfigurasi jumlah viewer & URL video
- `testedProxies.txt` → Tempat kamu isi daftar proxy SOCKS5
- `usedProxies.txt` → Dicatat otomatis oleh controller
- `ipCountryCache.json` → Cache negara asal IP
- `logs/` → Hasil log nonton per hari

---

## 🚀 Cara Jalankan

1. **Isi `testedProxies.txt`** dulu (pakai script fetch proxy Asia)
2. Jalankan:

```bash
node controller.mjs
```

3. Viewer akan berjalan paralel (10 max), bergantian selama proxy tersedia

---
