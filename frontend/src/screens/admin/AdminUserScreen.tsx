'use client';

import React from 'react';
import { AdminNavbar } from '@/components/AdminNavbar';
import { useAdminUser } from './useAdminUser';
import { AdminUserResetModal } from './components/AdminUserResetModal';
import { AdminUserAddModal } from './components/AdminUserAddModal';

export function AdminUserScreen() {
  const {
    penggunaList,
    geraiList,
    isLoading,
    selectedUser,
    pinBaru,
    setPinBaru,
    isResetModalOpen,
    setIsResetModalOpen,
    isTambahModalOpen,
    setIsTambahModalOpen,
    nama,
    setNama,
    username,
    setUsername,
    pin,
    setPin,
    peran,
    setPeran,
    idGerai,
    setIdGerai,
    feedback,
    handleBukaResetPin,
    handleSimpanResetPin,
    handleSimpanPenggunaBaru,
  } = useAdminUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <p className="text-sm text-[#6B7280]">Memuat data staf...</p>
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
              Akun Staf &amp; Manajemen PIN
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Kelola akun staf kasir, operator dapur stan, dan reset PIN cepat
            </p>
          </div>

          <button
            onClick={() => setIsTambahModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            + Tambah Akun Staf
          </button>
        </div>

        {feedback && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs sm:text-sm font-medium">
            {feedback}
          </div>
        )}

        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F9FAFB] text-[#4B5563] uppercase text-xs font-bold border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3 px-4">Nama Staf</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4">Penugasan Stan</th>
                <th className="py-3 px-4">PIN Login</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {penggunaList.map((user) => {
                const g = geraiList.find((x) => x.id === user.idGerai);
                return (
                  <tr key={user.id} className="hover:bg-[#F9FAFB]">
                    <td className="py-3 px-4 font-bold text-[#111827]">
                      {user.nama}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#6B7280]">
                      {user.username}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                          user.peran === 'superadmin'
                            ? 'bg-purple-100 text-purple-800'
                            : user.peran === 'kasir'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {user.peran}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#4B5563]">
                      {user.peran === 'gerai' ? g?.nama || user.idGerai : '-'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold tracking-widest text-[#111827]">
                      ••••••
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleBukaResetPin(user)}
                        className="px-2.5 py-1 text-xs font-medium rounded bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151]"
                      >
                        Reset PIN
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal Reset PIN */}
      <AdminUserResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        selectedUser={selectedUser}
        pinBaru={pinBaru}
        onPinBaruChange={setPinBaru}
        onSubmit={handleSimpanResetPin}
      />

      {/* Modal Tambah User */}
      <AdminUserAddModal
        isOpen={isTambahModalOpen}
        onClose={() => setIsTambahModalOpen(false)}
        onSubmit={handleSimpanPenggunaBaru}
        nama={nama}
        onNamaChange={setNama}
        username={username}
        onUsernameChange={setUsername}
        peran={peran}
        onPeranChange={setPeran}
        idGerai={idGerai}
        onIdGeraiChange={setIdGerai}
        geraiList={geraiList}
        pin={pin}
        onPinChange={setPin}
      />
    </div>
  );
}

export default AdminUserScreen;
