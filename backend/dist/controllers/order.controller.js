"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyOrders = exports.verifyPayment = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
const Course_1 = __importDefault(require("../models/Course"));
// @desc  Create Mock payment order
// @route POST /api/orders/create
const createOrder = async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course_1.default.findById(courseId);
        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found.' });
            return;
        }
        // Check if already enrolled
        const existing = await Enrollment_1.default.findOne({ userId: req.user._id, courseId });
        if (existing) {
            res.status(400).json({ success: false, message: 'Already enrolled in this course.' });
            return;
        }
        // Free course — direct enrollment
        if (course.price === 0) {
            const enrollment = await Enrollment_1.default.create({ userId: req.user._id, courseId });
            await Course_1.default.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } });
            const order = await Order_1.default.create({
                userId: req.user._id,
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
        const order = await Order_1.default.create({
            userId: req.user._id,
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create order.' });
    }
};
exports.createOrder = createOrder;
// @desc  Verify mock payment + create enrollment
// @route POST /api/orders/verify
const verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, orderId } = req.body;
        // Accept mock payment verification
        const order = await Order_1.default.findByIdAndUpdate(orderId, { paymentStatus: 'completed', transactionId: razorpayPaymentId || `mock_txn_${Date.now()}` }, { new: true });
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found.' });
            return;
        }
        const enrollment = await Enrollment_1.default.create({ userId: req.user._id, courseId: order.courseId });
        await Course_1.default.findByIdAndUpdate(order.courseId, { $inc: { totalStudents: 1 } });
        res.json({ success: true, enrollment, order });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Payment verification failed.' });
    }
};
exports.verifyPayment = verifyPayment;
// @desc  Get my orders
// @route GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.find({ userId: req.user._id })
            .populate('courseId', 'title thumbnail instructor')
            .sort({ createdAt: -1 });
        res.json({ success: true, orders });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
    }
};
exports.getMyOrders = getMyOrders;
//# sourceMappingURL=order.controller.js.map