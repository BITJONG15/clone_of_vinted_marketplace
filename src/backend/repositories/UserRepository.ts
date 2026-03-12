import { getDb } from '../config/database';
import { User } from '../models/User';

export class UserRepository {
  async findByEmail(email: string): Promise<User | undefined> {
    const db = await getDb();
    return db.get<User>('SELECT * FROM users WHERE email = ?', [email]);
  }

  async findById(id: number): Promise<User | undefined> {
    const db = await getDb();
    return db.get<User>('SELECT * FROM users WHERE id = ?', [id]);
  }

  async create(user: Omit<User, 'id' | 'created_at' | 'wallet_balance'>): Promise<number> {
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO users (username, email, password_hash, avatar) VALUES (?, ?, ?, ?)',
      [user.username, user.email, user.password_hash, user.avatar || null]
    );
    return result.lastID!;
  }

  async updateWallet(id: number, amount: number): Promise<void> {
    const db = await getDb();
    await db.run('UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?', [amount, id]);
  }
}
