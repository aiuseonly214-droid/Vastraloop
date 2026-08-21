import React from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  unreadCount?: number;
  user: UserProfile;
  activeRole: 'customer' | 'owner' | 'admin';
  onRoleChange: (role: 'customer' | 'owner' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  onBack,
  onSearchClick,
  onNotificationsClick,
  onProfileClick,
  unreadCount = 1,
  activeRole,
  onRoleChange
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full max-w-md mx-auto z-50 bg-[#f7f9fb]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(19,27,46,0.04)] pt-safe border-b border-[#eceef0]/60">
      <div className="h-16 px-4 flex items-center justify-between gap-3">
        {showBack ? (
          <div className="flex items-center gap-3 min-w-0">
            <button
              id="header-back-button"
              aria-label="Go back"
              className="w-10 h-10 flex items-center justify-center text-[#45464d] hover:bg-[#eceef0] rounded-full transition-colors active:scale-95 shrink-0"
              onClick={onBack}
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="font-playfair text-[22px] font-semibold text-[#131b2e] truncate">
              {title || 'VASTRALOOP'}
            </h1>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="font-playfair text-[22px] font-bold text-[#131b2e] tracking-tight">
              VASTRALOOP
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ffe081] text-[#564500] px-2 py-0.5 rounded-full">
              Nashik
            </span>
          </div>
        )}

        <div className="flex items-center gap-1">
          {/* Quick Role switch badge for PRD review */}
          <div className="flex bg-[#eceef0] p-0.5 rounded-full text-[11px] font-medium mr-1">
            <button
              id="role-customer-btn"
              onClick={() => onRoleChange('customer')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                activeRole === 'customer'
                  ? 'bg-black text-white font-semibold shadow-xs'
                  : 'text-[#45464d] hover:text-black'
              }`}
              title="Customer Mode"
            >
              Rent
            </button>
            <button
              id="role-owner-btn"
              onClick={() => onRoleChange('owner')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                activeRole === 'owner'
                  ? 'bg-[#725c00] text-white font-semibold shadow-xs'
                  : 'text-[#45464d] hover:text-black'
              }`}
              title="Owner / Boutique Mode"
            >
              Lend
            </button>
            <button
              id="role-admin-btn"
              onClick={() => onRoleChange('admin')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                activeRole === 'admin'
                  ? 'bg-[#131b2e] text-white font-semibold shadow-xs'
                  : 'text-[#45464d] hover:text-black'
              }`}
              title="Admin & Operations Mode"
            >
              Admin
            </button>
          </div>

          {!showBack && (
            <button
              id="header-search-btn"
              aria-label="Search"
              onClick={onSearchClick}
              className="w-9 h-9 flex items-center justify-center text-[#45464d] hover:bg-[#eceef0] rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
          )}

          <button
            id="header-notifications-btn"
            aria-label="Notifications"
            onClick={onNotificationsClick}
            className="w-9 h-9 flex items-center justify-center text-[#45464d] hover:bg-[#eceef0] rounded-full transition-colors relative"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#725c00] rounded-full animate-pulse"></span>
            )}
          </button>

          <button
            id="header-profile-btn"
            aria-label="User Profile"
            onClick={onProfileClick}
            className="ml-1 w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition-transform shadow-xs"
          >
            <span className="material-symbols-outlined text-white text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
