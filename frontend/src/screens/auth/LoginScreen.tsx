'use client';

import React from 'react';
import Link from 'next/link';
import { useLogin } from './useLogin';
import { LoginNumpad } from './components/LoginNumpad';

export function LoginScreen() {
  const {
    pin,
    errorMsg,
    isLoading,
    handleNumpadClick,
    handleBackspace,
    handleClear,
    handleSubmit,
    handleQuickLogin,
  } = useLogin();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col gap-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-lg font-black text-[#111827]">Kantin POS</span>
          </Link>
          <h2 className="text-xl font-bold text-[#111827]">Login Staf & Tenant</h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Masukkan PIN 4-6 digit Anda untuk mengakses sistem
          </p>
        </div>

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
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 shadow-xs"
        >
          {isLoading ? 'Memverifikasi...' : 'Masuk ke Sistem'}
        </button>

        {/* Quick Demo PIN Shortcuts for easy evaluation */}
        <div className="border-t border-[#F3F4F6] pt-4 flex flex-col gap-2">
          <span className="text-xs font-semibold text-[#6B7280] text-center">
            Pintasan Login Cepat (Mode Demo):
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('123456')}
              className="p-1.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-800 font-medium text-center border border-purple-200"
            >
              Superadmin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('112233')}
              className="p-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium text-center border border-blue-200"
            >
              Kasir
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('1111')}
              className="p-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium text-center border border-emerald-200"
            >
              Gerai G01
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
