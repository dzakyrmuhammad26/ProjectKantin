'use client';

import React from 'react';
import Link from 'next/link';
import { AdminNavbar } from '@/components/AdminNavbar';
import { formatCurrency } from '@/utils/formatters';
import { useAdminDashboard } from './useAdminDashboard';

export function AdminDashboardScreen() {
  const { summary, rekapList, geraiList, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <p className="text-sm text-[#6B7280]">Memuat dashboard analitik...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <AdminNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
            Dashboard Utama Superadmin
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Pantau perputaran omzet, transaksi harian, dan kinerja seluruh gerai kantin
          </p>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl border border-[#E5E7EB] shadow-xs flex flex-col gap-1">
            <span className="text-xs font-medium text-[#6B7280]">Omzet Penjualan Hari Ini</span>
            <span className="text-lg sm:text-2xl font-black text-emerald-600">
              {formatCurrency(summary?.omzetHariIni || 0)}
            </span>
            <span className="text-xs text-[#9CA3AF]">Akumulasi seluruh stan</span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#E5E7EB] shadow-xs flex flex-col gap-1">
            <span className="text-xs font-medium text-[#6B7280]">Total Transaksi</span>
            <span className="text-lg sm:text-2xl font-black text-[#111827]">
              {summary?.totalTransaksi || 0}
            </span>
            <span className="text-xs text-[#9CA3AF]">Pesanan yang telah dibayar</span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#E5E7EB] shadow-xs flex flex-col gap-1">
            <span className="text-xs font-medium text-[#6B7280]">Pelanggan Aktif</span>
            <span className="text-lg sm:text-2xl font-black text-amber-600">
              {summary?.totalPelangganAktif || 0} Kartu
            </span>
            <span className="text-xs text-[#9CA3AF]">Sedang memilih / menunggu bayar</span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#E5E7EB] shadow-xs flex flex-col gap-1">
            <span className="text-xs font-medium text-[#6B7280]">Rata-rata Transaksi</span>
            <span className="text-lg sm:text-2xl font-black text-indigo-600">
              {formatCurrency(summary?.rataRataPerTransaksi || 0)}
            </span>
            <span className="text-xs text-[#9CA3AF]">Rata-rata nilai per nota</span>
          </div>
        </div>

        {/* Performa Omzet per Gerai */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#111827]">
              Kinerja Penjualan per Gerai
            </h3>
            <Link
              href="/admin/reports"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline"
            >
              Lihat Laporan Lengkap
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F9FAFB] text-[#4B5563] uppercase text-xs font-bold border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-3 px-4">Stan / Gerai</th>
                  <th className="py-3 px-4">Penyewa</th>
                  <th className="py-3 px-4 text-center">Total Transaksi</th>
                  <th className="py-3 px-4 text-center">Porsi Terjual</th>
                  <th className="py-3 px-4 text-right">Total Omzet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {rekapList.map((item) => {
                  const g = geraiList.find((x) => x.id === item.idGerai);
                  return (
                    <tr key={item.idGerai} className="hover:bg-[#F9FAFB]">
                      <td className="py-3 px-4 font-bold text-[#111827] flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: g?.warna || '#10B981' }}
                        />
                        <span>{item.namaGerai}</span>
                        <span className="text-xs font-normal text-[#6B7280]">
                          ({item.idGerai})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#4B5563]">
                        {g?.penyewa || '-'}
                      </td>
                      <td className="py-3 px-4 text-center text-[#111827] font-medium">
                        {item.totalTransaksi} nota
                      </td>
                      <td className="py-3 px-4 text-center text-[#111827] font-medium">
                        {item.totalPorsi} porsi
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-700">
                        {formatCurrency(item.totalOmzet)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Shortcut Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/stalls"
            className="p-4 bg-white rounded-xl border border-[#E5E7EB] hover:border-gray-400 transition-colors flex flex-col gap-1 shadow-xs"
          >
            <h4 className="text-sm font-bold text-[#111827]">Kelola Stan</h4>
            <p className="text-xs text-[#6B7280]">
              Tambah stan baru, ubah penyewa &amp; warna kartu stan.
            </p>
          </Link>

          <Link
            href="/admin/menu"
            className="p-4 bg-white rounded-xl border border-[#E5E7EB] hover:border-gray-400 transition-colors flex flex-col gap-1 shadow-xs"
          >
            <h4 className="text-sm font-bold text-[#111827]">Master Menu Global</h4>
            <p className="text-xs text-[#6B7280]">
              Review &amp; kelola seluruh menu makanan/minuman semua stan.
            </p>
          </Link>

          <Link
            href="/admin/users"
            className="p-4 bg-white rounded-xl border border-[#E5E7EB] hover:border-gray-400 transition-colors flex flex-col gap-1 shadow-xs"
          >
            <h4 className="text-sm font-bold text-[#111827]">Akun Staf &amp; Kasir</h4>
            <p className="text-xs text-[#6B7280]">
              Atur hak akses staf dan reset PIN login.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboardScreen;
