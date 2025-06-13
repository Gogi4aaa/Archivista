export interface Artifact {
  id: string;
  name: string;
  description?: string;
  discoveryDate: string;
  discoveryLocation: string;
  period?: string;
  type?: string;
  material?: string;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  storageLocation?: string;
  creatorId: string;
  createdAt: string;
  updatedAt?: string;
  imageUrl?: string | null;
  loadedImageUrl?: string; // URL for already loaded image blob
}   