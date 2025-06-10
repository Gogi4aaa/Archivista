export interface Artifact {
  Id: string;
  Name: string;
  Description?: string;
  DiscoveryDate: string;
  DiscoveryLocation: string;
  Period?: string;
  Type?: string;
  Material?: string;
  Weight?: number;
  Height?: number;
  Width?: number;
  Length?: number;
  StorageLocation?: string;
  CreatorId: string;
  CreatedAt: string;
  UpdatedAt?: string;
  ImageUrl?: string | null;
} 