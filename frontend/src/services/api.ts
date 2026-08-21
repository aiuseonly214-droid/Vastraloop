import { OutfitItem, RentalOrder, DamageClaim, UserProfile } from '../types';

const API_BASE = '/api/v1';

export class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'API request failed');
    }

    return data.data;
  }

  // Auth APIs
  async login(emailOrPhone: string, password: string): Promise<{ token: string; user: UserProfile }> {
    const res = await this.request<{ token: string; user: UserProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrPhone, password }),
    });
    this.setToken(res.token);
    return res;
  }

  async getMe(): Promise<{ user: UserProfile }> {
    return this.request<{ user: UserProfile }>('/auth/me');
  }

  async verifyAadhaar(aadhaarNumber: string, otp: string): Promise<{ user: UserProfile; verifiedId: boolean }> {
    return this.request<{ user: UserProfile; verifiedId: boolean }>('/auth/verify-id', {
      method: 'POST',
      body: JSON.stringify({ aadhaarNumber, otp }),
    });
  }

  // Outfit APIs
  async getOutfits(params?: {
    search?: string;
    category?: string;
    gender?: string;
    occasion?: string;
    size?: string;
    maxPrice?: number;
    verifiedOnly?: boolean;
  }): Promise<OutfitItem[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category && params.category !== 'All') query.set('category', params.category);
    if (params?.gender && params.gender !== 'All') query.set('gender', params.gender);
    if (params?.occasion && params.occasion !== 'All') query.set('occasion', params.occasion);
    if (params?.size && params.size !== 'All') query.set('size', params.size);
    if (params?.maxPrice) query.set('maxPrice', String(params.maxPrice));
    if (params?.verifiedOnly) query.set('verifiedOnly', 'true');

    const qs = query.toString();
    return this.request<OutfitItem[]>(`/outfits${qs ? `?${qs}` : ''}`);
  }

  async getOutfitById(id: string): Promise<OutfitItem> {
    return this.request<OutfitItem>(`/outfits/${id}`);
  }

  async createOutfit(outfit: Partial<OutfitItem>): Promise<OutfitItem> {
    return this.request<OutfitItem>('/outfits', {
      method: 'POST',
      body: JSON.stringify(outfit),
    });
  }

  // Order APIs
  async createOrder(orderData: {
    outfitId: string;
    durationDays: number;
    startDate: string;
    endDate: string;
    fulfillmentType: 'delivery' | 'pickup';
    deliveryAddress?: string;
    paymentMethod: 'upi' | 'card' | 'cash';
  }): Promise<RentalOrder> {
    return this.request<RentalOrder>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(filter?: 'all' | 'active' | 'completed'): Promise<RentalOrder[]> {
    const qs = filter ? `?filter=${filter}` : '';
    return this.request<RentalOrder[]>(`/orders${qs}`);
  }

  async updateOrderStatus(orderId: string, status: string, note?: string): Promise<RentalOrder> {
    return this.request<RentalOrder>(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
  }

  // Damage Claims
  async getClaims(): Promise<DamageClaim[]> {
    return this.request<DamageClaim[]>('/claims');
  }

  async createClaim(claimData: {
    orderNumber: string;
    itemTitle: string;
    issueType: string;
    claimedAmount: number;
    evidenceDescription: string;
  }): Promise<DamageClaim> {
    return this.request<DamageClaim>('/claims', {
      method: 'POST',
      body: JSON.stringify(claimData),
    });
  }

  async resolveClaim(claimId: string, status: 'Approved' | 'Rejected' | 'Adjusted', resolutionNotes?: string): Promise<DamageClaim> {
    return this.request<DamageClaim>(`/claims/${claimId}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ status, resolutionNotes }),
    });
  }

  // AI Occasion Styling
  async getAIStyling(occasion: string, gender?: string, budget?: number): Promise<{ recommendations: OutfitItem[]; stylingAdvice: string }> {
    return this.request<{ recommendations: OutfitItem[]; stylingAdvice: string }>('/ai/recommend', {
      method: 'POST',
      body: JSON.stringify({ occasion, gender, budget }),
    });
  }
}

export const api = new ApiClient();
