'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface PageLoadingScreenProps {
  title?: string;
  subtitle?: string;
  fullScreen?: boolean;
}

export function PageLoadingScreen({
  title = 'Memuat Kantin POS...',
  subtitle = 'Menyiapkan data terbaru dari server',
  fullScreen = true,
}: PageLoadingScreenProps) {
  const containerClass = fullScreen
    ? 'min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6'
    : 'py-24 flex flex-col items-center justify-center p-6';

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4 text-center max-w-xs w-full"
      >
        {/* Animated Orbital Emblem */}
        <div className="relative flex items-center justify-center w-16 h-16">
          {/* Outer pulsing ring */}
          <motion.span
            animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.1, 0.35] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-2xl bg-emerald-500/25"
          />

          {/* Spinning border ring */}
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-1 rounded-full border-2 border-emerald-200 border-t-emerald-600"
          />

          {/* Inner brand badge */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-lg shadow-sm">
            K
          </div>
        </div>

        {/* Text & animated progress dots */}
        <div className="space-y-1">
          <p className="text-sm sm:text-base font-bold text-[#111827]">{title}</p>
          <p className="text-xs text-[#6B7280]">{subtitle}</p>
        </div>

        <div className="flex items-center gap-1.5 pt-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: i * 0.18,
                ease: 'easeInOut',
              }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-600"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default PageLoadingScreen;
