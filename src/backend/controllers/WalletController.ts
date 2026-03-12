import { Request, Response, NextFunction } from 'express';
import { WalletService } from '../services/WalletService';
import { AuthRequest } from '../middleware/authMiddleware';

export class WalletController {
  private walletService = new WalletService();

  buyProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const transaction = await this.walletService.buyProduct(req.user.id, Number(req.body.productId));
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  getBalance = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const balance = await this.walletService.getBalance(req.user.id);
      res.json({ balance });
    } catch (error: any) {
      next(error);
    }
  };

  getHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const history = await this.walletService.getHistory(req.user.id);
      res.json(history);
    } catch (error: any) {
      next(error);
    }
  };
}
