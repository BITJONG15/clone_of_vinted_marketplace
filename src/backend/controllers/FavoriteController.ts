import { Request, Response, NextFunction } from 'express';
import { FavoriteService } from '../services/FavoriteService';
import { AuthRequest } from '../middleware/authMiddleware';

export class FavoriteController {
  private favoriteService = new FavoriteService();

  getFavorites = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const favorites = await this.favoriteService.getFavorites(req.user.id);
      res.json(favorites);
    } catch (error: any) {
      next(error);
    }
  };

  addFavorite = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const favorite = await this.favoriteService.addFavorite(req.user.id, Number(req.body.productId));
      res.status(201).json(favorite);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  removeFavorite = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      await this.favoriteService.removeFavorite(req.user.id, Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
