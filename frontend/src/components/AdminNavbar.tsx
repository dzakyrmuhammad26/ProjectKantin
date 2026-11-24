'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Kelola Stan', href: '/admin/stalls' },
    { label: 'Master Menu', href: '/admin/menu' },
    { label: 'Akun Staf', href: '/admin/users' },
    { label: 'Laporan Rekap', href: '/admin/reports' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#111827] text-white border-b border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-bold text-sm sm:text-base tracking-tight text-white">
                Kantin POS
              </span>
            </Link>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              Superadmin
            </span>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white font-semibold shadow-xs'
                      : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2">
            <Link
              href="/cashier"
              prefetch={true}
              className="text-xs font-medium px-2.5 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors"
            >
              Kasir
            </Link>
            <Link
              href="/stall/queue"
              prefetch={true}
              className="text-xs font-medium px-2.5 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors"
            >
              Dapur Stan
            </Link>
            <Link
              href="/"
              className="text-xs font-medium px-2.5 py-1.5 rounded bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800/60 transition-colors"
            >
              Keluar
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-gray-800">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap px-2.5 py-1 rounded text-xs font-medium ${
                  isActive ? 'bg-gray-800 text-white font-bold' : 'text-gray-400'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
