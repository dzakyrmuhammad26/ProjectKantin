# API Testing dengan Newman (Kantin Sentral Backend)

Folder ini berisi koleksi pengujian API otomatis berbasis **Postman Collection v2.1** yang dieksekusi menggunakan **Newman**.

## Struktur File
- `kantin-api.postman_collection.json` — Koleksi lengkap seluruh endpoint API (positif & negatif).
- `kantin-local.postman_environment.json` — Konfigurasi environment lokal (`http://localhost:5000/api`) dan kredensial seeder.
- `run-newman.js` — Script runner Newman untuk menjalankan suite pengujian sekaligus mengekspor laporan JSON.
- `sample-menu.jpg` & `sample-invalid.txt` — File sampel gambar valid dan file non-gambar untuk skenario pengujian upload.

## Prasyarat
1. Pastikan database sudah di-seed (`bun run seed`).
2. Pastikan server backend sudah berjalan (`bun run dev` atau `bun run start`).

## Cara Menjalankan Testing

### Menggunakan Script NPM/Bun
```bash
bun run test:api
```

### Menggunakan Newman CLI Secara Langsung
```bash
bunx newman run testing/kantin-api.postman_collection.json -e testing/kantin-local.postman_environment.json
```

### Menguji URL Server Berbeda
```bash
API_BASE_URL=http://localhost:5000/api bun run test:api
```

## Cakupan Skenario Pengujian
1. **Health & 404 Handling**: Cek health endpoint dan penanganan endpoint tidak ditemukan.
2. **Auth**: Login PIN (Superadmin, Kasir, Gerai), Verify PIN, Guest Token, `/auth/me`, serta skenario error (`401` token kosong/salah, PIN salah, `422` validasi).
3. **Pengguna**: List, Filter, Create, Show, Update (`PUT` & `PATCH`), Ubah PIN, Soft Delete, Permanent Delete, serta validasi RBAC (`403` jika bukan superadmin).
4. **Gerai**: List, Filter aktif, Show (by kode/ID), Create, Update, Delete, serta validasi HEX & RBAC.
5. **Menu**: List, Filter, By Gerai, Show, Create, Update, Toggle Habis/Favorit, Delete, serta validasi stok & RBAC.
6. **Sesi Pelanggan**: Buka Sesi kartu 1–99 (termasuk idempotency sesi aktif), Cek Sesi Aktif by Kartu, Update Status, Tutup Sesi, dan validasi nomor kartu (`422`).
7. **Pesanan**: Buat Pesanan (validasi menu habis `400`, item kosong `422`), List & Filter per Kartu/Gerai/Sesi, Update Items, Update Status, Batalkan Pesanan, dan RBAC.
8. **Pembayaran**: Proses Pembayaran Tunai & hitung kembalian, validasi uang kurang (`422`), List & Filter riwayat, Detail pembayaran.
9. **Laporan**: Rekapitulasi Harian per Gerai & Ringkasan Dashboard.
10. **Pengaturan**: Baca Pengaturan, Update (`PUT`/`PATCH`), serta proteksi role superadmin (`403`).
11. **Upload Gambar**: Upload file gambar valid (`201`), cleanup file (`DELETE /upload`), validasi tanpa file (`422`), tolak format non-gambar (`400`), tanpa token (`401`), dan proteksi RBAC role non-admin/gerai (`403`).
