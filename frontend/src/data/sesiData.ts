import { SesiPelanggan } from '@/models/sesi';

/**
 * Data Simulasi Sesi Kartu Pelanggan Aktif (Nomor 1–99)
 */
export const DAFTAR_SESI_KARTU: SesiPelanggan[] = [
  {
    id: 'SESI-20261122-0005',
    nomorKartu: 5,
    nomorMeja: 2,
    status: 'aktif',
    totalTagihan: 43000,
    waktuBuka: '14:12 WIB',
  },
  {
    id: 'SESI-20261122-0012',
    nomorKartu: 12,
    nomorMeja: 6,
    status: 'aktif',
    totalTagihan: 31000,
    waktuBuka: '14:05 WIB',
  },
  {
    id: 'SESI-20261122-0023',
    nomorKartu: 23,
    nomorMeja: 4,
    status: 'aktif',
    totalTagihan: 0,
    waktuBuka: '14:20 WIB',
  },
  {
    id: 'SESI-20261122-0027',
    nomorKartu: 27,
    nomorMeja: 9,
    status: 'lunas',
    totalTagihan: 70000,
    waktuBuka: '13:50 WIB',
    waktuTutup: '13:52 WIB',
  },
  {
    id: 'SESI-20261122-0031',
    nomorKartu: 31,
    nomorMeja: 1,
    status: 'lunas',
    totalTagihan: 50000,
    waktuBuka: '13:30 WIB',
    waktuTutup: '13:35 WIB',
  },
];
