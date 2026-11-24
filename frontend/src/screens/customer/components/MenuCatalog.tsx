import React from 'react';
import { Menu } from '@/models/menu';
import { Stall } from '@/models/gerai';
import { Input } from '@/components/Input';
import { Tabs, TabItem } from '@/components/Tabs';
import { MenuCard } from '@/components/MenuCard';

interface MenuCatalogProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  filteredData: { stall: Stall; menus: Menu[] }[];
  getItemQty: (menuId: string) => number;
  onAddItem: (menu: Menu) => void;
  onRemoveItem: (menuId: string) => void;
}

export function MenuCatalog({
  searchQuery,
  onSearchChange,
  tabs,
  activeTabId,
  onTabChange,
  filteredData,
  getItemQty,
  onAddItem,
  onRemoveItem,
}: MenuCatalogProps) {
  return (
    <div className="col-span-1 lg:col-span-8 space-y-5 sm:space-y-6">
      {/* Search Bar */}
      <div>
        <Input
          type="text"
          placeholder="Cari menu atau nama gerai..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          }
        />
      </div>

      {/* Stall Category Tabs */}
      <div>
        <Tabs tabs={tabs} activeTab={activeTabId} onChange={onTabChange} />
      </div>

      {/* Menu Catalog grouped by Stall */}
      <div className="space-y-6 sm:space-y-8">
        {filteredData.length === 0 ? (
          <div className="rounded-[12px] border border-line bg-white p-8 text-center">
            <p className="text-[14px] text-muted">
              Tidak ada menu yang sesuai dengan pencarian &ldquo;{searchQuery}&rdquo;.
            </p>
          </div>
        ) : (
          filteredData.map(({ stall, menus: stallMenus }) => (
            <section key={stall.id} className="space-y-2.5 sm:space-y-3">
              {/* Stall Header */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className="inline-block h-3.5 sm:h-4 w-1 sm:w-1.5 rounded-full"
                  style={{ backgroundColor: stall.color }}
                />
                <h2 className="text-[14px] sm:text-[16px] font-bold text-ink truncate">
                  {stall.name}
                </h2>
                <span className="rounded bg-slate-100 px-1 sm:px-1.5 py-0.5 text-[10px] sm:text-[12px] font-medium text-muted shrink-0">
                  {stall.code}
                </span>
              </div>

              {/* Menu Grid: 3 cols on mobile, 2 cols on tablet/desktop */}
              <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 sm:gap-4">
                {stallMenus.map((menu) => (
                  <MenuCard
                    key={menu.id}
                    item={menu}
                    qty={getItemQty(menu.id)}
                    onIncrement={() => onAddItem(menu)}
                    onDecrement={() => onRemoveItem(menu.id)}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
