import { Router } from 'express';
import { FavoriteController } from '../controllers/FavoriteController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const favoriteController = new FavoriteController();

router.get('/', authMiddleware, favoriteController.getFavorites);
router.post('/', authMiddleware, favoriteController.addFavorite);
router.delete('/:id', authMiddleware, favoriteController.removeFavorite);

export default router;
