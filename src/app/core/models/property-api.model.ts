export interface ImageRef {
  id: number;
  filename: string;
  original_name: string;
}

export interface ImageRead {
  id: number;
  filename: string;
  original_name: string;
  listing_id: number | null;
  project_id: number | null;
  user_listing_id: number | null;
  created_at: string;
}

export interface ListingCreate {
  project_id?: number | null;
  property_name: string;
  property_type?: string | null;
  bhk?: string | null;
  price?: string | null;
  price_value?: number | null;
  price_per_sqft?: string | null;
  carpet_area?: string | null;
  builtup_area?: string | null;
  status?: string | null;
  possession_date?: string | null;
  rera_number?: string | null;
  locality_id?: number | null;
  locality_name?: string | null;
  description?: string | null;
  image_ids?: number[];
}

export interface ListingRead {
  id: number;
  property_id?: string;
  project_id?: number | null;
  builder_id?: number | null;
  property_name: string;
  property_type?: string | null;
  bhk?: string | null;
  price?: string | null;
  price_value?: number | null;
  price_per_sqft?: string | null;
  carpet_area?: string | null;
  builtup_area?: string | null;
  status?: string | null;
  possession_date?: string | null;
  rera_number?: string | null;
  locality_id?: number | null;
  description?: string | null;
  images?: ImageRef[] | null;
  created_at: string;
}

export type ListingUpdate = Partial<ListingCreate>;

export interface ProjectCreate {
  project_name: string;
  rera_number?: string | null;
  status?: string | null;
  address?: string | null;
  city?: string | null;
  locality?: string | null;
  lat?: number | null;
  lon?: number | null;
  total_area?: string | null;
  total_towers?: string | null;
  total_floors?: string | null;
  total_units?: string | null;
  brochure?: string | null;
  construction_progress?: string | null;
  image_ids?: number[];
}

export interface ProjectRead {
  id: number;
  builder_id?: number | null;
  project_name: string;
  rera_number?: string | null;
  status?: string | null;
  address?: string | null;
  city?: string | null;
  locality?: string | null;
  lat?: number | null;
  lon?: number | null;
  total_area?: string | null;
  total_towers?: string | null;
  total_floors?: string | null;
  total_units?: string | null;
  brochure?: string | null;
  construction_progress?: string | null;
  images?: ImageRef[] | null;
  created_at: string;
}

export type ProjectUpdate = Partial<ProjectCreate>;

export interface UserListingCreate {
  property_name: string;
  property_type?: string | null;
  bhk?: string | null;
  price?: string | null;
  price_value?: number | null;
  carpet_area?: string | null;
  builtup_area?: string | null;
  address?: string | null;
  city?: string | null;
  locality_id?: number | null;
  locality_name?: string | null;
  status?: string | null;
  possession_date?: string | null;
  description?: string | null;
  image_ids?: number[];
}

export interface UserListingRead {
  id: number;
  user_id?: number | null;
  property_name: string;
  property_type?: string | null;
  bhk?: string | null;
  price?: string | null;
  price_value?: number | null;
  carpet_area?: string | null;
  builtup_area?: string | null;
  address?: string | null;
  city?: string | null;
  locality_id?: number | null;
  status?: string | null;
  possession_date?: string | null;
  description?: string | null;
  images?: ImageRef[] | null;
  created_at: string;
}

export type UserListingUpdate = Partial<UserListingCreate>;
