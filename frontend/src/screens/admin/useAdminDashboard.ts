'use client';

import { useState, useEffect } from 'react';
import adminLaporanController from '@/controllers/adminLaporanController';
import adminKatalogController from '@/controllers/adminKatalogController';
import { RingkasanDashboard, RekapHarianGerai } from '@/models/laporan';
import { Gerai } from '@/models/gerai';

export function useAdminDashboard() {
  const [summary, setSummary] = useState<RingkasanDashboard | null>(null);
  const [rekapList, setRekapList] = useState<RekapHarianGerai[]>([]);
  const [geraiList, setGeraiList] = useState<Gerai[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dash, rekap, stalls] = await Promise.all([
          adminLaporanController.getRingkasanDashboard(),
          adminLaporanController.getRekapHarianGerai(),
          adminKatalogController.getDaftarGerai(),
        ]);
        setSummary(dash);
        setRekapList(rekap);
        setGeraiList(stalls);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return {
    summary,
    rekapList,
    geraiList,
    isLoading,
  };
}
