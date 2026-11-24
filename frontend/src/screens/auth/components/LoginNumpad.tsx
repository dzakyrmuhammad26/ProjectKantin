import React from 'react';

interface LoginNumpadProps {
  onDigitClick: (digit: string) => void;
  onClear: () => void;
  onBackspace: () => void;
}

export function LoginNumpad({
  onDigitClick,
  onClear,
  onBackspace,
}: LoginNumpadProps) {
  return (
    <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto w-full">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
        <button
          key={digit}
          type="button"
          onClick={() => onDigitClick(digit)}
          className="h-13 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] active:bg-[#E5E7EB] text-xl font-bold text-[#111827] shadow-xs transition-colors"
        >
          {digit}
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="h-13 rounded-xl border border-[#E5E7EB] bg-white hover:bg-rose-50 text-xs font-bold text-rose-600 shadow-xs transition-colors"
      >
        Hapus
      </button>
      <button
        type="button"
        onClick={() => onDigitClick('0')}
        className="h-13 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] active:bg-[#E5E7EB] text-xl font-bold text-[#111827] shadow-xs transition-colors"
      >
        0
      </button>
      <button
        type="button"
        onClick={onBackspace}
        className="h-13 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-sm font-bold text-[#4B5563] shadow-xs transition-colors"
      >
        ⌫
      </button>
    </div>
  );
}
