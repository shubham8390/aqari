export type UserType = 'regular' | 'builder';

export interface UserRead {
  id: number;
  email: string;
  user_type: UserType;
  name: string | null;
  phone: string | null;
  profile_complete: boolean;
  requirement: string | null;
  min_budget: number | null;
  max_budget: number | null;
  property_preference: string | null;
  configuration: string | null;
  preferred_areas: string | null;
  company_name: string | null;
  website: string | null;
  builder_description: string | null;
  created_at: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  user_type: UserType;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserRead;
}
