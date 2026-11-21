import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'default' | 'large' | 'small';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  className = '',
  disabled = false,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'rounded-[8px] font-medium inline-flex items-center justify-center transition-colors select-none focus:outline-none focus:ring-2 focus:ring-brand-700 focus:ring-offset-1';

  const sizeStyles = {
    small: 'h-9 px-3 text-[14px]',
    default: 'h-12 px-5 text-[16px]',
    large: 'h-14 px-6 text-[16px] font-semibold',
  }[size];

  const variantStyles = {
    primary:
      'bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed',
    secondary:
      'bg-white border border-line text-ink hover:border-brand-700 hover:text-brand-700 active:bg-brand-50 disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed',
    text:
      'bg-transparent text-brand-700 hover:text-brand-800 hover:bg-brand-50/50 active:bg-brand-50 disabled:text-slate-400 disabled:cursor-not-allowed',
  }[variant];

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
