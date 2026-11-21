import React from 'react';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

export function Panel({ children, className = '' }: PanelProps) {
  return (
    <div
      className={`bg-white border border-line rounded-[12px] p-6 shadow-none ${className}`}
    >
      {children}
    </div>
  );
}

export default Panel;
