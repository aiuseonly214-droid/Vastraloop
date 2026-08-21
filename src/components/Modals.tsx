import React, { useState } from 'react';
import { RentalOrder } from '../types';

interface ShopDirectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  boutiqueName: string;
  address: string;
}

export const ShopDirectionsModal: React.FC<ShopDirectionsModalProps> = ({
  isOpen,
  onClose,
  boutiqueName,
  address
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-[#725c00] uppercase tracking-wider">
              Store Pickup Navigation
            </span>
            <h3 className="font-playfair text-[20px] font-bold text-[#131b2e]">
              {boutiqueName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Visual Map Mockup for Nashik */}
        <div className="w-full h-44 bg-[#e6e8ea] rounded-2xl relative overflow-hidden border border-gray-200 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{
              backgroundImage: `radial-gradient(#bec6e0 2px, transparent 2px), radial-gradient(#bec6e0 2px, #f7f9fb 2px)`,
              backgroundSize: '24px 24px'
            }}
          />

          {/* Route path line */}
          <div className="absolute inset-x-8 top-1/2 h-1 bg-[#725c00] -translate-y-1/2 rounded-full dashed" />
          
          {/* User pin */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <span className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-md animate-pulse" />
            <span className="text-[10px] font-bold bg-white px-1.5 py-0.5 rounded shadow-xs mt-1">You</span>
          </div>

          {/* Destination pin */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <span className="material-symbols-outlined text-[#725c00] text-[28px] drop-shadow-md">
              location_on
            </span>
            <span className="text-[10px] font-bold bg-[#131b2e] text-white px-1.5 py-0.5 rounded shadow-xs">
              {boutiqueName}
            </span>
          </div>
        </div>

        <div className="bg-[#f7f9fb] p-3 rounded-xl border border-gray-200 text-xs">
          <p className="font-bold text-gray-900">Address:</p>
          <p className="text-gray-600 mt-0.5">{address}</p>
          <div className="flex gap-4 mt-2 pt-2 border-t border-gray-200 text-[11px]">
            <span><strong>Distance:</strong> 2.4 km</span>
            <span><strong>Est. Drive:</strong> 8 mins</span>
            <span className="text-emerald-700"><strong>Open till:</strong> 8:00 PM</span>
          </div>
        </div>

        <button
          onClick={() => {
            window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
          }}
          className="w-full py-3.5 bg-[#725c00] hover:bg-[#564500] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">navigation</span>
          <span>Start Navigation in Google Maps</span>
        </button>
      </div>
    </div>
  );
};

interface ContactShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  boutiqueName: string;
  phone: string;
}

export const ContactShopModal: React.FC<ContactShopModalProps> = ({
  isOpen,
  onClose,
  boutiqueName,
  phone
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-[#725c00] uppercase tracking-wider">
              Boutique Concierge
            </span>
            <h3 className="font-playfair text-[20px] font-bold text-[#131b2e]">
              {boutiqueName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          Connect with the boutique manager for trial fittings, pickup time slots, or accessory inquiries:
        </p>

        <div className="space-y-2.5 pt-1">
          <a
            href={`tel:${phone}`}
            className="w-full py-3 bg-[#eceef0] hover:bg-[#e0e3e5] rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-gray-900 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#725c00]">call</span>
            <span>Direct Call ({phone})</span>
          </a>

          <button
            onClick={() => {
              alert(`Connecting via WhatsApp to ${boutiqueName} (+91 98231 55442)`);
              onClose();
            }}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Chat on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ReturnPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReturnPolicyModal: React.FC<ReturnPolicyModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-3.5 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-[#725c00] uppercase tracking-wider">
              Vastraloop Trust &amp; Safety
            </span>
            <h3 className="font-playfair text-[20px] font-bold text-[#131b2e]">
              Return &amp; Deposit Policy
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-2.5 text-xs text-gray-600">
          <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
            <p className="font-bold text-gray-900">✨ Professional Cleaning Included</p>
            <p className="mt-0.5">
              You do not need to wash or dry-clean outfits before returning. Every item is sanitized by the verified boutique.
            </p>
          </div>

          <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
            <p className="font-bold text-gray-900">⚡ 100% Instant Deposit Refund</p>
            <p className="mt-0.5">
              Once handed over at the shop, the quick 2-minute fabric inspection is completed and your deposit is refunded immediately to your UPI account.
            </p>
          </div>

          <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
            <p className="font-bold text-gray-900">🛡️ Fair Dispute &amp; Damage Rules</p>
            <p className="mt-0.5">
              Minor wear and tear is normal. In case of major stains or tears, owner reports are reviewed with photographic proof by Vastraloop before any adjustment.
            </p>
          </div>

          <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
            <p className="font-bold text-gray-900">⏰ Return Deadlines</p>
            <p className="mt-0.5">
              Outfits must be returned by 10:00 AM following the rental completion date to allow scheduling for upcoming bookings.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#131b2e] text-white font-bold rounded-xl text-xs uppercase tracking-wider"
        >
          Got It, Understood
        </button>
      </div>
    </div>
  );
};

interface DamageClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: RentalOrder | null;
  onSubmitClaim: (claim: {
    orderNumber: string;
    itemTitle: string;
    issueType: any;
    claimedAmount: number;
    description: string;
  }) => void;
}

export const DamageClaimModal: React.FC<DamageClaimModalProps> = ({
  isOpen,
  onClose,
  order,
  onSubmitClaim
}) => {
  const [issueType, setIssueType] = useState<'Stain' | 'Tear / Rip' | 'Missing Accessory' | 'Late Return'>('Stain');
  const [amount, setAmount] = useState(500);
  const [description, setDescription] = useState('');

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitClaim({
      orderNumber: order.orderNumber,
      itemTitle: order.outfitTitle,
      issueType,
      claimedAmount: amount,
      description: description || 'Damage reported upon inspection.'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
              PRD 9.5 Dispute Workflow
            </span>
            <h3 className="font-playfair text-[20px] font-bold text-gray-900">
              Report Return Issue
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Issue Type</label>
            <select
              value={issueType}
              onChange={(e: any) => setIssueType(e.target.value)}
              className="w-full p-2 border rounded-xl bg-white"
            >
              <option value="Stain">Stain (Beverage/Food/Grease)</option>
              <option value="Tear / Rip">Tear / Stitch Rip</option>
              <option value="Missing Accessory">Missing Dupatta / Brooch / Belt</option>
              <option value="Late Return">Late Return Fee</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">
              Deduction Amount (Max Deposit: ₹{order.depositFee})
            </label>
            <input
              type="number"
              max={order.depositFee}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2.5 border rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">
              Inspection Notes / Evidence
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe condition found during boutique return inspection..."
              className="w-full p-2.5 border rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl uppercase tracking-wider text-xs shadow-md"
          >
            Submit for Vastraloop Review
          </button>
        </form>
      </div>
    </div>
  );
};
