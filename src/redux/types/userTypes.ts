export interface IInitialUserState {
  status: string;
  error: string | undefined;
  userData: any;
}

export interface IUser {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}
