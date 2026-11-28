'use client';

import React from 'react';
import Link from 'next/link';

export interface NavbarProps {
  title?: string;
  cardNumber?: string;
}

export function Navbar({ title = 'Kantin Sentral Pujasera', cardNumber }: NavbarProps) {
  return (
    <header className="h-16 w-full bg-white border-b border-line sticky top-0 z-40">
      <div className="max-w-[1280px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Kiri */}
        <div className="flex items-center">
          <Link
            href="/customer"
            prefetch={true}
            className="font-bold text-[16px] sm:text-[18px] text-ink hover:text-brand-700 transition-colors"
          >
            {title}
          </Link>
        </div>

        {/* Kartu Pelanggan Kanan */}
        {cardNumber && (
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-brand-50 border border-brand-700 rounded-[8px]">
            <span className="text-[12px] sm:text-[13px] font-semibold text-brand-700 whitespace-nowrap">
              Kartu No. {cardNumber}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
