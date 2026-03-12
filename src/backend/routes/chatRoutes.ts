import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const chatController = new ChatController();

router.get('/:productId', authMiddleware, chatController.getMessages);
router.post('/', authMiddleware, chatController.sendMessage);

export default router;
