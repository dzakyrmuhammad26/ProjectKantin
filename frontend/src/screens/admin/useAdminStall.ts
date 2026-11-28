'use client';

import { useState, useEffect, useCallback } from 'react';
import adminKatalogController from '@/controllers/adminKatalogController';
import { Gerai } from '@/models/gerai';

export function useAdminStall() {
  const [geraiList, setGeraiList] = useState<Gerai[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyStallId, setBusyStallId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGerai, setEditingGerai] = useState<Gerai | null>(null);
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [penyewa, setPenyewa] = useState('');
  const [warna, setWarna] = useState('#10B981');
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadGerai = useCallback(async () => {
    try {
      const data = await adminKatalogController.getDaftarGerai(false);
      setGeraiList(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGerai();
  }, [loadGerai]);

  const handleBukaTambah = () => {
    setEditingGerai(null);
    setKode(`G${String(geraiList.length + 1).padStart(2, '0')}`);
    setNama('');
    setPenyewa('');
    setWarna('#10B981');
    setIsModalOpen(true);
  };

  const handleBukaEdit = (g: Gerai) => {
    setEditingGerai(g);
    setKode(g.kode || g.code);
    setNama(g.nama || g.name);
    setPenyewa(g.penyewa);
    setWarna(g.warna || g.color || '#10B981');
    setIsModalOpen(true);
  };

  const handleSimpan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!kode.trim() || !nama.trim() || !penyewa.trim()) {
      alert('Kode, Nama Stan, dan Nama Penyewa wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingGerai) {
        await adminKatalogController.ubahGerai(editingGerai.id, {
          nama: nama.trim(),
          penyewa: penyewa.trim(),
          warna,
        });
        setFeedback(`Gerai "${nama}" berhasil diperbarui.`);
      } else {
        await adminKatalogController.tambahGerai({
          kode: kode.trim().toUpperCase(),
          nama: nama.trim(),
          penyewa: penyewa.trim(),
          warna,
        });
        setFeedback(`Gerai "${nama}" berhasil ditambahkan.`);
      }

      setIsModalOpen(false);
      await loadGerai();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan data gerai');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAktif = async (g: Gerai) => {
    if (busyStallId) return;
    setBusyStallId(g.id);
    try {
      await adminKatalogController.ubahGerai(g.id, { aktif: !g.aktif });
      setFeedback(`Stan "${g.nama}" berhasil ${g.aktif ? 'dinonaktifkan' : 'diaktifkan kembali'}.`);
      await loadGerai();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status stan');
    } finally {
      setBusyStallId(null);
    }
  };

  const handleHapusGerai = async (g: Gerai) => {
    if (busyStallId) return;
    const confirmed = window.confirm(
      `Hapus permanen stan "${g.nama}" (${g.kode})?`
    );
    if (!confirmed) return;

    setBusyStallId(g.id);
    try {
      await adminKatalogController.hapusGerai(g.id, true);
      setFeedback(`Stan "${g.nama}" berhasil dihapus.`);
      await loadGerai();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus stan');
    } finally {
      setBusyStallId(null);
    }
  };

  return {
    geraiList,
    isLoading,
    isSubmitting,
    busyStallId,
    isModalOpen,
    setIsModalOpen,
    editingGerai,
    kode,
    setKode,
    nama,
    setNama,
    penyewa,
    setPenyewa,
    warna,
    setWarna,
    feedback,
    handleBukaTambah,
    handleBukaEdit,
    handleSimpan,
    handleToggleAktif,
    handleHapusGerai,
  };
}
