export interface UserPayload {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  work_preference?: 'remote' | 'on-site' | 'hybrid' | null;
  interest_area?: string | null;
}


