import { Router } from 'express';
import { getMessages, sendMessage } from '../controllers/messageController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = Router();


router.use(auth);

router.post('/send/:id', sendMessage)
router.get('/all/:id', getMessages)


export default router;