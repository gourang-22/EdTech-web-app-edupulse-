"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = exports.getStudents = exports.getStats = void 0;
const User_1 = __importDefault(require("../models/User"));
const Course_1 = __importDefault(require("../models/Course"));
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
const Order_1 = __importDefault(require("../models/Order"));
// @desc  Get platform analytics
// @route GET /api/admin/stats
const getStats = async (_req, res) => {
    try {
        const [totalStudents, totalCourses, totalRevenue, activeEnrollments, recentOrders] = await Promise.all([
            User_1.default.countDocuments({ role: 'student' }),
            Course_1.default.countDocuments(),
            Order_1.default.aggregate([
                { $match: { paymentStatus: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            Enrollment_1.default.countDocuments(),
            Order_1.default.find({ paymentStatus: 'completed' })
                .populate('userId', 'name email')
                .populate('courseId', 'title')
                .sort({ createdAt: -1 })
                .limit(10),
        ]);
        // Monthly revenue for chart (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const revenueChart = await Order_1.default.aggregate([
            { $match: { paymentStatus: 'completed', createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
                    revenue: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);
        res.json({
            success: true,
            stats: {
                totalStudents,
                totalCourses,
                totalRevenue: totalRevenue[0]?.total || 0,
                activeEnrollments,
            },
            revenueChart,
            recentOrders,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
    }
};
exports.getStats = getStats;
// @desc  Get all students
// @route GET /api/admin/students
const getStudents = async (_req, res) => {
    try {
        const students = await User_1.default.find({ role: 'student' }).sort({ createdAt: -1 });
        const studentsWithEnrollments = await Promise.all(students.map(async (student) => {
            const enrollmentCount = await Enrollment_1.default.countDocuments({ userId: student._id });
            return { ...student.toJSON(), enrollmentCount };
        }));
        res.json({ success: true, students: studentsWithEnrollments });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch students.' });
    }
};
exports.getStudents = getStudents;
// @desc  Get all orders
// @route GET /api/admin/orders
const getAllOrders = async (_req, res) => {
    try {
        const orders = await Order_1.default.find()
            .populate('userId', 'name email')
            .populate('courseId', 'title price')
            .sort({ createdAt: -1 });
        res.json({ success: true, orders });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
    }
};
exports.getAllOrders = getAllOrders;
//# sourceMappingURL=admin.controller.js.map