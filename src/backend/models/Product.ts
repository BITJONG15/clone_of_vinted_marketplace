export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  brand: string;
  size: string;
  condition: string;
  seller_id: number;
  status: 'available' | 'reserved' | 'sold';
  created_at: string;
}
