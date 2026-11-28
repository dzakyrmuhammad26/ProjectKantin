'use client';

import { useState, useEffect, useCallback } from 'react';
import { Gerai } from '@/models/gerai';
import { Pesanan } from '@/models/pesanan';
import antreanGeraiController from '@/controllers/antreanGeraiController';
import stallController from '@/controllers/stallController';
import { useAuth } from '@/context/AuthContext';

export function useStallQueue() {
  const { currentUser } = useAuth();
  const [daftarGerai, setDaftarGerai] = useState<Gerai[]>([]);
  const [geraiAktif, setGeraiAktif] = useState<Gerai | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [completingOrderId, setCompletingOrderId] = useState<string | null>(null);

  // 3 Kolom antrean
  const [menungguBayar, setMenungguBayar] = useState<Pesanan[]>([]);
  const [siapDibuat, setSiapDibuat] = useState<Pesanan[]>([]);
  const [selesai, setSelesai] = useState<Pesanan[]>([]);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Inisialisasi daftar gerai sesuai akun yang login
  useEffect(() => {
    async function init() {
      try {
        const stalls = await stallController.getStalls();
        setDaftarGerai(stalls);
        if (stalls.length > 0) {
          const matchedUserStall =
            currentUser?.peran === 'gerai' && currentUser.idGerai
              ? stalls.find((s) => s.id === currentUser.idGerai || s.kode === currentUser.idGerai)
              : null;
          setGeraiAktif(matchedUserStall || stalls[0]);
        }
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [currentUser?.peran, currentUser?.idGerai]);

  // Muat antrean stan aktif
  const loadAntrean = useCallback(async (gId: string, silent = false) => {
    try {
      if (!silent) setIsRefreshing(true);
      const data = await antreanGeraiController.getAntreanStan(gId);
      setMenungguBayar(data.menungguBayar);
      setSiapDibuat(data.siapDibuat);
      setSelesai(data.selesai);
    } catch {
      // ignore
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (geraiAktif?.id) {
      loadAntrean(geraiAktif.id, true);
      const timer = setInterval(() => {
        loadAntrean(geraiAktif.id, true);
      }, 10000);
      return () => clearInterval(timer);
    }
  }, [geraiAktif?.id, loadAntrean]);

  const handlePilihGerai = (idGerai: string) => {
    const found = daftarGerai.find((g) => g.id === idGerai) || null;
    setGeraiAktif(found);
  };

  const handleSelesaikanPesanan = async (idPesanan: string) => {
    if (!geraiAktif || completingOrderId) return;
    setCompletingOrderId(idPesanan);
    try {
      await antreanGeraiController.tandaiSelesai(geraiAktif.id, idPesanan);
      setActionMessage({ text: `Pesanan ${idPesanan} telah ditandai Selesai`, type: 'success' });
      await loadAntrean(geraiAktif.id, false);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Gagal menyelesaikan pesanan', type: 'error' });
      setTimeout(() => setActionMessage(null), 3000);
    } finally {
      setCompletingOrderId(null);
    }
  };

  const refresh = () => {
    if (geraiAktif?.id) {
      loadAntrean(geraiAktif.id, false);
    }
  };

  return {
    daftarGerai,
    geraiAktif,
    isLoading,
    isRefreshing,
    completingOrderId,
    menungguBayar,
    siapDibuat,
    selesai,
    actionMessage,
    handlePilihGerai,
    handleSelesaikanPesanan,
    refresh,
  };
}
