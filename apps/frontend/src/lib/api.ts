import axios from 'axios';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface Asset {
  name: string;
  gpsId: string;
  type: string;
//   [key: string]: any; // Add additional properties as needed
}

// Configure Axios globally
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Ensures cookies are sent with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Auth endpoints
  signup: async (email: string, password: string) => {
    const { data } = await apiClient.post('/auth/signup', { email, password });
    return data;
  },

  login: async (email: string, password: string) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },

  logout: async () => {
    const { data } = await apiClient.post('/auth/logout');
    return data;
  },

  // User profile endpoints
  updateProfile: async (profileData: Partial<UserProfile>) => {
    const { data } = await apiClient.put('/user/profile', profileData);
    return data;
  },

  getProfile: async () => {
    const { data } = await apiClient.get('/user/profile');
    return data;
  },

  // Asset endpoints
  getAssets: async () => {
    const { data } = await apiClient.get('/assets');
    return data;
  },

  getAsset: async (gpsId: string) => {
    const { data } = await apiClient.get(`/assets/${gpsId}`);
    return data;
  },

  createAsset: async (assetData: { name: string; gpsId: string; type: string }) => {
    const { data } = await apiClient.post('/assets', assetData);
    return data;
  },

  updateAsset: async (id: string, assetData: Partial<Asset>) => {
    const { data } = await apiClient.patch(`/assets/${id}`, assetData);
    return data;
  },

  deleteAsset: async (id: string) => {
    const { data } = await apiClient.delete(`/assets/${id}`);
    return data;
  },

  updateAssetLocation: async (locationData: { gpsId: string; latitude: number; longitude: number }) => {
    const { data } = await apiClient.patch('/assets/location', locationData);
    return data;
  },

  // GPS endpoints
  submitGpsApplication: async (formData: { name: string; email: string; phone: string; address: string; vehicleCount: string }) => {
    const { data } = await apiClient.post('/gps/apply', formData);
    return data;
  },

  verifyGpsDevice: async (gpsId: string, plateNumber: string) => {
    const { data } = await apiClient.post('/gps/verify', { gpsId, plateNumber });
    return data;
  },

  createGpsEntry: async () => {
    const delhiGpsEntry = {
      gpsId: 'GP_NO_01012345',
      location: {
        latitude: 28.6139, // Delhi's coordinates
        longitude: 77.2090,
        timestamp: new Date().toISOString(),
      },
      status: 'active',
    };

    const { data } = await apiClient.post('/gps/create', delhiGpsEntry);
    return data;
  },

  validateGpsId: async (gpsId: string) => {
    const { data } = await apiClient.get(`/gps/validate/${gpsId}`);
    return data;
  },

  // Location tracking
  getVehicleLocation: async (vehicleId: string) => {
    const { data } = await apiClient.get(`/location/${vehicleId}`);
    return data;
  },

  getVehicleHistory: async (vehicleId: string, startDate: string, endDate: string) => {
    const { data } = await apiClient.get(`/location/${vehicleId}/history`, {
      params: { start: startDate, end: endDate },
    });
    return data;
  },
};
