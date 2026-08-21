import React, { useState } from 'react';
import { OutfitItem, RentalOrder, DamageClaim, RentalStatus, UserProfile } from './types';
import { OUTFITS, INITIAL_ORDERS, INITIAL_CLAIMS, INITIAL_USER } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { OrderTrackingScreen } from './components/OrderTrackingScreen';
import { CategoriesScreen } from './components/CategoriesScreen';
import { OrdersListScreen } from './components/OrdersListScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { OwnerPortalModal } from './components/OwnerPortalModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import {
  ShopDirectionsModal,
  ContactShopModal,
  ReturnPolicyModal,
  DamageClaimModal
} from './components/Modals';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [activeScreen, setActiveScreen] = useState<
    'tab_screen' | 'product_detail' | 'checkout' | 'order_tracking'
  >('tab_screen');

  // Application Data States
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [outfits, setOutfits] = useState<OutfitItem[]>(OUTFITS);
  const [orders, setOrders] = useState<RentalOrder[]>(INITIAL_ORDERS);
  const [claims, setClaims] = useState<DamageClaim[]>(INITIAL_CLAIMS);
  const [favorites, setFavorites] = useState<string[]>(['outfit-4']); // Tuxedo favorited in screenshot

  // Selected item states
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitItem>(OUTFITS[0]);
  const [selectedOrder, setSelectedOrder] = useState<RentalOrder>(INITIAL_ORDERS[0]);
  const [checkoutConfig, setCheckoutConfig] = useState<{
    outfit: OutfitItem;
    durationDays: number;
    startDate: string;
    endDate: string;
    calculatedRent: number;
  }>({
    outfit: OUTFITS[0],
    durationDays: 1,
    startDate: '24 Aug',
    endDate: '25 Aug',
    calculatedRent: 1500
  });

  // Search & Filters on Home
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal States
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [directionsModal, setDirectionsModal] = useState<{
    isOpen: boolean;
    boutique: string;
    address: string;
  }>({ isOpen: false, boutique: '', address: '' });
  const [contactShopModal, setContactShopModal] = useState<{
    isOpen: boolean;
    boutique: string;
    phone: string;
  }>({ isOpen: false, boutique: '', phone: '' });
  const [isReturnPolicyModalOpen, setIsReturnPolicyModalOpen] = useState(false);
  const [damageClaimTarget, setDamageClaimTarget] = useState<RentalOrder | null>(null);
  const [showNotificationsToast, setShowNotificationsToast] = useState(false);

  // Favorite toggle
  const handleToggleFavorite = (outfitId: string) => {
    setFavorites((prev) =>
      prev.includes(outfitId) ? prev.filter((id) => id !== outfitId) : [...prev, outfitId]
    );
  };

  // Navigating to detail
  const handleSelectOutfit = (outfit: OutfitItem) => {
    setSelectedOutfit(outfit);
    setActiveScreen('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigating to checkout
  const handleProceedToCheckout = (config: {
    outfit: OutfitItem;
    durationDays: number;
    startDate: string;
    endDate: string;
    calculatedRent: number;
  }) => {
    setCheckoutConfig(config);
    setActiveScreen('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Checkout order completed
  const handleOrderSuccess = (newOrder: RentalOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrder(newOrder);
    setActiveScreen('order_tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Tracking an order
  const handleSelectOrder = (order: RentalOrder) => {
    setSelectedOrder(order);
    setActiveScreen('order_tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Updating order status in live lifecycle
  const handleUpdateOrderStatus = (orderId: string, newStatus: RentalStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, status: newStatus };
          if (newStatus === 'deposit_refunded' || newStatus === 'completed') {
            updated.depositRefundAmount = ord.depositFee;
          }
          return updated;
        }
        return ord;
      })
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({
        ...prev,
        status: newStatus,
        depositRefundAmount:
          newStatus === 'deposit_refunded' || newStatus === 'completed'
            ? prev.depositFee
            : prev.depositRefundAmount
      }));
    }
  };

  // Owner adding new outfit
  const handleAddOutfit = (newOutfit: OutfitItem) => {
    setOutfits((prev) => [newOutfit, ...prev]);
  };

  // Damage claim submission
  const handleSubmitDamageClaim = (claimData: {
    orderNumber: string;
    itemTitle: string;
    issueType: any;
    claimedAmount: number;
    description: string;
  }) => {
    const newClaim: DamageClaim = {
      id: `claim-${Date.now()}`,
      orderNumber: claimData.orderNumber,
      itemTitle: claimData.itemTitle,
      reportedBy: `${user.name} (Boutique Owner)`,
      issueType: claimData.issueType,
      claimedAmount: claimData.claimedAmount,
      status: 'Pending Admin Review',
      evidenceDescription: claimData.description,
      createdAt: 'Just now'
    };

    setClaims((prev) => [newClaim, ...prev]);
    alert(`Damage claim for ${claimData.orderNumber} submitted to Vastraloop Admin for inspection.`);
  };

  // Admin resolving claim
  const handleResolveClaim = (
    claimId: string,
    status: 'Approved' | 'Rejected' | 'Adjusted'
  ) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status } : c))
    );
  };

  // Switch role handler
  const handleRoleChange = (role: 'customer' | 'owner' | 'admin') => {
    setUser((prev) => ({ ...prev, role }));
    if (role === 'owner') {
      setIsOwnerModalOpen(true);
    } else if (role === 'admin') {
      setIsAdminModalOpen(true);
    }
  };

  // Determine back navigation
  const handleBack = () => {
    if (activeScreen === 'product_detail') {
      setActiveScreen('tab_screen');
    } else if (activeScreen === 'checkout') {
      setActiveScreen('product_detail');
    } else if (activeScreen === 'order_tracking') {
      setActiveScreen('tab_screen');
      setCurrentTab('orders');
    }
  };

  // Header Title
  const getHeaderTitle = () => {
    if (activeScreen === 'product_detail') return 'Product Details';
    if (activeScreen === 'checkout') return 'Checkout';
    if (activeScreen === 'order_tracking') return 'Order Tracking';
    if (currentTab === 'categories') return 'Categories';
    if (currentTab === 'orders') return 'My Rentals';
    if (currentTab === 'profile') return 'Profile';
    return undefined;
  };

  const isSubScreen = activeScreen !== 'tab_screen';

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex justify-center text-[#191c1e]">
      {/* Mobile-sized shell centered for clean viewing */}
      <div className="w-full max-w-md bg-[#f7f9fb] min-h-screen relative flex flex-col shadow-xl">
        {/* App Header */}
        <Header
          title={getHeaderTitle()}
          showBack={isSubScreen}
          onBack={handleBack}
          onSearchClick={() => {
            setCurrentTab('categories');
            setActiveScreen('tab_screen');
          }}
          onNotificationsClick={() => setShowNotificationsToast(!showNotificationsToast)}
          onProfileClick={() => {
            setCurrentTab('profile');
            setActiveScreen('tab_screen');
          }}
          unreadCount={1}
          user={user}
          activeRole={user.role}
          onRoleChange={handleRoleChange}
        />

        {/* Notifications Toast / Dropdown */}
        {showNotificationsToast && (
          <div className="fixed top-16 left-0 right-0 max-w-md mx-auto z-50 px-4 pt-2">
            <div className="bg-[#131b2e] text-white p-3.5 rounded-2xl shadow-xl border border-white/10 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-[#ffe081] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#ffe081] animate-ping" />
                  Pickup Reminder
                </span>
                <button
                  onClick={() => setShowNotificationsToast(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
              <p className="text-gray-200">
                Order #VL-8821 (Midnight Blue Sherwani) is packaged and ready at Vastra Boutique Nashik.
              </p>
              <button
                onClick={() => {
                  setShowNotificationsToast(false);
                  setActiveScreen('order_tracking');
                }}
                className="mt-2 text-[11px] font-bold text-[#ffe081] hover:underline block"
              >
                Open Order Tracking →
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 w-full pt-16">
          {/* Sub-screens */}
          {activeScreen === 'product_detail' && (
            <ProductDetailScreen
              outfit={selectedOutfit}
              onBack={handleBack}
              onProceedToCheckout={handleProceedToCheckout}
              isFavorite={favorites.includes(selectedOutfit.id)}
              onToggleFavorite={() => handleToggleFavorite(selectedOutfit.id)}
            />
          )}

          {activeScreen === 'checkout' && (
            <CheckoutScreen
              config={checkoutConfig}
              user={user}
              onBack={handleBack}
              onOrderSuccess={handleOrderSuccess}
            />
          )}

          {activeScreen === 'order_tracking' && (
            <OrderTrackingScreen
              order={selectedOrder}
              onBack={handleBack}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onOpenDirections={(boutique, address) =>
                setDirectionsModal({ isOpen: true, boutique, address })
              }
              onOpenContactShop={(boutique, phone) =>
                setContactShopModal({ isOpen: true, boutique, phone })
              }
              onOpenReturnPolicy={() => setIsReturnPolicyModalOpen(true)}
              onOpenDamageClaimModal={(order) => setDamageClaimTarget(order)}
            />
          )}

          {/* Tab Screens */}
          {activeScreen === 'tab_screen' && (
            <>
              {currentTab === 'home' && (
                <HomeScreen
                  outfits={outfits}
                  onSelectOutfit={handleSelectOutfit}
                  onOpenListingModal={() => setIsOwnerModalOpen(true)}
                  onViewAllCategories={() => setCurrentTab('categories')}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              )}

              {currentTab === 'categories' && (
                <CategoriesScreen
                  outfits={outfits}
                  onSelectOutfit={handleSelectOutfit}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}

              {currentTab === 'orders' && (
                <OrdersListScreen
                  orders={orders}
                  onSelectOrder={handleSelectOrder}
                  onExploreOutfits={() => setCurrentTab('home')}
                />
              )}

              {currentTab === 'profile' && (
                <ProfileScreen
                  user={user}
                  activeRole={user.role}
                  onRoleChange={handleRoleChange}
                  onOpenListingModal={() => setIsOwnerModalOpen(true)}
                  onOpenReturnPolicy={() => setIsReturnPolicyModalOpen(true)}
                />
              )}
            </>
          )}
        </main>

        {/* Bottom Navigation */}
        {!isSubScreen && (
          <BottomNav
            activeTab={currentTab}
            onTabChange={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            activeOrdersCount={
              orders.filter((o) =>
                ['confirmed', 'ready_for_pickup', 'in_use', 'return_pending'].includes(o.status)
              ).length
            }
          />
        )}

        {/* Modals */}
        <OwnerPortalModal
          isOpen={isOwnerModalOpen}
          onClose={() => setIsOwnerModalOpen(false)}
          onAddOutfit={handleAddOutfit}
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onOpenDamageClaimModal={(order) => setDamageClaimTarget(order)}
        />

        <AdminPortalModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          claims={claims}
          onResolveClaim={handleResolveClaim}
          orders={orders}
        />

        <ShopDirectionsModal
          isOpen={directionsModal.isOpen}
          onClose={() => setDirectionsModal({ isOpen: false, boutique: '', address: '' })}
          boutiqueName={directionsModal.boutique}
          address={directionsModal.address}
        />

        <ContactShopModal
          isOpen={contactShopModal.isOpen}
          onClose={() => setContactShopModal({ isOpen: false, boutique: '', phone: '' })}
          boutiqueName={contactShopModal.boutique}
          phone={contactShopModal.phone}
        />

        <ReturnPolicyModal
          isOpen={isReturnPolicyModalOpen}
          onClose={() => setIsReturnPolicyModalOpen(false)}
        />

        <DamageClaimModal
          isOpen={!!damageClaimTarget}
          onClose={() => setDamageClaimTarget(null)}
          order={damageClaimTarget}
          onSubmitClaim={handleSubmitDamageClaim}
        />
      </div>
    </div>
  );
}
