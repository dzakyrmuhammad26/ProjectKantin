import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export function Input({
  label,
  helperText,
  error,
  leftIcon,
  className = '',
  disabled = false,
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-[14px] font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative w-full flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center justify-center text-slate-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          disabled={disabled}
          className={`h-12 w-full rounded-[8px] border bg-white text-[16px] text-ink placeholder:text-slate-400 outline-none transition-colors disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
            leftIcon ? 'pl-11 pr-4' : 'px-4'
          } ${
            error
              ? 'border-status-cancel focus:border-status-cancel focus:ring-1 focus:ring-status-cancel'
              : 'border-line focus:border-brand-700 focus:ring-1 focus:ring-brand-700'
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <span className="text-[12px] text-status-cancel">{error}</span>
      ) : helperText ? (
        <span className="text-[12px] text-muted">{helperText}</span>
      ) : null}
    </div>
  );
}

export default Input;
