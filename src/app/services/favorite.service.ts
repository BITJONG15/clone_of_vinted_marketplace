import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Favorite {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private apiUrl = '/api/favorites';

  constructor(private http: HttpClient) {}

  getFavorites() {
    return this.http.get<Favorite[]>(this.apiUrl);
  }

  addFavorite(productId: number) {
    return this.http.post<Favorite>(this.apiUrl, { productId });
  }

  removeFavorite(productId: number) {
    return this.http.delete(`${this.apiUrl}/${productId}`);
  }
}
