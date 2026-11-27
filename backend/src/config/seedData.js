export const INITIAL_GERAI = [
  { kode: 'G01', nama: 'Pempek Cik Ani', penyewa: 'Cik Ani', warna: '#F97316', aktif: true },
  { kode: 'G02', nama: 'Mie Celor 26', penyewa: 'Kang Asep', warna: '#F43F5E', aktif: true },
  { kode: 'G03', nama: 'Nasi Goreng Bang Rudi', penyewa: 'Bang Rudi', warna: '#9333EA', aktif: true },
  { kode: 'G04', nama: 'Es Teh & Jus', penyewa: 'Mbak Dewi', warna: '#059669', aktif: true },
]

export const INITIAL_PENGGUNA = [
  { nama: 'Pak Hendra (Pemilik)', username: 'admin', pin: '123456', peran: 'superadmin', idGerai: null, aktif: true },
  { nama: 'Siti Rahma (Kasir)', username: 'kasir', pin: '112233', peran: 'kasir', idGerai: null, aktif: true },
  { nama: 'Cik Ani (Pempek)', username: 'pempek', pin: '1111', peran: 'gerai', idGerai: 'G01', aktif: true },
  { nama: 'Kang Asep (Mie Celor)', username: 'miecelor', pin: '2222', peran: 'gerai', idGerai: 'G02', aktif: true },
  { nama: 'Bang Rudi (Nasi Goreng)', username: 'nasgor', pin: '3333', peran: 'gerai', idGerai: 'G03', aktif: true },
  { nama: 'Mbak Dewi (Es Teh & Jus)', username: 'minuman', pin: '4444', peran: 'gerai', idGerai: 'G04', aktif: true },
]

export const INITIAL_MENU = [
  // Gerai G01 - Pempek Cik Ani
  { kode: 'G01-001', nama: 'Pempek Kapal Selam', harga: 25000, idGerai: 'G01', namaGerai: 'Pempek Cik Ani', kategori: 'makanan', foto: '/images/menu/g01-001.jpg', urutan: 1, isFavorit: true, isHabis: false, aktif: true },
  { kode: 'G01-002', nama: 'Pempek Lenjer Besar', harga: 22000, idGerai: 'G01', namaGerai: 'Pempek Cik Ani', kategori: 'makanan', foto: '/images/menu/g01-002.jpg', urutan: 2, isFavorit: false, isHabis: false, aktif: true },
  { kode: 'G01-003', nama: 'Pempek Adaan', harga: 18000, idGerai: 'G01', namaGerai: 'Pempek Cik Ani', kategori: 'makanan', foto: '/images/menu/g01-003.jpg', urutan: 3, isFavorit: false, isHabis: false, aktif: true },
  { kode: 'G01-004', nama: 'Pempek Kulit Crispy', harga: 18000, idGerai: 'G01', namaGerai: 'Pempek Cik Ani', kategori: 'makanan', foto: '/images/menu/g01-004.jpg', urutan: 4, isFavorit: false, isHabis: true, aktif: true },

  // Gerai G02 - Mie Celor 26
  { kode: 'G02-001', nama: 'Mie Celor Spesial Telur', harga: 28000, idGerai: 'G02', namaGerai: 'Mie Celor 26', kategori: 'makanan', foto: '/images/menu/g02-001.jpg', urutan: 1, isFavorit: true, isHabis: false, aktif: true },
  { kode: 'G02-002', nama: 'Mie Celor Udang', harga: 35000, idGerai: 'G02', namaGerai: 'Mie Celor 26', kategori: 'makanan', foto: '/images/menu/g02-002.jpg', urutan: 2, isFavorit: false, isHabis: false, aktif: true },
  { kode: 'G02-003', nama: 'Mie Celor Biasa', harga: 22000, idGerai: 'G02', namaGerai: 'Mie Celor 26', kategori: 'makanan', foto: '/images/menu/g02-003.jpg', urutan: 3, isFavorit: false, isHabis: false, aktif: true },
  { kode: 'G02-004', nama: 'Mie Celor Komplit', harga: 38000, idGerai: 'G02', namaGerai: 'Mie Celor 26', kategori: 'makanan', foto: '/images/menu/g02-004.jpg', urutan: 4, isFavorit: false, isHabis: false, aktif: true },

  // Gerai G03 - Nasi Goreng Bang Rudi
  { kode: 'G03-001', nama: 'Nasi Goreng Spesial', harga: 25000, idGerai: 'G03', namaGerai: 'Nasi Goreng Bang Rudi', kategori: 'makanan', foto: '/images/menu/g03-001.jpg', urutan: 1, isFavorit: true, isHabis: false, aktif: true },
  { kode: 'G03-002', nama: 'Nasi Goreng Seafood', harga: 30000, idGerai: 'G03', namaGerai: 'Nasi Goreng Bang Rudi', kategori: 'makanan', foto: '/images/menu/g03-002.jpg', urutan: 2, isFavorit: false, isHabis: false, aktif: true },
  { kode: 'G03-003', nama: 'Nasi Goreng Gila Pedas', harga: 28000, idGerai: 'G03', namaGerai: 'Nasi Goreng Bang Rudi', kategori: 'makanan', foto: '/images/menu/g03-003.jpg', urutan: 3, isFavorit: false, isHabis: false, aktif: true },
  { kode: 'G03-004', nama: 'Kwetiau Goreng Sapi', harga: 27000, idGerai: 'G03', namaGerai: 'Nasi Goreng Bang Rudi', kategori: 'makanan', foto: '/images/menu/g03-004.jpg', urutan: 4, isFavorit: false, isHabis: false, aktif: true },

  // Gerai G04 - Es Teh & Jus
  { kode: 'G04-001', nama: 'Es Teh Manis Jumbo', harga: 6000, idGerai: 'G04', namaGerai: 'Es Teh & Jus', kategori: 'minuman', foto: '/images/menu/g04-001.jpg', urutan: 1, isFavorit: true, isHabis: false, aktif: true },
  { kode: 'G04-002', nama: 'Jus Alpukat Keruk', harga: 15000, idGerai: 'G04', namaGerai: 'Es Teh & Jus', kategori: 'minuman', foto: '/images/menu/g04-002.jpg', urutan: 2, isFavorit: false, isHabis: false, aktif: true },
  { kode: 'G04-003', nama: 'Jus Jeruk Peras Murni', harga: 12000, idGerai: 'G04', namaGerai: 'Es Teh & Jus', kategori: 'minuman', foto: '/images/menu/g04-003.jpg', urutan: 3, isFavorit: false, isHabis: false, aktif: true },
  { kode: 'G04-004', nama: 'Es Kelapa Muda Gula Aren', harga: 14000, idGerai: 'G04', namaGerai: 'Es Teh & Jus', kategori: 'minuman', foto: '/images/menu/g04-004.jpg', urutan: 4, isFavorit: false, isHabis: false, aktif: true },
]

export const INITIAL_PENGATURAN = {
  namaKantin: 'Kantin Sentral Pujasera',
  alamatKantin: 'Gedung Kuliah Bersama Lt. 1',
  nomorKartuMin: 1,
  nomorKartuMax: 99,
  teksFooterStruk: 'Terima kasih atas kunjungan Anda di Kantin Sentral!',
  metodeBayarAktif: ['tunai', 'qris', 'debit'],
}
