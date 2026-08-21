import React, { useState } from 'react';
import { OutfitItem } from '../types';

interface HomeScreenProps {
  outfits: OutfitItem[];
  onSelectOutfit: (outfit: OutfitItem) => void;
  onOpenListingModal: () => void;
  onViewAllCategories: () => void;
  favorites: string[];
  onToggleFavorite: (outfitId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CATEGORIES = ['All', 'Wedding', 'Festivals', 'Party Wear', 'Sherwanis', 'Lehengas', 'Sarees', 'Tuxedos'];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  outfits,
  onSelectOutfit,
  onOpenListingModal,
  onViewAllCategories,
  favorites,
  onToggleFavorite,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory
}) => {
  const filteredOutfits = outfits.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.boutique.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === 'All') return matchesSearch;
    if (selectedCategory === 'Wedding' || selectedCategory === 'Festivals' || selectedCategory === 'Party Wear') {
      return matchesSearch && item.occasion.toLowerCase() === selectedCategory.toLowerCase();
    }
    return (
      matchesSearch &&
      (item.category.toLowerCase() === selectedCategory.toLowerCase() ||
        item.category.toLowerCase().includes(selectedCategory.toLowerCase().slice(0, -1)))
    );
  });

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Hero Banner with Curated Occasion Background */}
      <section className="relative w-full h-[360px] bg-[#131b2e] text-[#bec6e0] overflow-hidden rounded-b-[2rem] shadow-lg">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCtg0Kw7224lLOqRJNbcUV4ZXofC8isSqQcOkSbKwga3pLtuyQYHxKRvKXpCSi3HCuF_fPj-vCuZ6VIk_s2u4Rrb6hlYY-kwGw_RkoRo927aGSX-WuPkzI1sTxcdlNd7pRs3pOKeZZm1IsQV05Dl5bmDVsRKyyMvGm2h5Os-XJzvTUAmqf530bx9Ux4fCFvPeqaN-zOQbbRFWr6FOtfuCydOUBpflwnt6Xg1ei7ULZf60JwWirWvPhG')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#131b2e]/60 to-[#131b2e]" />
        
        <div className="relative z-10 flex flex-col items-center justify-end h-full px-4 pb-8 text-center">
          <h2 className="font-playfair text-[28px] sm:text-[32px] text-white font-bold leading-tight mb-2 drop-shadow-md">
            Dress for the Moment,<br />Not Forever.
          </h2>
          <p className="font-inter text-[15px] text-[#bec6e0] mb-5 max-w-[300px]">
            Curated high-end rentals for your grandest occasions in Nashik.
          </p>

          <div className="w-full max-w-[340px] relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#45464d] text-[20px]">
              search
            </span>
            <input
              id="home-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-[#f7f9fb] rounded-full font-inter text-[15px] text-[#191c1e] placeholder-[#76777d] focus:outline-none focus:ring-2 focus:ring-[#ffe081] shadow-[0_4px_16px_rgba(19,27,46,0.12)] transition-shadow"
              placeholder="Search outfits, designers, boutiques..."
              type="text"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Pills Horizontal Scroll */}
      <section className="w-full mt-6 px-4">
        <div className="flex overflow-x-auto gap-2.5 pb-2 -mx-4 px-4 hide-scrollbar snap-x">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`category-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`snap-start shrink-0 px-4 py-2 rounded-full font-inter text-[13px] font-semibold tracking-wide whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#725c00] text-white shadow-md'
                    : 'bg-[#eceef0] text-[#45464d] shadow-2xs hover:bg-[#e0e3e5]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Curated Edit Section */}
      <section className="w-full mt-7 px-4">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="font-inter text-[11px] font-bold text-[#725c00] mb-0.5 uppercase tracking-widest">
              Curated Edit
            </p>
            <h3 className="font-playfair text-[24px] font-bold text-[#191c1e]">
              Trending Near Nashik
            </h3>
          </div>
          <button
            id="view-all-trending-btn"
            onClick={onViewAllCategories}
            className="font-inter text-[13px] font-semibold text-[#76777d] hover:text-[#191c1e] transition-colors flex items-center gap-1 group"
          >
            <span>View All</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        {/* 2-Column Outfit Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {filteredOutfits.map((outfit) => {
            const isFavorite = favorites.includes(outfit.id);
            return (
              <div
                key={outfit.id}
                id={`outfit-card-${outfit.id}`}
                onClick={() => onSelectOutfit(outfit)}
                className="flex flex-col bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(15,23,42,0.06)] relative group cursor-pointer hover:shadow-md transition-shadow border border-[#eceef0]/60"
              >
                {/* Favorite Toggle Button */}
                <button
                  id={`favorite-btn-${outfit.id}`}
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

                {/* Outfit Thumbnail */}
                <div className="relative w-full aspect-[4/5] bg-[#e6e8ea] overflow-hidden">
                  <img
                    src={outfit.images[0]}
                    alt={outfit.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
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
                  {outfit.deposit > 0 && (
                    <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white px-1.5 py-0.5 rounded text-[10px] font-medium">
                      Dep: ₹{outfit.deposit}
                    </div>
                  )}
                </div>

                {/* Outfit Details */}
                <div className="p-3 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="font-inter text-[14px] font-semibold text-[#191c1e] line-clamp-1 leading-snug">
                      {outfit.title}
                    </h4>
                    <p className="font-inter text-[12px] text-[#45464d] truncate mt-0.5">
                      by {outfit.boutique}
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-baseline justify-between pt-1 border-t border-[#eceef0]/60">
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

        {filteredOutfits.length === 0 && (
          <div className="text-center py-12 px-4 bg-white rounded-xl border border-dashed border-[#c6c6cd] mt-4">
            <span className="material-symbols-outlined text-4xl text-[#76777d] mb-2">
              checkroom
            </span>
            <p className="font-inter font-semibold text-gray-700">No outfits matched your filters</p>
            <p className="font-inter text-xs text-gray-500 mt-1">Try selecting 'All' or clearing your search term.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 px-4 py-1.5 bg-[#725c00] text-white text-xs font-semibold rounded-full"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Lender / Closet Monetization CTA Banner */}
      <section className="w-full mt-8 px-4">
        <div className="w-full bg-[#725c00] text-white rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-black/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10">
            <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center mb-3 text-[#ffe081]">
              <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
            </div>
            <h3 className="font-playfair text-[22px] font-bold mb-2 leading-tight">
              Got outfits you only wore once?
            </h3>
            <p className="font-inter text-[14px] text-[#ffe081] mb-5 opacity-90 max-w-[280px] leading-relaxed">
              List them on Vastraloop and turn your closet into an investment in Nashik.
            </p>
            <button
              id="start-earning-cta-btn"
              onClick={onOpenListingModal}
              className="px-5 py-3 bg-white text-[#191c1e] font-inter text-[13px] font-bold tracking-wide uppercase rounded-lg shadow-md hover:bg-[#f7f9fb] active:scale-98 transition-all flex items-center gap-2"
            >
              <span>Start Earning Today</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
