'use client';

import React from 'react';
import { StallNavbar } from '@/components/StallNavbar';
import { useStallMenu } from './useStallMenu';
import { StallMenuCard } from './components/StallMenuCard';
import { StallMenuModal } from './components/StallMenuModal';

export function StallMenuScreen() {
  const {
    daftarGerai,
    geraiAktif,
    filteredMenuList,
    isLoading,
    searchQuery,
    setSearchQuery,
    kategoriFilter,
    setKategoriFilter,
    modalMode,
    setModalMode,
    formNama,
    setFormNama,
    formHarga,
    setFormHarga,
    formKategori,
    setFormKategori,
    formFoto,
    setFormFoto,
    formKode,
    setFormKode,
    isSubmitting,
    actionMessage,
    handlePilihGerai,
    handleToggleHabis,
    handleBukaModalTambah,
    handleBukaModalEdit,
    handleSimpanMenu,
    handleHapusMenu,
  } = useStallMenu();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <p className="text-sm text-[#6B7280]">Memuat katalog menu gerai...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <StallNavbar
        geraiAktif={geraiAktif}
        daftarGerai={daftarGerai}
        onPilihGerai={handlePilihGerai}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Header & Tambah Menu Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
              Kelola Menu {geraiAktif?.nama}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Tambah, edit harga/foto, atau tandai stok habis untuk gerai Anda
            </p>
          </div>

          <button
            onClick={handleBukaModalTambah}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            + Tambah Menu Baru
          </button>
        </div>

        {/* Action Message Feedback */}
        {actionMessage && (
          <div
            className={`p-3 rounded-lg text-xs sm:text-sm font-medium border ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {actionMessage.text}
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-xl border border-[#E5E7EB]">
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari menu stan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-1.5 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {['semua', 'makanan', 'minuman', 'camilan'].map((kat) => (
              <button
                key={kat}
                onClick={() => setKategoriFilter(kat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                  kategoriFilter === kat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]'
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMenuList.length === 0 ? (
            <div className="col-span-full py-16 text-center text-sm text-[#6B7280]">
              Tidak ada menu ditemukan di stan ini.
            </div>
          ) : (
            filteredMenuList.map((menu) => (
              <StallMenuCard
                key={menu.id}
                menu={menu}
                onToggleHabis={handleToggleHabis}
                onEdit={handleBukaModalEdit}
                onDelete={handleHapusMenu}
              />
            ))
          )}
        </div>
      </main>

      {/* Modal Tambah / Edit Menu */}
      <StallMenuModal
        modalMode={modalMode}
        onClose={() => setModalMode(null)}
        onSubmit={handleSimpanMenu}
        formKode={formKode}
        onFormKodeChange={setFormKode}
        formNama={formNama}
        onFormNamaChange={setFormNama}
        formHarga={formHarga}
        onFormHargaChange={setFormHarga}
        formKategori={formKategori}
        onFormKategoriChange={setFormKategori}
        formFoto={formFoto}
        onFormFotoChange={setFormFoto}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default StallMenuScreen;
