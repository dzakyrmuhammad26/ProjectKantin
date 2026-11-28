'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import adminKatalogController from '@/controllers/adminKatalogController';
import { uploadApi } from '@/api/uploadApi';
import { Menu } from '@/models/menu';
import { Gerai } from '@/models/gerai';

export function useAdminMenu() {
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [geraiList, setGeraiList] = useState<Gerai[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyMenuId, setBusyMenuId] = useState<string | null>(null);
  const [selectedGeraiFilter, setSelectedGeraiFilter] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [formKode, setFormKode] = useState('');
  const [formNama, setFormNama] = useState('');
  const [formHarga, setFormHarga] = useState(15000);
  const [formIdGerai, setFormIdGerai] = useState('');
  const [formKategori, setFormKategori] = useState<'makanan' | 'minuman' | 'camilan'>('makanan');
  const [formFoto, setFormFoto] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [menus, stalls] = await Promise.all([
        adminKatalogController.getDaftarMenuSemua(true),
        adminKatalogController.getDaftarGerai(true),
      ]);
      setMenuList(menus);
      setGeraiList(stalls);
      if (stalls.length > 0) {
        setFormIdGerai((prev) => prev || stalls[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBukaTambah = () => {
    setEditingMenu(null);
    setSelectedFile(null);
    const targetGerai = geraiList[0];
    setFormIdGerai(targetGerai?.id || 'G01');
    setFormKode(`${targetGerai?.kode || 'G01'}-${String(menuList.length + 1).padStart(3, '0')}`);
    setFormNama('');
    setFormHarga(15000);
    setFormKategori('makanan');
    setFormFoto('');
    setIsModalOpen(true);
  };

  const handleBukaEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setSelectedFile(null);
    setFormIdGerai(menu.idGerai || menu.stallId);
    setFormKode(menu.kode || menu.code);
    setFormNama(menu.nama || menu.name);
    setFormHarga(menu.harga || menu.price);
    setFormKategori((menu.kategori as any) || 'makanan');
    setFormFoto(menu.foto || menu.image || '');
    setIsModalOpen(true);
  };

  const handleSimpan = async (e: React.FormEvent) => {
    e.preventDefault();
    const g = geraiList.find((x) => x.id === formIdGerai);
    const namaGerai = g?.nama || 'Gerai';

    try {
      setIsSubmitting(true);
      let finalFotoUrl = formFoto.trim() || undefined;
      if (selectedFile) {
        const uploaded = await uploadApi.uploadMenuImage(selectedFile);
        finalFotoUrl = uploaded.url;
      }

      if (editingMenu) {
        await adminKatalogController.ubahMenuGlobal(editingMenu.id, {
          kode: formKode.trim(),
          nama: formNama.trim(),
          harga: formHarga,
          kategori: formKategori,
          foto: finalFotoUrl || '/images/menu/placeholder.jpg',
        });
        setFeedback(`Menu "${formNama}" berhasil diperbarui.`);
      } else {
        await adminKatalogController.tambahMenuGlobal({
          kode: formKode.trim(),
          nama: formNama.trim(),
          harga: formHarga,
          idGerai: formIdGerai,
          namaGerai,
          kategori: formKategori,
          foto: finalFotoUrl,
        });
        setFeedback(`Menu "${formNama}" berhasil ditambahkan.`);
      }

      setSelectedFile(null);
      setIsModalOpen(false);
      await loadData();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan menu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleHabis = async (menu: Menu) => {
    if (busyMenuId) return;
    setBusyMenuId(menu.id);
    try {
      await adminKatalogController.toggleStatusHabisGlobal(menu.id);
      setFeedback(`Status stok "${menu.nama || menu.name}" berhasil diperbarui.`);
      await loadData();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status stok');
    } finally {
      setBusyMenuId(null);
    }
  };

  const handleHapus = async (menu: Menu) => {
    if (busyMenuId) return;
    const confirmDelete = window.confirm(`Hapus menu "${menu.nama || menu.name}"?`);
    if (!confirmDelete) return;

    setBusyMenuId(menu.id);
    try {
      await adminKatalogController.hapusMenuGlobal(menu.id);
      setFeedback(`Menu "${menu.nama || menu.name}" berhasil dihapus.`);
      await loadData();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus menu');
    } finally {
      setBusyMenuId(null);
    }
  };

  const filtered = useMemo(() => {
    return menuList.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (m.nama || m.name).toLowerCase().includes(q) ||
        (m.kode || m.code).toLowerCase().includes(q) ||
        (m.namaGerai || m.stallName || '').toLowerCase().includes(q);
      const matchesGerai =
        selectedGeraiFilter === 'semua' ||
        m.idGerai === selectedGeraiFilter ||
        m.stallId === selectedGeraiFilter;
      return matchesSearch && matchesGerai;
    });
  }, [menuList, searchQuery, selectedGeraiFilter]);

  return {
    menuList,
    geraiList,
    filtered,
    isLoading,
    busyMenuId,
    selectedGeraiFilter,
    setSelectedGeraiFilter,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    editingMenu,
    formKode,
    setFormKode,
    formNama,
    setFormNama,
    formHarga,
    setFormHarga,
    formIdGerai,
    setFormIdGerai,
    formKategori,
    setFormKategori,
    formFoto,
    setFormFoto,
    selectedFile,
    setSelectedFile,
    isSubmitting,
    feedback,
    handleBukaTambah,
    handleBukaEdit,
    handleSimpan,
    handleToggleHabis,
    handleHapus,
  };
}
