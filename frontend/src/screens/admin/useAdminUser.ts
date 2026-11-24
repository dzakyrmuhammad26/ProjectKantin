'use client';

import { useState, useEffect, useCallback } from 'react';
import adminPenggunaController from '@/controllers/adminPenggunaController';
import adminKatalogController from '@/controllers/adminKatalogController';
import { Pengguna, PeranPengguna } from '@/models/pengguna';
import { Gerai } from '@/models/gerai';

export function useAdminUser() {
  const [penggunaList, setPenggunaList] = useState<Pengguna[]>([]);
  const [geraiList, setGeraiList] = useState<Gerai[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reset PIN modal
  const [selectedUser, setSelectedUser] = useState<Pengguna | null>(null);
  const [pinBaru, setPinBaru] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Tambah User modal
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [peran, setPeran] = useState<PeranPengguna>('kasir');
  const [idGerai, setIdGerai] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [users, stalls] = await Promise.all([
        adminPenggunaController.getDaftarPengguna(),
        adminKatalogController.getDaftarGerai(),
      ]);
      setPenggunaList(users);
      setGeraiList(stalls);
      if (stalls.length > 0) setIdGerai(stalls[0].id);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBukaResetPin = (user: Pengguna) => {
    setSelectedUser(user);
    setPinBaru('');
    setIsResetModalOpen(true);
  };

  const handleSimpanResetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await adminPenggunaController.resetPin(selectedUser.id, pinBaru);
      setFeedback(`PIN untuk "${selectedUser.nama}" berhasil direset.`);
      setIsResetModalOpen(false);
      await loadData();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal mereset PIN');
    }
  };

  const handleSimpanPenggunaBaru = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminPenggunaController.tambahPengguna({
        nama: nama.trim(),
        username: username.trim().toLowerCase(),
        pin: pin.trim(),
        peran,
        idGerai: peran === 'gerai' ? idGerai : undefined,
        aktif: true,
      });
      setFeedback(`Akun staf "${nama}" berhasil dibuat.`);
      setIsTambahModalOpen(false);
      setNama('');
      setUsername('');
      setPin('');
      await loadData();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal membuat akun');
    }
  };

  return {
    penggunaList,
    geraiList,
    isLoading,
    selectedUser,
    pinBaru,
    setPinBaru,
    isResetModalOpen,
    setIsResetModalOpen,
    isTambahModalOpen,
    setIsTambahModalOpen,
    nama,
    setNama,
    username,
    setUsername,
    pin,
    setPin,
    peran,
    setPeran,
    idGerai,
    setIdGerai,
    feedback,
    handleBukaResetPin,
    handleSimpanResetPin,
    handleSimpanPenggunaBaru,
  };
}
