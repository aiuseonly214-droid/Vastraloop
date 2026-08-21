import React, { useState } from 'react';
import { OutfitItem, RentalOrder, UserProfile } from '../types';

interface CheckoutConfig {
  outfit: OutfitItem;
  durationDays: number;
  startDate: string;
  endDate: string;
  calculatedRent: number;
}

interface CheckoutScreenProps {
  config: CheckoutConfig;
  user: UserProfile;
  onBack: () => void;
  onOrderSuccess: (newOrder: RentalOrder) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  config,
  user,
  onBack,
  onOrderSuccess
}) => {
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [deliveryAddress, setDeliveryAddress] = useState(
    '12, Prestige Apartments, Gangapur Road, Nashik, Maharashtra 422005'
  );
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDepositInfo, setShowDepositInfo] = useState(false);

  const deliveryFee = fulfillment === 'delivery' ? 150 : 0;
  const rentalFee = config.calculatedRent;
  const depositFee = config.outfit.deposit;
  const totalPayable = rentalFee + depositFee + deliveryFee;

  const handleConfirmAndPay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderNum = `#VL-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const timeString = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;

      const newOrder: RentalOrder = {
        id: `order-${Date.now()}`,
        orderNumber: orderNum,
        outfitId: config.outfit.id,
        outfitTitle: config.outfit.title,
        outfitImage: config.outfit.images[0],
        boutique: config.outfit.boutique,
        boutiqueAddress: config.outfit.boutiqueAddress,
        boutiquePhone: config.outfit.boutiquePhone,
        durationDays: config.durationDays,
        startDate: config.startDate,
        endDate: config.endDate,
        fulfillmentType: fulfillment,
        deliveryAddress: fulfillment === 'delivery' ? deliveryAddress : undefined,
        pickupLocation: `${config.outfit.boutique}, Nashik branch`,
        paymentMethod: paymentMethod,
        rentalFee: rentalFee,
        depositFee: depositFee,
        deliveryFee: deliveryFee,
        totalAmount: totalPayable,
        status: 'ready_for_pickup',
        createdAt: timeString,
        customerName: user.name,
        customerPhone: user.phone,
        depositRefundAmount: depositFee,
        timeline: [
          {
            id: 't-1',
            title: 'Order Confirmed',
            timestamp: timeString,
            description: `Payment of ₹${totalPayable.toLocaleString('en-IN')} received via ${paymentMethod.toUpperCase()}.`,
            status: 'completed'
          },
          {
            id: 't-2',
            title: fulfillment === 'delivery' ? 'Dispatching to Address' : 'Ready for Pickup',
            timestamp: 'Active Now',
            description:
              fulfillment === 'delivery'
                ? `Delivery partner assigned. Outfit will arrive at ${deliveryAddress} before your rental start date.`
                : `Collect your items at ${config.outfit.boutique}, Nashik branch before 8:00 PM today.`,
            warning: 'Please bring a valid photo ID matching the name on your order.',
            status: 'current'
          },
          {
            id: 't-3',
            title: 'In Use',
            timestamp: 'Pending handover',
            description: 'Enjoy your special celebration with peace of mind.',
            status: 'upcoming'
          },
          {
            id: 't-4',
            title: 'Return Pending',
            timestamp: `Due by ${config.endDate}, 10:00 AM`,
            description: `Return the outfit to ${config.outfit.boutique} for quality inspection.`,
            status: 'upcoming'
          },
          {
            id: 't-5',
            title: 'Deposit Refunded',
            timestamp: 'After inspection',
            description: `₹${depositFee.toLocaleString('en-IN')} refundable security deposit will be transferred automatically.`,
            status: 'upcoming'
          }
        ]
      };

      setIsProcessing(false);
      onOrderSuccess(newOrder);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full pb-32 bg-[#f7f9fb]">
      {/* Title Header */}
      <div className="px-4 mb-5 mt-2">
        <h2 className="font-playfair text-[26px] font-bold text-[#131b2e] tracking-tight mb-1">
          Checkout
        </h2>
        <p className="font-inter text-[14px] text-[#45464d]">
          Review your order details and complete payment.
        </p>
      </div>

      {/* Item Summary Card */}
      <div className="px-4 mb-6">
        <div className="bg-white shadow-xs rounded-xl overflow-hidden p-4 relative border border-[#eceef0]">
          <div className="flex gap-4">
            <div className="w-22 h-28 rounded-lg bg-[#eceef0] overflow-hidden shrink-0">
              <img
                src={config.outfit.images[0]}
                alt={config.outfit.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
              <div>
                <h3 className="font-inter text-[16px] text-[#191c1e] font-semibold truncate">
                  {config.outfit.title}
                </h3>
                <p className="font-inter text-[13px] text-[#45464d] mt-0.5">
                  {config.durationDays} Day Rental • by {config.outfit.boutique}
                </p>
              </div>

              <div className="mt-3">
                <p className="font-inter text-[11px] text-[#45464d] font-semibold uppercase tracking-wider mb-0.5">
                  Rental Period
                </p>
                <p className="font-inter text-[14px] text-[#131b2e] font-medium">
                  {config.startDate} - {config.endDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fulfillment Options */}
      <div className="px-4 mb-6">
        <h3 className="font-playfair text-[20px] font-bold text-[#131b2e] mb-3">
          Fulfillment Options
        </h3>
        
        {/* Toggle Pills */}
        <div className="flex bg-[#eceef0] p-1 rounded-lg mb-3 relative">
          <div
            id="fulfillment-slider"
            className="absolute inset-y-1 bg-white rounded-md shadow-xs transition-transform duration-300 ease-in-out"
            style={{
              width: 'calc(50% - 4px)',
              transform: fulfillment === 'delivery' ? 'translateX(4px)' : 'translateX(calc(100% + 4px))'
            }}
          />
          <button
            id="btn-delivery"
            type="button"
            onClick={() => setFulfillment('delivery')}
            className={`relative z-10 flex-1 py-2.5 font-inter text-[13px] text-center transition-colors ${
              fulfillment === 'delivery' ? 'text-[#191c1e] font-semibold' : 'text-[#45464d]'
            }`}
          >
            Home Delivery
          </button>
          <button
            id="btn-pickup"
            type="button"
            onClick={() => setFulfillment('pickup')}
            className={`relative z-10 flex-1 py-2.5 font-inter text-[13px] text-center transition-colors ${
              fulfillment === 'pickup' ? 'text-[#191c1e] font-semibold' : 'text-[#45464d]'
            }`}
          >
            Self-Pickup
          </button>
        </div>

        {/* Dynamic Fulfillment Address / Location Details */}
        {fulfillment === 'delivery' ? (
          <div
            id="delivery-details"
            className="bg-white shadow-xs rounded-xl p-4 border border-[#eceef0] transition-opacity"
          >
            <div className="flex items-start gap-3">
              <span
                className="material-symbols-outlined text-[#725c00] text-[22px] mt-0.5"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                location_on
              </span>
              <div className="flex-1">
                <p className="font-inter text-[14px] text-[#191c1e] font-semibold">
                  Deliver to
                </p>
                <p className="font-inter text-[13px] text-[#45464d] mt-1 leading-snug">
                  {deliveryAddress}
                </p>
                <button
                  id="change-address-btn"
                  onClick={() => setIsChangingAddress(true)}
                  className="font-inter text-[12px] text-[#725c00] uppercase tracking-wider mt-2.5 font-bold hover:underline"
                >
                  Change Address
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            id="pickup-details"
            className="bg-white shadow-xs rounded-xl p-4 border border-[#eceef0] transition-opacity"
          >
            <div className="flex items-start gap-3">
              <span
                className="material-symbols-outlined text-[#725c00] text-[22px] mt-0.5"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                storefront
              </span>
              <div className="flex-1">
                <p className="font-inter text-[14px] text-[#191c1e] font-semibold">
                  Pick up from
                </p>
                <p className="font-inter text-[13px] text-[#45464d] mt-1 leading-snug">
                  {config.outfit.boutique}, {config.outfit.boutiqueAddress}
                </p>
                <p className="font-inter text-[12px] text-[#725c00] font-medium mt-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Open today until 8:00 PM • Free pickup
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="px-4 mb-6">
        <h3 className="font-playfair text-[20px] font-bold text-[#131b2e] mb-3">
          Payment Method
        </h3>
        <div className="space-y-2.5">
          <label
            onClick={() => setPaymentMethod('upi')}
            className={`flex items-center p-3.5 bg-white shadow-xs rounded-xl cursor-pointer border transition-all ${
              paymentMethod === 'upi'
                ? 'border-[#ffe081] ring-2 ring-[#ffe081]/50'
                : 'border-[#eceef0] hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === 'upi'}
              onChange={() => setPaymentMethod('upi')}
              className="w-4 h-4 text-[#725c00] border-gray-300 focus:ring-[#725c00]"
            />
            <span className="ml-3.5 flex-1 flex items-center justify-between">
              <span className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#45464d] text-[22px]">
                  account_balance_wallet
                </span>
                <span className="font-inter text-[14px] text-[#191c1e] font-medium">
                  UPI (GPay / PhonePe / Paytm / BHIM)
                </span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Instant
              </span>
            </span>
          </label>

          <label
            onClick={() => setPaymentMethod('card')}
            className={`flex items-center p-3.5 bg-white shadow-xs rounded-xl cursor-pointer border transition-all ${
              paymentMethod === 'card'
                ? 'border-[#ffe081] ring-2 ring-[#ffe081]/50'
                : 'border-[#eceef0] hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
              className="w-4 h-4 text-[#725c00] border-gray-300 focus:ring-[#725c00]"
            />
            <span className="ml-3.5 flex-1 flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#45464d] text-[22px]">
                credit_card
              </span>
              <span className="font-inter text-[14px] text-[#191c1e] font-medium">
                Credit / Debit Card
              </span>
            </span>
          </label>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="px-4 mb-6">
        <h3 className="font-playfair text-[20px] font-bold text-[#131b2e] mb-3">
          Price Breakdown
        </h3>
        <div className="bg-white shadow-xs rounded-xl p-4 border border-[#eceef0]">
          <div className="flex justify-between items-center mb-2.5">
            <span className="font-inter text-[14px] text-[#45464d]">Rental Fee</span>
            <span className="font-inter text-[14px] text-[#191c1e] font-semibold">
              ₹{rentalFee.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-between items-center mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="font-inter text-[14px] text-[#45464d]">
                Security Deposit
              </span>
              <button
                type="button"
                onClick={() => setShowDepositInfo(!showDepositInfo)}
                className="text-[#76777d] hover:text-black flex items-center"
              >
                <span className="material-symbols-outlined text-[16px]">info</span>
              </button>
            </div>
            <span className="font-inter text-[14px] text-[#191c1e] font-semibold">
              ₹{depositFee.toLocaleString('en-IN')}
            </span>
          </div>

          {showDepositInfo && (
            <div className="mb-3 p-2.5 bg-[#f7f9fb] border border-[#eceef0] rounded-lg text-[12px] text-[#45464d] leading-relaxed">
              <strong>100% Refundable:</strong> Security deposit is held securely by Vastraloop during your rental period and credited back to your account right after boutique return inspection.
            </div>
          )}

          {fulfillment === 'delivery' && (
            <div
              id="delivery-fee-row"
              className="flex justify-between items-center mb-3 pb-3 border-b border-[#eceef0]"
            >
              <span className="font-inter text-[14px] text-[#45464d]">Delivery Fee</span>
              <span className="font-inter text-[14px] text-[#191c1e] font-semibold">
                ₹{deliveryFee}
              </span>
            </div>
          )}

          {fulfillment === 'pickup' && (
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-[#eceef0]">
              <span className="font-inter text-[14px] text-[#45464d]">Store Pickup</span>
              <span className="font-inter text-[13px] text-emerald-600 font-bold">
                FREE
              </span>
            </div>
          )}

          <div className="flex justify-between items-center pt-1">
            <div>
              <span className="font-inter text-[15px] text-[#131b2e] font-bold">
                Total Payable
              </span>
              <p className="text-[11px] text-[#76777d]">Includes refundable deposit</p>
            </div>
            <span
              id="total-price"
              className="font-inter text-[20px] font-bold text-[#131b2e]"
            >
              ₹{totalPayable.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Confirm Button */}
      <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white/95 backdrop-blur-md pb-safe shadow-[0_-4px_16px_rgba(19,27,46,0.06)] px-4 py-4 z-40 border-t border-[#eceef0]">
        <button
          id="confirm-and-pay-btn"
          disabled={isProcessing}
          onClick={handleConfirmAndPay}
          className="w-full bg-[#725c00] hover:bg-[#564500] text-white py-4 rounded-full font-inter text-[14px] uppercase tracking-wider font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 disabled:opacity-75"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">lock</span>
              <span>Confirm &amp; Pay ₹{totalPayable.toLocaleString('en-IN')}</span>
            </>
          )}
        </button>
      </div>

      {/* Address Edit Modal */}
      {isChangingAddress && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl">
            <h4 className="font-playfair text-[18px] font-bold text-[#131b2e] mb-2">
              Update Delivery Address in Nashik
            </h4>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-xl font-inter text-[13px] text-gray-800 focus:ring-2 focus:ring-[#ffe081] focus:outline-none"
              placeholder="House/Flat No, Apartment, Landmark, Nashik Pincode"
            />
            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => setIsChangingAddress(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsChangingAddress(false)}
                className="px-5 py-2 text-xs font-bold bg-[#725c00] text-white rounded-lg shadow-xs"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
