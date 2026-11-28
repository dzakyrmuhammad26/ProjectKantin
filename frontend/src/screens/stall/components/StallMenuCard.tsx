/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { Menu } from '@/models/menu';
import { formatCurrency, MENU_IMAGE_FALLBACK } from '@/utils/formatters';

interface StallMenuCardProps {
  menu: Menu;
  onToggleHabis: (menu: Menu) => void;
  onEdit: (menu: Menu) => void;
  onDelete: (menu: Menu) => void;
  busyMenuId?: string | null;
}

export function StallMenuCard({
  menu,
  onToggleHabis,
  onEdit,
  onDelete,
  busyMenuId = null,
}: StallMenuCardProps) {
  const isBusy = busyMenuId === menu.id;
  const isHabis = menu.isHabis || menu.isSoldOut;
  const imgSrc =
    menu.foto && menu.foto !== '/images/menu/placeholder.jpg'
      ? menu.foto
      : menu.image && menu.image !== '/images/menu/placeholder.jpg'
      ? menu.image
      : MENU_IMAGE_FALLBACK;

  return (
    <div
      className={`bg-white rounded-xl border transition-all flex flex-col overflow-hidden shadow-xs ${
        isHabis ? 'border-rose-200 opacity-80' : 'border-[#E5E7EB]'
      }`}
    >
      <div className="relative aspect-video bg-[#F3F4F6] overflow-hidden">
        <img
          src={imgSrc}
          alt={menu.nama || menu.name}
          className={`w-full h-full object-cover ${isHabis ? 'grayscale' : ''}`}
          onError={(e) => {
            e.currentTarget.src = MENU_IMAGE_FALLBACK;
          }}
        />
        {isHabis && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-600 text-white">
              HABIS
            </span>
          </div>
        )}
        <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
          {menu.kode || menu.code}
        </span>
      </div>

      <div className="p-3.5 flex flex-col gap-2 flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-[#6B7280]">
              {menu.kategori || 'Makanan'}
            </span>
            <span className="text-xs font-bold text-emerald-700">
              {formatCurrency(menu.harga || menu.price)}
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#111827] mt-1 line-clamp-1">
            {menu.nama || menu.name}
          </h4>
        </div>

        <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between gap-2">
          <button
            onClick={() => onToggleHabis(menu)}
            disabled={busyMenuId !== null}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors disabled:opacity-60 ${
              isHabis
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            {isBusy && <LoadingSpinner size="xs" variant={isHabis ? 'brand' : 'amber'} />}
            {isHabis ? 'Tandai Tersedia' : 'Tandai Habis'}
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(menu)}
              disabled={busyMenuId !== null}
              className="px-2.5 py-1 rounded text-xs font-medium bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] disabled:opacity-60"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(menu)}
              disabled={busyMenuId !== null}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 disabled:opacity-60"
            >
              {isBusy && <LoadingSpinner size="xs" variant="danger" />}
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
