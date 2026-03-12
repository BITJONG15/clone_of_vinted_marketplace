export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  avatar?: string;
  wallet_balance: number;
  created_at: string;
}
