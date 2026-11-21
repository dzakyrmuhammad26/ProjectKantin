# Panduan Desain — Kantin POS

Versi 1.0 · 21 November 2026 · Berlaku untuk semua role dan semua halaman. Acuan visual: halaman pelanggan Stitch yang sudah disetujui. Dipakai bersama PRD sebagai sumber kebenaran saat implementasi.

## 1. Prinsip

1. **Sederhana dan fungsional.** Hanya elemen yang dibutuhkan fungsi inti. Tidak ada hiasan.
2. **Satu kerangka untuk semua.** Navbar, container, grid, dan komponen sama di setiap role. Yang berbeda hanya isinya.
3. **Proporsional.** Setiap posisi mengikuti grid dan skala jarak. Tidak ada angka acak.
4. **Cepat dipakai.** Tombol besar, urutan tetap, tanpa konfirmasi berlapis.
5. **Siap jadi kode.** Setiap elemen harus bisa menjadi komponen yang dipakai ulang.

## 2. Kerangka Halaman (semua halaman)

Target awal: **layar PC, frame 1440 × 900**. Tablet dan HP menyusul (bagian 11).

| Elemen | Aturan |
| --- | --- |
| Navbar | Menempel di atas, tinggi 64px, putih, border bawah 1px. **Tidak ada sidebar** di role mana pun |
| Container | Lebar maksimum 1280px, di tengah, padding kiri dan kanan 24px. Isi navbar memakai container yang sama, jadi tepi kiri dan kanannya sejajar dengan konten |
| Grid | 12 kolom, jarak antar kolom 24px |
| Pembagian kolom yang diizinkan | 12 · 8 + 4 · 4 + 8 · 4 + 4 + 4 · panel tengah 6 kolom |
| Jarak vertikal | Konten mulai 24px di bawah navbar. Antar panel 24px. Padding dalam panel 20–24px |
| Panel | Putih, border 1px, sudut 12px, tanpa bayangan |
| Panel berdampingan | Selalu sama garis atas dan sama tinggi. Tidak ada ruang kosong besar |
| Baris judul | Judul halaman (20px semibold) di kiri, satu aksi utama opsional di kanan, tinggi 48px, lalu jarak 24px |
| Footer | Satu baris teks kecil 12px, opsional |

## 3. Navbar per Role

Komponen yang sama di semua role. Yang berubah hanya link dan sisi kanan.

| Role | Link | Sisi kanan |
| --- | --- | --- |
| Login | tidak ada | tidak ada |
| Pelanggan | tidak ada | label berborder 'Kartu No. 23' |
| Gerai | Pesan, Antrean, Menu | nama gerai, tautan Keluar |
| Kasir | Beranda, Pesan | 'Kasir', tautan Keluar |
| Superadmin | Dashboard, Gerai, Menu, Laporan, Pengguna | 'Superadmin', tautan Keluar |

- Kiri: nama kantin (16px bold) di dalam container, jarak 32px ke link pertama.
- Link 14–15px regular. Link aktif: teks teal dengan garis bawah 2px teal yang menyentuh dasar navbar.
- Tanpa subjudul, tanpa ikon di dalam link.

## 4. Warna

Satu warna aksen. Warna lain hanya untuk status dan penanda gerai.

| Peran | Nama | Nilai | Dipakai untuk |
| --- | --- | --- | --- |
| Aksen | brand-700 | #0F766E | Tombol utama, link aktif, tab aktif, fokus, border kartu terpilih |
| Aksen hover | brand-800 | #115E59 | Hover tombol utama |
| Tint | brand-50 | #F0FDFA | Latar label kartu pelanggan dan stepper terpilih |
| Latar halaman | surface | #F8F9FA | Latar belakang |
| Panel | white | #FFFFFF | Panel dan kartu |
| Garis | line | #E2E8F0 | Border panel, tabel, input |
| Teks utama | ink | #1F2937 | Judul dan isi |
| Teks sekunder | slate-500 | #64748B | Kode, bantuan, label kecil |
| Teks pudar | slate-400 | #94A3B8 | Placeholder, disabled |
| Status: menunggu bayar | amber | #D97706 | Titik dan teks status |
| Status: lunas atau siap dibuat | green | #059669 | Titik dan teks status |
| Status: selesai | gray | #64748B | Titik dan teks status |
| Status: batal atau error | red | #DC2626 | Titik, teks, banner error |
| Gerai G01 | orange | #F97316 | Batang atau titik penanda saja |
| Gerai G02 | rose | #F43F5E | Batang atau titik penanda saja |
| Gerai G03 | purple | #9333EA | Batang atau titik penanda saja |
| Gerai G04 | emerald | #059669 | Batang atau titik penanda saja |

Aturan warna: warna gerai tidak pernah dipakai untuk blok besar. Status selalu disertai teks, tidak hanya warna.

```
:root {
  --brand-50:#F0FDFA; --brand-700:#0F766E; --brand-800:#115E59;
  --surface:#F8F9FA; --line:#E2E8F0; --ink:#1F2937;
  --muted:#64748B; --faint:#94A3B8;
  --st-wait:#D97706; --st-paid:#059669; --st-done:#64748B; --st-cancel:#DC2626;
  --g01:#F97316; --g02:#F43F5E; --g03:#9333EA; --g04:#059669;
}
```

## 5. Tipografi

Font **Inter** (400, 500, 600, 700). Teks rata kiri, angka di tabel rata kanan.

| Pemakaian | Ukuran dan berat |
| --- | --- |
| Judul halaman | 20px semibold |
| Judul panel atau gerai | 16px bold |
| Nama menu di kartu | 15px semibold |
| Isi, tabel, tab, link navbar | 14px regular atau medium |
| Input dan tombol | 16px |
| Kode, bantuan, label kecil | 12px regular, abu |
| Harga di kartu | 16px bold |
| Total di keranjang | 20px extrabold |
| Nomor kartu besar dan total di kasir | 32px bold |

Ukuran teks minimum 12px. Format uang selalu `Rp 35.000`. Jam 24 jam, misalnya `14.05`.

## 6. Jarak, Sudut, Border

| Aturan | Nilai |
| --- | --- |
| Skala jarak | 4, 8, 12, 16, 24, 32 |
| Sudut panel dan kartu | 12px |
| Sudut tombol, input, foto | 8px |
| Border | 1px #E2E8F0 |
| Bayangan | Tidak dipakai. Pemisah memakai border |
| Tinggi kontrol | Input 48px, tombol 48px (aksi utama 56px), baris tabel 56px, area sentuh minimum 44px |
| Transisi | 150ms hanya untuk warna border dan latar |

## 7. Komponen

| Komponen | Spesifikasi |
| --- | --- |
| Tombol utama | Latar teal solid, teks putih semibold. Hanya satu per area. Hover brand-800 |
| Tombol sekunder | Putih, border 1px abu atau teal, teks teal atau abu tua |
| Tombol teks | Tanpa border, teks teal atau abu, dipakai untuk Batal, Ubah, Reset PIN |
| Input | Tinggi 48px, border 1px, sudut 8px, fokus: border teal ditambah ring 1px teal |
| Tab | Teks saja. Aktif: teal semibold dengan garis bawah 2px teal. Di bawah deretan tab ada garis 1px abu |
| Label status | Titik 8px berwarna ditambah teks. Contoh: titik amber + 'Menunggu bayar' |
| Chip nomor kartu | Kotak berborder 1px, teks 14px. Dipakai untuk daftar kartu aktif |
| Stepper | Selalu tiga bagian: tombol minus, jumlah, tombol plus. Tinggi 44px. Plus: teal solid. Minus: putih berborder, nonaktif abu bila jumlah 0. **Tidak ada tombol 'Tambah' terpisah** |
| Header gerai | Batang vertikal 6px warna gerai, nama gerai 16px bold, chip kode gerai (12px, latar abu muda) |
| Kartu menu | Lihat bagian 7.1 |
| Tabel | Header 12px abu, baris 56px, garis pemisah 1px, angka rata kanan, aksi berupa tombol teks di kolom terakhir |
| Keranjang | Panel sticky di kolom 4, lihat bagian 7.2 |
| Banner | Kotak berborder 1px dengan teks. Info: abu. Error: merah. Lunas di gerai: hijau |
| Modal | Lebar 480px, di tengah, latar halaman diredupkan, tombol Simpan (utama) dan Batal (sekunder) |
| Ikon | Hanya bila menggantikan kata: pencarian dan kosongkan keranjang. Selain itu teks saja |

### 7.1 Kartu Menu

| Aturan | Nilai |
| --- | --- |
| Susunan | Horizontal: foto di kiri, teks di kanan |
| Grid | 2 kolom di dalam tiap bagian gerai, jarak 16px, tinggi kartu dalam satu baris sama (minimum 128px) |
| Isi per gerai | 4 menu, agar baris selalu penuh (untuk contoh dan seed) |
| Foto | Kotak 104 × 104, sudut 8px, saat belum ada foto: kotak abu #F1F1EF. Tanpa badge di atas foto |
| Nama | 15px semibold, maksimum 2 baris, tidak dipotong tanda elipsis |
| Kode | Di bawah nama, 12px abu, font biasa (bukan monospace) |
| Baris bawah | Harga di kiri, stepper di kanan, selalu menempel di dasar kartu |
| Jumlah 0 | Minus nonaktif, jumlah '0' abu, border kartu 1px abu |
| Jumlah lebih dari 0 | Minus berborder teal, jumlah gelap tebal, border kartu 1px teal. Ukuran kartu tidak berubah |
| Habis | Foto diredupkan, nama dan harga abu, stepper diganti label 'Habis' (tinggi 44px, abu, tidak bisa ditekan) |
| Dilarang | Deskripsi, badge (Terlaris, Favorit, Chef Pick, Segar), efek angkat atau skala saat hover, garis pemisah di dalam kartu |

### 7.2 Keranjang Pelanggan

- Panel putih di kolom 4, menempel 80px dari atas (di bawah navbar).
- Header: 'Keranjang Pesanan' dan jumlah item. Di bawahnya: 'Tagihan Kartu No. 23'.
- Daftar item dikelompokkan per gerai (batang warna gerai), tiap item: nama, catatan singkat opsional, harga.
- Rincian: Subtotal dan **Total** (20px extrabold).
- Satu tombol utama penuh lebar: 'Konfirmasi & Pesan' (48px).
- Tombol kosongkan keranjang berupa ikon tempat sampah di pojok kanan header.

### 7.3 Penyesuaian terhadap hasil Stitch

Beberapa elemen di hasil Stitch tidak sesuai PRD dan harus dihapus saat implementasi:

| Elemen di hasil Stitch | Tindakan |
| --- | --- |
| Kolom 'Nomor Pelanggan / WhatsApp' di keranjang | Hapus. Identitas pelanggan adalah nomor kartu |
| Baris 'Biaya Layanan Kantin: GRATIS' | Hapus. Tidak ada biaya layanan |
| Teks 'Dine-in' dan 'Beban ke Kartu #23' | Ganti: 'Tagihan Kartu No. 23' |
| Subjudul 'Pujasera & Gerai Kuliner' dan ikon restoran di navbar | Hapus, cukup nama kantin |
| Ikon Material Symbols di tab, tombol, dan label | Hapus, kecuali pencarian dan kosongkan keranjang |
| Teks footer 'Sistem Operasional Sentral' | Boleh dihapus atau disederhanakan menjadi satu baris |

## 8. Susunan Tiap Halaman

| Halaman | Pembagian | Isi |
| --- | --- | --- |
| Login | Panel tengah 6 kolom | Judul 'Masuk', dropdown Akun, input PIN, tombol 'Masuk' |
| Pelanggan — Kartu | Panel tengah 6 kolom | Input nomor kartu besar, bantuan, tombol 'Lanjut'. Varian: notice nomor yang sudah punya pesanan |
| Pelanggan — Menu | 8 + 4 | Kiri: pencarian, tab gerai, empat bagian gerai dengan kartu 2 kolom. Kanan: keranjang sticky |
| Pelanggan — Terkirim | Panel tengah 6 kolom | 'Pesanan terkirim', nomor kartu 32px, ringkasan per gerai, notice bayar di kasir, tombol 'Tambah pesanan' |
| Gerai — Pesan | Baris 1: 12. Baris 2: 8 + 4 | Baris 1: input nomor kartu, teks konfirmasi, chip kartu aktif. Kiri: menu gerai itu. Kanan: pesanan dan tombol KIRIM |
| Gerai — Antrean | 4 + 4 + 4 | Kolom Menunggu bayar, Siap dibuat, Selesai. Tiap pesanan berupa baris berborder |
| Gerai — Menu | 12 | Tabel kode, nama, harga, status, toggle Habis |
| Kasir — Beranda | 4 + 8 | Kiri: cari nomor kartu. Kanan: tabel pelanggan aktif dengan tab Semua dan Belum bayar |
| Kasir — Tagihan | 8 + 4 | Kiri: tagihan per gerai. Kanan: total, tombol Tunai dan QRIS. Varian panel: Tunai, QRIS, Lunas |
| Kasir — Pesan | Baris 1: 12. Baris 2: 8 + 4 | Seperti Gerai — Pesan, tetapi menu semua gerai. Tombol Kirim dan Kirim & bayar |
| Admin — Dashboard | 4 + 4 + 4, lalu 12 | Tiga angka ringkasan, lalu tabel rekap per gerai. Tanpa grafik |
| Admin — Gerai, Menu, Pengguna | 12 | Satu tabel, tombol tambah di baris judul, ubah lewat modal |
| Admin — Laporan | 12 dan 12 | Tab periode, tabel rekap, lalu tabel rincian transaksi |

## 9. Teks dan Istilah

| Hal | Aturan |
| --- | --- |
| Bahasa | Indonesia, singkat, kalimat aktif |
| Nomor kartu | 'Kartu No. 23' atau 'No. 23' |
| Status pesanan | Menunggu bayar, Siap dibuat, Selesai, Batal |
| Sumber pesanan | Pelanggan, Gerai, Kasir |
| Tombol | Kata kerja: Pesan, Kirim, Bayar, Simpan, Batal, Selesai |
| Pesanan belum dibayar di tablet gerai | Teks 'Jangan dibuat dulu' |
| Pesanan lunas di tablet gerai | Banner 'Sudah dibayar — siap dibuat' dan bunyi singkat |
| Data contoh | Gerai: Pempek Cik Ani, Mie Celor 26, Nasi Goreng Bang Rudi, Es Teh & Jus |

## 10. State dan Interaksi

- **Hover:** hanya border menjadi abu lebih gelap. Tanpa angkat, skala, atau bayangan.
- **Fokus:** ring 1–2px teal. Semua elemen bisa dijangkau dengan keyboard.
- **Nonaktif:** teks dan border abu, kursor tidak aktif.
- **Memuat:** teks 'Memuat...' tanpa animasi dekoratif.
- **Kosong:** satu kalimat abu di tengah panel, misalnya 'Belum ada pesanan'.
- **Error:** banner merah berborder di atas panel dengan pesan jelas dan tombol coba lagi bila perlu.
- **Koneksi:** indikator kecil 'Online' atau 'Terputus' di navbar gerai dan kasir.
- **Aksi cepat:** tombol KIRIM tanpa dialog konfirmasi, tersedia Undo beberapa detik.

## 11. Responsif (tahap berikutnya)

| Lebar | Perilaku |
| --- | --- |
| 1280 ke atas | Desain dasar di dokumen ini |
| 1024–1279 (tablet landscape, gerai dan kasir) | Navbar sama, pembagian 8 + 4 dan 4 + 4 + 4 tetap, padding container 16px |
| 768–1023 | 4 + 4 + 4 menjadi satu kolom bertumpuk, 8 + 4 tetap bila muat, selain itu bertumpuk |
| Di bawah 768 (HP, hanya pelanggan) | Kartu menu 1 kolom, tab gerai bisa digeser mendatar, keranjang menjadi bar di bawah layar (jumlah item, total, tombol Pesan) yang membuka daftar. Area sentuh minimum 44px |

Role staf (gerai, kasir, superadmin) tidak didukung di layar HP pada tahap awal.

## 12. Larangan

- Gradient, glassmorphism, bayangan, blur, efek neon.
- Emoji, ikon dekoratif, ilustrasi, foto stok atau foto hasil AI yang berulang.
- Badge pemasaran (Terlaris, Favorit, Chef Pick), statistik atau grafik karangan.
- Kartu di dalam kartu, bagian hero, banner promosi.
- Animasi masuk, efek skala atau angkat.
- Lebih dari satu warna aksen. Warna gerai sebagai blok besar.
- Ukuran teks di bawah 12px atau area sentuh di bawah 44px.
- Posisi atau ukuran yang tidak mengikuti grid dan skala jarak.

## 13. Daftar Periksa Sebelum Halaman Dianggap Selesai

1. Navbar identik dengan role lain: tinggi 64px, 'nama kantin' dan link sejajar dengan tepi container.
2. Konten berada di container 1280px, pembagian kolom hanya dari daftar yang diizinkan.
3. Panel berdampingan sama garis atas dan sama tinggi.
4. Hanya komponen dari bagian 7 yang dipakai, tanpa komponen baru.
5. Satu tombol utama per area, tinggi kontrol sesuai bagian 6.
6. Tidak ada elemen dari daftar larangan.
7. Semua teks dan istilah sesuai bagian 9, format uang benar.
8. Semua state (hover, fokus, nonaktif, kosong, error) terlihat benar.
9. Screenshot hasil implementasi dibandingkan dengan layar Stitch, selisih posisi dan ukuran sudah diperbaiki.
