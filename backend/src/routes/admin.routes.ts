import { Router } from 'express';
import { getStats, getStudents, getAllOrders } from '../controllers/admin.controller';
import { protect } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/admin.middleware';

const router = Router();

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/students', getStudents);
router.get('/orders', getAllOrders);

export default router;
