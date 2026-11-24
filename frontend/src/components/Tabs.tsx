import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab?: string;
  activeTabId?: string;
  onChange?: (id: string) => void;
  onTabChange?: (id: string) => void;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  activeTabId,
  onChange,
  onTabChange,
  className = '',
}: TabsProps) {
  const currentActive = activeTab || activeTabId || (tabs[0] ? tabs[0].id : '');
  const handleSelect = (id: string) => {
    onChange?.(id);
    onTabChange?.(id);
  };

  return (
    <div className={`border-b border-line flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === currentActive;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleSelect(tab.id)}
            className={`pb-3 text-[13px] sm:text-[14px] transition-colors whitespace-nowrap shrink-0 focus:outline-none ${
              isActive
                ? 'text-brand-700 font-semibold border-b-2 border-brand-700 -mb-px'
                : 'text-muted hover:text-ink font-medium'
            }`}
          >
            {tab.label}
            {typeof tab.count === 'number' && (
              <span className="ml-1.5 text-[11px] sm:text-[12px] opacity-75">({tab.count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
