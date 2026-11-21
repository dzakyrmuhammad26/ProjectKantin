'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GERAI_LIST, MENU_ITEMS } from '@/models/menuData';
import { TabItem } from '@/components/Tabs';
import { useCart } from './CartContext';

export function useMenuController() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cardNumber, setCardNumber, items, addItem, removeItem, clearCart, updateItemNotes, getItemQty, itemsByGerai, totalCount, totalAmount } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabId, setActiveTabId] = useState('semua');
  const [cardError, setCardError] = useState<string | null>(null);

  // Sinkronisasi nomor kartu dari query string ?kartu=
  useEffect(() => {
    const kartuParam = searchParams.get('kartu');
    if (kartuParam) {
      setCardNumber(kartuParam);
    }
  }, [searchParams, setCardNumber]);

  const handleCardNumberChange = (val: string) => {
    setCardNumber(val);
    if (cardError && val.trim()) {
      setCardError(null);
    }
  };

  // Tab list
  const tabList: TabItem[] = useMemo(() => {
    return [
      { id: 'semua', label: 'Semua Gerai', count: MENU_ITEMS.length },
      ...GERAI_LIST.map((g) => ({
        id: g.id,
        label: g.name,
        count: MENU_ITEMS.filter((m) => m.geraiId === g.id).length,
      })),
    ];
  }, []);

  // Filter Gerai & Menu
  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const visibleGerais =
      activeTabId === 'semua'
        ? GERAI_LIST
        : GERAI_LIST.filter((g) => g.id === activeTabId);

    return visibleGerais
      .map((gerai) => {
        const stallMenus = MENU_ITEMS.filter((item) => item.geraiId === gerai.id);
        const matchingMenus = stallMenus.filter((item) => {
          if (!q) return true;
          return (
            item.name.toLowerCase().includes(q) ||
            item.code.toLowerCase().includes(q) ||
            gerai.name.toLowerCase().includes(q)
          );
        });

        return {
          gerai,
          menus: matchingMenus,
        };
      })
      .filter((group) => group.menus.length > 0);
  }, [searchQuery, activeTabId]);

  const geraiMap = useMemo(() => {
    return new Map(GERAI_LIST.map((g) => [g.id, g]));
  }, []);

  const handleCheckout = () => {
    if (items.length === 0) return;
    if (!cardNumber || !cardNumber.trim()) {
      setCardError('Silakan masukkan nomor pelanggan terlebih dahulu.');
      const inputEl = document.getElementById('customer-number-input');
      inputEl?.focus();
      return;
    }
    setCardError(null);
    router.push(`/pesan/konfirmasi?kartu=${encodeURIComponent(cardNumber.trim())}`);
  };

  return {
    cardNumber,
    setCardNumber,
    handleCardNumberChange,
    cardError,
    setCardError,
    searchQuery,
    setSearchQuery,
    activeTabId,
    setActiveTabId,
    tabList,
    filteredData,
    geraiMap,
    items,
    itemsByGerai,
    totalCount,
    totalAmount,
    getItemQty,
    addItem,
    removeItem,
    clearCart,
    updateItemNotes,
    handleCheckout,
  };
}
