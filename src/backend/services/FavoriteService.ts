import { FavoriteRepository } from '../repositories/FavoriteRepository';
import { Favorite } from '../models/Favorite';

export class FavoriteService {
  private favoriteRepository = new FavoriteRepository();

  async getFavorites(userId: number): Promise<Favorite[]> {
    return this.favoriteRepository.findByUserId(userId);
  }

  async addFavorite(userId: number, productId: number): Promise<Favorite> {
    const id = await this.favoriteRepository.create(userId, productId);
    const favorites = await this.favoriteRepository.findByUserId(userId);
    return favorites.find(f => f.id === id)!;
  }

  async removeFavorite(userId: number, productId: number): Promise<void> {
    await this.favoriteRepository.delete(userId, productId);
  }
}
