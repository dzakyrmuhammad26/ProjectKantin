'use client';

import { PageLoadingScreen } from '@/components/loading/PageLoadingScreen';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { PeranPengguna } from '@/models/pengguna';

interface RoleGuardProps {
  allowedRoles: PeranPengguna[];
  areaLabel: string;
  children: ReactNode;
}

export function RoleGuard({ allowedRoles, areaLabel, children }: RoleGuardProps) {
  const { currentUser, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <PageLoadingScreen
        title="Memverifikasi sesi akses..."
        subtitle={`Menyiapkan ${areaLabel}`}
      />
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-6 text-center space-y-4">
          <div className="inline-flex px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
            Autentikasi Diperlukan
          </div>
          <h2 className="text-xl font-bold text-[#111827]">
            Login untuk Mengakses {areaLabel}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
            Sesuai keamanan API backend, setiap aksi pengelolaan pada halaman ini membutuhkan token JWT staf yang sah.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/auth"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors"
            >
              Login Staf via PIN
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 bg-white hover:bg-[#F3F4F6] text-[#374151] border border-[#D1D5DB] rounded-xl text-sm font-medium transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasAccess =
    currentUser.peran === 'superadmin' || allowedRoles.includes(currentUser.peran);

  if (!hasAccess) {
    const redirectPath =
      currentUser.peran === 'kasir'
        ? '/cashier'
        : currentUser.peran === 'gerai'
        ? '/stall/queue'
        : '/customer';

    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-rose-200 rounded-2xl shadow-sm p-6 text-center space-y-4">
          <div className="inline-flex px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
            Akses Ditolak (RBAC)
          </div>
          <h2 className="text-xl font-bold text-[#111827]">
            Peran Anda Tidak Memiliki Izin
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
            Anda login sebagai <strong className="text-[#111827]">{currentUser.nama}</strong> ({currentUser.peran}), yang tidak diizinkan mengakses {areaLabel}.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href={redirectPath}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors"
            >
              Buka Halaman Sesuai Peran Anda
            </Link>
            <Link
              href="/auth"
              onClick={() => {
                logout();
              }}
              className="w-full py-2.5 bg-white hover:bg-[#F3F4F6] text-[#374151] border border-[#D1D5DB] rounded-xl text-sm font-medium transition-colors"
            >
              Ganti Akun Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default RoleGuard;
