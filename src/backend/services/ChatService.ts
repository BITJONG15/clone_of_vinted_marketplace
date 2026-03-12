import { MessageRepository } from '../repositories/MessageRepository';
import { Message } from '../models/Message';

export class ChatService {
  private messageRepository = new MessageRepository();

  async getMessagesForProduct(productId: number): Promise<Message[]> {
    return this.messageRepository.findByProductId(productId);
  }

  async sendMessage(data: Omit<Message, 'id' | 'created_at'>): Promise<Message> {
    const id = await this.messageRepository.create(data);
    const messages = await this.messageRepository.findByProductId(data.product_id);
    return messages.find(m => m.id === id)!;
  }
}
