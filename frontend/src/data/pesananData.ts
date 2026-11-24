import { Pesanan } from '@/models/pesanan';
import { DAFTAR_MENU } from './menuData';

/**
 * Data Simulasi Pesanan untuk 4 Role (Bahasa Indonesia)
 * Digunakan untuk antrean Gerai, Kasir Sentral, dan Riwayat Pelanggan
 */
export const DAFTAR_PESANAN_AWAL: Pesanan[] = [
  // Pesanan Kartu 12: Menunggu bayar di kasir
  {
    id: 'TRX-1201',
    idSesi: 'SESI-20261122-0012',
    nomorKartu: '12',
    cardNumber: '12',
    nomorMeja: 6,
    total: 31000,
    status: 'menunggu_bayar',
    sumber: 'pelanggan',
    waktuPesan: '14:05 WIB',
    createdAt: '14:05 WIB',
    items: [
      {
        menu: DAFTAR_MENU[0], // Pempek Kapal Selam (G01)
        menuItem: DAFTAR_MENU[0],
        jumlah: 1,
        qty: 1,
        catatan: 'Cuko pedas',
        notes: 'Cuko pedas',
        hargaSaatItu: 25000,
        subtotal: 25000,
      },
      {
        menu: DAFTAR_MENU[12], // Es Teh Manis Jumbo (G04)
        menuItem: DAFTAR_MENU[12],
        jumlah: 1,
        qty: 1,
        hargaSaatItu: 6000,
        subtotal: 6000,
      },
    ],
  },

  // Pesanan Kartu 05: Menunggu bayar di kasir
  {
    id: 'TRX-0588',
    idSesi: 'SESI-20261122-0005',
    nomorKartu: '05',
    cardNumber: '05',
    nomorMeja: 2,
    total: 43000,
    status: 'menunggu_bayar',
    sumber: 'gerai',
    waktuPesan: '14:12 WIB',
    createdAt: '14:12 WIB',
    items: [
      {
        menu: DAFTAR_MENU[4], // Mie Celor Spesial Telur (G02)
        menuItem: DAFTAR_MENU[4],
        jumlah: 1,
        qty: 1,
        hargaSaatItu: 28000,
        subtotal: 28000,
      },
      {
        menu: DAFTAR_MENU[13], // Jus Alpukat Keruk (G04)
        menuItem: DAFTAR_MENU[13],
        jumlah: 1,
        qty: 1,
        catatan: 'Gula sedikit saja',
        notes: 'Gula sedikit saja',
        hargaSaatItu: 15000,
        subtotal: 15000,
      },
    ],
  },

  // Pesanan Kartu 27: Sudah lunas, siap dibuat oleh gerai (G03 dan G04)
  {
    id: 'TRX-2741',
    idSesi: 'SESI-20261122-0027',
    nomorKartu: '27',
    cardNumber: '27',
    nomorMeja: 9,
    total: 70000,
    status: 'siap_dibuat',
    sumber: 'pelanggan',
    waktuPesan: '13:50 WIB',
    createdAt: '13:50 WIB',
    pembayaran: {
      metode: 'qris',
      totalTagihan: 70000,
      uangDiterima: 70000,
      kembalian: 0,
      waktuBayar: '13:52 WIB',
      referensiQris: 'QRIS-ID-88492019',
      method: 'qris',
      amountPaid: 70000,
      change: 0,
      paidAt: '13:52 WIB',
    },
    payment: {
      metode: 'qris',
      totalTagihan: 70000,
      uangDiterima: 70000,
      kembalian: 0,
      waktuBayar: '13:52 WIB',
      referensiQris: 'QRIS-ID-88492019',
      method: 'qris',
      amountPaid: 70000,
      change: 0,
      paidAt: '13:52 WIB',
    },
    items: [
      {
        menu: DAFTAR_MENU[8], // Nasi Goreng Spesial (G03)
        menuItem: DAFTAR_MENU[8],
        jumlah: 2,
        qty: 2,
        catatan: 'Satu pedas, satu sedang',
        notes: 'Satu pedas, satu sedang',
        hargaSaatItu: 25000,
        subtotal: 50000,
      },
      {
        menu: DAFTAR_MENU[14], // Jus Jeruk (G04)
        menuItem: DAFTAR_MENU[14],
        jumlah: 1,
        qty: 1,
        hargaSaatItu: 12000,
        subtotal: 12000,
      },
      {
        menu: DAFTAR_MENU[12], // Es Teh Manis Jumbo (G04)
        menuItem: DAFTAR_MENU[12],
        jumlah: 1,
        qty: 1,
        hargaSaatItu: 6000,
        subtotal: 6000,
      },
    ],
  },

  // Pesanan Kartu 31: Selesai diserahkan ke pelanggan
  {
    id: 'TRX-3105',
    idSesi: 'SESI-20261122-0031',
    nomorKartu: '31',
    cardNumber: '31',
    nomorMeja: 1,
    total: 50000,
    status: 'selesai',
    sumber: 'kasir',
    waktuPesan: '13:30 WIB',
    createdAt: '13:30 WIB',
    pembayaran: {
      metode: 'tunai',
      totalTagihan: 50000,
      uangDiterima: 50000,
      kembalian: 0,
      waktuBayar: '13:32 WIB',
      method: 'cash',
      amountPaid: 50000,
      change: 0,
      paidAt: '13:32 WIB',
    },
    payment: {
      metode: 'tunai',
      totalTagihan: 50000,
      uangDiterima: 50000,
      kembalian: 0,
      waktuBayar: '13:32 WIB',
      method: 'cash',
      amountPaid: 50000,
      change: 0,
      paidAt: '13:32 WIB',
    },
    items: [
      {
        menu: DAFTAR_MENU[0], // Pempek Kapal Selam
        menuItem: DAFTAR_MENU[0],
        jumlah: 2,
        qty: 2,
        hargaSaatItu: 25000,
        subtotal: 50000,
      },
    ],
  },
];
