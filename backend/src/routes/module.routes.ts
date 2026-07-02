import { Router } from 'express';
import { getModulesByCourse, createModule, updateModule, deleteModule } from '../controllers/module.controller';
import { protect } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/admin.middleware';

const router = Router();

router.get('/course/:courseId', protect, getModulesByCourse);
router.post('/', protect, adminOnly, createModule);
router.put('/:id', protect, adminOnly, updateModule);
router.delete('/:id', protect, adminOnly, deleteModule);

export default router;
