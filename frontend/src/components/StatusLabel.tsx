import React from 'react';
import { StatusType } from '@/models/pesanan';

interface StatusLabelProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusConfig: Record<StatusType, { color: string; defaultLabel: string }> = {
  wait: {
    color: '#D97706',
    defaultLabel: 'Menunggu bayar',
  },
  menunggu: {
    color: '#D97706',
    defaultLabel: 'Menunggu bayar',
  },
  paid: {
    color: '#059669',
    defaultLabel: 'Siap dibuat',
  },
  lunas: {
    color: '#059669',
    defaultLabel: 'Siap dibuat',
  },
  done: {
    color: '#64748B',
    defaultLabel: 'Selesai',
  },
  selesai: {
    color: '#64748B',
    defaultLabel: 'Selesai',
  },
  cancel: {
    color: '#DC2626',
    defaultLabel: 'Batal',
  },
  batal: {
    color: '#DC2626',
    defaultLabel: 'Batal',
  },
};

export function StatusLabel({ status, label, className = '' }: StatusLabelProps) {
  const config = statusConfig[status] || statusConfig.wait;
  const displayText = label || config.defaultLabel;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="w-2 h-2 rounded-full inline-block shrink-0"
        style={{ backgroundColor: config.color }}
      />
      <span
        className="text-[14px] font-medium"
        style={{ color: config.color }}
      >
        {displayText}
      </span>
    </div>
  );
}

export default StatusLabel;
