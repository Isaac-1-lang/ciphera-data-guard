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
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for JWT
      ...options,
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
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile(): Promise<User> {
    return this.request<User>('/auth/profile');
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    return this.request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwords: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwords),
    });
  }

  // Scan endpoints
  async scanText(content: string): Promise<any> {
    return this.request('/scan/text', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async scanFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request('/scan/file', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  async getScanHistory(page = 1, limit = 10): Promise<any> {
    return this.request(`/scan/history?page=${page}&limit=${limit}`);
  }

  async getScanStats(): Promise<any> {
    return this.request('/scan/stats');
  }

  // Alert endpoints
  async getAlerts(page = 1, limit = 10): Promise<any> {
    return this.request(`/alerts?page=${page}&limit=${limit}`);
  }

  async getAlertStats(): Promise<any> {
    return this.request('/alerts/stats');
  }

  async updateAlert(alertId: string, updates: any): Promise<any> {
    return this.request(`/alerts/${alertId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async resolveAlert(alertId: string): Promise<any> {
    return this.request(`/alerts/${alertId}/resolve`, {
      method: 'POST',
    });
  }

  async snoozeAlert(alertId: string, duration: number): Promise<any> {
    return this.request(`/alerts/${alertId}/snooze`, {
      method: 'POST',
      body: JSON.stringify({ duration }),
    });
  }

  // Dashboard endpoints
  async getDashboardData(): Promise<any> {
    return this.request('/dashboard/data');
  }

  async getAnalytics(): Promise<any> {
    return this.request('/dashboard/analytics');
  }
}

export const apiService = new ApiService();
