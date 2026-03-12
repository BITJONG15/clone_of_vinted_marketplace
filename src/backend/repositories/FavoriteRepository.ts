import { getDb } from '../config/database';
import { Favorite } from '../models/Favorite';

export class FavoriteRepository {
  async findByUserId(userId: number): Promise<Favorite[]> {
    const db = await getDb();
    return db.all<Favorite[]>('SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  }

  async create(userId: number, productId: number): Promise<number> {
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)',
      [userId, productId]
    );
    return result.lastID!;
  }

  async delete(userId: number, productId: number): Promise<void> {
    const db = await getDb();
    await db.run('DELETE FROM favorites WHERE user_id = ? AND product_id = ?', [userId, productId]);
  }
}
