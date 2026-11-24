'use client';

import React from 'react';
import { AdminNavbar } from '@/components/AdminNavbar';
import { formatCurrency } from '@/utils/formatters';
import { useAdminReport } from './useAdminReport';

export function AdminReportScreen() {
  const {
    rekapList,
    geraiList,
    isLoading,
    totalOmzetKantin,
    totalTransaksiKantin,
    totalPorsiKantin,
    handleCetakLaporan,
  } = useAdminReport();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <p className="text-sm text-[#6B7280]">Memuat laporan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <AdminNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
              Laporan Settlement &amp; Rekapitulasi Gerai
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Rekap penjualan harian per stan untuk perhitungan bagi hasil / settlement kasir terpusat
            </p>
          </div>

          <button
            onClick={handleCetakLaporan}
            className="px-4 py-2 bg-[#111827] hover:bg-black text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            Cetak Rekapitulasi (PDF)
          </button>
        </div>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-[#E5E7EB] shadow-xs">
            <span className="text-xs text-[#6B7280] font-medium">Total Omzet Bersih Seluruh Stan</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {formatCurrency(totalOmzetKantin)}
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[#E5E7EB] shadow-xs">
            <span className="text-xs text-[#6B7280] font-medium">Total Transaksi Selesai</span>
            <p className="text-2xl font-black text-[#111827] mt-1">
              {totalTransaksiKantin} Nota
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[#E5E7EB] shadow-xs">
            <span className="text-xs text-[#6B7280] font-medium">Total Porsi Terjual</span>
            <p className="text-2xl font-black text-indigo-600 mt-1">
              {totalPorsiKantin} Porsi
            </p>
          </div>
        </div>

        {/* Tabel Rekapitulasi */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-xs">
          <div className="p-4 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111827]">
              Rincian Pembagian Settlement per Gerai
            </h3>
            <span className="text-xs text-[#6B7280]">
              Periode: Hari Ini
            </span>
          </div>

          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F9FAFB] text-[#4B5563] uppercase text-xs font-bold border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3 px-4">Stan / Gerai</th>
                <th className="py-3 px-4">Penyewa</th>
                <th className="py-3 px-4 text-center">Total Transaksi</th>
                <th className="py-3 px-4 text-center">Total Porsi</th>
                <th className="py-3 px-4 text-right">Omzet Stan</th>
                <th className="py-3 px-4 text-right">Hak Cair Stan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {rekapList.map((item) => {
                const g = geraiList.find((x) => x.id === item.idGerai);
                return (
                  <tr key={item.idGerai} className="hover:bg-[#F9FAFB]">
                    <td className="py-3.5 px-4 font-bold text-[#111827] flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: g?.warna || '#10B981' }}
                      />
                      <span>{item.namaGerai}</span>
                      <span className="text-xs font-mono font-normal text-[#6B7280]">
                        ({item.idGerai})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#4B5563]">
                      {g?.penyewa || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium">
                      {item.totalTransaksi}
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium">
                      {item.totalPorsi}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#111827]">
                      {formatCurrency(item.totalOmzet)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                      {formatCurrency(item.totalOmzet)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-[#F9FAFB] font-bold border-t border-[#E5E7EB]">
              <tr>
                <td colSpan={2} className="py-3.5 px-4 text-[#111827]">
                  TOTAL KESELURUHAN
                </td>
                <td className="py-3.5 px-4 text-center">{totalTransaksiKantin}</td>
                <td className="py-3.5 px-4 text-center">{totalPorsiKantin}</td>
                <td className="py-3.5 px-4 text-right">{formatCurrency(totalOmzetKantin)}</td>
                <td className="py-3.5 px-4 text-right text-emerald-700">
                  {formatCurrency(totalOmzetKantin)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminReportScreen;
