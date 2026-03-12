export interface Transaction {
  id: number;
  buyer_id: number;
  seller_id: number;
  product_id: number;
  amount: number;
  status: 'pending' | 'paid' | 'completed' | 'refunded';
  created_at: string;
}
