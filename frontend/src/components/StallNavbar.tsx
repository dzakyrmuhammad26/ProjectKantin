'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gerai } from '@/models/gerai';

interface StallNavbarProps {
  geraiAktif: Gerai | null;
  daftarGerai: Gerai[];
  onPilihGerai: (idGerai: string) => void;
}

export function StallNavbar({
  geraiAktif,
  daftarGerai,
  onPilihGerai,
}: StallNavbarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Antrean Dapur', href: '/stall/queue' },
    { label: 'Kelola Menu', href: '/stall/menu' },
    { label: 'Pesan Cepat', href: '/stall/order' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Stall Info */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              prefetch={true}
              className="text-xs font-semibold px-2.5 py-1 bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded text-[#4B5563] transition-colors"
            >
              Beranda
            </Link>

            <div className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full ring-2 ring-white"
                style={{ backgroundColor: geraiAktif?.warna || '#10B981' }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-bold text-[#111827]">
                    {geraiAktif?.nama || 'Tablet Gerai'}
                  </h1>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                    {geraiAktif?.kode || 'G01'}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280]">
                  Penyewa: {geraiAktif?.penyewa || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigasi Tab */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#1F2937] text-white shadow-sm'
                      : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Quick Switch Stan (Dropdown) */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-[#6B7280]">Pilih Stan:</span>
            <select
              value={geraiAktif?.id || ''}
              onChange={(e) => onPilihGerai(e.target.value)}
              className="text-xs font-medium border border-[#D1D5DB] rounded-lg px-2.5 py-1.5 bg-white text-[#111827] focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              {daftarGerai.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.kode} - {g.nama}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
