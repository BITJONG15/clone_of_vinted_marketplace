import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Transaction {
  id: number;
  buyer_id: number;
  seller_id: number;
  product_id: number;
  amount: number;
  status: 'pending' | 'paid' | 'completed' | 'refunded';
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class WalletService {
  private apiUrl = '/api/wallet';

  constructor(private http: HttpClient) {}

  buyProduct(productId: number) {
    return this.http.post<Transaction>(`${this.apiUrl}/buy`, { productId });
  }

  getBalance() {
    return this.http.get<{ balance: number }>(`${this.apiUrl}/balance`);
  }

  getHistory() {
    return this.http.get<Transaction[]>(`${this.apiUrl}/history`);
  }
}
