import { Router } from 'express';
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPosts, getPostComments, getUserPost, likePost } from '../controllers/postController.js';
import { auth } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multerMiddleware.js';

const router = Router();


router.use(auth);

router.post('/addPost',upload.single('image'), addNewPost);
router.get('/all',getAllPosts);
router.get('/userpost/all',getUserPost);
router.post('/:id/like',likePost);
router.post('/:id/dislike',dislikePost);
router.post('/:id/comment',addComment);
router.get('/:id/comment/all',getPostComments);
router.delete('/delete/:id',deletePost);
router.get('/:id/bookmark',bookmarkPost);







export default router;