import { getDb } from '../config/database';
import { Transaction } from '../models/Transaction';

export class TransactionRepository {
  async findByUserId(userId: number): Promise<Transaction[]> {
    const db = await getDb();
    return db.all<Transaction[]>(
      'SELECT * FROM transactions WHERE buyer_id = ? OR seller_id = ? ORDER BY created_at DESC',
      [userId, userId]
    );
  }

  async create(transaction: Omit<Transaction, 'id' | 'created_at' | 'status'>): Promise<number> {
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO transactions (buyer_id, seller_id, product_id, amount) VALUES (?, ?, ?, ?)',
      [transaction.buyer_id, transaction.seller_id, transaction.product_id, transaction.amount]
    );
    return result.lastID!;
  }

  async updateStatus(id: number, status: string): Promise<void> {
    const db = await getDb();
    await db.run('UPDATE transactions SET status = ? WHERE id = ?', [status, id]);
  }
}
