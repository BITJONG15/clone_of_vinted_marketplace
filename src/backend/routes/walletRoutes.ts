import { Router } from 'express';
import { WalletController } from '../controllers/WalletController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const walletController = new WalletController();

router.post('/buy', authMiddleware, walletController.buyProduct);
router.get('/balance', authMiddleware, walletController.getBalance);
router.get('/history', authMiddleware, walletController.getHistory);

export default router;
