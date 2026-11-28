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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  // Reset PIN modal
  const [selectedUser, setSelectedUser] = useState<Pengguna | null>(null);
  const [pinBaru, setPinBaru] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Tambah / Edit User modal
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Pengguna | null>(null);
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [peran, setPeran] = useState<PeranPengguna>('kasir');
  const [idGerai, setIdGerai] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [users, stalls] = await Promise.all([
        adminPenggunaController.getDaftarPengguna(false),
        adminKatalogController.getDaftarGerai(true),
      ]);
      setPenggunaList(users);
      setGeraiList(stalls);
      if (stalls.length > 0) {
        setIdGerai((prev) => prev || stalls[0].id);
      }
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
    if (!selectedUser || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await adminPenggunaController.resetPin(selectedUser.id, pinBaru);
      setFeedback(`PIN untuk "${selectedUser.nama}" berhasil direset.`);
      setIsResetModalOpen(false);
      await loadData();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal mereset PIN');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBukaTambahUser = () => {
    setEditingUser(null);
    setNama('');
    setUsername('');
    setPin('');
    setPeran('kasir');
    setIdGerai(geraiList[0]?.id || 'G01');
    setIsUserModalOpen(true);
  };

  const handleBukaEditUser = (user: Pengguna) => {
    setEditingUser(user);
    setNama(user.nama);
    setUsername(user.username);
    setPin('');
    setPeran(user.peran);
    setIdGerai(user.idGerai || geraiList[0]?.id || 'G01');
    setIsUserModalOpen(true);
  };

  const handleSimpanPengguna = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (editingUser) {
        await adminPenggunaController.ubahPengguna(editingUser.id, {
          nama: nama.trim(),
          username: username.trim().toLowerCase(),
          peran,
          idGerai: peran === 'gerai' ? idGerai : undefined,
        });
        setFeedback(`Akun staf "${nama}" berhasil diperbarui.`);
      } else {
        await adminPenggunaController.tambahPengguna({
          nama: nama.trim(),
          username: username.trim().toLowerCase(),
          pin: pin.trim(),
          peran,
          idGerai: peran === 'gerai' ? idGerai : undefined,
          aktif: true,
        });
        setFeedback(`Akun staf "${nama}" berhasil dibuat.`);
      }

      setIsUserModalOpen(false);
      await loadData();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan akun staf');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAktif = async (user: Pengguna) => {
    if (busyUserId) return;
    setBusyUserId(user.id);
    try {
      await adminPenggunaController.ubahPengguna(user.id, { aktif: !user.aktif });
      setFeedback(`Akun "${user.nama}" berhasil ${user.aktif ? 'dinonaktifkan' : 'diaktifkan kembali'}.`);
      await loadData();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status pengguna');
    } finally {
      setBusyUserId(null);
    }
  };

  const handleHapusUser = async (user: Pengguna) => {
    if (busyUserId) return;
    const confirmed = window.confirm(
      `Hapus permanen akun staf "${user.nama}" (${user.username})?`
    );
    if (!confirmed) return;

    setBusyUserId(user.id);
    try {
      await adminPenggunaController.hapusPengguna(user.id, true);
      setFeedback(`Akun "${user.nama}" berhasil dihapus.`);
      await loadData();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus akun staf');
    } finally {
      setBusyUserId(null);
    }
  };

  return {
    penggunaList,
    geraiList,
    isLoading,
    isSubmitting,
    busyUserId,
    selectedUser,
    pinBaru,
    setPinBaru,
    isResetModalOpen,
    setIsResetModalOpen,
    isUserModalOpen,
    setIsUserModalOpen,
    editingUser,
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
    handleBukaTambahUser,
    handleBukaEditUser,
    handleSimpanPengguna,
    handleToggleAktif,
    handleHapusUser,
  };
}
