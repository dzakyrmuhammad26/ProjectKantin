'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MotionFadeInProps {
  children: ReactNode;
  className?: string;
}

export function MotionFadeIn({ children, className = '' }: MotionFadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default MotionFadeIn;
