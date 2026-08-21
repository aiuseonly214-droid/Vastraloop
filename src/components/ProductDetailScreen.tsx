import React, { useState } from 'react';
import { OutfitItem } from '../types';

interface ProductDetailScreenProps {
  outfit: OutfitItem;
  onBack: () => void;
  onProceedToCheckout: (config: {
    outfit: OutfitItem;
    durationDays: number;
    startDate: string;
    endDate: string;
    calculatedRent: number;
  }) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  outfit,
  onBack,
  onProceedToCheckout,
  isFavorite,
  onToggleFavorite
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [durationDays, setDurationDays] = useState<number>(1);
  const [selectedStartDay, setSelectedStartDay] = useState<number>(1);
  const [calendarMonth, setCalendarMonth] = useState('November 2023');

  // November 2023 calendar data (matches screenshot with 29, 30, 31 previous month overflow, 1 to 11)
  const calendarDays = [
    { day: 29, isCurrentMonth: false },
    { day: 30, isCurrentMonth: false },
    { day: 31, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true, isBooked: true },
    { day: 7, isCurrentMonth: true, isBooked: true },
    { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true },
    { day: 18, isCurrentMonth: true }
  ];

  // Pricing calculation
  const calculateTotalRentalPrice = (days: number) => {
    if (days === 1) return outfit.pricePerDay;
    if (days === 2) return Math.round(outfit.pricePerDay * 2 * 0.93); // slight 2-day bundle discount like ₹2,800
    return Math.round(outfit.pricePerDay * days * 0.9);
  };

  const currentRentalPrice = calculateTotalRentalPrice(durationDays);

  const selectedEndDay = selectedStartDay + durationDays - 1;
  const startDateStr = `${selectedStartDay} Nov`;
  const endDateStr = `${selectedEndDay} Nov`;

  return (
    <div className="relative w-full pb-28 bg-[#f7f9fb]">
      {/* Hero Image Carousel */}
      <div className="relative w-full h-[480px] sm:h-[540px] bg-[#131b2e]">
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-300 relative"
          style={{ backgroundImage: `url('${outfit.images[activeImageIndex] || outfit.images[0]}')` }}
        >
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>

        {/* Available Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-[#191c1e] text-white px-3 py-1 rounded-full font-inter text-[11px] font-bold uppercase tracking-widest shadow-md">
            Available
          </span>
        </div>

        {/* Image Indicators */}
        {outfit.images.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2 z-10">
            {outfit.images.map((_, idx) => (
              <button
                key={idx}
                aria-label={`View photo ${idx + 1}`}
                onClick={() => setActiveImageIndex(idx)}
                className={`transition-all rounded-full ${
                  activeImageIndex === idx
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Details Sheet */}
      <div className="px-4 pt-6 pb-8 bg-white -mt-6 rounded-t-[2rem] relative z-10 shadow-[0_-4px_24px_rgba(15,23,42,0.08)] flex flex-col gap-6">
        {/* Title & Favorite */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-start">
            <h2 className="font-playfair text-[26px] sm:text-[28px] font-bold text-[#131b2e] pr-3 leading-tight">
              {outfit.title}
            </h2>
            <button
              id="detail-favorite-btn"
              aria-label="Save to wishlist"
              onClick={onToggleFavorite}
              className={`w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-[#eceef0] transition-colors active:scale-90 ${
                isFavorite ? 'text-[#ba1a1a]' : 'text-[#45464d] hover:text-[#ba1a1a]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
          </div>
          <p className="font-inter text-[14px] text-[#45464d]">
            by <span className="font-semibold text-black">{outfit.boutique}</span> • Size: {outfit.size}
          </p>
        </div>

        {/* Rental Price & Security Deposit Box */}
        <div className="bg-[#eceef0] px-5 py-4 rounded-xl flex items-center gap-4">
          <div className="flex-1">
            <p className="font-inter text-[11px] text-[#45464d] font-semibold uppercase tracking-wider mb-1">
              Rental Price
            </p>
            <p className="font-inter text-[22px] font-bold text-[#131b2e]">
              ₹{outfit.pricePerDay.toLocaleString('en-IN')}{' '}
              <span className="font-inter text-[13px] text-[#45464d] font-normal">/ day</span>
            </p>
          </div>
          <div className="w-[1px] h-10 bg-[#c6c6cd]/60" />
          <div className="flex-1 pl-2">
            <p className="font-inter text-[11px] text-[#45464d] font-semibold uppercase tracking-wider mb-1">
              Deposit (Refundable)
            </p>
            <p className="font-inter text-[18px] text-[#191c1e] font-semibold">
              ₹{outfit.deposit.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Rental Duration Selector */}
        <div className="flex flex-col gap-2.5">
          <p className="font-inter text-[12px] font-bold text-[#45464d] uppercase tracking-wider">
            Rental Duration
          </p>
          <div className="flex p-1 bg-[#eceef0] rounded-lg relative">
            <div
              id="duration-indicator"
              className="absolute inset-y-1 bg-white rounded-md shadow-xs transition-transform duration-300 ease-out"
              style={{
                width: durationDays === 3 ? 'calc(33.333% - 4px)' : 'calc(50% - 4px)',
                transform:
                  durationDays === 1
                    ? 'translateX(4px)'
                    : durationDays === 2
                    ? 'translateX(calc(100% + 4px))'
                    : 'translateX(calc(200% + 4px))'
              }}
            />
            <button
              id="duration-btn-1"
              type="button"
              onClick={() => setDurationDays(1)}
              className={`relative z-10 flex-1 py-2 font-inter text-[13px] font-semibold transition-colors ${
                durationDays === 1 ? 'text-[#131b2e]' : 'text-[#45464d]'
              }`}
            >
              1 Day
            </button>
            <button
              id="duration-btn-2"
              type="button"
              onClick={() => setDurationDays(2)}
              className={`relative z-10 flex-1 py-2 font-inter text-[13px] font-semibold transition-colors ${
                durationDays === 2 ? 'text-[#131b2e]' : 'text-[#45464d]'
              }`}
            >
              2 Days
            </button>
          </div>
        </div>

        {/* Interactive Availability Calendar */}
        <div className="flex flex-col gap-2.5">
          <p className="font-inter text-[12px] font-bold text-[#45464d] uppercase tracking-wider">
            Availability
          </p>
          <div className="bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] border border-[#eceef0] rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-inter font-bold text-[15px] text-[#131b2e]">
                {calendarMonth}
              </span>
              <div className="flex gap-1">
                <button
                  aria-label="Previous Month"
                  onClick={() => setCalendarMonth('October 2023')}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#45464d] hover:bg-[#eceef0]"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button
                  aria-label="Next Month"
                  onClick={() => setCalendarMonth('November 2023')}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#45464d] hover:bg-[#eceef0]"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Weekday Header */}
            <div className="grid grid-cols-7 gap-1 text-center font-inter text-[12px] font-semibold text-[#76777d] mb-1.5">
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center font-inter text-[14px]">
              {calendarDays.map((item, index) => {
                if (!item.isCurrentMonth) {
                  return (
                    <div key={index} className="py-2 text-[#c6c6cd] text-[13px]">
                      {item.day}
                    </div>
                  );
                }

                const isBooked = item.isBooked || outfit.bookedDates.includes(item.day);
                const isSelected =
                  item.day >= selectedStartDay && item.day <= selectedEndDay;

                if (isSelected) {
                  return (
                    <button
                      key={index}
                      onClick={() => !isBooked && setSelectedStartDay(item.day)}
                      className="py-2 bg-[#ffe081] text-[#231b00] font-bold rounded-full transition-transform active:scale-95 shadow-xs"
                    >
                      {item.day}
                    </button>
                  );
                }

                if (isBooked) {
                  return (
                    <div
                      key={index}
                      className="py-2 text-[#c6c6cd] relative cursor-not-allowed"
                      title="Already booked on this date"
                    >
                      <span>{item.day}</span>
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ba1a1a] rounded-full" />
                    </div>
                  );
                }

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedStartDay(item.day)}
                    className="py-2 hover:bg-[#eceef0] rounded-full cursor-pointer transition-colors text-[#191c1e] active:scale-95"
                  >
                    {item.day}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-3 pt-3 border-t border-[#eceef0] text-[11px] text-[#45464d] font-semibold uppercase tracking-wider justify-center">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffe081]" /> Selected ({startDateStr} - {endDateStr})
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]" /> Booked
              </div>
            </div>
          </div>
        </div>

        {/* Details and Specifications */}
        <div className="flex flex-col gap-3">
          <h3 className="font-playfair text-[20px] font-bold text-[#131b2e]">
            Details
          </h3>
          <p className="font-inter text-[14px] text-[#45464d] leading-relaxed">
            {outfit.description}
          </p>

          <div className="grid grid-cols-2 gap-3.5 mt-2">
            <div className="flex gap-2.5 items-start p-2.5 bg-[#f7f9fb] rounded-lg">
              <span className="material-symbols-outlined text-[#76777d] text-[20px] mt-0.5">
                dry_cleaning
              </span>
              <div>
                <p className="font-inter text-[11px] font-bold text-[#191c1e] uppercase tracking-wide">
                  Fabric
                </p>
                <p className="font-inter text-[13px] text-[#45464d]">
                  {outfit.fabric}
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 items-start p-2.5 bg-[#f7f9fb] rounded-lg">
              <span className="material-symbols-outlined text-[#76777d] text-[20px] mt-0.5">
                styler
              </span>
              <div>
                <p className="font-inter text-[11px] font-bold text-[#191c1e] uppercase tracking-wide">
                  Fit
                </p>
                <p className="font-inter text-[13px] text-[#45464d]">
                  {outfit.fit}
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 items-start p-2.5 bg-[#f7f9fb] rounded-lg">
              <span className="material-symbols-outlined text-[#76777d] text-[20px] mt-0.5">
                policy
              </span>
              <div>
                <p className="font-inter text-[11px] font-bold text-[#191c1e] uppercase tracking-wide">
                  Cancellation
                </p>
                <p className="font-inter text-[13px] text-[#45464d]">
                  {outfit.cancellationPolicy}
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 items-start p-2.5 bg-[#f7f9fb] rounded-lg">
              <span className="material-symbols-outlined text-[#76777d] text-[20px] mt-0.5">
                local_shipping
              </span>
              <div>
                <p className="font-inter text-[11px] font-bold text-[#191c1e] uppercase tracking-wide">
                  Delivery
                </p>
                <p className="font-inter text-[13px] text-[#45464d]">
                  Store Pickup / Home
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto p-4 bg-white/95 backdrop-blur-lg shadow-[0_-8px_16px_rgba(19,27,46,0.06)] z-40 pb-safe border-t border-[#eceef0]">
        <div className="flex gap-4 items-center">
          <div className="shrink-0 flex flex-col justify-center">
            <span className="font-inter text-[11px] text-[#45464d] font-bold uppercase tracking-wider">
              Total
            </span>
            <span
              id="price-val"
              className="font-inter text-[20px] font-bold text-[#131b2e]"
            >
              ₹{currentRentalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            id="detail-book-now-btn"
            onClick={() =>
              onProceedToCheckout({
                outfit,
                durationDays,
                startDate: startDateStr,
                endDate: endDateStr,
                calculatedRent: currentRentalPrice
              })
            }
            className="flex-1 h-13 bg-[#ffe081] hover:bg-[#e8c344] text-[#231b00] font-inter text-[13px] font-bold uppercase tracking-widest rounded-xl shadow-[0_4px_12px_rgba(255,224,129,0.35)] active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>Book Now</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
