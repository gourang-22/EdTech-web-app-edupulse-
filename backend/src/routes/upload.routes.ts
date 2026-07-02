import { Router } from 'express';
import { uploadImage, uploadVideo, uploadResource, upload } from '../controllers/upload.controller';
import { protect } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/admin.middleware';

const router = Router();

router.post('/image', protect, adminOnly, upload.single('file'), uploadImage);
router.post('/video', protect, adminOnly, upload.single('file'), uploadVideo);
router.post('/resource', protect, adminOnly, upload.single('file'), uploadResource);

export default router;
