'use client';

import React from 'react';
import Link from 'next/link';

export interface NavbarProps {
  title?: string;
  cardNumber?: string;
}

export function Navbar({ title = 'Kantin Darren' }: NavbarProps) {
  return (
    <header className="h-16 w-full bg-white border-b border-line sticky top-0 z-50">
      <div className="max-w-[1280px] h-full mx-auto px-6 flex items-center justify-between">
        {/* Brand Kiri */}
        <div className="flex items-center">
          <Link href="/pesan" className="font-bold text-[16px] text-ink hover:text-brand-700 transition-colors">
            {title}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
