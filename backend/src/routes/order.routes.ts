import { Router } from 'express';
import { createOrder, verifyPayment, getMyOrders } from '../controllers/order.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/create', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/my-orders', protect, getMyOrders);

export default router;
