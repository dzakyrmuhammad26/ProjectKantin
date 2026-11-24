import React from 'react';

export interface StepperProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
  disabled = false,
}: StepperProps) {
  const isZero = value <= min;
  const isMax = value >= max;

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && !isZero) {
      onChange(value - 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && !isMax) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 h-6 sm:h-[44px]">
      {/* Tombol Minus */}
      <button
        type="button"
        disabled={disabled || isZero}
        onClick={handleDecrement}
        aria-label="Kurangi jumlah"
        className={`w-6 h-6 sm:w-[44px] sm:h-[44px] rounded-[5px] sm:rounded-[8px] flex items-center justify-center font-bold text-[12px] sm:text-[18px] transition-colors ${
          disabled || isZero
            ? 'bg-white border border-line text-slate-300 cursor-not-allowed opacity-50'
            : 'bg-white border border-brand-700 text-brand-700 hover:bg-brand-50 cursor-pointer active:bg-brand-50'
        }`}
      >
        −
      </button>

      {/* Nilai Jumlah */}
      <span
        className={`w-4 sm:w-8 text-center text-[11px] sm:text-[16px] select-none font-semibold ${
          isZero ? 'text-slate-400 font-normal' : 'text-ink'
        }`}
      >
        {value}
      </span>

      {/* Tombol Plus */}
      <button
        type="button"
        disabled={disabled || isMax}
        onClick={handleIncrement}
        aria-label="Tambah jumlah"
        className={`w-6 h-6 sm:w-[44px] sm:h-[44px] rounded-[5px] sm:rounded-[8px] bg-brand-700 text-white flex items-center justify-center font-bold text-[12px] sm:text-[18px] transition-colors ${
          disabled || isMax
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-brand-800 active:bg-brand-800 cursor-pointer'
        }`}
      >
        +
      </button>
    </div>
  );
}

export default Stepper;
