import React, { useState } from 'react';
import { OutfitItem } from '../types';

interface CategoriesScreenProps {
  outfits: OutfitItem[];
  onSelectOutfit: (outfit: OutfitItem) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  outfits,
  onSelectOutfit,
  favorites,
  onToggleFavorite
}) => {
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);

  const categories = ['All', 'Sherwani', 'Lehenga', 'Tuxedo', 'Saree'];
  const occasions = ['All', 'Wedding', 'Festivals', 'Party Wear'];
  const genders = ['All', 'Men', 'Women'];
  const sizes = ['All', 'S', 'M', 'L', 'XL', 'Free Size'];

  const filtered = outfits.filter((item) => {
    if (selectedGender !== 'All' && item.gender !== selectedGender) return false;
    if (selectedOccasion !== 'All' && item.occasion !== selectedOccasion) return false;
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (selectedSize !== 'All' && !item.availableSizes.includes(selectedSize) && item.size !== selectedSize)
      return false;
    if (item.pricePerDay > maxPrice) return false;
    if (onlyVerified && !item.isBoutiqueVerified) return false;
    return true;
  });

  const resetAllFilters = () => {
    setSelectedGender('All');
    setSelectedOccasion('All');
    setSelectedCategory('All');
    setSelectedSize('All');
    setMaxPrice(3000);
    setOnlyVerified(false);
  };

  return (
    <div className="flex flex-col w-full pb-28 px-4 pt-3 bg-[#f7f9fb]">
      <div className="mb-4">
        <h2 className="font-playfair text-[24px] font-bold text-[#131b2e]">
          Browse Occasion Wear
        </h2>
        <p className="font-inter text-[13px] text-[#45464d]">
          Filter by occasion, style, size and rental budget in Nashik
        </p>
      </div>

      {/* Filter Chips Bar */}
      <div className="space-y-3 bg-white p-4 rounded-2xl shadow-xs border border-[#eceef0] mb-5">
        {/* Gender Filter */}
        <div>
          <label className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider block mb-1.5">
            Gender
          </label>
          <div className="flex gap-2">
            {genders.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                  selectedGender === g
                    ? 'bg-[#725c00] text-white shadow-xs'
                    : 'bg-[#eceef0] text-[#45464d] hover:bg-[#e0e3e5]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider block mb-1.5">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                  selectedCategory === c
                    ? 'bg-[#725c00] text-white shadow-xs'
                    : 'bg-[#eceef0] text-[#45464d] hover:bg-[#e0e3e5]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Occasion Filter */}
        <div>
          <label className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider block mb-1.5">
            Occasion
          </label>
          <div className="flex flex-wrap gap-2">
            {occasions.map((o) => (
              <button
                key={o}
                onClick={() => setSelectedOccasion(o)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                  selectedOccasion === o
                    ? 'bg-[#131b2e] text-white shadow-xs'
                    : 'bg-[#eceef0] text-[#45464d] hover:bg-[#e0e3e5]'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        {/* Price Slider */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider">
              Max Rental: ₹{maxPrice.toLocaleString('en-IN')}/day
            </label>
            <span className="text-[11px] text-[#76777d]">₹500 - ₹3,000</span>
          </div>
          <input
            type="range"
            min="500"
            max="3000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[#725c00] h-1.5 bg-gray-200 rounded-lg cursor-pointer"
          />
        </div>

        {/* Verified & Reset */}
        <div className="flex items-center justify-between pt-2 border-t border-[#eceef0]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
              className="rounded text-[#725c00] focus:ring-[#725c00]"
            />
            <span className="text-[12px] font-semibold text-[#191c1e]">
              Verified Boutiques Only
            </span>
          </label>

          <button
            onClick={resetAllFilters}
            className="text-[11px] font-semibold text-[#725c00] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[13px] font-bold text-[#191c1e]">
          Showing {filtered.length} {filtered.length === 1 ? 'outfit' : 'outfits'}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        {filtered.map((outfit) => {
          const isFavorite = favorites.includes(outfit.id);
          return (
            <div
              key={outfit.id}
              onClick={() => onSelectOutfit(outfit)}
              className="flex flex-col bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(15,23,42,0.06)] relative group cursor-pointer hover:shadow-md transition-shadow border border-[#eceef0]"
            >
              <button
                aria-label="Save to favorites"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(outfit.id);
                }}
                className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 flex items-center justify-center bg-white/85 backdrop-blur-md rounded-full shadow-sm transition-all active:scale-90 ${
                  isFavorite ? 'text-[#ba1a1a]' : 'text-[#45464d] hover:text-[#ba1a1a]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
              </button>

              <div className="relative w-full aspect-[4/5] bg-[#e6e8ea] overflow-hidden">
                <img
                  src={outfit.images[0]}
                  alt={outfit.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {outfit.isBoutiqueVerified && (
                  <div className="absolute top-2.5 left-2.5 bg-[#fdd755] text-[#564500] px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[12px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    Boutique
                  </div>
                )}
              </div>

              <div className="p-3 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="font-inter text-[14px] font-semibold text-[#191c1e] line-clamp-1 leading-snug">
                    {outfit.title}
                  </h4>
                  <p className="font-inter text-[12px] text-[#45464d] truncate mt-0.5">
                    by {outfit.boutique}
                  </p>
                </div>

                <div className="mt-2.5 flex items-baseline justify-between pt-1 border-t border-[#eceef0]">
                  <div>
                    <span className="font-inter text-[16px] font-bold text-[#191c1e]">
                      ₹{outfit.pricePerDay.toLocaleString('en-IN')}
                    </span>
                    <span className="font-inter text-[11px] text-[#76777d]"> /day</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#725c00] bg-[#ffe081]/30 px-1.5 py-0.5 rounded">
                    {outfit.size}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
