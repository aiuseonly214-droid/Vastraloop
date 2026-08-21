import React from 'react';

export type TabType = 'home' | 'categories' | 'orders' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  activeOrdersCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  activeOrdersCount = 1
}) => {
  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto z-50 bg-[#f7f9fb]/90 backdrop-blur-xl pb-safe shadow-[0_-1px_8px_rgba(19,27,46,0.04)] border-t border-[#eceef0]/80"
    >
      <div className="flex justify-around items-center h-16 px-2">
        <button
          id="nav-tab-home"
          onClick={() => onTabChange('home')}
          aria-current={activeTab === 'home' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors ${
            activeTab === 'home' ? 'text-[#725c00]' : 'text-[#45464d] hover:text-[#191c1e]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}
          >
            home
          </span>
          <span className="text-[12px] font-semibold tracking-wide">Home</span>
        </button>

        <button
          id="nav-tab-categories"
          onClick={() => onTabChange('categories')}
          aria-current={activeTab === 'categories' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors ${
            activeTab === 'categories' ? 'text-[#725c00]' : 'text-[#45464d] hover:text-[#191c1e]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: activeTab === 'categories' ? "'FILL' 1" : "'FILL' 0" }}
          >
            category
          </span>
          <span className="text-[12px] font-semibold tracking-wide">Categories</span>
        </button>

        <button
          id="nav-tab-orders"
          onClick={() => onTabChange('orders')}
          aria-current={activeTab === 'orders' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors relative ${
            activeTab === 'orders' ? 'text-[#725c00]' : 'text-[#45464d] hover:text-[#191c1e]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: activeTab === 'orders' ? "'FILL' 1" : "'FILL' 0" }}
          >
            shopping_bag
          </span>
          {activeOrdersCount > 0 && (
            <span className="absolute top-1.5 right-4 w-4 h-4 bg-[#725c00] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeOrdersCount}
            </span>
          )}
          <span className="text-[12px] font-semibold tracking-wide">Orders</span>
        </button>

        <button
          id="nav-tab-profile"
          onClick={() => onTabChange('profile')}
          aria-current={activeTab === 'profile' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors ${
            activeTab === 'profile' ? 'text-[#725c00]' : 'text-[#45464d] hover:text-[#191c1e]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}
          >
            account_circle
          </span>
          <span className="text-[12px] font-semibold tracking-wide">Profile</span>
        </button>
      </div>
    </nav>
  );
};
