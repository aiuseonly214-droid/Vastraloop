import React, { useState } from 'react';
import { OutfitItem, RentalOrder } from '../types';

interface OwnerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOutfit: (newOutfit: OutfitItem) => void;
  orders: RentalOrder[];
  onUpdateOrderStatus: (orderId: string, status: any) => void;
  onOpenDamageClaimModal: (order: RentalOrder) => void;
}

export const OwnerPortalModal: React.FC<OwnerPortalModalProps> = ({
  isOpen,
  onClose,
  onAddOutfit,
  orders,
  onUpdateOrderStatus,
  onOpenDamageClaimModal
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'new' | 'orders' | 'payouts'>('new');
  
  // New Listing Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Sherwani' | 'Lehenga' | 'Tuxedo' | 'Saree'>('Sherwani');
  const [gender, setGender] = useState<'Men' | 'Women'>('Men');
  const [occasion, setOccasion] = useState<'Wedding' | 'Festivals' | 'Party Wear'>('Wedding');
  const [pricePerDay, setPricePerDay] = useState(1400);
  const [deposit, setDeposit] = useState(2500);
  const [size, setSize] = useState('L');
  const [fabric, setFabric] = useState('Raw Silk & Brocade');
  const [boutiqueName, setBoutiqueName] = useState('Vastra Boutique Nashik');
  const [boutiqueAddress, setBoutiqueAddress] = useState('College Road, Nashik');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAo8zZfvjKpsCM_cU5arWQAcCzofvYNLY3yS8jOKA6hMm9OifjzClqJUVJjY3PmCG-teToG6tC-B1MVF7zMyZtvtvboCfsH2RewjvnIYmGGVIZQ-3JDsbqdmlK5QjAkVdXuNmBFW-JAVuhkmMy8qz6jlY7FkxexiOJOg7VBOGpEgWUCI7NiehmGrEhcuSGizt_qn8QGUBR3_jSJd1GVKlqQknu5xwzRsdQnucOCA5Ya4KD6tFlbUik1'
  );
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOutfit: OutfitItem = {
      id: `outfit-${Date.now()}`,
      title: title || 'Custom Designer Sherwani',
      boutique: boutiqueName,
      boutiqueAddress: `${boutiqueAddress}, Nashik - 422005`,
      boutiquePhone: '+91 98220 99887',
      location: boutiqueAddress,
      pricePerDay: Number(pricePerDay),
      deposit: Number(deposit),
      rating: 5.0,
      reviewsCount: 1,
      size: size,
      availableSizes: [size],
      fabric: fabric || 'Fine Silk Blend',
      fit: 'Tailored Fit',
      cancellationPolicy: '48hrs Prior',
      deliveryOptions: 'Store Pickup / Delivery',
      images: [imageUrl],
      category: category,
      gender: gender,
      occasion: occasion,
      isBoutiqueVerified: true,
      description: description || 'Stunning occasion outfit in mint condition, professionally dry cleaned and ready for rent.',
      bookedDates: [],
      available: true
    };

    onAddOutfit(newOutfit);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#131b2e] text-white flex justify-between items-center shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#ffe081]">
              Owner &amp; Boutique Dashboard
            </span>
            <h3 className="font-playfair text-[20px] font-bold">Vastraloop Partner Hub</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#eceef0] p-1 border-b border-gray-200 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'new' ? 'bg-white text-black shadow-xs' : 'text-gray-600'
            }`}
          >
            + Add Listing
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'orders' ? 'bg-white text-black shadow-xs' : 'text-gray-600'
            }`}
          >
            Shop Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'payouts' ? 'bg-white text-black shadow-xs' : 'text-gray-600'
            }`}
          >
            Earnings / Payouts
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto flex-1 font-inter">
          {activeTab === 'new' && (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {isSuccess ? (
                <div className="py-12 text-center">
                  <span className="material-symbols-outlined text-5xl text-emerald-600 mb-2">
                    check_circle
                  </span>
                  <h4 className="font-playfair text-xl font-bold text-gray-900">
                    Listing Published!
                  </h4>
                  <p className="text-gray-600 mt-1">
                    Your outfit is now live for rental bookings across Nashik.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Outfit Title *
                    </label>
                    <input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Royal Maroon Embroidered Sherwani"
                      className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-[#ffe081] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Category</label>
                      <select
                        value={category}
                        onChange={(e: any) => setCategory(e.target.value)}
                        className="w-full p-2 border rounded-xl bg-white"
                      >
                        <option value="Sherwani">Sherwani</option>
                        <option value="Lehenga">Lehenga</option>
                        <option value="Tuxedo">Tuxedo</option>
                        <option value="Saree">Saree</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Gender</label>
                      <select
                        value={gender}
                        onChange={(e: any) => setGender(e.target.value)}
                        className="w-full p-2 border rounded-xl bg-white"
                      >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Rental Price (₹/day) *
                      </label>
                      <input
                        type="number"
                        required
                        value={pricePerDay}
                        onChange={(e) => setPricePerDay(Number(e.target.value))}
                        className="w-full p-2.5 border rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Security Deposit (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        value={deposit}
                        onChange={(e) => setDeposit(Number(e.target.value))}
                        className="w-full p-2.5 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Size</label>
                      <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full p-2 border rounded-xl bg-white"
                      >
                        <option value="S">S (Small)</option>
                        <option value="M">M (Medium)</option>
                        <option value="L">L (Large)</option>
                        <option value="XL">XL (Extra Large)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Occasion</label>
                      <select
                        value={occasion}
                        onChange={(e: any) => setOccasion(e.target.value)}
                        className="w-full p-2 border rounded-xl bg-white"
                      >
                        <option value="Wedding">Wedding</option>
                        <option value="Festivals">Festivals</option>
                        <option value="Party Wear">Party Wear</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Boutique / Pickup Location in Nashik
                    </label>
                    <input
                      value={boutiqueAddress}
                      onChange={(e) => setBoutiqueAddress(e.target.value)}
                      placeholder="e.g. College Road / Gangapur Road / Main Road"
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Description &amp; Embellishments
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Mention fabric, zari work, styling details..."
                      rows={2}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#725c00] hover:bg-[#564500] text-white font-bold rounded-xl shadow-md uppercase tracking-wider text-xs"
                  >
                    Publish Rentable Outfit
                  </button>
                </>
              )}
            </form>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-3 text-xs">
              <p className="text-gray-500 mb-2">
                Manage handovers, returns and inspections for your store rentals:
              </p>
              {orders.map((o) => (
                <div key={o.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-black">{o.orderNumber}</span>
                      <p className="font-medium text-gray-800">{o.outfitTitle}</p>
                    </div>
                    <span className="bg-[#ffe081] text-[#231b00] font-bold px-2 py-0.5 rounded-full text-[10px]">
                      {o.status}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    Customer: {o.customerName} ({o.customerPhone})
                  </p>
                  <p className="text-gray-600">
                    Duration: {o.startDate} - {o.endDate} ({o.durationDays} days)
                  </p>
                  <div className="flex gap-2 mt-3 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => onUpdateOrderStatus(o.id, 'in_use')}
                      className="flex-1 py-1.5 bg-black text-white rounded-lg font-semibold text-[11px]"
                    >
                      Mark Handed Over
                    </button>
                    <button
                      onClick={() => onOpenDamageClaimModal(o)}
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-semibold text-[11px]"
                    >
                      Report Damage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="space-y-3 text-xs">
              <div className="bg-[#f7f9fb] p-4 rounded-2xl border border-gray-200">
                <p className="text-gray-500 font-semibold uppercase text-[10px]">
                  Total Completed Earnings
                </p>
                <h3 className="text-2xl font-bold text-black mt-1">₹14,850</h3>
                <p className="text-emerald-700 font-medium text-[11px] mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Bank Account Linked (HDFC Bank Nashik Branch ••4491)
                </p>
              </div>

              <h4 className="font-bold text-gray-800 pt-2">Recent Payout Transactions</h4>
              <div className="divide-y divide-gray-100">
                <div className="py-2.5 flex justify-between">
                  <div>
                    <p className="font-bold text-gray-800">Order #VL-8742 (Flora Lehenga)</p>
                    <p className="text-gray-500 text-[11px]">Completed &amp; Settled on Aug 16</p>
                  </div>
                  <span className="font-bold text-emerald-700">+₹2,069</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <div>
                    <p className="font-bold text-gray-800">Order #VL-8610 (Tuxedo Suit)</p>
                    <p className="text-gray-500 text-[11px]">Completed on Aug 18</p>
                  </div>
                  <span className="font-bold text-emerald-700">+₹899</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
