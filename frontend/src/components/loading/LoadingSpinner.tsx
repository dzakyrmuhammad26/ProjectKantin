'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'brand' | 'white' | 'muted' | 'danger' | 'amber';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const COLOR_CLASSES: Record<NonNullable<LoadingSpinnerProps['variant']>, string> = {
  brand: 'text-emerald-600',
  white: 'text-white',
  muted: 'text-[#6B7280]',
  danger: 'text-rose-600',
  amber: 'text-amber-700',
};

export function LoadingSpinner({
  size = 'sm',
  variant = 'brand',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
      className={`inline-flex items-center justify-center shrink-0 ${COLOR_CLASSES[variant]} ${className}`}
      aria-hidden="true"
    >
      <Loader2 className={`${SIZE_CLASSES[size]} animate-spin`} />
    </motion.span>
  );
}

export default LoadingSpinner;
