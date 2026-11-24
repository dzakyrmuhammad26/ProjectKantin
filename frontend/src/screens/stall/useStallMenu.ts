'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Gerai } from '@/models/gerai';
import { Menu } from '@/models/menu';
import geraiController from '@/controllers/geraiController';
import menuGeraiController from '@/controllers/menuGeraiController';

export function useStallMenu() {
  const [daftarGerai, setDaftarGerai] = useState<Gerai[]>([]);
  const [geraiAktif, setGeraiAktif] = useState<Gerai | null>(null);
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Inisialisasi daftar gerai
  useEffect(() => {
    async function init() {
      try {
        const stalls = await geraiController.getStalls();
        setDaftarGerai(stalls);
        if (stalls.length > 0) {
          setGeraiAktif(stalls[0]);
        }
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Muat menu stan
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
    if (!geraiAktif) return;
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
    }
  };

  const handleBukaModalTambah = () => {
    setModalMode('tambah');
    setSelectedMenu(null);
    setFormNama('');
    setFormHarga(15000);
    setFormKategori('makanan');
    setFormFoto('/images/menu/placeholder.jpg');
    setFormKode(`${geraiAktif?.kode || 'G01'}-${String(menuList.length + 1).padStart(3, '0')}`);
  };

  const handleBukaModalEdit = (menu: Menu) => {
    setModalMode('edit');
    setSelectedMenu(menu);
    setFormNama(menu.nama || menu.name);
    setFormHarga(menu.harga || menu.price);
    setFormKategori((menu.kategori as any) || 'makanan');
    setFormFoto(menu.foto || menu.image || '/images/menu/placeholder.jpg');
    setFormKode(menu.kode || menu.code);
  };

  const handleSimpanMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!geraiAktif) return;

    if (!formNama.trim()) {
      alert('Nama menu wajib diisi');
      return;
    }
    if (formHarga <= 0) {
      alert('Harga harus lebih dari 0');
      return;
    }

    try {
      setIsSubmitting(true);
      if (modalMode === 'tambah') {
        await menuGeraiController.tambahMenu(geraiAktif.id, geraiAktif.nama, {
          kode: formKode,
          nama: formNama.trim(),
          harga: formHarga,
          kategori: formKategori,
          foto: formFoto.trim() || '/images/menu/placeholder.jpg',
        });
        setActionMessage({ text: `Menu "${formNama}" berhasil ditambahkan!`, type: 'success' });
      } else if (modalMode === 'edit' && selectedMenu) {
        await menuGeraiController.ubahMenu(geraiAktif.id, selectedMenu.id, {
          nama: formNama.trim(),
          harga: formHarga,
          kategori: formKategori,
          foto: formFoto.trim() || '/images/menu/placeholder.jpg',
        });
        setActionMessage({ text: `Menu "${formNama}" berhasil diperbarui!`, type: 'success' });
      }

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
    if (!geraiAktif) return;
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus menu "${menu.nama || menu.name}" dari katalog stan?`
    );
    if (!confirmDelete) return;

    try {
      await menuGeraiController.hapusMenu(geraiAktif.id, menu.id);
      setActionMessage({ text: `Menu "${menu.nama || menu.name}" berhasil dihapus`, type: 'success' });
      await loadMenuStan(geraiAktif.id);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Gagal menghapus menu', type: 'error' });
      setTimeout(() => setActionMessage(null), 3000);
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
