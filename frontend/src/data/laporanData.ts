import { RekapHarianGerai, RingkasanDashboard } from '@/models/laporan';

/**
 * Data Simulasi Laporan dan Dashboard Superadmin
 */
export const RINGKASAN_DASHBOARD_HARI_INI: RingkasanDashboard = {
  omzetHariIni: 4360000,
  totalTransaksi: 237,
  totalPelangganAktif: 4,
  rataRataPerTransaksi: 18396,
};

export const REKAP_HARIAN_GERAI: RekapHarianGerai[] = [
  {
    idGerai: 'G01',
    namaGerai: 'Pempek Cik Ani',
    tanggal: '22 November 2026',
    totalTransaksi: 48,
    totalPorsi: 62,
    totalOmzet: 1150000,
  },
  {
    idGerai: 'G02',
    namaGerai: 'Mie Celor 26',
    tanggal: '22 November 2026',
    totalTransaksi: 42,
    totalPorsi: 45,
    totalOmzet: 1080000,
  },
  {
    idGerai: 'G03',
    namaGerai: 'Nasi Goreng Bang Rudi',
    tanggal: '22 November 2026',
    totalTransaksi: 55,
    totalPorsi: 58,
    totalOmzet: 1450000,
  },
  {
    idGerai: 'G04',
    namaGerai: 'Es Teh & Jus',
    tanggal: '22 November 2026',
    totalTransaksi: 92,
    totalPorsi: 110,
    totalOmzet: 680000,
  },
];
