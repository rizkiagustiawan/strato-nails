const API_BASE = '/api';

export interface Booking {
  id: number;
  booking_id: string;
  name: string;
  contact: string;
  date: string;
  time: string;
  treatment: string;
  budget: string | null;
  payment_method: string;
  photo_url?: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
  whatsapp_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookingStats {
  total_bookings: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  today: number;
  this_week: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
  };
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const token = this.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options?.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Bookings
  async getBookings(params?: { status?: string; limit?: number; offset?: number }): Promise<ApiResponse<Booking[]>> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    
    const query = searchParams.toString();
    return this.fetch(`/bookings${query ? `?${query}` : ''}`);
  }

  async getBooking(id: string): Promise<ApiResponse<Booking>> {
    return this.fetch(`/bookings/${id}`);
  }

  async createBooking(data: {
    name: string;
    contact: string;
    date: string;
    time: string;
    treatment: string;
    budget?: string;
    payment_method?: string;
    photo_url?: string | null;
  }): Promise<ApiResponse<Booking>> {
    return this.fetch('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBooking(id: string, data: { status?: string; notes?: string }): Promise<ApiResponse<Booking>> {
    return this.fetch(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBooking(id: string): Promise<ApiResponse<void>> {
    return this.fetch(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  // AI Analysis
  async analyzeImage(base64Image: string): Promise<ApiResponse<{ category: string }>> {
    return this.fetch('/analyze', {
      method: 'POST',
      body: JSON.stringify({ image: base64Image }),
    });
  }

  // Stats
  async getStats(): Promise<ApiResponse<{
    stats: BookingStats;
    recentBookings: Booking[];
    popularTreatments: { treatment: string; count: number }[];
  }>> {
    return this.fetch('/stats');
  }
}

export const api = new ApiService();
