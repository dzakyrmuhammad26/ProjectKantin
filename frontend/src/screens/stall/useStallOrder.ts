'use client';

import { useState, useEffect, useCallback } from 'react';
import { Gerai } from '@/models/gerai';
import { Menu } from '@/models/menu';
import { CartItem } from '@/models/pesanan';
import { PengaturanKantin } from '@/models/pengaturan';
import stallController from '@/controllers/stallController';
import menuGeraiController from '@/controllers/menuGeraiController';
import cartController from '@/controllers/cartController';
import orderController from '@/controllers/orderController';
import pengaturanController from '@/controllers/pengaturanController';
import { useAuth } from '@/context/AuthContext';

export function useStallOrder() {
  const { currentUser } = useAuth();
  const [daftarGerai, setDaftarGerai] = useState<Gerai[]>([]);
  const [geraiAktif, setGeraiAktif] = useState<Gerai | null>(null);
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [pengaturan, setPengaturan] = useState<PengaturanKantin>(pengaturanController.getDefault());
  const [isLoading, setIsLoading] = useState(true);

  const [nomorKartu, setNomorKartu] = useState<string>('');
  const [nomorMeja, setNomorMeja] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const [stalls, settingData] = await Promise.all([
          stallController.getStalls(),
          pengaturanController.getPengaturan(),
        ]);
        setDaftarGerai(stalls);
        setPengaturan(settingData);
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
      setCartItems([]);
    }
  }, [geraiAktif?.id, loadMenuStan]);

  const handlePilihGerai = (idGerai: string) => {
    const found = daftarGerai.find((g) => g.id === idGerai) || null;
    setGeraiAktif(found);
  };

  const handleTambahItem = (menu: Menu) => {
    setCartItems((prev) => cartController.addItem(prev, menu));
  };

  const handleKurangItem = (menuId: string) => {
    setCartItems((prev) => cartController.removeItem(prev, menuId));
  };

  const { totalCount, totalAmount } = cartController.calculateTotals(cartItems);

  const handleSubmitPesananStan = async () => {
    const validation = cartController.validateCardNumber(
      nomorKartu,
      pengaturan.nomorKartuMin,
      pengaturan.nomorKartuMax
    );
    if (!validation.valid) {
      alert(validation.error || 'Masukkan nomor kartu fisik pelanggan yang valid');
      return;
    }
    if (cartItems.length === 0) {
      alert('Pilih setidaknya 1 menu');
      return;
    }

    try {
      setIsSubmitting(true);
      const meja = nomorMeja ? parseInt(nomorMeja, 10) : undefined;
      const order = await orderController.createOrder(
        nomorKartu.trim(),
        cartItems,
        totalAmount,
        {
          nomorMeja: meja,
          idGerai: geraiAktif?.kode,
          namaGerai: geraiAktif?.nama,
          sumber: 'gerai',
          minCard: pengaturan.nomorKartuMin,
          maxCard: pengaturan.nomorKartuMax,
        }
      );

      setSuccessInfo(
        `Pesanan #${order.id} untuk Kartu ${nomorKartu} berhasil dicatat! Menunggu pembayaran di kasir sentral.`
      );
      setCartItems([]);
      setNomorKartu('');
      setNomorMeja('');
    } catch (err: any) {
      alert(err.message || 'Gagal membuat pesanan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    daftarGerai,
    geraiAktif,
    menuList,
    pengaturan,
    isLoading,
    nomorKartu,
    setNomorKartu,
    nomorMeja,
    setNomorMeja,
    cartItems,
    totalCount,
    totalAmount,
    isSubmitting,
    successInfo,
    setSuccessInfo,
    handlePilihGerai,
    handleTambahItem,
    handleKurangItem,
    handleSubmitPesananStan,
  };
}
