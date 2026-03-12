import { ProductRepository } from '../repositories/ProductRepository';
import { Product } from '../models/Product';

export class ProductService {
  private productRepository = new ProductRepository();

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.productRepository.findById(id);
  }

  async createProduct(data: Omit<Product, 'id' | 'created_at' | 'status'>): Promise<Product> {
    const id = await this.productRepository.create(data);
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error('Product not created');
    return product;
  }

  async updateProduct(id: number, userId: number, data: Partial<Product>): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error('Product not found');
    if (product.seller_id !== userId) throw new Error('Unauthorized');

    await this.productRepository.update(id, data);
    return (await this.productRepository.findById(id))!;
  }

  async deleteProduct(id: number, userId: number): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error('Product not found');
    if (product.seller_id !== userId) throw new Error('Unauthorized');

    await this.productRepository.delete(id);
  }
}
