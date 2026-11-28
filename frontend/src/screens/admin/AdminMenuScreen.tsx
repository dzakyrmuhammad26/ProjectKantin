'use client';

import { AdminTableSkeleton } from '@/components/loading/LoadingSkeletons';
import { MotionFadeIn } from '@/components/loading/MotionFadeIn';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';

/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { AdminNavbar } from '@/components/AdminNavbar';
import { RoleGuard } from '@/components/RoleGuard';
import { formatCurrency, MENU_IMAGE_FALLBACK } from '@/utils/formatters';
import { useAdminMenu } from './useAdminMenu';
import { AdminMenuModal } from './components/AdminMenuModal';

export function AdminMenuScreen() {
  const {
    geraiList,
    filtered,
    isLoading,
    busyMenuId,
    selectedGeraiFilter,
    setSelectedGeraiFilter,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    editingMenu,
    formKode,
    setFormKode,
    formNama,
    setFormNama,
    formHarga,
    setFormHarga,
    formIdGerai,
    setFormIdGerai,
    formKategori,
    setFormKategori,
    formFoto,
    setFormFoto,
    selectedFile,
    setSelectedFile,
    isSubmitting,
    feedback,
    handleBukaTambah,
    handleBukaEdit,
    handleSimpan,
    handleToggleHabis,
    handleHapus,
  } = useAdminMenu();

  return (
    <RoleGuard allowedRoles={['superadmin']} areaLabel="Master Menu Global">
      {isLoading ? (
        <div className="min-h-screen bg-[#F8F9FA]">
          <div className="h-[64px] bg-[#111827]" />
          <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            <AdminTableSkeleton rows={7} />
          </div>
        </div>
      ) : (
        <MotionFadeIn className="min-h-screen bg-[#F8F9FA] flex flex-col">
          <AdminNavbar />

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
                  Master Menu Katalog Kantin
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7280]">
                  Lihat dan kelola seluruh menu makanan &amp; minuman dari setiap gerai
                </p>
              </div>

              <button
                onClick={handleBukaTambah}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              >
                + Tambah Menu
              </button>
            </div>

            {feedback && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs sm:text-sm font-medium">
                {feedback}
              </div>
            )}

            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-xl border border-[#E5E7EB]">
              <div className="w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Cari nama menu atau kode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-1.5 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-[#6B7280]">Filter Stan:</span>
                <select
                  value={selectedGeraiFilter}
                  onChange={(e) => setSelectedGeraiFilter(e.target.value)}
                  className="text-xs font-medium px-2.5 py-1.5 border border-[#D1D5DB] rounded-lg bg-white"
                >
                  <option value="semua">Semua Stan</option>
                  {geraiList.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.kode} - {g.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table View */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#F9FAFB] text-[#4B5563] uppercase text-xs font-bold border-b border-[#E5E7EB]">
                  <tr>
                    <th className="py-3 px-4">Menu</th>
                    <th className="py-3 px-4">Stan / Gerai</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Harga</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {filtered.map((menu) => {
                    const isBusy = busyMenuId === menu.id;
                    const isHabis = menu.isHabis || menu.isSoldOut;
                    const imgSrc =
                      menu.foto && menu.foto !== '/images/menu/placeholder.jpg'
                        ? menu.foto
                        : menu.image && menu.image !== '/images/menu/placeholder.jpg'
                        ? menu.image
                        : MENU_IMAGE_FALLBACK;

                    return (
                      <tr key={menu.id} className="hover:bg-[#F9FAFB]">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={imgSrc}
                              alt={menu.nama || menu.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = MENU_IMAGE_FALLBACK;
                              }}
                            />
                          </div>
                          <div>
                            <span className="text-xs font-mono font-bold text-[#6B7280]">
                              {menu.kode || menu.code}
                            </span>
                            <h4 className="font-bold text-[#111827]">
                              {menu.nama || menu.name}
                            </h4>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-[#4B5563]">
                          {menu.namaGerai || menu.stallName}
                        </td>
                        <td className="py-3 px-4 uppercase text-xs text-[#6B7280]">
                          {menu.kategori || 'Makanan'}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-700">
                          {formatCurrency(menu.harga || menu.price)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            disabled={busyMenuId !== null}
                            onClick={() => handleToggleHabis(menu)}
                            title="Klik untuk ubah status stok"
                            className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold transition-colors disabled:opacity-60 ${
                              isHabis
                                ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            }`}
                          >
                            {isBusy && <LoadingSpinner size="xs" variant={isHabis ? 'danger' : 'brand'} />}
                            {isHabis ? 'Habis' : 'Tersedia'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              disabled={busyMenuId !== null}
                              onClick={() => handleBukaEdit(menu)}
                              className="px-2.5 py-1 text-xs font-medium rounded bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] disabled:opacity-60"
                            >
                              Edit
                            </button>
                            <button
                              disabled={busyMenuId !== null}
                              onClick={() => handleHapus(menu)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded bg-rose-50 hover:bg-rose-100 text-rose-700 disabled:opacity-60"
                            >
                              {isBusy && <LoadingSpinner size="xs" variant="danger" />}
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </main>

          <AdminMenuModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSimpan}
            editingMenu={editingMenu}
            geraiList={geraiList}
            formIdGerai={formIdGerai}
            onIdGeraiChange={setFormIdGerai}
            formKode={formKode}
            onKodeChange={setFormKode}
            formNama={formNama}
            onNamaChange={setFormNama}
            formHarga={formHarga}
            onHargaChange={setFormHarga}
            formKategori={formKategori}
            onKategoriChange={setFormKategori}
            formFoto={formFoto}
            onFotoChange={setFormFoto}
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            isSubmitting={isSubmitting}
          />
        </MotionFadeIn>
      )}
    </RoleGuard>
  );
}

export default AdminMenuScreen;
