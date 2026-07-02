import { Router } from 'express';
import { getLessonsByModule, getLesson, createLesson, updateLesson, deleteLesson } from '../controllers/lesson.controller';
import { protect } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/admin.middleware';

const router = Router();

router.get('/module/:moduleId', protect, getLessonsByModule);
router.get('/:id', protect, getLesson);
router.post('/', protect, adminOnly, createLesson);
router.put('/:id', protect, adminOnly, updateLesson);
router.delete('/:id', protect, adminOnly, deleteLesson);

export default router;
