'use client';

import { useState, useEffect } from 'react';
import adminLaporanController from '@/controllers/adminLaporanController';
import adminKatalogController from '@/controllers/adminKatalogController';
import { RekapHarianGerai } from '@/models/laporan';
import { Gerai } from '@/models/gerai';

export function useAdminReport() {
  const [rekapList, setRekapList] = useState<RekapHarianGerai[]>([]);
  const [geraiList, setGeraiList] = useState<Gerai[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [rekap, stalls] = await Promise.all([
          adminLaporanController.getRekapHarianGerai(),
          adminKatalogController.getDaftarGerai(),
        ]);
        setRekapList(rekap);
        setGeraiList(stalls);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const totalOmzetKantin = rekapList.reduce((acc, r) => acc + r.totalOmzet, 0);
  const totalTransaksiKantin = rekapList.reduce((acc, r) => acc + r.totalTransaksi, 0);
  const totalPorsiKantin = rekapList.reduce((acc, r) => acc + r.totalPorsi, 0);

  const handleCetakLaporan = () => {
    window.print();
  };

  return {
    rekapList,
    geraiList,
    isLoading,
    totalOmzetKantin,
    totalTransaksiKantin,
    totalPorsiKantin,
    handleCetakLaporan,
  };
}
