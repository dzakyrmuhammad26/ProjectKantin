'use client';

import { useState } from 'react';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLogin } from './useLogin';
import { LoginNumpad } from './components/LoginNumpad';

export function LoginScreen() {
  const { currentUser, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const {
    pin,
    errorMsg,
    isLoading,
    activeQuickPin,
    handleNumpadClick,
    handleBackspace,
    handleClear,
    handleSubmit,
    handleQuickLogin,
  } = useLogin();

  const currentDashboardHref =
    currentUser?.peran === 'superadmin'
      ? '/admin/dashboard'
      : currentUser?.peran === 'kasir'
      ? '/cashier'
      : currentUser?.peran === 'gerai'
      ? '/stall/queue'
      : '/customer';

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col gap-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-lg font-black text-[#111827]">Kantin POS</span>
          </Link>
          <h2 className="text-xl font-bold text-[#111827]">Login Staf &amp; Tenant</h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Masukkan PIN 4-6 digit Anda untuk mengakses sistem
          </p>
        </div>

        {currentUser && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-xs">
            <div className="min-w-0">
              <span className="text-emerald-800 block font-semibold truncate">
                Sudah login: {currentUser.nama} ({currentUser.peran})
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={currentDashboardHref}
                className="px-2.5 py-1 rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
              >
                Lanjutkan
              </Link>
              <button
                type="button"
                disabled={isLoggingOut || isLoading}
                onClick={async () => {
                  if (isLoggingOut) return;
                  setIsLoggingOut(true);
                  try {
                    await logout();
                  } finally {
                    setIsLoggingOut(false);
                  }
                }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-medium disabled:opacity-60"
              >
                {isLoggingOut && <LoadingSpinner size="xs" variant="brand" />}
                {isLoggingOut ? 'Keluar...' : 'Keluar'}
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {/* PIN Display Dots */}
        <div className="flex justify-center items-center gap-3 py-3">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                idx < pin.length
                  ? 'bg-emerald-600 border-emerald-600 scale-110'
                  : 'bg-gray-100 border-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Numpad 3x4 */}
        <LoginNumpad
          onDigitClick={handleNumpadClick}
          onClear={handleClear}
          onBackspace={handleBackspace}
        />

        <button
          onClick={() => handleSubmit()}
          disabled={isLoading || pin.length < 4}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 shadow-xs inline-flex items-center justify-center gap-2"
        >
          {isLoading && !activeQuickPin && <LoadingSpinner size="sm" variant="white" />}
          {isLoading && !activeQuickPin ? 'Memverifikasi...' : 'Masuk ke Sistem'}
        </button>

        {/* Quick Demo PIN Shortcuts */}
        <div className="border-t border-[#F3F4F6] pt-4 flex flex-col gap-2">
          <span className="text-xs font-semibold text-[#6B7280] text-center">
            Pintasan Login Cepat (Mode Demo):
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickLogin('123456')}
              className="p-1.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-800 font-medium text-center border border-purple-200 inline-flex items-center justify-center gap-1 disabled:opacity-60"
            >
              {isLoading && activeQuickPin === '123456' && <LoadingSpinner size="xs" variant="brand" />}
              Superadmin
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickLogin('112233')}
              className="p-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium text-center border border-blue-200 inline-flex items-center justify-center gap-1 disabled:opacity-60"
            >
              {isLoading && activeQuickPin === '112233' && <LoadingSpinner size="xs" variant="brand" />}
              Kasir
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickLogin('1111')}
              className="p-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium text-center border border-emerald-200 inline-flex items-center justify-center gap-1 disabled:opacity-60"
            >
              {isLoading && activeQuickPin === '1111' && <LoadingSpinner size="xs" variant="brand" />}
              Gerai G01
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
