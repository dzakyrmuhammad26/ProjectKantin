/**
 * Model Laporan dan Rekapitulasi (Superadmin)
 */

export interface RekapHarianGerai {
  idGerai: string;
  namaGerai: string;
  tanggal: string;
  totalTransaksi: number;
  totalPorsi: number;
  totalOmzet: number;
}

export interface RingkasanDashboard {
  omzetHariIni: number;
  totalTransaksi: number;
  totalPelangganAktif: number;
  rataRataPerTransaksi: number;
}
