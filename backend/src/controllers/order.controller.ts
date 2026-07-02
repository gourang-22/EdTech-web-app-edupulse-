import { Response } from 'express';
import Order from '../models/Order';
import Enrollment from '../models/Enrollment';
import Course from '../models/Course';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc  Create Mock payment order
// @route POST /api/orders/create
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) { res.status(404).json({ success: false, message: 'Course not found.' }); return; }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ userId: req.user!._id, courseId });
    if (existing) { res.status(400).json({ success: false, message: 'Already enrolled in this course.' }); return; }

    // Free course — direct enrollment
    if (course.price === 0) {
      const enrollment = await Enrollment.create({ userId: req.user!._id, courseId });
      await Course.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } });
      const order = await Order.create({
        userId: req.user!._id,
        courseId,
        amount: 0,
        paymentStatus: 'completed',
        paymentGateway: 'free',
      });
      res.json({ success: true, free: true, enrollment, order });
      return;
    }

    // Paid course — create mock order
    const mockRazorpayOrderId = `mock_order_${Date.now()}`;
    const order = await Order.create({
      userId: req.user!._id,
      courseId,
      amount: course.price,
      paymentStatus: 'pending',
      paymentGateway: 'mock',
      razorpayOrderId: mockRazorpayOrderId,
    });

    res.json({
      success: true,
      order,
      razorpayOrder: { id: mockRazorpayOrderId, amount: course.price * 100, currency: 'INR' },
      course: { title: course.title, thumbnail: course.thumbnail },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create order.' });
  }
};

// @desc  Verify mock payment + create enrollment
// @route POST /api/orders/verify
export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { razorpayOrderId, razorpayPaymentId, orderId } = req.body;
    
    // Accept mock payment verification
    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: 'completed', transactionId: razorpayPaymentId || `mock_txn_${Date.now()}` },
      { new: true }
    );
    if (!order) { res.status(404).json({ success: false, message: 'Order not found.' }); return; }

    const enrollment = await Enrollment.create({ userId: req.user!._id, courseId: order.courseId });
    await Course.findByIdAndUpdate(order.courseId, { $inc: { totalStudents: 1 } });

    res.json({ success: true, enrollment, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment verification failed.' });
  }
};

// @desc  Get my orders
// @route GET /api/orders/my-orders
export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ userId: req.user!._id })
      .populate('courseId', 'title thumbnail instructor')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
};
