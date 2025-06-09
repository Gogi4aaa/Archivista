import axios from 'axios';
import { Artifact } from '../types/Artifact';

const API_URL = 'http://localhost:5075/api'; // adjust this to match your API URL

export interface CreateArtifactDto {
  title: string;
  description: string;
  period?: string;
  location: {
    site: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  category: string[];
  image?: File;
}

export type { Artifact };

export const artifactService = {
  getAllArtifacts: async (): Promise<Artifact[]> => {
    const response = await axios.get(`${API_URL}/artifact`);
    console.log("DATA: ", response.data);
    return response.data;
  },

  createArtifact: async (artifact: CreateArtifactDto): Promise<Artifact> => {
    const formData = new FormData();
    Object.entries(artifact).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        formData.append('image', value);
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    const response = await axios.post(`${API_URL}/artifact`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}; 