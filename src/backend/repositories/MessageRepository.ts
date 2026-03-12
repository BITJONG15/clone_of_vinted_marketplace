import { getDb } from '../config/database';
import { Message } from '../models/Message';

export class MessageRepository {
  async findByProductId(productId: number): Promise<Message[]> {
    const db = await getDb();
    return db.all<Message[]>('SELECT * FROM messages WHERE product_id = ? ORDER BY created_at ASC', [productId]);
  }

  async create(message: Omit<Message, 'id' | 'created_at'>): Promise<number> {
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO messages (sender_id, receiver_id, product_id, content) VALUES (?, ?, ?, ?)',
      [message.sender_id, message.receiver_id, message.product_id, message.content]
    );
    return result.lastID!;
  }
}
