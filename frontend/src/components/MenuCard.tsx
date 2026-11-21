'use client';

/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Menu } from '@/models';
import { formatCurrency } from '@/utils';
import { Stepper } from './Stepper';

export interface MenuCardProps {
  item: Menu;
  qty?: number;
  onQtyChange?: (newQty: number) => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export function MenuCard({
  item,
  qty = 0,
  onQtyChange,
  onIncrement,
  onDecrement,
}: MenuCardProps) {
  const isSelected = qty > 0;
  const isSoldOut = Boolean(item.isSoldOut);

  // Placeholder grey box when image is not available
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
      className={`bg-white rounded-[12px] p-3 flex gap-3 border transition-colors min-h-[128px] ${
        isSelected
          ? 'border-brand-700'
          : 'border-line hover:border-slate-300'
      } ${isSoldOut ? 'opacity-60 bg-slate-50/50' : ''}`}
    >
      {/* Photo 104x104 with 8px radius */}
      <div className="w-[104px] h-[104px] rounded-[8px] bg-[#F1F1EF] shrink-0 overflow-hidden relative">
        <img
          src={item.image || placeholderImg}
          alt={item.name}
          width={104}
          height={104}
          loading="eager"
          decoding="sync"
          className={`w-full h-full object-cover rounded-[8px] ${
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
            className={`text-[15px] font-semibold leading-snug line-clamp-2 ${
              isSoldOut ? 'text-muted' : 'text-ink'
            }`}
          >
            {item.name}
          </h3>
          <span className="text-[12px] text-muted block mt-0.5">
            {item.code}
          </span>
        </div>

        {/* Bottom Row: Price left, Stepper right */}
        <div className="flex items-center justify-between mt-2 pt-1">
          <span
            className={`text-[16px] font-bold ${
              isSoldOut ? 'text-muted' : 'text-ink'
            }`}
          >
            {formatCurrency(item.price)}
          </span>

          {isSoldOut ? (
            <div className="h-[44px] px-4 flex items-center justify-center bg-slate-100 rounded-[8px] text-muted text-[14px] font-medium select-none">
              Habis
            </div>
          ) : (
            <Stepper
              value={qty}
              onChange={handleQtyChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
