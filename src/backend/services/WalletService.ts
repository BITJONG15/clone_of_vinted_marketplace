import { TransactionRepository } from '../repositories/TransactionRepository';
import { UserRepository } from '../repositories/UserRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { Transaction } from '../models/Transaction';

export class WalletService {
  private transactionRepository = new TransactionRepository();
  private userRepository = new UserRepository();
  private productRepository = new ProductRepository();

  async buyProduct(buyerId: number, productId: number): Promise<Transaction> {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new Error('Product not found');
    if (product.status !== 'available') throw new Error('Product is not available');
    if (product.seller_id === buyerId) throw new Error('Cannot buy your own product');

    const buyer = await this.userRepository.findById(buyerId);
    if (!buyer) throw new Error('Buyer not found');
    if (buyer.wallet_balance < product.price) throw new Error('Insufficient funds');

    // Deduct from buyer
    await this.userRepository.updateWallet(buyerId, -product.price);
    // Add to seller
    await this.userRepository.updateWallet(product.seller_id, product.price);
    // Update product status
    await this.productRepository.updateStatus(productId, 'sold');

    // Create transaction
    const transactionId = await this.transactionRepository.create({
      buyer_id: buyerId,
      seller_id: product.seller_id,
      product_id: productId,
      amount: product.price
    });
    
    await this.transactionRepository.updateStatus(transactionId, 'completed');

    const transactions = await this.transactionRepository.findByUserId(buyerId);
    return transactions.find(t => t.id === transactionId)!;
  }

  async getBalance(userId: number): Promise<number> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    return user.wallet_balance;
  }

  async getHistory(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.findByUserId(userId);
  }
}
