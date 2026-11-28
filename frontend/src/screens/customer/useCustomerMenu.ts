'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Menu } from '@/models/menu';
import { Stall } from '@/models/gerai';
import { PengaturanKantin } from '@/models/pengaturan';
import { TabItem } from '@/components/Tabs';
import menuController from '@/controllers/menuController';
import stallController from '@/controllers/stallController';
import cartController from '@/controllers/cartController';
import pengaturanController from '@/controllers/pengaturanController';
import { useCart } from '@/context/CartContext';

export function useCustomerMenu() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Data state loaded via controllers
  const [menus, setMenus] = useState<Menu[]>([]);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [pengaturan, setPengaturan] = useState<PengaturanKantin>(pengaturanController.getDefault());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Pure UI state for filtering & inputs
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabId, setActiveTabId] = useState('all');
  const [cardError, setCardError] = useState<string | null>(null);

  // Mobile cart drawer open state
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Cart state & actions from CartContext
  const cart = useCart();
  const { cardNumber, setCardNumber } = cart;

  // Load menu, stall, and settings data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [stallData, menuData, settingData] = await Promise.all([
          stallController.getStalls(),
          menuController.getMenus(),
          pengaturanController.getPengaturan(),
        ]);
        setStalls(stallData);
        setMenus(menuData);
        setPengaturan(settingData);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Prefetch confirm route for instant checkout navigation
  useEffect(() => {
    router.prefetch('/customer/confirm');
  }, [router]);

  // Sync card number from URL query ?card=
  useEffect(() => {
    const cardParam = searchParams.get('card')?.trim();
    if (cardParam && cardParam !== cardNumber) {
      setCardNumber(cardParam);
    }
  }, [searchParams, cardNumber, setCardNumber]);

  // Handle card number change and clear error
  const handleCardNumberChange = useCallback(
    (val: string) => {
      setCardNumber(val);
      if (cardError && val.trim()) {
        setCardError(null);
      }
    },
    [cardError, setCardNumber]
  );

  // Build stall tabs using controller data
  const tabList: TabItem[] = useMemo(() => {
    return [
      { id: 'all', label: 'Semua Gerai', count: menus.length },
      ...stalls.map((s) => ({
        id: s.id,
        label: s.name,
        count: menus.filter((m) => m.stallId === s.id).length,
      })),
    ];
  }, [stalls, menus]);

  // Compute filtered menu groups using controller logic
  const filteredData = useMemo(() => {
    return menuController.filterMenus(menus, stalls, searchQuery, activeTabId);
  }, [menus, stalls, searchQuery, activeTabId]);

  // Lookup map for stall metadata
  const stallMap = useMemo(() => {
    return stallController.getStallMap(stalls);
  }, [stalls]);

  // Handle checkout navigation with validation matching backend card range
  const handleCheckout = useCallback(() => {
    if (cart.items.length === 0) return;

    const validation = cartController.validateCardNumber(
      cardNumber,
      pengaturan.nomorKartuMin,
      pengaturan.nomorKartuMax
    );

    if (!validation.valid) {
      setCardError(validation.error || 'Silakan masukkan nomor kartu yang valid.');
      if (!isMobileCartOpen && typeof window !== 'undefined' && window.innerWidth < 1024) {
        setIsMobileCartOpen(true);
      }
      setTimeout(() => {
        const inputEl = document.getElementById('customer-number-input');
        inputEl?.focus();
      }, 100);
      return;
    }

    setCardError(null);
    setIsMobileCartOpen(false);
    router.push(`/customer/confirm?card=${encodeURIComponent(cardNumber.trim())}`);
  }, [
    cart.items.length,
    cardNumber,
    pengaturan.nomorKartuMin,
    pengaturan.nomorKartuMax,
    isMobileCartOpen,
    router,
  ]);

  return {
    menus,
    stalls,
    pengaturan,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeTabId,
    setActiveTabId,
    cardError,
    setCardError,
    isMobileCartOpen,
    setIsMobileCartOpen,
    cart,
    tabList,
    filteredData,
    stallMap,
    handleCardNumberChange,
    handleCheckout,
  };
}
