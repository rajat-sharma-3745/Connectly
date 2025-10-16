import { Router } from 'express'
import { editProfile, followOrUnfollow, getProfile, getSuggestedUser, getUser, login, logout, register } from '../controllers/userController.js';
import { auth } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multerMiddleware.js';

const router = Router();


router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.use(auth);
router.get('/profile', getUser)
router.get('/:id/profile', getProfile)
router.post('/profile/edit', upload.single('profilePicture'), editProfile);
router.get('/suggested',  getSuggestedUser)
router.post('/followOrUnfollow/:id',followOrUnfollow)





export default router;