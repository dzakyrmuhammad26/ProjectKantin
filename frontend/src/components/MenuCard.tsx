'use client';

/* eslint-disable @next/next/no-img-element */
import React, { memo } from 'react';
import { Menu } from '@/models/menu';
import { formatCurrency } from '@/utils/formatters';
import { Stepper } from './Stepper';

export interface MenuCardProps {
  item: Menu;
  qty?: number;
  onQtyChange?: (newQty: number) => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

function MenuCardComponent({
  item,
  qty = 0,
  onQtyChange,
  onIncrement,
  onDecrement,
}: MenuCardProps) {
  const isSelected = qty > 0;
  const isSoldOut = Boolean(item.isSoldOut || item.isHabis);

  const placeholderImg =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="104" height="104" viewBox="0 0 104 104"><rect width="104" height="104" fill="%23F1F1EF"/></svg>';

  const handleQtyChange = (newVal: number) => {
    if (newVal > qty) {
      if (onIncrement) onIncrement();
      else onQtyChange?.(newVal);
    } else if (newVal < qty) {
      if (onDecrement) onDecrement();
      else onQtyChange?.(newVal);
    } else {
      onQtyChange?.(newVal);
    }
  };

  return (
    <div
      className={`bg-white rounded-[10px] sm:rounded-[12px] p-2 sm:p-3 flex flex-col sm:flex-row gap-2 sm:gap-3 border transition-colors sm:min-h-[128px] ${
        isSelected
          ? 'border-brand-700 ring-1 ring-brand-700/20'
          : 'border-line hover:border-slate-300'
      } ${isSoldOut ? 'opacity-60 bg-slate-50/50' : ''}`}
    >
      {/* Photo: Square aspect ratio on mobile, fixed 104x104 on sm+ */}
      <div className="w-full sm:w-[104px] aspect-square sm:aspect-auto sm:h-[104px] rounded-[6px] sm:rounded-[8px] bg-[#F1F1EF] shrink-0 overflow-hidden relative">
        <img
          src={item.foto || item.image || placeholderImg}
          alt={item.nama || item.name}
          width={104}
          height={104}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover rounded-[6px] sm:rounded-[8px] ${
            isSoldOut ? 'grayscale contrast-75' : ''
          }`}
          onError={(e) => {
            e.currentTarget.src = placeholderImg;
          }}
        />
      </div>

      {/* Menu Info & Actions */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <h3
            className={`text-[11px] sm:text-[15px] font-semibold leading-tight sm:leading-snug line-clamp-2 ${
              isSoldOut ? 'text-muted' : 'text-ink'
            }`}
          >
            {item.nama || item.name}
          </h3>
          <span className="text-[9px] sm:text-[12px] text-muted block mt-0.5 truncate">
            {item.kode || item.code}
          </span>
        </div>

        {/* Bottom Row / Stack: Price & Stepper */}
        <div className="mt-auto pt-1.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-1">
          <span
            className={`text-[11px] sm:text-[16px] font-bold truncate ${
              isSoldOut ? 'text-muted' : 'text-ink'
            }`}
          >
            {formatCurrency(item.harga || item.price)}
          </span>

          {isSoldOut ? (
            <div className="h-6 sm:h-[44px] px-2 sm:px-4 flex items-center justify-center bg-slate-100 rounded-[4px] sm:rounded-[8px] text-muted text-[10px] sm:text-[14px] font-medium select-none">
              Habis
            </div>
          ) : (
            <div className="flex justify-center sm:justify-end">
              <Stepper
                value={qty}
                onChange={handleQtyChange}
                disabled={isSoldOut}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const MenuCard = memo(MenuCardComponent);
export default MenuCard;
