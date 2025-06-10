import axios from 'axios';
import { Artifact } from '../types/Artifact';
import { authService } from './authService';

const API_URL = 'http://localhost:5075/api'; // adjust this to match your API URL

export interface CreateArtifactDto {
  Name: string;
  Description?: string;
  DiscoveryLocation: string;
  Period?: string;
  Type?: string;
  Material?: string;
  Weight?: number;
  Height?: number;
  Width?: number;
  Length?: number;
  StorageLocation?: string;
  image?: File;
}

export type { Artifact };

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const artifactService = {
  getAllArtifacts: async (): Promise<Artifact[]> => {
    try {
      const response = await api.get('/artifact');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Handle unauthorized error
        throw new Error('Please login to view artifacts');
      }
      throw new Error('Failed to fetch artifacts');
    }
  },

  createArtifact: async (artifact: CreateArtifactDto): Promise<Artifact> => {
    try {
      const formData = new FormData();
      
      // Add all fields to FormData
      Object.entries(artifact).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (key === 'location') {
          // Handle location object
          formData.append('location.site', value.site);
          if (value.coordinates) {
            formData.append('location.coordinates.latitude', String(value.coordinates.latitude));
            formData.append('location.coordinates.longitude', String(value.coordinates.longitude));
          }
        } else if (key === 'category' && Array.isArray(value)) {
          // Handle category array
          value.forEach((cat, index) => {
            formData.append(`category[${index}]`, cat);
          });
        } else if (value !== undefined && value !== null) {
          // Only append if value is not undefined or null
          formData.append(key, String(value));
        }
      });

      const response = await api.post('/artifact', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Please login to create artifacts');
      }
      throw new Error('Failed to create artifact');
    }
  }
}; 