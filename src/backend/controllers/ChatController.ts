import { Request, Response, NextFunction } from 'express';
import { ChatService } from '../services/ChatService';
import { AuthRequest } from '../middleware/authMiddleware';

export class ChatController {
  private chatService = new ChatService();

  getMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const messages = await this.chatService.getMessagesForProduct(Number(req.params.productId));
      res.json(messages);
    } catch (error: any) {
      next(error);
    }
  };

  sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const messageData = {
        ...req.body,
        sender_id: req.user.id
      };
      const message = await this.chatService.sendMessage(messageData);
      res.status(201).json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
