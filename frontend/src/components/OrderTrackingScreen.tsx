import React, { useState } from 'react';
import { RentalOrder, RentalStatus } from '../types';

interface OrderTrackingScreenProps {
  order: RentalOrder;
  onBack: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: RentalStatus, note?: string) => void;
  onOpenDirections: (boutique: string, address: string) => void;
  onOpenContactShop: (boutique: string, phone: string) => void;
  onOpenReturnPolicy: () => void;
  onOpenDamageClaimModal: (order: RentalOrder) => void;
}

export const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({
  order,
  onBack,
  onUpdateOrderStatus,
  onOpenDirections,
  onOpenContactShop,
  onOpenReturnPolicy,
  onOpenDamageClaimModal
}) => {
  const [showSimulator, setShowSimulator] = useState(false);

  // Status text mappings
  const getStatusDisplay = () => {
    switch (order.status) {
      case 'confirmed':
        return {
          title: 'Order Confirmed',
          desc: 'Your payment was received. Boutique is packaging your outfit.'
        };
      case 'ready_for_pickup':
        return {
          title: 'Ready for Pickup',
          desc: `Your outfit is prepared and waiting for you at ${order.boutique}.`
        };
      case 'in_use':
        return {
          title: 'Outfit In Use',
          desc: `Enjoy your special occasion. Return due by ${order.endDate}.`
        };
      case 'return_pending':
      case 'inspection':
        return {
          title: 'Return & Inspection',
          desc: `Outfit received at ${order.boutique}. Fabric inspection in progress.`
        };
      case 'deposit_refunded':
      case 'completed':
        return {
          title: 'Deposit Refunded & Completed',
          desc: `₹${order.depositRefundAmount || order.depositFee} successfully credited to your account.`
        };
      default:
        return {
          title: 'Ready for Pickup',
          desc: `Your outfit is prepared and waiting for you at ${order.boutique}.`
        };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="flex flex-col w-full pb-24 bg-[#f7f9fb]">
      {/* Top Status Header with Animated Icon */}
      <div className="px-4 pt-4 pb-6 relative overflow-hidden bg-[#f7f9fb]">
        <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#fdd755] flex items-center justify-center shadow-xs relative mb-1">
            <div className="absolute inset-0 bg-[#fdd755] rounded-full animate-ping opacity-30" />
            <span
              className="material-symbols-outlined text-[32px] text-[#735d00]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {order.status === 'completed' || order.status === 'deposit_refunded'
                ? 'check_circle'
                : 'local_mall'}
            </span>
          </div>

          <h2 className="font-playfair text-[24px] font-bold text-[#191c1e] text-center leading-tight">
            {statusInfo.title}
          </h2>
          <p className="font-inter text-[14px] text-[#45464d] text-center max-w-[300px]">
            {statusInfo.desc}
          </p>

          {/* Quick interactive status controller toggle */}
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className="text-[11px] font-semibold text-[#725c00] bg-[#ffe081]/40 hover:bg-[#ffe081] px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">tune</span>
            <span>{showSimulator ? 'Hide Lifecycle Simulator' : 'Test Rental Status Flow (PRD)'}</span>
          </button>
        </div>
      </div>

      {/* Simulator Bar (PRD Validation Tool) */}
      {showSimulator && (
        <div className="mx-4 mb-5 p-3.5 bg-white border border-[#ffe081] rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#725c00]">
              PRD Rental Lifecycle Simulator
            </span>
            <span className="text-[11px] text-gray-500">Current: {order.status}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              onClick={() => onUpdateOrderStatus(order.id, 'ready_for_pickup')}
              className={`p-2 rounded font-medium text-left transition-colors ${
                order.status === 'ready_for_pickup' ? 'bg-[#ffe081] text-[#231b00] font-bold' : 'bg-gray-100 text-gray-700'
              }`}
            >
              1. Ready for Pickup
            </button>
            <button
              onClick={() => onUpdateOrderStatus(order.id, 'in_use')}
              className={`p-2 rounded font-medium text-left transition-colors ${
                order.status === 'in_use' ? 'bg-[#ffe081] text-[#231b00] font-bold' : 'bg-gray-100 text-gray-700'
              }`}
            >
              2. Handover &amp; In Use
            </button>
            <button
              onClick={() => onUpdateOrderStatus(order.id, 'return_pending')}
              className={`p-2 rounded font-medium text-left transition-colors ${
                order.status === 'return_pending' ? 'bg-[#ffe081] text-[#231b00] font-bold' : 'bg-gray-100 text-gray-700'
              }`}
            >
              3. Returned to Shop
            </button>
            <button
              onClick={() => onUpdateOrderStatus(order.id, 'deposit_refunded')}
              className={`p-2 rounded font-medium text-left transition-colors ${
                order.status === 'deposit_refunded' || order.status === 'completed'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              4. Pass Inspection &amp; Refund
            </button>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
            <span className="text-[11px] text-gray-500">Test dispute/damage workflow?</span>
            <button
              onClick={() => onOpenDamageClaimModal(order)}
              className="text-[11px] font-semibold text-rose-700 hover:underline"
            >
              Report Stain / Claim
            </button>
          </div>
        </div>
      )}

      {/* Order Item Card */}
      <div className="px-4 mb-6">
        <div className="bg-[#eceef0] rounded-xl p-4 shadow-2xs relative overflow-hidden flex items-center gap-4">
          <div className="w-20 h-24 rounded-lg bg-[#e0e3e5] shrink-0 relative overflow-hidden">
            <img
              src={order.outfitImage}
              alt={order.outfitTitle}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <p className="font-inter text-[11px] font-bold text-black uppercase tracking-wider mb-1">
              Order {order.orderNumber}
            </p>
            <p className="font-inter text-[16px] text-[#191c1e] font-semibold truncate leading-tight mb-1">
              {order.outfitTitle}
            </p>
            <p className="font-inter text-[13px] text-[#45464d] mb-2">
              Rental: {order.startDate} - {order.endDate}
            </p>
            <div className="flex gap-2">
              <span className="bg-[#ffe081] text-[#231b00] font-inter font-semibold text-[11px] px-2.5 py-0.5 rounded-full whitespace-nowrap">
                {order.durationDays} {order.durationDays === 1 ? 'Day' : 'Days'}
              </span>
              <span className="bg-white/80 text-[#45464d] text-[11px] px-2 py-0.5 rounded-full">
                ₹{order.totalAmount.toLocaleString('en-IN')} paid
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Timeline with Vertical Connector Line */}
      <div className="px-4 mb-8 relative">
        <div className="absolute left-[35px] top-6 bottom-8 w-[2px] bg-[#e6e8ea] z-0" />
        
        <div className="flex flex-col gap-6 relative z-10">
          {/* Step 1: Order Confirmed */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white shadow-md">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
            </div>
            <div className="flex flex-col pt-1.5 pb-2 flex-1">
              <h4 className="font-inter text-[15px] text-[#191c1e] font-bold">
                Order Confirmed
              </h4>
              <p className="font-inter text-[13px] text-[#45464d] mt-0.5">
                {order.createdAt}
              </p>
            </div>
          </div>

          {/* Step 2: Ready for Pickup */}
          {order.status === 'ready_for_pickup' ? (
            <div className="flex gap-4 relative">
              <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-[#fdd755] flex items-center justify-center text-[#735d00] shadow-md relative">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#ffe081] opacity-75 animate-pulse" />
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    storefront
                  </span>
                </div>
              </div>
              <div className="flex flex-col pt-1 pb-2 flex-1">
                <h4 className="font-inter text-[16px] text-[#725c00] font-bold">
                  Ready for Pickup
                </h4>
                <p className="font-inter text-[13px] text-[#45464d] mt-1 leading-relaxed">
                  Collect your items at {order.boutique}, Nashik branch before 8:00 PM today.
                </p>
                <div className="mt-3 bg-[#f2f4f6] border border-[#eceef0] rounded-lg p-3 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#725c00] text-[18px] shrink-0 mt-[1px]">
                    warning
                  </span>
                  <p className="font-inter text-[12px] text-[#45464d]">
                    Please bring a valid photo ID matching the name on your order.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className={`flex gap-4 ${order.status === 'confirmed' ? 'opacity-50' : ''}`}>
              <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">storefront</span>
                </div>
              </div>
              <div className="flex flex-col pt-1.5 pb-2 flex-1">
                <h4 className="font-inter text-[15px] text-[#191c1e] font-bold">
                  Ready for Pickup / Handed Over
                </h4>
                <p className="font-inter text-[13px] text-[#45464d] mt-0.5">
                  {order.boutique}, Nashik
                </p>
              </div>
            </div>
          )}

          {/* Step 3: In Use */}
          <div
            className={`flex gap-4 ${
              order.status === 'in_use'
                ? 'opacity-100'
                : ['return_pending', 'inspection', 'deposit_refunded', 'completed'].includes(order.status)
                ? 'opacity-90'
                : 'opacity-50'
            }`}
          >
            <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  order.status === 'in_use'
                    ? 'bg-[#fdd755] text-[#735d00]'
                    : ['return_pending', 'inspection', 'deposit_refunded', 'completed'].includes(order.status)
                    ? 'bg-black text-white'
                    : 'bg-[#e6e8ea] text-[#76777d]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">styler</span>
              </div>
            </div>
            <div className="flex flex-col pt-1.5 pb-2 flex-1">
              <h4 className="font-inter text-[15px] text-[#191c1e] font-bold">
                In Use
              </h4>
              <p className="font-inter text-[13px] text-[#45464d] mt-0.5">
                {order.status === 'in_use' ? 'Currently active rental' : 'Pending pickup'}
              </p>
            </div>
          </div>

          {/* Step 4: Return Pending */}
          <div
            className={`flex gap-4 ${
              order.status === 'return_pending' || order.status === 'inspection'
                ? 'opacity-100'
                : ['deposit_refunded', 'completed'].includes(order.status)
                ? 'opacity-90'
                : 'opacity-50'
            }`}
          >
            <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  order.status === 'return_pending' || order.status === 'inspection'
                    ? 'bg-[#fdd755] text-[#735d00]'
                    : ['deposit_refunded', 'completed'].includes(order.status)
                    ? 'bg-black text-white'
                    : 'bg-[#e6e8ea] text-[#76777d]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  assignment_return
                </span>
              </div>
            </div>
            <div className="flex flex-col pt-1.5 pb-2 flex-1">
              <h4 className="font-inter text-[15px] text-[#191c1e] font-bold">
                Return &amp; Inspection
              </h4>
              <p className="font-inter text-[13px] text-[#45464d] mt-0.5">
                Due by {order.endDate}, 10:00 AM
              </p>
            </div>
          </div>

          {/* Step 5: Deposit Refunded */}
          <div
            className={`flex gap-4 ${
              order.status === 'deposit_refunded' || order.status === 'completed'
                ? 'opacity-100'
                : 'opacity-50'
            }`}
          >
            <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  order.status === 'deposit_refunded' || order.status === 'completed'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-[#e6e8ea] text-[#76777d]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  price_check
                </span>
              </div>
            </div>
            <div className="flex flex-col pt-1.5 pb-2 flex-1">
              <h4 className="font-inter text-[15px] text-[#191c1e] font-bold">
                Deposit Refunded
              </h4>
              <p className="font-inter text-[13px] text-[#45464d] mt-0.5">
                {order.status === 'deposit_refunded' || order.status === 'completed'
                  ? `₹${order.depositRefundAmount || order.depositFee} successfully refunded to UPI account`
                  : 'After boutique return inspection'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4">
        <div className="flex flex-col gap-3">
          <button
            id="btn-get-directions"
            onClick={() => onOpenDirections(order.boutique, order.boutiqueAddress)}
            className="w-full h-14 bg-[#725c00] hover:bg-[#564500] text-white rounded-full font-inter text-[14px] uppercase tracking-wider font-bold flex items-center justify-center shadow-md active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined mr-2 text-[20px]">
              directions
            </span>
            <span>Get Directions to Shop</span>
          </button>

          <div className="grid grid-cols-2 gap-3 mt-1">
            <button
              id="btn-contact-shop"
              onClick={() => onOpenContactShop(order.boutique, order.boutiquePhone)}
              className="h-12 bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] rounded-full font-inter text-[12px] uppercase tracking-wider font-bold flex items-center justify-center transition-colors active:scale-98"
            >
              <span className="material-symbols-outlined mr-2 text-[18px]">call</span>
              <span>Contact Shop</span>
            </button>
            <button
              id="btn-return-policy"
              onClick={onOpenReturnPolicy}
              className="h-12 bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] rounded-full font-inter text-[12px] uppercase tracking-wider font-bold flex items-center justify-center transition-colors active:scale-98"
            >
              <span className="material-symbols-outlined mr-2 text-[18px]">policy</span>
              <span>Return Policy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
