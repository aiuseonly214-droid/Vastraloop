import React from 'react';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  user: UserProfile;
  activeRole: 'customer' | 'owner' | 'admin';
  onRoleChange: (role: 'customer' | 'owner' | 'admin') => void;
  onOpenListingModal: () => void;
  onOpenReturnPolicy: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  activeRole,
  onRoleChange,
  onOpenListingModal,
  onOpenReturnPolicy
}) => {
  return (
    <div className="flex flex-col w-full pb-28 px-4 pt-3 bg-[#f7f9fb]">
      <div className="mb-4">
        <h2 className="font-playfair text-[24px] font-bold text-[#131b2e]">
          Profile &amp; Settings
        </h2>
        <p className="font-inter text-[13px] text-[#45464d]">
          Manage your verified rental identity and addresses in Nashik
        </p>
      </div>

      {/* User Card */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#eceef0] mb-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center font-playfair text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-inter text-[17px] font-bold text-[#191c1e] truncate">
                {user.name}
              </h3>
              {user.verifiedId && (
                <span
                  className="material-symbols-outlined text-[#725c00] text-[18px]"
                  title="Government ID Verified"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              )}
            </div>
            <p className="font-inter text-[13px] text-[#45464d] mt-0.5">
              {user.phone}
            </p>
            <p className="font-inter text-[12px] text-[#76777d] mt-0.5 truncate">
              {user.city}
            </p>
          </div>
        </div>

        {/* Verification Pill */}
        <div className="mt-4 pt-3 border-t border-[#eceef0] flex justify-between items-center text-xs">
          <span className="text-[#45464d]">Gov ID Status:</span>
          <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Verified via Aadhaar OTP
          </span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="bg-[#131b2e] text-white rounded-2xl p-4 shadow-md mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-inter text-[14px] font-bold">Switch Marketplace Role</h4>
            <p className="font-inter text-[12px] text-[#bec6e0]">
              Test Customer, Boutique Owner &amp; Admin Workflows
            </p>
          </div>
          <span className="bg-[#ffe081] text-[#231b00] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            PRD Mode
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onRoleChange('customer')}
            className={`py-2 px-2 rounded-xl text-[12px] font-bold text-center transition-all ${
              activeRole === 'customer'
                ? 'bg-[#ffe081] text-[#231b00] shadow-xs'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => onRoleChange('owner')}
            className={`py-2 px-2 rounded-xl text-[12px] font-bold text-center transition-all ${
              activeRole === 'owner'
                ? 'bg-[#ffe081] text-[#231b00] shadow-xs'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Boutique Owner
          </button>
          <button
            onClick={() => onRoleChange('admin')}
            className={`py-2 px-2 rounded-xl text-[12px] font-bold text-center transition-all ${
              activeRole === 'admin'
                ? 'bg-[#ffe081] text-[#231b00] shadow-xs'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Admin Ops
          </button>
        </div>
      </div>

      {/* Menu Actions */}
      <div className="bg-white rounded-2xl p-2 shadow-xs border border-[#eceef0] space-y-1 mb-5">
        <button
          onClick={onOpenListingModal}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#f7f9fb] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#725c00] text-[22px]">
              storefront
            </span>
            <div className="text-left">
              <p className="font-inter text-[14px] font-semibold text-[#191c1e]">
                List New Outfit (Lend &amp; Earn)
              </p>
              <p className="font-inter text-[12px] text-[#76777d]">
                Monetize fancy &amp; wedding wear in your closet
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-gray-400 text-[18px]">
            chevron_right
          </span>
        </button>

        <button
          onClick={onOpenReturnPolicy}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#f7f9fb] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#45464d] text-[22px]">
              policy
            </span>
            <div className="text-left">
              <p className="font-inter text-[14px] font-semibold text-[#191c1e]">
                Security Deposit &amp; Return Policy
              </p>
              <p className="font-inter text-[12px] text-[#76777d]">
                Guidelines on dry cleaning, inspection &amp; refunds
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-gray-400 text-[18px]">
            chevron_right
          </span>
        </button>
      </div>

      {/* Nashik Local Support */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eceef0]">
        <h4 className="font-inter text-[13px] font-bold text-[#191c1e] mb-1">
          Nashik Concierge Support
        </h4>
        <p className="font-inter text-[12px] text-[#45464d] leading-relaxed">
          Need custom fitting, boutique alterations, or delivery inquiries? Call our local Nashik helpline:
        </p>
        <p className="font-inter text-[14px] font-bold text-[#725c00] mt-2">
          📞 +91 98220 18000 • 9:00 AM - 9:00 PM
        </p>
      </div>
    </div>
  );
};
