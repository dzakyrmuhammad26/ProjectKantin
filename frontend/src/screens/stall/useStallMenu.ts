'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Gerai } from '@/models/gerai';
import { Menu } from '@/models/menu';
import stallController from '@/controllers/stallController';
import menuGeraiController from '@/controllers/menuGeraiController';
import { uploadApi } from '@/api/uploadApi';
import { useAuth } from '@/context/AuthContext';

export function useStallMenu() {
  const { currentUser } = useAuth();
  const [daftarGerai, setDaftarGerai] = useState<Gerai[]>([]);
  const [geraiAktif, setGeraiAktif] = useState<Gerai | null>(null);
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyMenuId, setBusyMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState<string>('semua');

  // Modal State
  const [modalMode, setModalMode] = useState<'tambah' | 'edit' | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [formNama, setFormNama] = useState('');
  const [formHarga, setFormHarga] = useState<number>(0);
  const [formKategori, setFormKategori] = useState<'makanan' | 'minuman' | 'camilan'>('makanan');
  const [formFoto, setFormFoto] = useState('');
  const [formKode, setFormKode] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

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

  const loadMenuStan = useCallback(async (gId: string) => {
    try {
      const data = await menuGeraiController.getMenuStan(gId);
      setMenuList(data);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (geraiAktif?.id) {
      loadMenuStan(geraiAktif.id);
    }
  }, [geraiAktif?.id, loadMenuStan]);

  const handlePilihGerai = (idGerai: string) => {
    const found = daftarGerai.find((g) => g.id === idGerai) || null;
    setGeraiAktif(found);
  };

  const handleToggleHabis = async (menu: Menu) => {
    if (!geraiAktif || busyMenuId) return;
    setBusyMenuId(menu.id);
    try {
      await menuGeraiController.toggleStatusHabis(geraiAktif.id, menu.id);
      setActionMessage({
        text: `Status menu "${menu.nama || menu.name}" berhasil diubah`,
        type: 'success',
      });
      await loadMenuStan(geraiAktif.id);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Gagal mengubah status', type: 'error' });
      setTimeout(() => setActionMessage(null), 3000);
    } finally {
      setBusyMenuId(null);
    }
  };

  const handleBukaModalTambah = () => {
    setModalMode('tambah');
    setSelectedMenu(null);
    setSelectedFile(null);
    setFormNama('');
    setFormHarga(15000);
    setFormKategori('makanan');
    setFormFoto('');
    setFormKode(`${geraiAktif?.kode || 'G01'}-${String(menuList.length + 1).padStart(3, '0')}`);
  };

  const handleBukaModalEdit = (menu: Menu) => {
    setModalMode('edit');
    setSelectedMenu(menu);
    setSelectedFile(null);
    setFormNama(menu.nama || menu.name);
    setFormHarga(menu.harga || menu.price);
    setFormKategori((menu.kategori as any) || 'makanan');
    setFormFoto(menu.foto || menu.image || '');
    setFormKode(menu.kode || menu.code);
  };

  const handleSimpanMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!geraiAktif) return;

    if (!formNama.trim()) {
      alert('Nama menu wajib diisi');
      return;
    }
    if (formHarga < 0) {
      alert('Harga tidak boleh negatif');
      return;
    }

    try {
      setIsSubmitting(true);
      let finalFotoUrl = formFoto.trim() || undefined;
      if (selectedFile) {
        const uploaded = await uploadApi.uploadMenuImage(selectedFile);
        finalFotoUrl = uploaded.url;
      }

      if (modalMode === 'tambah') {
        await menuGeraiController.tambahMenu(geraiAktif.id, geraiAktif.nama, {
          kode: formKode.trim(),
          nama: formNama.trim(),
          harga: formHarga,
          kategori: formKategori,
          foto: finalFotoUrl,
        });
        setActionMessage({ text: `Menu "${formNama}" berhasil ditambahkan!`, type: 'success' });
      } else if (modalMode === 'edit' && selectedMenu) {
        await menuGeraiController.ubahMenu(geraiAktif.id, selectedMenu.id, {
          kode: formKode.trim(),
          nama: formNama.trim(),
          harga: formHarga,
          kategori: formKategori,
          foto: finalFotoUrl || '/images/menu/placeholder.jpg',
        });
        setActionMessage({ text: `Menu "${formNama}" berhasil diperbarui!`, type: 'success' });
      }

      setSelectedFile(null);
      setModalMode(null);
      await loadMenuStan(geraiAktif.id);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat menyimpan menu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHapusMenu = async (menu: Menu) => {
    if (!geraiAktif || busyMenuId) return;
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus menu "${menu.nama || menu.name}" dari katalog stan?`
    );
    if (!confirmDelete) return;

    setBusyMenuId(menu.id);
    try {
      await menuGeraiController.hapusMenu(geraiAktif.id, menu.id);
      setActionMessage({ text: `Menu "${menu.nama || menu.name}" berhasil dihapus`, type: 'success' });
      await loadMenuStan(geraiAktif.id);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Gagal menghapus menu', type: 'error' });
      setTimeout(() => setActionMessage(null), 3000);
    } finally {
      setBusyMenuId(null);
    }
  };

  const filteredMenuList = useMemo(() => {
    return menuList.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (m.nama || m.name).toLowerCase().includes(q) ||
        (m.kode || m.code).toLowerCase().includes(q);
      const matchesKat = kategoriFilter === 'semua' || m.kategori === kategoriFilter;
      return matchesSearch && matchesKat;
    });
  }, [menuList, searchQuery, kategoriFilter]);

  return {
    daftarGerai,
    geraiAktif,
    menuList,
    filteredMenuList,
    isLoading,
    busyMenuId,
    searchQuery,
    setSearchQuery,
    kategoriFilter,
    setKategoriFilter,
    modalMode,
    setModalMode,
    formNama,
    setFormNama,
    formHarga,
    setFormHarga,
    formKategori,
    setFormKategori,
    formFoto,
    setFormFoto,
    formKode,
    setFormKode,
    selectedFile,
    setSelectedFile,
    isSubmitting,
    actionMessage,
    handlePilihGerai,
    handleToggleHabis,
    handleBukaModalTambah,
    handleBukaModalEdit,
    handleSimpanMenu,
    handleHapusMenu,
  };
}
