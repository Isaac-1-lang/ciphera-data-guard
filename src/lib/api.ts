import { config } from '@/config';

const API_BASE_URL = config.apiUrl;

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  lastLogin: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Build headers conditionally: do NOT set JSON content-type for FormData
    let headers: HeadersInit = options.headers || {};
    const isFormData = options.body instanceof FormData;

    if (!isFormData) {
      headers = {
        'Content-Type': 'application/json',
        ...headers,
      };
    }

    const config: RequestInit = {
      credentials: 'include', // Include cookies for JWT
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const res = await this.request<{ success: boolean; message: string; user: User; token?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return { user: res.user, message: res.message };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const res = await this.request<{ success: boolean; message: string; user: User; token?: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return { user: res.user, message: res.message };
  }

  async logout(): Promise<{ message: string }> {
    const res = await this.request<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' });
    return { message: res.message };
  }

  async getProfile(): Promise<User> {
    const res = await this.request<{ success: boolean; user: User }>('/auth/profile');
    return res.user;
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    const res = await this.request<{ success: boolean; message: string; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return res.user;
  }

  async changePassword(passwords: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    const res = await this.request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwords),
    });
    return { message: res.message };
  }

  // Scan endpoints
  async scanText(content: string): Promise<any> {
    const res = await this.request<{ success: boolean; data: any; message: string }>('/scan/text', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return res.data;
  }

  async scanFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await this.request<{ success: boolean; data: any; message: string }>('/scan/file', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
    return res.data;
  }

  async getScanHistory(page = 1, limit = 10): Promise<{ docs: any[]; totalDocs: number; limit: number; page: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean }> {
    const res = await this.request<{ success: boolean; data: any; message: string }>(`/scan/history?page=${page}&limit=${limit}`);
    return res.data;
  }

  async getScanStats(): Promise<any> {
    const res = await this.request<{ success: boolean; data: any; message: string }>(`/scan/stats`);
    return res.data;
  }

  // Alert endpoints
  async getAlerts(page = 1, limit = 10): Promise<{ docs: any[]; totalDocs: number; limit: number; page: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean }> {
    const res = await this.request<{ success: boolean; data: any; message: string }>(`/alerts?page=${page}&limit=${limit}`);
    return res.data;
  }

  async getAlertStats(): Promise<any> {
    const res = await this.request<{ success: boolean; data: any; message: string }>(`/alerts/stats`);
    return res.data;
  }

  async updateAlert(alertId: string, updates: any): Promise<any> {
    const res = await this.request<{ success: boolean; data: any; message: string }>(`/alerts/${alertId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return res.data;
  }

  async resolveAlert(alertId: string): Promise<any> {
    const res = await this.request<{ success: boolean; data: any; message: string }>(`/alerts/${alertId}/resolve`, {
      method: 'POST',
    });
    return res.data;
  }

  async snoozeAlert(alertId: string, duration: number): Promise<any> {
    const res = await this.request<{ success: boolean; data: any; message: string }>(`/alerts/${alertId}/snooze`, {
      method: 'POST',
      body: JSON.stringify({ duration }),
    });
    return res.data;
  }

  async deleteAlert(alertId: string): Promise<{ message: string }> {
    const res = await this.request<{ success: boolean; message: string }>(`/alerts/${alertId}`, {
      method: 'DELETE',
    });
    return { message: res.message };
  }

  async acknowledgeAllAlerts(): Promise<{ acknowledgedCount: number }> {
    const res = await this.request<{ success: boolean; data: { acknowledgedCount: number }; message: string }>(`/alerts/acknowledge-all`, {
      method: 'POST',
    });
    return res.data;
  }

  // Dashboard endpoints
  async getDashboardData(): Promise<any> {
    const res = await this.request<{ success: boolean; data: any; message: string }>(`/dashboard/data`);
    return res.data;
  }

  async getAnalytics(params?: { type?: string; period?: string }): Promise<any> {
    const search = new URLSearchParams();
    if (params?.type) search.set('type', params.type);
    if (params?.period) search.set('period', params.period);
    const path = `/dashboard/analytics${search.toString() ? `?${search.toString()}` : ''}`;
    const res = await this.request<{ success: boolean; data: any; message: string }>(path);
    return res.data;
  }
}

export const apiService = new ApiService();
