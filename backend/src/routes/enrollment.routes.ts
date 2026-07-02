import { Router } from 'express';
import { getMyCourses, getEnrollment, completeLesson, checkEnrollment } from '../controllers/enrollment.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/my-courses', protect, getMyCourses);
router.get('/check/:courseId', protect, checkEnrollment);
router.get('/:enrollmentId', protect, getEnrollment);
router.put('/:enrollmentId/complete-lesson', protect, completeLesson);

export default router;
