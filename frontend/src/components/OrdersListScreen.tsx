import React, { useState } from 'react';
import { RentalOrder } from '../types';

interface OrdersListScreenProps {
  orders: RentalOrder[];
  onSelectOrder: (order: RentalOrder) => void;
  onExploreOutfits: () => void;
}

export const OrdersListScreen: React.FC<OrdersListScreenProps> = ({
  orders,
  onSelectOrder,
  onExploreOutfits
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'active') {
      return ['confirmed', 'ready_for_pickup', 'in_use', 'return_pending', 'inspection'].includes(o.status);
    }
    if (filter === 'completed') {
      return ['deposit_refunded', 'completed', 'cancelled'].includes(o.status);
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready_for_pickup':
        return (
          <span className="bg-[#ffe081] text-[#231b00] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#725c00] animate-ping" />
            Ready for Pickup
          </span>
        );
      case 'in_use':
        return (
          <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            In Use
          </span>
        );
      case 'return_pending':
      case 'inspection':
        return (
          <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            Inspection
          </span>
        );
      case 'deposit_refunded':
      case 'completed':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">check</span>
            Completed &amp; Refunded
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 px-4 pt-3 bg-[#f7f9fb]">
      <div className="mb-4">
        <h2 className="font-playfair text-[24px] font-bold text-[#131b2e]">
          My Rental Orders
        </h2>
        <p className="font-inter text-[13px] text-[#45464d]">
          Track live pickup, rental progress, return inspections &amp; deposit refunds
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-[#eceef0] rounded-xl mb-5">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all ${
            filter === 'all' ? 'bg-white text-[#191c1e] shadow-xs' : 'text-[#45464d]'
          }`}
        >
          All ({orders.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all ${
            filter === 'active' ? 'bg-white text-[#191c1e] shadow-xs' : 'text-[#45464d]'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all ${
            filter === 'completed' ? 'bg-white text-[#191c1e] shadow-xs' : 'text-[#45464d]'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            onClick={() => onSelectOrder(order)}
            className="bg-white rounded-2xl p-4 shadow-xs border border-[#eceef0] hover:border-[#ffe081] cursor-pointer transition-all active:scale-[0.99] group"
          >
            <div className="flex justify-between items-center pb-3 border-b border-[#eceef0] mb-3">
              <span className="text-[12px] font-bold text-black font-mono">
                {order.orderNumber}
              </span>
              {getStatusBadge(order.status)}
            </div>

            <div className="flex gap-3.5">
              <div className="w-20 h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                <img
                  src={order.outfitImage}
                  alt={order.outfitTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h4 className="font-inter text-[15px] font-bold text-[#191c1e] truncate group-hover:text-[#725c00] transition-colors">
                    {order.outfitTitle}
                  </h4>
                  <p className="font-inter text-[12px] text-[#45464d] mt-0.5">
                    {order.boutique}
                  </p>
                  <p className="font-inter text-[12px] text-[#76777d] mt-1">
                    Rental: {order.startDate} - {order.endDate} ({order.durationDays} {order.durationDays === 1 ? 'day' : 'days'})
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[14px] font-bold text-[#191c1e]">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                  <button className="text-[12px] font-bold text-[#725c00] flex items-center gap-0.5">
                    <span>Track Order</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-dashed border-gray-300">
            <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">
              shopping_bag
            </span>
            <p className="font-inter font-semibold text-gray-700">No rentals found</p>
            <p className="font-inter text-xs text-gray-500 mt-1">
              Browse occasion outfits and rent for weddings or festivals in Nashik.
            </p>
            <button
              onClick={onExploreOutfits}
              className="mt-4 px-5 py-2 bg-[#725c00] text-white text-xs font-bold rounded-full shadow-xs"
            >
              Explore Outfits
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
