# PRD — Sistem POS Kantin Multi-Gerai (Kasir Terpusat)

Versi 1.1 · diperbarui 21 November 2026 (lihat bagian 20) · Status: Draft untuk validasi dengan pemilik · Bahasa: Indonesia

## 1. Ringkasan Produk

Aplikasi web (PWA) untuk kantin yang terdiri dari banyak gerai sewaan dengan **satu kasir terpusat**. Pesanan bisa masuk lewat tiga jalur: pelanggan sendiri lewat barcode di meja, penjual di gerai, atau kasir. Pelanggan membayar sekali di kasir, lalu gerai membuat pesanan. Setiap pesanan diikat oleh satu **KODE PELANGGAN** berupa kartu fisik bernomor, sehingga kasir tidak keliru menagih. Antarmuka dirancang untuk tablet dan harus memungkinkan **satu pesanan diinput dalam sekitar 4 detik**.

**Satu kalimat:** Pelanggan, gerai, atau kasir menginput pesanan memakai kode pelanggan, kasir menagih semuanya sekaligus, gerai mendapat notifikasi lunas di tabletnya lalu langsung membuat pesanan, lalu pemilik mendapat rekap dan perhitungan sewa per gerai.

## 2. Latar Belakang dan Masalah

Pemilik memiliki beberapa gerai di depan rumahnya dan menyewakannya ke penjual. Pembayaran dipusatkan di satu kasir. Masalah yang ingin diselesaikan:

- Pelanggan membeli dari banyak gerai, sehingga tanpa pengikat yang jelas kasir mudah salah menjumlah atau salah menagih.
- Pencatatan manual membuat pembagian hasil ke penyewa lambat dan sulit diaudit.
- Gerai perlu tahu pasti bahwa pesanan sudah dibayar sebelum menyerahkan makanan.
- Pemilik butuh laporan omzet per gerai untuk menghitung sewa atau komisi.

## 3. Tujuan dan Metrik Sukses

| Tujuan | Metrik | Target |
| --- | --- | --- |
| Input pesanan cepat | Waktu dari ketik kode sampai tombol Kirim | ≤ 4 detik untuk pesanan 1–3 item |
| Kasir akurat | Selisih tagihan vs pesanan gerai | 0 selisih |
| Pembayaran cepat | Waktu dari kode diketik sampai lunas | ≤ 30 detik (tunai), ≤ 45 detik (QRIS) |
| Rekap otomatis | Rekap harian per gerai tersedia tanpa input manual | 100% |
| Mudah dipelajari | Gerai baru bisa memakai tanpa pelatihan panjang | ≤ 15 menit orientasi |

## 4. Di Luar Cakupan MVP (Non-Goals)

- Pembayaran online langsung dari HP pelanggan (pembayaran tetap di kasir).
- Manajemen stok bahan baku.
- Program loyalitas, voucher, dan promo.
- Integrasi pembukuan atau pajak otomatis.
- Aplikasi native (cukup PWA).
- Pengiriman atau pesan-antar.

## 5. Pengguna dan Peran

| Peran | Deskripsi | Perangkat |
| --- | --- | --- |
| **Superadmin** | Pemilik. Mengelola gerai, penyewa, menu, akun, tarif sewa, laporan | Tablet atau laptop |
| **Admin (Kasir)** | Satu kasir terpusat. Mencari kode pelanggan, menerima pembayaran, mencetak struk | Tablet landscape di meja kasir |
| **User Gerai** | Perwakilan penyewa. Input pesanan, tandai siap atau selesai, lihat omzet gerainya | Tablet landscape di tiap gerai |

**Pelanggan** bukan akun. Pelanggan memakai halaman web pesan (tanpa login dan tanpa instal) yang dibuka dengan scan barcode di meja. Pelanggan hanya bisa membuat atau menambah pesanan atas nomor kartunya. Pelanggan tidak bisa membayar, membatalkan pesanan yang sudah masuk, atau melihat data pelanggan lain.

### Matriks Hak Akses

| Fitur | Superadmin | Kasir | User Gerai |
| --- | --- | --- | --- |
| Input pesanan | Ya | Ya (semua gerai) | Ya (gerai sendiri) |
| Lihat tagihan pelanggan | Ya | Ya | Hanya item gerai sendiri |
| Terima pembayaran | Ya | Ya | Tidak |
| Batalkan pesanan | Ya | Ya | Ya, sebelum lunas, dengan log |
| Refund | Ya | Dengan persetujuan Superadmin | Tidak |
| Kelola menu | Ya | Tidak | Menu gerai sendiri (opsional, diatur Superadmin) |
| Tandai menu habis | Ya | Tidak | Ya (gerai sendiri) |
| Kelola gerai dan akun | Ya | Tidak | Tidak |
| Laporan semua gerai | Ya | Ringkasan harian | Hanya gerai sendiri |

## 6. Konsep Inti dan Glosarium

| Istilah | Arti |
| --- | --- |
| **KODE PELANGGAN** | Nomor pengikat semua pesanan satu pelanggan dari berbagai gerai. Berupa angka 1–99 pada **kartu fisik bernomor** yang diambil pelanggan di pintu masuk (dikonfirmasi pemilik). Pelanggan mengetik nomor kartu itu saat memesan lewat HP. Pelanggan tidak menghafal, cukup menunjukkan kartu |
| **KODE GERAI** | Identitas gerai, contoh `G01`. Tiap gerai punya warna tetap |
| **KODE MAKANAN** | Identitas menu, contoh `G01-005`, disertai nama dan foto. Prefix gerai mencegah bentrok antar gerai |
| **Sesi Pelanggan** | Rentang hidup satu kode: terbuka saat pesanan pertama, tertutup setelah lunas. Setelah itu kode bebas dipakai pelanggan lain |
| **Pesanan** | Kumpulan item dari satu gerai dalam satu sesi |
| **Tagihan** | Gabungan semua pesanan dalam satu sesi |
| **Settlement** | Rekap omzet, potongan sewa atau komisi, dan jumlah bersih untuk penyewa |

## 7. Alur Pengguna Utama

Ada **tiga skema input pesanan**: (A) pelanggan memesan sendiri lewat barcode di meja, (B) penjual menginput di tablet gerai, (C) kasir menginput. Ketiganya bermuara ke **satu tagihan per kode pelanggan** (kartu fisik bernomor) dan dibayar di satu kasir, tunai atau QRIS.

**Aturan utama:** gerai baru membuat pesanan setelah pembayaran terkonfirmasi di kasir. Saat itu juga gerai terkait menerima notifikasi dari sistem.

### 7.1 Skema A — Pelanggan memesan sendiri lewat barcode meja

1. Pelanggan mengambil kartu bernomor di pintu masuk, misalnya **23**.
2. Pelanggan duduk dan scan barcode di meja. Halaman pesan terbuka di browser HP, tanpa instal aplikasi dan tanpa login.
3. Pelanggan memasukkan nomor kartunya (**23**). Jika nomor itu sudah punya pesanan, sistem menampilkan ringkasannya agar salah ketik terlihat.
4. Pelanggan memilih menu dari semua gerai dalam satu halaman, lalu menekan **Pesan**.
5. Pesanan terpecah otomatis per gerai dan masuk ke tagihan sesi 23 dengan status MENUNGGU BAYAR. Tablet gerai menampilkannya, tetapi belum dibuat.
6. Pelanggan membawa kartu ke kasir. Kasir mengetik **23** dan melihat tagihan gabungan.
7. Pelanggan membayar tunai atau QRIS, lalu status sesi menjadi **LUNAS**.
8. Tablet tiap gerai berbunyi dan menampilkan notifikasi. Gerai langsung membuat pesanan, lalu menandainya **SELESAI** saat diserahkan.

### 7.2 Skema B — Penjual menginput pesanan di gerai

1. Pelanggan mengambil kartu bernomor, misalnya **23**.
2. Pelanggan memesan di gerai A dan menunjukkan kartu.
3. User gerai mengetik **23** di keypad, mengetuk menu (ketuk berulang untuk menambah jumlah), lalu menekan **KIRIM**.
4. Sesi 23 terbuka otomatis. Pesanan masuk ke tagihan sesi 23 dengan status MENUNGGU BAYAR dan tampil di kasir secara real-time. Gerai belum membuatnya.
5. Pelanggan mengulang di gerai B dan C. Pesanan ditambahkan ke sesi 23.
6. Pelanggan ke kasir. Kasir mengetik **23** dan melihat tagihan gabungan yang dikelompokkan per gerai.
7. Kasir memilih metode bayar (Tunai atau QRIS), lalu status sesi menjadi **LUNAS**.
8. Tablet gerai A, B, dan C berbunyi dan menampilkan notifikasi **SUDAH DIBAYAR**, dan gerai langsung membuat pesanannya.
9. Gerai membuat pesanan lalu menandainya **SELESAI**. Kartu dikembalikan ke kasir.

### 7.3 Skema C — Kasir menginput pesanan

Untuk pelanggan yang tidak memakai HP atau lebih nyaman memesan langsung ke kasir, termasuk pesanan ke banyak gerai sekaligus.

1. Pelanggan menyerahkan kartu bernomor ke kasir dan menyebut pesanannya.
2. Kasir mengetik nomor kartu, memilih menu dari semua gerai (dikelompokkan per gerai), lalu menekan **Kirim**.
3. Kasir bisa langsung lanjut **Bayar** (jalur cepat) atau menunda pembayaran.
4. Setelah **LUNAS**, notifikasi ke gerai dan pembuatan pesanan sama seperti skema lain.

### 7.4 Pembayaran, notifikasi, dan campuran skema

Pembayaran selalu di kasir, tunai atau QRIS. Begitu status sesi menjadi **LUNAS**, sistem mengirim notifikasi real-time ke tablet setiap gerai yang punya pesanan di sesi itu, dan gerai langsung membuat pesanannya.

Ketiga skema boleh dicampur. Pesanan dari HP di gerai A, pesanan langsung di gerai B, dan tambahan dari kasir tetap masuk ke satu tagihan selama nomor kartunya sama.

## 8. Kebutuhan Fungsional

Prioritas: **P0** wajib MVP, **P1** tahap 2, **P2** tahap 3.

### 8.1 Autentikasi dan Akun

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-01 | Login username dan PIN atau password, berbasis peran | P0 |
| FR-02 | Akun User Gerai terikat ke satu gerai | P0 |
| FR-03 | Login cepat dengan PIN 4–6 digit untuk tablet gerai | P0 |
| FR-04 | Sesi login bertahan lama di tablet, logout manual | P0 |
| FR-05 | Superadmin membuat, menonaktifkan, dan mereset akun | P0 |

### 8.2 Manajemen Gerai dan Menu (Superadmin)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-10 | CRUD gerai: kode, nama, penyewa, warna, status aktif atau kosong | P0 |
| FR-11 | Atur model sewa per gerai: tetap, komisi %, atau gabungan | P0 |
| FR-12 | CRUD menu: kode, nama, harga, foto, kategori, urutan, aktif | P0 |
| FR-13 | Urutan menu dan gerai **tetap**, diatur manual, tidak pernah diacak otomatis | P0 |
| FR-14 | Menu favorit disematkan di posisi atas | P0 |
| FR-15 | Gerai menandai menu **Habis** dengan satu ketukan | P0 |
| FR-16 | Harga saat transaksi disalin ke item pesanan, sehingga perubahan harga tidak mengubah riwayat | P0 |
| FR-17 | Impor menu dari CSV | P2 |

### 8.3 Input Pesanan (Tablet Gerai)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-20 | Keypad angka besar untuk mengetik kode pelanggan | P0 |
| FR-21 | Setelah kode diketik, tampil ringkasan konfirmasi: nomor, jumlah gerai yang sudah memesan, total sementara | P0 |
| FR-22 | Daftar kode aktif sebagai jalan pintas ketuk (opsional) | P0 |
| FR-23 | Grid menu berfoto besar. Ketuk menambah 1, ketuk lagi menambah jumlah | P0 |
| FR-24 | Keranjang di sisi kanan dengan tombol kurang, tambah, hapus, dan catatan singkat | P0 |
| FR-25 | Satu tombol **KIRIM** besar tanpa dialog konfirmasi. Tersedia **Undo** selama beberapa detik setelah kirim | P0 |
| FR-26 | Pencarian menu cepat berdasarkan kode makanan atau nama | P1 |
| FR-27 | Kirim pesanan ke kode yang sesinya sudah LUNAS membuka sesi baru, dengan peringatan jelas | P0 |

### 8.4 Pemesanan Mandiri oleh Pelanggan (Barcode Meja)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-70 | Barcode di meja membuka halaman pesan (web mobile, tanpa instal dan tanpa login) | P0 |
| FR-71 | Satu barcode per meja, nomor meja terbawa otomatis di URL dan tercatat di pesanan | P1 |
| FR-72 | Pelanggan mengetik nomor kartu fisiknya, divalidasi terhadap rentang kode yang diatur | P0 |
| FR-73 | Jika nomor sudah punya pesanan hari ini, tampil ringkasan (jumlah gerai, total) dan pelanggan menekan 'Ya, ini kartu saya' | P0 |
| FR-74 | Katalog menu semua gerai dalam satu halaman: tab per gerai, foto, harga, tombol tambah dan kurang | P0 |
| FR-75 | Keranjang dan tombol **Pesan**. Pesanan terpecah otomatis per gerai | P0 |
| FR-76 | Layar konfirmasi: nomor kartu besar, ringkasan pesanan, dan petunjuk 'Bayar di kasir dengan kartu No. X' | P0 |
| FR-77 | Pelanggan bisa menambah pesanan dengan nomor yang sama | P0 |
| FR-78 | Pelanggan melihat status pesanan di HP (Menunggu bayar, Dibuat, Selesai) | P1 |
| FR-79 | Perlindungan penyalahgunaan: batas kecepatan, batas jumlah item per pesanan, validasi di server | P0 |

### 8.5 Input Pesanan oleh Kasir

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-80 | Layar Pesan di kasir: ketik nomor kartu, pilih menu semua gerai yang dikelompokkan per gerai berwarna | P0 |
| FR-81 | Dua tombol: **Kirim** dan **Kirim & Bayar** (jalur cepat langsung ke pembayaran) | P0 |
| FR-82 | Kasir dapat menambah, mengubah, atau membatalkan item pesanan dari skema mana pun selama belum lunas | P0 |
| FR-83 | Setiap pesanan mencatat sumbernya: pelanggan, gerai, atau kasir | P0 |
| FR-84 | Pesanan dari kasir langsung tampil di tablet gerai terkait dengan status Menunggu Bayar atau Siap Dibuat | P0 |

### 8.6 Antrean Gerai dan Notifikasi Lunas

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-30 | Tab antrean: Menunggu Bayar (belum boleh dibuat), Siap Dibuat (sudah lunas), Selesai | P0 |
| FR-31 | Kartu pesanan menampilkan kode pelanggan besar, daftar item, status, serta sumber pesanan (pelanggan, gerai, atau kasir) dan nomor meja bila ada | P0 |
| FR-32 | Notifikasi real-time (visual dan bunyi) ke gerai terkait saat pesanan LUNAS, dan pesanan langsung berpindah ke Siap Dibuat | P0 |
| FR-33 | Tandai Selesai atau Diserahkan dengan satu ketukan | P0 |
| FR-34 | Batalkan pesanan sebelum lunas, wajib mencatat alasan singkat | P0 |

### 8.7 Kasir — Tagihan dan Pembayaran

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-40 | Keypad besar untuk mencari kode pelanggan | P0 |
| FR-41 | Tagihan gabungan dikelompokkan per gerai (warna dan kode gerai), tiap baris menampilkan kode makanan, nama, jumlah, harga, serta subtotal gerai dan total | P0 |
| FR-42 | Daftar pelanggan aktif beserta status belum bayar atau lunas dan total | P0 |
| FR-43 | Pembayaran **Tunai**: input uang diterima, tombol nominal cepat (pas, 50rb, 100rb), kembalian otomatis | P0 |
| FR-44 | Pembayaran **QRIS dinamis**: tampilkan QR per transaksi, status lunas otomatis lewat webhook | P1 |
| FR-45 | Pembayaran QRIS statis dengan konfirmasi manual kasir sebagai cadangan | P0 |
| FR-46 | Cetak atau tampil struk digital | P1 |
| FR-47 | Kasir dapat membatalkan atau mengoreksi item sebelum lunas dengan log | P0 |
| FR-48 | Tandai sesi lama yang belum lunas sebagai **Tidak Dibayar** untuk ditindaklanjuti | P1 |
| FR-49 | Split bayar (sebagian tunai, sebagian QRIS) | P2 |

### 8.8 Dashboard dan Laporan (Superadmin)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-50 | Dashboard hari ini: omzet total, omzet per gerai, jumlah transaksi, jam ramai | P0 |
| FR-51 | Rekap harian per gerai: omzet kotor, potongan, bersih | P0 |
| FR-52 | Filter periode (hari, minggu, bulan) dan ekspor CSV | P1 |
| FR-53 | Perhitungan sewa atau komisi otomatis per periode (settlement) | P1 |
| FR-54 | Menu terlaris per gerai | P1 |
| FR-55 | Log audit: pembatalan, refund, perubahan harga, perubahan akun | P1 |
| FR-56 | User Gerai melihat omzet harian gerainya sendiri | P0 |

### 8.9 Pengaturan Sistem

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-60 | Jumlah kode pelanggan (default 1–99) | P0 |
| FR-61 | Mode bayar: akhir atau awal | P1 |
| FR-62 | Info usaha untuk struk (nama, alamat, footer) | P1 |
| FR-63 | Metode pembayaran aktif | P0 |

## 9. Spesifikasi Layar

Target utama: **tablet landscape 10–11 inci (sekitar 1280×800)**. Layar harus tetap responsif untuk tablet portrait dan laptop. Halaman pelanggan (S11) dirancang mobile-first untuk HP portrait.

### S1. Login

Dua pilihan: pilih akun (avatar gerai atau kasir) lalu masukkan PIN dengan keypad besar. Logo kantin di tengah.

### S2. Gerai — Input Pesanan (layar utama gerai)

- **Header:** nama dan warna gerai, indikator koneksi, tab Pesan dan Antrean, nama user.
- **Kiri atas:** tampilan kode pelanggan yang sedang diisi (angka sangat besar) dengan keypad 0–9, Hapus, dan OK. Di bawahnya chip kode aktif.
- **Kiri tengah:** ringkasan konfirmasi (No. 23 · sudah 2 gerai · Rp 35.000).
- **Kiri utama:** grid menu 3–4 kolom, kartu berfoto besar (tinggi tombol minimal 80px), nama, harga, kode makanan, badge jumlah. Favorit di atas. Menu habis ditampilkan abu-abu dengan ikon silang.
- **Kanan:** keranjang (item, jumlah, subtotal), total besar, tombol **KIRIM** hijau selebar panel, tombol Kosongkan dan Undo.

### S3. Gerai — Antrean

Tiga kolom: Menunggu Bayar (kuning, belum boleh dibuat), Siap Dibuat (hijau, berkedip dan berbunyi saat baru), Selesai (abu-abu). Kartu berisi kode pelanggan besar, waktu, item, dan tombol Selesai atau Batal.

### S4. Kasir — Beranda dan Pencarian

- **Kiri:** keypad besar dan kolom kode pelanggan.
- **Kanan:** daftar pelanggan aktif (kode, jumlah gerai, total, status).

### S5. Kasir — Tagihan dan Pembayaran

- Header besar: **No. 23**, status, waktu sesi.
- Daftar dikelompokkan per gerai dengan pita warna gerai dan subtotal.
- Panel kanan: total besar, tombol **TUNAI** dan **QRIS**, lalu tombol Batalkan item.
- **Dialog Tunai:** uang diterima, nominal cepat, kembalian besar, tombol Selesai.
- **Dialog QRIS:** QR besar, hitung mundur, status menunggu atau berhasil, tombol Konfirmasi Manual.
- **Layar sukses:** centang hijau, opsi Cetak Struk dan Transaksi Berikutnya.

### S6. Superadmin — Dashboard

Kartu ringkasan (omzet hari ini, transaksi, rata-rata per pelanggan), grafik omzet per gerai, grafik jam ramai, tabel rekap per gerai, dan daftar aktivitas terbaru.

### S7. Superadmin — Kelola Gerai

Tabel gerai (kode, nama, penyewa, model sewa, status). Form tambah dan ubah dalam panel samping.

### S8. Superadmin — Kelola Menu

Pilih gerai, daftar menu dengan foto kecil, harga, urutan yang bisa digeser, dan sakelar aktif.

### S9. Superadmin — Laporan dan Settlement

Filter periode, tabel omzet kotor, potongan, bersih per gerai, tombol ekspor CSV, dan rincian transaksi.

### S10. Superadmin — Pengguna dan Pengaturan

Daftar akun dan peran, reset PIN, serta pengaturan sistem (jumlah kode, mode bayar, info struk).

### S11. Pelanggan — Halaman Pesan (HP)

Mobile-first, portrait, tanpa login. Alurnya: (1) kolom nomor kartu dengan keypad angka dan peringatan bila nomor sudah dipakai; (2) tab gerai di atas dengan warna tetap dan daftar menu berfoto dengan tombol tambah dan kurang; (3) bar keranjang menempel di bawah berisi total dan tombol **PESAN**; (4) layar konfirmasi dengan nomor kartu besar dan teks 'Bayar di kasir dengan kartu No. 23'; (5) opsional status pesanan.

### S12. Kasir — Input Pesanan

Tombol **Pesan** di beranda kasir. Kiri: keypad kode pelanggan. Tengah: menu semua gerai dikelompokkan per gerai berwarna dengan urutan tetap. Kanan: keranjang per gerai, total, tombol **KIRIM** dan **KIRIM & BAYAR**.

## 10. Prinsip Desain dan UX

1. **Cepat di atas segalanya.** Setiap langkah tambahan harus dibenarkan. Tanpa dialog konfirmasi berlapis, gunakan Undo.
2. **Tata letak konsisten dan tidak acak.** Urutan gerai dan menu selalu sama agar jari hafal posisi.
3. **Target sentuh besar.** Minimal 48px, tombol utama minimal 80px, jarak antar tombol cukup untuk jari.
4. **Kode sebagai patokan visual.** Kode pelanggan selalu tampil sangat besar. Kode gerai selalu disertai warna tetap.
5. **Status jelas dengan warna dan ikon.** Kuning menunggu bayar, hijau lunas, abu-abu selesai, merah batal atau error. Tidak mengandalkan warna saja.
6. **Kontras tinggi** agar terbaca di ruang terbuka yang terang.
7. **Teks Bahasa Indonesia** yang singkat. Format uang `Rp 35.000`.
8. **Mode terang** sebagai default. Font minimal 16px, angka penting 32px ke atas.
9. **Umpan balik instan.** Bunyi atau getar ringan saat berhasil kirim, dan indikator koneksi selalu terlihat.

## 11. Kebutuhan Non-Fungsional

| Aspek | Kebutuhan |
| --- | --- |
| Performa | Aksi ketuk responsif < 100 ms. Pesanan sampai di kasir < 2 detik |
| Real-time | Pesanan baru dan status lunas diterima tanpa refresh (SSE atau WebSocket) |
| Ketersediaan | Beroperasi selama jam kantin. Backup database harian |
| Offline | Indikator koneksi jelas. Antrean kirim offline dengan sinkron ulang (P1) |
| Keamanan | Password atau PIN ter-hash, akses berbasis peran di sisi server, HTTPS, validasi webhook QRIS |
| Konsistensi data | Transaksi pembayaran bersifat atomik. Harga disalin saat pemesanan |
| Kompatibilitas | Chrome atau Safari terbaru di tablet Android atau iPad. PWA fullscreen |
| Audit | Pembatalan, refund, dan perubahan data penting tercatat dengan siapa dan kapan |
| Skalabilitas | Dirancang untuk 5–30 gerai dan beberapa ratus transaksi per hari |

## 12. Model Data

```
users         (id, nama, username, pin_hash, role[superadmin|kasir|gerai], gerai_id?, aktif)
gerai         (id, kode, nama, penyewa, warna, status, model_sewa, tarif_tetap, komisi_persen)
menu          (id, gerai_id, kode, nama, harga, foto_url, kategori, urutan, favorit, aktif, habis)
sesi_pelanggan(id, kode, tanggal, status[aktif|lunas|tidak_dibayar|dibatalkan], dibuka_at, ditutup_at)
pesanan       (id, sesi_id, gerai_id, status[menunggu_bayar|siap_dibuat|selesai|batal], sumber[pelanggan|gerai|kasir], meja_id?, dibuat_by?, dibuat_at, catatan)
pesanan_item  (id, pesanan_id, menu_id, nama_saat_itu, harga_saat_itu, qty, catatan)
pembayaran    (id, sesi_id, metode[tunai|qris], jumlah, diterima, kembalian, status, ref_qris, kasir_id, waktu)
refund        (id, pembayaran_id, jumlah, alasan, disetujui_by, waktu)
settlement    (id, gerai_id, periode_awal, periode_akhir, omzet, potongan, bersih, status)
audit_log     (id, user_id, aksi, entitas, entitas_id, detail_json, waktu)
pengaturan    (kunci, nilai)
```

Tabel tambahan untuk barcode meja: `meja (id, nomor, kode_barcode, aktif)`. Tabel `pengaturan (kunci, nilai)` berdiri sendiri dan tidak punya relasi.

**Relasi:** satu sesi punya banyak pesanan (satu per pengiriman gerai) dan satu pembayaran menutup seluruh sesi. Kode pelanggan hanya boleh punya **satu sesi berstatus aktif** pada satu waktu.

### Diagram ERD

&#91;embedded content: ERD sistem POS kantin · 11 tabel, 11 relasi\]

Setiap pesanan menunjuk ke satu sesi pelanggan (kartu nomor), satu gerai, dan opsional satu meja, apa pun skema pemesanannya. Pembayaran menutup sesi sehingga semua pesanan di dalamnya lunas sekaligus, sedangkan settlement dihitung per gerai dari item pesanan yang sudah lunas.

## 13. Aturan Bisnis

1. Sesi terbuka otomatis saat pesanan pertama dikirim ke kode yang belum punya sesi aktif.
2. Sesi ditutup (LUNAS) saat pembayaran penuh diterima. Semua pesanan di dalamnya berubah menjadi SIAP DIBUAT secara atomik dan gerai terkait menerima notifikasi.
3. Pesanan yang dikirim ke kode berstatus LUNAS membuka sesi baru. Sistem menampilkan peringatan agar kartu yang tertinggal tidak menimbulkan salah tagih.
4. Pesanan hanya dapat dibatalkan sebelum lunas. Setelah lunas, perubahan harus lewat refund yang disetujui Superadmin.
5. Menu berstatus Habis tidak dapat dipilih.
6. Harga item dikunci saat pesanan dikirim.
7. Omzet gerai dihitung dari item pesanan berstatus SIAP DIBUAT atau SELESAI.
8. Settlement: **Tetap** berarti bersih = omzet; sewa ditagih terpisah per periode. **Komisi** berarti potongan = omzet × persen; bersih = omzet − potongan. **Gabungan** berarti sewa tetap ditambah komisi.
9. Sesi yang tidak lunas hingga penutupan hari ditandai **Tidak Dibayar** dan muncul di laporan.
10. Kode pelanggan dibatasi pada rentang yang diatur. Kode di luar rentang ditolak.

**Aturan tambahan untuk tiga skema:**

- Gerai hanya boleh membuat pesanan berstatus SIAP DIBUAT (sudah lunas). Pesanan MENUNGGU BAYAR tampil dengan tanda jangan dibuat dulu.
- Pesanan dari pelanggan lewat HP pada nomor kartu yang sudah punya sesi aktif ditambahkan ke sesi itu setelah pelanggan mengonfirmasi. Kasir selalu bisa melihat dan membatalkan item sebelum lunas.
- Pesanan yang tidak dibayar dalam batas waktu (default 60 menit) ditandai Kedaluwarsa dan dibatalkan.
- Setiap pesanan mencatat sumbernya (pelanggan, gerai, kasir) untuk audit dan laporan.

## 14. Integrasi QRIS

| Opsi | Cara kerja | Rekomendasi |
| --- | --- | --- |
| **Payment gateway QRIS dinamis** (Midtrans, Xendit, DOKU, atau sejenisnya) | Sistem membuat QR per sesi lewat API. Pelanggan membayar. Webhook mengubah status menjadi LUNAS | **Utama (tahap 2)** |
| **QRIS statis dan konfirmasi manual** | Kasir memeriksa mutasi atau notifikasi bank lalu menekan Konfirmasi | **Cadangan, tersedia di MVP** |
| **EDC atau mesin bank** | Umumnya tertutup dan jarang menyediakan API | Cek dulu ke bank |

Syarat implementasi dinamis: akun merchant dan dokumen legalitas sesuai penyedia, endpoint webhook publik ber-HTTPS, verifikasi signature, penanganan idempoten, dan batas waktu QR. Biaya per transaksi dan syarat onboarding perlu dicek langsung ke penyedia.

## 15. Arsitektur dan Tech Stack

- **Framework:** Next.js (App Router), monolith full-stack.
- **Basis data:** PostgreSQL dengan Prisma ORM.
- **Auth:** Auth.js atau sesi kustom dengan peran dan PIN.
- **Real-time:** SSE atau WebSocket. Jika di Vercel gunakan Pusher atau Supabase Realtime. Jika di VPS sendiri bisa SSE atau WebSocket native.
- **UI:** Tailwind CSS dan shadcn/ui.
- **PWA:** manifest dan service worker agar bisa dipasang fullscreen di tablet.
- **Cetak struk:** ESC/POS lewat Web Bluetooth atau USB (tahap 2).
- **Deploy:** VPS kecil dengan Docker, atau Vercel ditambah database terkelola.

**Halaman pelanggan:** rute publik mobile-first (misalnya `/pesan?meja=<kode>`) tanpa login, dengan rate limiting dan validasi di server. Notifikasi lunas dikirim lewat channel real-time ke tablet gerai terkait.

```
Tablet Gerai ─┐
Tablet Kasir ─┼─► Next.js (UI + API route) ─► PostgreSQL
Superadmin ───┘            │
                           ├─► Real-time channel (SSE/WS)
                           └─► Webhook QRIS ◄─ Payment gateway
```

## 16. Kasus Tepi

| Kasus | Penanganan |
| --- | --- |
| Kode salah ketik | Ringkasan konfirmasi setelah kode (jumlah gerai, total) membuat salah ketik cepat terlihat. Pesanan dapat dipindah kode oleh kasir (P1) |
| Pesanan salah input | Undo cepat, lalu batal dengan log |
| Menu habis | Tandai Habis, pesanan berjalan tetap bisa dibatalkan |
| Pelanggan pergi tanpa bayar | Sesi ditandai Tidak Dibayar, masuk laporan |
| Kartu hilang | Kasir mencari sesi lewat daftar aktif (gerai dan item yang dipesan) |
| Dua orang memakai kode sama | Dicegah dengan aturan kartu dikembalikan ke kasir setelah bayar |
| Internet putus | Indikator merah, antrean offline dan sinkron ulang (P1) |
| QRIS lambat atau gagal | Batas waktu QR, tombol buat ulang, konfirmasi manual sebagai cadangan |
| Webhook ganda | Penanganan idempoten berdasarkan referensi transaksi |
| Refund | Hanya Superadmin yang menyetujui, tercatat di audit log |
| Pesanan tambahan setelah lunas | Membuka sesi baru pada kode yang sama dengan peringatan |
| Pelanggan mengetik nomor kartu orang lain lewat HP | Sistem menampilkan ringkasan nomor yang sudah dipakai dan meminta konfirmasi. Kasir melihat semua item sebelum bayar dan bisa membatalkan item yang bukan milik pelanggan |
| Pesanan iseng atau spam lewat HP | Gerai tidak membuat pesanan sebelum lunas, jadi tidak ada kerugian bahan. Ada batas kecepatan dan batas item, dan pesanan tak dibayar kedaluwarsa otomatis |
| Pelanggan memesan lewat HP tanpa kartu | Tidak diizinkan, kartu diambil lebih dulu. Kasir dapat menyerahkan kartu yang tersedia |

## 17. Roadmap

**MVP (P0):** login dan peran, kelola gerai dan menu, tiga jalur input pesanan (pelanggan lewat barcode meja, tablet gerai, dan kasir), notifikasi lunas ke gerai, antrean gerai, tagihan kasir berdasarkan kode, pembayaran tunai dan QRIS statis manual, status lunas real-time, dashboard dan rekap harian.

**Tahap 2 (P1):** QRIS dinamis dan webhook, cetak struk, settlement sewa atau komisi, laporan dan ekspor, antrean offline, log audit, pencarian menu, status pesanan di HP pelanggan.

**Tahap 3 (P2):** split bayar, impor menu, stok, promo atau voucher, pembayaran online langsung dari HP pelanggan.

## 18. Asumsi dan Pertanyaan Terbuka

| # | Pertanyaan | Asumsi sementara |
| --- | --- | --- |
| 1 | Bentuk kode pelanggan: kartu, nomor meja, atau tiket kasir? | Dikonfirmasi: kartu fisik bernomor 1–99 |
| 2 | Bayar di awal atau di akhir? | Dikonfirmasi: pelanggan memesan dulu, bayar di kasir, gerai membuat pesanan setelah lunas |
| 3 | Model sewa gerai? | Mendukung tetap, komisi, dan gabungan |
| 4 | Metode bayar dan penyedia QRIS? | Tunai dan QRIS. Penyedia belum ditentukan |
| 5 | Jumlah gerai dan tablet? | 5–10 gerai, 1 kasir |
| 6 | Perlu struk fisik? | Layar dahulu, printer tahap 2 |
| 7 | Siapa yang mengisi menu dan harga? | Superadmin, gerai bisa diberi izin |
| 8 | Apakah makanan dibungkus atau makan di tempat memengaruhi alur? | Belum, tidak dibedakan di MVP |
| 9 | Makanan diantar ke meja atau diambil pelanggan di gerai? | Diambil di gerai. Nomor meja tetap dicatat bila ada |
| 10 | Satu barcode per meja atau satu untuk semua meja? | Satu barcode per meja, nomor meja tercatat otomatis |
| 11 | Perlu status pesanan di HP pelanggan? | Ya, tahap 2 |

## 19. Lampiran — Prompt Stitch Awal (digantikan bagian 20 dan Panduan Desain)

Prompt dalam bahasa Inggris karena umumnya memberi hasil desain lebih konsisten. Label tampilan tetap Bahasa Indonesia. Disarankan mengirim **Prompt Umum** lebih dulu, lalu satu layar per prompt.

### Prompt Umum (design system)

```
Design a responsive tablet-first web app UI (landscape, 1280x800) for a multi-stall food court POS with a single central cashier. All UI labels are in Indonesian. Style: clean, modern, high contrast, light mode, large touch targets (buttons min 80px tall for primary actions), generous spacing, rounded corners, big readable numbers. Typeface: Inter or similar sans-serif, body 16px+, key numbers 32px+. Color: neutral white and light gray background, primary deep blue, success green (paid), warning amber (waiting payment), danger red (cancel), gray (done). Each food stall has a fixed accent color. Key concept: every customer holds a numbered card (CUSTOMER CODE, 1-99) shown very large on screen. Three staff roles: Superadmin (owner), Kasir (cashier), User Gerai (stall staff), plus anonymous customers who order from their phone (mobile web, no login) by scanning a table barcode and typing their card number. Orders can come from three sources: customer, stall, or cashier. Stalls only start preparing an order after it is marked paid at the cashier. Currency format: Rp 35.000. Layouts must be consistent and never reorder items.
```

### Layar 1 — Login

```
Login screen. Center card with the food court logo, a row of account avatars (stalls and cashier), and a large numeric PIN keypad (0-9, backspace, OK). Show 4-6 PIN dots. Clean and minimal.
```

### Layar 2 — Tablet Gerai: Input Pesanan

```
Stall order entry screen, landscape tablet. Top bar: stall name with accent color chip, connection status dot, tabs 'Pesan' and 'Antrean', user name. Left column: huge customer code display (e.g. 'No. 23'), large numeric keypad (0-9, Hapus, OK), small chips of active customer codes below, and a confirmation line 'No. 23 · sudah 2 gerai · Rp 35.000'. Center: 3-column grid of large menu cards with food photo, name, price, food code (e.g. G01-005) and a quantity badge; favorites on top; sold-out items grayed with an X. Right panel: cart list with +/- buttons, large total, a very large green 'KIRIM' button, and secondary 'Undo' and 'Kosongkan' buttons.
```

### Layar 3 — Tablet Gerai: Antrean

```
Stall queue screen with three columns: 'Menunggu Bayar' (amber), 'Siap Dibuat' (green, newest card highlighted), 'Selesai' (gray). Each order card shows a very large customer code, time, item list with quantities, and buttons 'Selesai' or 'Batal'. Paid cards show a green banner 'SUDAH DIBAYAR - SIAP DIBUAT' and a small source chip (Pelanggan, Gerai or Kasir). Unpaid cards are dimmed with the label 'Belum dibayar - jangan dibuat dulu'.
```

### Layar 4 — Kasir: Beranda

```
Cashier home screen. Left: large keypad and a big customer code input with 'Cari' button. Right: list of active customers as cards showing code, number of stalls ordered, total, and status chip (Belum bayar amber, Lunas green). Search and filter at the top.
```

### Layar 5 — Kasir: Tagihan & Pembayaran

```
Cashier bill screen for customer code 23. Left: bill grouped by stall, each group has a colored header with stall code and name, rows with food code, item name, qty, price, and a stall subtotal. Right panel: huge grand total, two big buttons 'TUNAI' and 'QRIS', and a small 'Batalkan item' link. Also design: (a) cash dialog with amount received, quick amount buttons (Uang Pas, 50rb, 100rb), large change amount; (b) QRIS dialog with a large QR code, countdown timer, waiting state and 'Konfirmasi Manual' button; (c) success screen with green check, 'Cetak Struk' and 'Transaksi Berikutnya'.
```

### Layar 6 — Superadmin: Dashboard

```
Owner dashboard. Left sidebar navigation: Dashboard, Gerai, Menu, Laporan, Pengguna, Pengaturan. Main area: summary cards (Omzet Hari Ini, Transaksi, Rata-rata per Pelanggan), bar chart of revenue per stall using each stall's accent color, line chart of busy hours, table of daily recap per stall (omzet, potongan, bersih), and a recent activity list.
```

### Layar 7 — Superadmin: Kelola Gerai dan Menu

```
Admin management screens. (a) Stall table with code, name, tenant, rent model (Tetap/Komisi/Gabungan), status chip, and a right-side drawer form to add or edit a stall including color picker. (b) Menu management: stall selector, list of menu rows with photo, food code, name, price, drag handle for fixed ordering, favorite star, active toggle, sold-out toggle.
```

### Layar 8 — Superadmin: Laporan & Settlement

```
Report screen with period filter (Hari ini, Minggu ini, Bulan ini, Kustom), export CSV button, table per stall: omzet kotor, potongan sewa/komisi, bersih, status settlement, and an expandable transaction detail. Include a summary header with totals.
```

### Layar 9 — Pelanggan: Pesan lewat Barcode Meja

```
Mobile-first customer ordering web page (portrait, 390x844), opened by scanning a QR code on a table. No login. Indonesian labels. Step 1: card titled 'Pesan Makanan' with a big numeric field 'Nomor Kartu Anda', a numeric keypad, and a helper text 'Ambil kartu bernomor di pintu masuk'. If the number already has orders, show 'No. 23 sudah memesan di 2 gerai (Rp 35.000). Ini kartu Anda?' with buttons 'Ya' and 'Ganti'. Step 2: menu page with a sticky top bar and a 'Kartu No. 23' chip, horizontal tabs for each stall in its accent color, a vertical list of menu items with photo, name, price, food code and a +/- stepper; sold-out items grayed out. Sticky bottom cart bar with item count, total and a large 'PESAN' button. Step 3: confirmation screen with a green check, huge card number, order summary grouped by stall, and the text 'Bayar di kasir dengan menunjukkan kartu No. 23'. Optional status chips per stall: Menunggu bayar, Dibuat, Selesai.
```

### Layar 10 — Kasir: Input Pesanan

```
Cashier order entry screen (tablet landscape). Left: large keypad and a customer code field. Center: menu of all stalls grouped by stall with colored headers in a fixed order, large food cards with photo, name, price and code. Right: cart grouped by stall with subtotals, a grand total, and two big buttons 'KIRIM' and 'KIRIM & BAYAR' (opens a payment panel with TUNAI and QRIS).
```

## 20. Revisi Desain dan Keputusan Implementasi (21 November 2026)

Bagian ini **menggantikan** bagian 9, 10, dan lampiran 19 bila ada pertentangan. Aturan tampilan lengkap ada di dokumen **Panduan Desain**. Urutan implementasi dan prompt-nya ada di dokumen **Prompt Antigravity**.

### 20.1 Keputusan

- **Target tampilan:** layar PC lebih dulu (frame 1440 × 900). Tablet dan HP menyusul pada tahap berikutnya.
- **Navbar atas yang sama di semua role, tanpa sidebar.** Isi navbar sejajar dengan container konten (lebar maksimum 1280px, padding 24px).
- **Pembagian kolom** hanya: 12, 8 + 4, 4 + 8, 4 + 4 + 4, atau panel tengah 6 kolom.
- **Halaman pelanggan:** pencarian di atas daftar menu, tab gerai berupa teks, empat bagian gerai, kartu menu horizontal dua kolom dengan foto kotak abu sementara, stepper selalu \[−\]\[jumlah\]\[+\] tanpa tombol Tambah terpisah, keranjang sticky di kanan.
- **Identitas pelanggan adalah nomor kartu.** Kolom WhatsApp, biaya layanan, dan keterangan Dine-in di hasil Stitch dihapus.
- **Tanpa keypad layar di PC.** Nomor kartu diketik langsung.
- **Gerai punya halaman Menu** yang hanya berisi toggle Habis.
- **Halaman Pengaturan superadmin ditunda.** Navbar superadmin: Dashboard, Gerai, Menu, Laporan, Pengguna.
- **Pesanan dibuat gerai setelah lunas.** Pesanan menunggu bayar tampil di gerai dengan tanda jangan dibuat dulu.
- **Implementasi:** Next.js (monolith) di Antigravity, desain dibaca dari Stitch lewat MCP.

### 20.2 Pemetaan Rute dan Layar

| Role | Rute | Layar Stitch |
| --- | --- | --- |
| Umum | /login | Login |
| Pelanggan (publik) | /pesan (menu), /pesan/konfirmasi, /pesan/selesai. Halaman input nomor kartu menyusul, sementara nomor kartu dari parameter ?kartu= | Pelanggan - Menu, Pelanggan - Konfirmasi, Pelanggan - Pesanan Dibuat |
| Gerai | /gerai/pesan | Gerai - Pesan |
| Gerai | /gerai/antrean | Gerai - Antrean |
| Gerai | /gerai/menu | Gerai - Menu |
| Kasir | /kasir | Kasir - Beranda |
| Kasir | /kasir/tagihan/\[kartu\] | Kasir - Tagihan (varian Tunai, QRIS, Lunas) |
| Kasir | /kasir/pesan | Kasir - Pesan |
| Superadmin | /admin | Admin - Dashboard |
| Superadmin | /admin/gerai | Admin - Gerai |
| Superadmin | /admin/menu | Admin - Menu |
| Superadmin | /admin/laporan | Admin - Laporan |
| Superadmin | /admin/pengguna | Admin - Pengguna |
| Sistem | /api/stream | Kanal real-time (SSE) |
| Sistem | /api/pesanan/pelanggan, /api/pesanan/gerai, /api/pesanan/kasir | Pembuatan pesanan per sumber |
| Sistem | /api/pembayaran | Konfirmasi pembayaran tunai dan QRIS |
