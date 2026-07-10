export interface UserRead {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  picture?: string | null;
  profile_complete: boolean;
  created_at: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserRead;
}

export type AuthProvider = 'password' | 'google';

