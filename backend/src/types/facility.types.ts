export interface Facility {
  id: number;
  owner_id: number;
  name: string;
  type: string;
  description: string | null;
  city: string | null;
  address: string | null;
  hourly_rate: number;
  is_active: boolean;
  created_at: Date;
}

export interface CreateFacilityDTO {
  name: string;
  type: string;
  description?: string;
  city?: string;
  address?: string;
  hourlyRate: number;
}

export interface UpdateFacilityDTO {
  name?: string;
  type?: string;
  description?: string;
  city?: string;
  address?: string;
  hourlyRate?: number;
  isActive?: boolean;
}

export interface FacilityQuery {
  city?: string;
  type?: string;
  maxPrice?: number;
  minPrice?: number;
  search?: string;
}
