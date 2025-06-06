export interface Artifact {
  id: string;
  title: string;
  description: string;
  dateFound: string;
  period: string;
  location: {
    site: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  dimensions: {
    height: number;
    width: number;
    depth: number;
    unit: 'cm' | 'mm' | 'm';
  };
  weight: {
    value: number;
    unit: 'g' | 'kg';
  };
  material: string[];
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  conservation: {
    status: 'Not Required' | 'Pending' | 'In Progress' | 'Completed';
    notes?: string;
    lastChecked?: string;
  };
  storage: {
    location: string;
    container: string;
    position: string;
  };
  images: {
    url: string;
    type: 'primary' | 'detail' | 'conservation' | 'other';
    caption?: string;
  }[];
  category: string[];
  tags: string[];
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  featured: boolean;
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    lastModifiedBy: string;
  };
} 