import { getDb } from '../config/database';
import { Product } from '../models/Product';

export class ProductRepository {
  async findAll(): Promise<Product[]> {
    const db = await getDb();
    return db.all<Product[]>('SELECT * FROM products ORDER BY created_at DESC');
  }

  async findById(id: number): Promise<Product | undefined> {
    const db = await getDb();
    return db.get<Product>('SELECT * FROM products WHERE id = ?', [id]);
  }

  async create(product: Omit<Product, 'id' | 'created_at' | 'status'>): Promise<number> {
    const db = await getDb();
    const result = await db.run(
      `INSERT INTO products (title, description, price, image_url, category, brand, size, condition, seller_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.title, product.description, product.price, product.image_url,
        product.category, product.brand, product.size, product.condition, product.seller_id
      ]
    );
    return result.lastID!;
  }

  async update(id: number, product: Partial<Product>): Promise<void> {
    const db = await getDb();
    const keys = Object.keys(product).filter(k => k !== 'id' && k !== 'created_at');
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => (product as any)[k]);
    
    if (keys.length > 0) {
      await db.run(`UPDATE products SET ${setClause} WHERE id = ?`, [...values, id]);
    }
  }

  async delete(id: number): Promise<void> {
    const db = await getDb();
    await db.run('DELETE FROM products WHERE id = ?', [id]);
  }

  async updateStatus(id: number, status: string): Promise<void> {
    const db = await getDb();
    await db.run('UPDATE products SET status = ? WHERE id = ?', [status, id]);
  }
}
