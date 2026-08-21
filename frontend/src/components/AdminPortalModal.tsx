import React, { useState } from 'react';
import { DamageClaim, RentalOrder } from '../types';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  claims: DamageClaim[];
  onResolveClaim: (claimId: string, status: 'Approved' | 'Rejected' | 'Adjusted') => void;
  orders: RentalOrder[];
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  claims,
  onResolveClaim,
  orders
}) => {
  const [activeTab, setActiveTab] = useState<'claims' | 'owners' | 'audits'>('claims');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#131b2e] text-white flex justify-between items-center shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#ffe081]">
              Platform Operations
            </span>
            <h3 className="font-playfair text-[20px] font-bold">Admin &amp; Dispute Control</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[#eceef0] p-1 border-b border-gray-200 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('claims')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'claims' ? 'bg-white text-black shadow-xs' : 'text-gray-600'
            }`}
          >
            Disputes / Claims ({claims.length})
          </button>
          <button
            onClick={() => setActiveTab('owners')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'owners' ? 'bg-white text-black shadow-xs' : 'text-gray-600'
            }`}
          >
            Owner Verifications (3)
          </button>
          <button
            onClick={() => setActiveTab('audits')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'audits' ? 'bg-white text-black shadow-xs' : 'text-gray-600'
            }`}
          >
            Deposit Audits
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 text-xs">
          {activeTab === 'claims' && (
            <div className="space-y-3">
              <p className="text-gray-600">
                Review owner damage/stain reports before deducting security deposit:
              </p>

              {claims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[11px] font-bold text-gray-500">
                        {claim.id} • {claim.orderNumber}
                      </span>
                      <h4 className="font-bold text-gray-900 text-[13px]">{claim.itemTitle}</h4>
                      <p className="text-gray-600 text-[11px]">Reported by: {claim.reportedBy}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        claim.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : claim.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-gray-100">
                    <p className="font-semibold text-gray-800">
                      Issue: <span className="text-rose-700">{claim.issueType}</span> (Claim: ₹{claim.claimedAmount})
                    </p>
                    <p className="text-gray-600 mt-1 text-[11px] leading-relaxed">
                      "{claim.evidenceDescription}"
                    </p>
                  </div>

                  {claim.status === 'Pending Admin Review' && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => onResolveClaim(claim.id, 'Approved')}
                        className="flex-1 py-1.5 bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                      >
                        Approve Deduction
                      </button>
                      <button
                        onClick={() => onResolveClaim(claim.id, 'Rejected')}
                        className="flex-1 py-1.5 bg-gray-200 text-gray-800 rounded-lg font-bold text-[11px]"
                      >
                        Reject Claim
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'owners' && (
            <div className="space-y-3">
              <p className="text-gray-600">Verified boutique providers in Nashik region:</p>
              
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900">Vastra Boutique</h4>
                  <p className="text-gray-500 text-[11px]">College Road • GSTIN Verified</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  Verified
                </span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900">Royal Nashik Tailors</h4>
                  <p className="text-gray-500 text-[11px]">Shalimar Chowk • Shop Act ID Verified</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  Verified
                </span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900">Sabyasachi Inspired Boutique</h4>
                  <p className="text-gray-500 text-[11px]">Gangapur Road • Trade License Verified</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  Verified
                </span>
              </div>
            </div>
          )}

          {activeTab === 'audits' && (
            <div className="space-y-2.5">
              <p className="text-gray-600">Platform security deposit escrow logs:</p>
              {orders.map((o) => (
                <div key={o.id} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-800">{o.orderNumber}</span>
                    <span className="font-bold text-gray-900">Escrow: ₹{o.depositFee}</span>
                  </div>
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    Customer: {o.customerName} • Status: {o.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
