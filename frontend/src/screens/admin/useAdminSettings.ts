'use client';

import { useState, useEffect } from 'react';
import adminKatalogController from '@/controllers/adminKatalogController';
import { MetodePembayaran } from '@/models/pembayaran';

export function useAdminSettings() {
  const [namaKantin, setNamaKantin] = useState('');
  const [alamatKantin, setAlamatKantin] = useState('');
  const [nomorKartuMin, setNomorKartuMin] = useState(1);
  const [nomorKartuMax, setNomorKartuMax] = useState(99);
  const [teksFooterStruk, setTeksFooterStruk] = useState('');
  const [metodeBayarAktif, setMetodeBayarAktif] = useState<MetodePembayaran[]>([
    'tunai',
    'qris',
    'debit',
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    async function load() {
      try {
        const data = await adminKatalogController.getPengaturan();
        setNamaKantin(data.namaKantin);
        setAlamatKantin(data.alamatKantin);
        setNomorKartuMin(data.nomorKartuMin);
        setNomorKartuMax(data.nomorKartuMax);
        setTeksFooterStruk(data.teksFooterStruk);
        setMetodeBayarAktif(data.metodeBayarAktif || ['tunai', 'qris', 'debit']);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const toggleMetodeBayar = (metode: MetodePembayaran) => {
    setMetodeBayarAktif((prev) => {
      if (prev.includes(metode)) {
        if (prev.length <= 1) return prev; // Minimal 1 metode aktif
        return prev.filter((m) => m !== metode);
      }
      return [...prev, metode];
    });
  };

  const handleSimpan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nomorKartuMin > nomorKartuMax) {
      setFeedback({
        type: 'error',
        text: 'Nomor kartu minimal tidak boleh lebih besar dari maksimal.',
      });
      return;
    }

    setIsSaving(true);
    setFeedback(null);
    try {
      await adminKatalogController.updatePengaturan({
        namaKantin: namaKantin.trim(),
        alamatKantin: alamatKantin.trim(),
        nomorKartuMin,
        nomorKartuMax,
        teksFooterStruk: teksFooterStruk.trim(),
        metodeBayarAktif,
      });
      setFeedback({
        type: 'success',
        text: 'Pengaturan sistem kantin berhasil disimpan.',
      });
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err.message || 'Gagal menyimpan pengaturan.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    namaKantin,
    setNamaKantin,
    alamatKantin,
    setAlamatKantin,
    nomorKartuMin,
    setNomorKartuMin,
    nomorKartuMax,
    setNomorKartuMax,
    teksFooterStruk,
    setTeksFooterStruk,
    metodeBayarAktif,
    toggleMetodeBayar,
    isLoading,
    isSaving,
    feedback,
    handleSimpan,
  };
}
