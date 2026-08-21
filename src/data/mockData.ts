import { OutfitItem, RentalOrder, DamageClaim, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Aditya Patil',
  phone: '+91 98220 41234',
  email: 'aditya.patil@vastraloop.in',
  city: 'Nashik, Maharashtra',
  address: '12, Prestige Apartments, Gangapur Road, Nashik, Maharashtra 422005',
  verifiedId: true,
  role: 'customer'
};

export const OUTFITS: OutfitItem[] = [
  {
    id: 'outfit-1',
    title: 'Royal Navy Silk Sherwani',
    boutique: 'Vastra Boutique',
    boutiqueAddress: 'Shop 4, College Road, Near BYK College, Nashik - 422005',
    boutiquePhone: '+91 98231 55442',
    location: 'College Road, Nashik',
    pricePerDay: 1500,
    deposit: 3000,
    rating: 4.9,
    reviewsCount: 38,
    size: 'L',
    availableSizes: ['M', 'L', 'XL'],
    fabric: 'Raw Silk',
    fit: 'Tailored / Slim',
    cancellationPolicy: '48hrs Prior',
    deliveryOptions: 'Store Pickup / Home Delivery',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAo8zZfvjKpsCM_cU5arWQAcCzofvYNLY3yS8jOKA6hMm9OifjzClqJUVJjY3PmCG-teToG6tC-B1MVF7zMyZtvtvboCfsH2RewjvnIYmGGVIZQ-3JDsbqdmlK5QjAkVdXuNmBFW-JAVuhkmMy8qz6jlY7FkxexiOJOg7VBOGpEgWUCI7NiehmGrEhcuSGizt_qn8QGUBR3_jSJd1GVKlqQknu5xwzRsdQnucOCA5Ya4KD6tFlbUik1',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMdKdetYdZl4Mo1wvey0UT8Z7YhCmIvxg2PdRoQC3CuZwZhxswns-4U-inYRCwdn_8Dw9clwcSzB0cKJxdM6YrEKgeEu9QP9_vUA5_bJF4_dvqqW9ljC0mmXe1VKuHy9N0i2XhNDLNsI9R6g5FcqIwfS-MUwok4PwuuY-YmPihJOxzBTWYptL1I7eZyFKLs6Bu5V17jCZvcFXgiaXqNrtSmjm4AOoqF9TY86JmWo-S0jq2uVhbl5lu',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD8BLezZKcfaHV9XU3DY5HFKdy25ESsq0YQNitB2ESAoWIRRRlN9SoCf0BvyiKCM5BCP18_D-qZOy01E_myKY3pTNOZ_O5D0z02-Mpzmu170l1_AA3J0qz0GN8zFOKW1s95EJOSyumL3fyOg0mT3kh2d1156tWe6n2zBzNuD71Lu09prYVZfzO_baf96mfO1wTSvGn48XDOVHJ3HRHiSdSrn1QeERWhWgTQIeiTTFzIYMiypnxwaNyQ'
    ],
    category: 'Sherwani',
    gender: 'Men',
    occasion: 'Wedding',
    isBoutiqueVerified: true,
    description: 'Exude regal charm with this classic Navy Blue Sherwani, crafted from premium raw silk. Featuring delicate zari work and a structured silhouette, it\'s the perfect choice for evening receptions and sangeet ceremonies.',
    bookedDates: [6, 7, 21, 22],
    available: true
  },
  {
    id: 'outfit-2',
    title: 'Midnight Blue Zardozi Sherwani',
    boutique: 'Royal Nashik Tailors',
    boutiqueAddress: 'Near Shalimar Chowk, Main Road, Nashik - 422001',
    boutiquePhone: '+91 94222 88991',
    location: 'Main Road, Nashik',
    pricePerDay: 1499,
    deposit: 3000,
    rating: 4.8,
    reviewsCount: 26,
    size: 'L',
    availableSizes: ['M', 'L', 'XL', 'XXL'],
    fabric: 'Velvet & Brocade',
    fit: 'Tailored Fit',
    cancellationPolicy: '48hrs Prior',
    deliveryOptions: 'Store Pickup / Express Delivery',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMdKdetYdZl4Mo1wvey0UT8Z7YhCmIvxg2PdRoQC3CuZwZhxswns-4U-inYRCwdn_8Dw9clwcSzB0cKJxdM6YrEKgeEu9QP9_vUA5_bJF4_dvqqW9ljC0mmXe1VKuHy9N0i2XhNDLNsI9R6g5FcqIwfS-MUwok4PwuuY-YmPihJOxzBTWYptL1I7eZyFKLs6Bu5V17jCZvcFXgiaXqNrtSmjm4AOoqF9TY86JmWo-S0jq2uVhbl5lu',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAo8zZfvjKpsCM_cU5arWQAcCzofvYNLY3yS8jOKA6hMm9OifjzClqJUVJjY3PmCG-teToG6tC-B1MVF7zMyZtvtvboCfsH2RewjvnIYmGGVIZQ-3JDsbqdmlK5QjAkVdXuNmBFW-JAVuhkmMy8qz6jlY7FkxexiOJOg7VBOGpEgWUCI7NiehmGrEhcuSGizt_qn8QGUBR3_jSJd1GVKlqQknu5xwzRsdQnucOCA5Ya4KD6tFlbUik1'
    ],
    category: 'Sherwani',
    gender: 'Men',
    occasion: 'Wedding',
    isBoutiqueVerified: true,
    description: 'A luxurious midnight blue sherwani featuring intricate silver and gold zardozi embroidery. Handcrafted royal collar with regal buttons.',
    bookedDates: [3, 4, 15, 16],
    available: true
  },
  {
    id: 'outfit-3',
    title: 'Pastel Flora Lehenga',
    boutique: 'Sabyasachi Inspired',
    boutiqueAddress: 'Opp. Big Bazaar, Gangapur Road, Nashik - 422013',
    boutiquePhone: '+91 98901 77332',
    location: 'Gangapur Road, Nashik',
    pricePerDay: 2299,
    deposit: 4500,
    rating: 5.0,
    reviewsCount: 52,
    size: 'M',
    availableSizes: ['S', 'M', 'L'],
    fabric: 'Georgette & Net',
    fit: 'Flared A-Line',
    cancellationPolicy: '72hrs Prior',
    deliveryOptions: 'Store Pickup / Home Delivery',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCcmsnT9GQYNYrdqaN3fJhoJCw3SBixpZobWfvfX2FdE08ulkpdg2JL5gnL-bmlreSCcTPhkHUv-KRlGSZjyxwRls20xubdMMi7qnh8h2ASY3qkTIP1V6UUr59GqvmjzT-GiCz297GG6cGXu-QZABWkouklpvnSL-fZuNtm_mVVUkyDXofPeBf4_MeGur6PIHLs3YPuiqFc7qTitNDBHigeozGL4-Vs9RFumAe7906Qo0rkX07N27Oi'
    ],
    category: 'Lehenga',
    gender: 'Women',
    occasion: 'Wedding',
    isBoutiqueVerified: true,
    description: 'A breathtaking pastel pink floral lehenga choli made with delicate flowing georgette, embellished with sequins and pastel resham threadwork.',
    bookedDates: [9, 10, 24, 25],
    available: true
  },
  {
    id: 'outfit-4',
    title: 'Ivory Tuxedo Suit',
    boutique: 'Elite Menswear',
    boutiqueAddress: 'Shop 12, Mahatma Nagar Arcade, Nashik - 422007',
    boutiquePhone: '+91 97654 33210',
    location: 'Mahatma Nagar, Nashik',
    pricePerDay: 999,
    deposit: 2000,
    rating: 4.7,
    reviewsCount: 19,
    size: '40R (L)',
    availableSizes: ['38R', '40R', '42R'],
    fabric: 'Italian Wool Blend',
    fit: 'Slim Modern Fit',
    cancellationPolicy: '24hrs Prior',
    deliveryOptions: 'Store Pickup / Home Delivery',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBHnS2P22FCoM5aNZjSryF7zdaMqZO32ALmowiY6EKYOVv6bW_6BwVLiikihi2FQQ0KPP6N04MD-k6CEKHyvjBouS4Azx4RXEqxaJWQWb15z_uMu61eWoWXyt2_pVS3K5WE9cu-3nWm0KwuDGlP_vQufgDB3inxM6VJLffO_2jL-yyJVdoa5AqwrBy6sMGSTDOlAZRE0BkOvG7E8quQsBhFt6lGVboUnD7PMg7mOwvNqKNOSpuvR118'
    ],
    category: 'Tuxedo',
    gender: 'Men',
    occasion: 'Party Wear',
    isBoutiqueVerified: true,
    description: 'An elegant ivory tuxedo with black satin shawl lapel, matching slim-fit trousers and formal bow tie. Sharp, sophisticated and timeless.',
    bookedDates: [12, 13],
    available: true
  },
  {
    id: 'outfit-5',
    title: 'Emerald Silk Saree',
    boutique: 'Heritage Weaves',
    boutiqueAddress: '1st Floor, Canada Corner, Sharanpur Road, Nashik - 422002',
    boutiquePhone: '+91 98223 99001',
    location: 'Canada Corner, Nashik',
    pricePerDay: 850,
    deposit: 1500,
    rating: 4.9,
    reviewsCount: 44,
    size: 'Free Size',
    availableSizes: ['Free Size (Includes Stitched Blouse M/L)'],
    fabric: 'Pure Paithani Silk',
    fit: 'Traditional Drape',
    cancellationPolicy: '48hrs Prior',
    deliveryOptions: 'Store Pickup / Home Delivery',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCIubQhYBwusRO7prXRvwp3Ai6qFvhJKYNZE6MdK2Kr7xz0wbExmRf6suVygxzuZuXQ0zSVgLWtVPEMFnIrcbZFwpGGrzB0uB1jxLFSgXEvVI8O9SYgKq0OUZixJa8ilnjj3Afv68Orfx5dy6MxR3mJMDl_1JC51hooltVnTTCHA2GhQjmyzWLNxmt6HQF3C_R36RUQEpWPOyQxZ1Tj6C51rsKc4Hl5-CjVySyV9TUUCbe8msp1Kuac'
    ],
    category: 'Saree',
    gender: 'Women',
    occasion: 'Festivals',
    isBoutiqueVerified: true,
    description: 'A rich emerald green silk Paithani saree with authentic gold zari peacock border and traditional pallu. Perfectly pressed and ready to wear.',
    bookedDates: [5, 6, 17, 18],
    available: true
  },
  {
    id: 'outfit-6',
    title: 'Crimson Velvet Bridal Lehenga',
    boutique: 'Vastra Boutique',
    boutiqueAddress: 'Shop 4, College Road, Near BYK College, Nashik - 422005',
    boutiquePhone: '+91 98231 55442',
    location: 'College Road, Nashik',
    pricePerDay: 2899,
    deposit: 5000,
    rating: 5.0,
    reviewsCount: 31,
    size: 'M',
    availableSizes: ['S', 'M', 'L'],
    fabric: 'Micro Velvet',
    fit: 'Heavy Bridal Flared',
    cancellationPolicy: '72hrs Prior',
    deliveryOptions: 'Store Pickup / Express Delivery',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCcmsnT9GQYNYrdqaN3fJhoJCw3SBixpZobWfvfX2FdE08ulkpdg2JL5gnL-bmlreSCcTPhkHUv-KRlGSZjyxwRls20xubdMMi7qnh8h2ASY3qkTIP1V6UUr59GqvmjzT-GiCz297GG6cGXu-QZABWkouklpvnSL-fZuNtm_mVVUkyDXofPeBf4_MeGur6PIHLs3YPuiqFc7qTitNDBHigeozGL4-Vs9RFumAe7906Qo0rkX07N27Oi',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMdKdetYdZl4Mo1wvey0UT8Z7YhCmIvxg2PdRoQC3CuZwZhxswns-4U-inYRCwdn_8Dw9clwcSzB0cKJxdM6YrEKgeEu9QP9_vUA5_bJF4_dvqqW9ljC0mmXe1VKuHy9N0i2XhNDLNsI9R6g5FcqIwfS-MUwok4PwuuY-YmPihJOxzBTWYptL1I7eZyFKLs6Bu5V17jCZvcFXgiaXqNrtSmjm4AOoqF9TY86JmWo-S0jq2uVhbl5lu'
    ],
    category: 'Lehenga',
    gender: 'Women',
    occasion: 'Wedding',
    isBoutiqueVerified: true,
    description: 'Heritage deep crimson velvet lehenga adorned with antique gold dabka and marodi embroidery. Comes with double dupatta set.',
    bookedDates: [1, 2, 28, 29],
    available: true
  }
];

export const INITIAL_ORDERS: RentalOrder[] = [
  {
    id: 'order-1',
    orderNumber: '#VL-8821',
    outfitId: 'outfit-1',
    outfitTitle: 'Midnight Blue Sherwani Set',
    outfitImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8BLezZKcfaHV9XU3DY5HFKdy25ESsq0YQNitB2ESAoWIRRRlN9SoCf0BvyiKCM5BCP18_D-qZOy01E_myKY3pTNOZ_O5D0z02-Mpzmu170l1_AA3J0qz0GN8zFOKW1s95EJOSyumL3fyOg0mT3kh2d1156tWe6n2zBzNuD71Lu09prYVZfzO_baf96mfO1wTSvGn48XDOVHJ3HRHiSdSrn1QeERWhWgTQIeiTTFzIYMiypnxwaNyQ',
    boutique: 'Vastra Boutique',
    boutiqueAddress: 'Shop 4, College Road, Near BYK College, Nashik - 422005',
    boutiquePhone: '+91 98231 55442',
    durationDays: 2,
    startDate: '24 Aug',
    endDate: '26 Aug',
    fulfillmentType: 'pickup',
    pickupLocation: 'Vastra Boutique, Nashik branch',
    paymentMethod: 'upi',
    rentalFee: 2800,
    depositFee: 3000,
    deliveryFee: 0,
    totalAmount: 5800,
    status: 'ready_for_pickup',
    createdAt: 'Aug 20, 2:45 PM',
    customerName: 'Aditya Patil',
    customerPhone: '+91 98220 41234',
    depositRefundAmount: 3000,
    timeline: [
      {
        id: 't-1',
        title: 'Order Confirmed',
        timestamp: 'Aug 20, 2:45 PM',
        description: 'Payment verified via UPI. Outfit reserved.',
        status: 'completed'
      },
      {
        id: 't-2',
        title: 'Ready for Pickup',
        timestamp: 'Active Now',
        description: 'Collect your items at Vastra Boutique, Nashik branch before 8:00 PM today.',
        warning: 'Please bring a valid photo ID matching the name on your order.',
        status: 'current'
      },
      {
        id: 't-3',
        title: 'In Use',
        timestamp: 'Pending pickup',
        description: 'Enjoy your occasion in style!',
        status: 'upcoming'
      },
      {
        id: 't-4',
        title: 'Return Pending',
        timestamp: 'Due by Aug 26, 10:00 AM',
        description: 'Hand over outfit at Vastra Boutique for quick inspection.',
        status: 'upcoming'
      },
      {
        id: 't-5',
        title: 'Deposit Refunded',
        timestamp: 'After inspection',
        description: '₹3,000 security deposit will be automatically refunded to your UPI account.',
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'order-2',
    orderNumber: '#VL-8742',
    outfitId: 'outfit-3',
    outfitTitle: 'Pastel Flora Lehenga',
    outfitImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcmsnT9GQYNYrdqaN3fJhoJCw3SBixpZobWfvfX2FdE08ulkpdg2JL5gnL-bmlreSCcTPhkHUv-KRlGSZjyxwRls20xubdMMi7qnh8h2ASY3qkTIP1V6UUr59GqvmjzT-GiCz297GG6cGXu-QZABWkouklpvnSL-fZuNtm_mVVUkyDXofPeBf4_MeGur6PIHLs3YPuiqFc7qTitNDBHigeozGL4-Vs9RFumAe7906Qo0rkX07N27Oi',
    boutique: 'Sabyasachi Inspired',
    boutiqueAddress: 'Opp. Big Bazaar, Gangapur Road, Nashik - 422013',
    boutiquePhone: '+91 98901 77332',
    durationDays: 1,
    startDate: '14 Aug',
    endDate: '15 Aug',
    fulfillmentType: 'delivery',
    deliveryAddress: '12, Prestige Apartments, Gangapur Road, Nashik, Maharashtra 422005',
    paymentMethod: 'upi',
    rentalFee: 2299,
    depositFee: 4500,
    deliveryFee: 150,
    totalAmount: 6949,
    status: 'completed',
    createdAt: 'Aug 12, 11:20 AM',
    customerName: 'Aditya Patil',
    customerPhone: '+91 98220 41234',
    depositRefundAmount: 4500,
    inspectionNotes: 'Returned in pristine condition. Full deposit refunded.',
    timeline: [
      { id: 't1', title: 'Order Confirmed', timestamp: 'Aug 12, 11:20 AM', status: 'completed' },
      { id: 't2', title: 'Delivered to Address', timestamp: 'Aug 14, 09:30 AM', status: 'completed' },
      { id: 't3', title: 'Returned to Boutique', timestamp: 'Aug 15, 05:00 PM', status: 'completed' },
      { id: 't4', title: 'Inspection Passed', timestamp: 'Aug 15, 05:15 PM', status: 'completed' },
      { id: 't5', title: 'Deposit Refunded (₹4,500)', timestamp: 'Aug 15, 05:16 PM', status: 'completed' }
    ]
  }
];

export const INITIAL_CLAIMS: DamageClaim[] = [
  {
    id: 'claim-101',
    orderNumber: '#VL-8610',
    itemTitle: 'Ivory Tuxedo Suit',
    reportedBy: 'Elite Menswear (Owner)',
    issueType: 'Stain',
    claimedAmount: 400,
    status: 'Approved',
    evidenceDescription: 'Small beverage stain on right cuff sleeve. Requires specialized dry cleaning.',
    createdAt: 'Aug 18, 2026'
  }
];
