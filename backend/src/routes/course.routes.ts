import { Router } from 'express';
import {
  getCourses, getCourse, createCourse, updateCourse, deleteCourse, getAllCoursesAdmin,
} from '../controllers/course.controller';
import { protect } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/admin.middleware';

const router = Router();

router.get('/', getCourses);
router.get('/admin/all', protect, adminOnly, getAllCoursesAdmin);
router.get('/:id', getCourse);
router.post('/', protect, adminOnly, createCourse);
router.put('/:id', protect, adminOnly, updateCourse);
router.delete('/:id', protect, adminOnly, deleteCourse);

export default router;
