import { Request, Response } from 'express';
import User from '../models/User';
import Course from '../models/Course';
import Enrollment from '../models/Enrollment';
import Order from '../models/Order';

// @desc  Get platform analytics
// @route GET /api/admin/stats
export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalStudents, totalCourses, totalRevenue, activeEnrollments, recentOrders] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Course.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Enrollment.countDocuments(),
      Order.find({ paymentStatus: 'completed' })
        .populate('userId', 'name email')
        .populate('courseId', 'title')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    // Monthly revenue for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const revenueChart = await Order.aggregate([
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
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
  }
};

// @desc  Get all students
// @route GET /api/admin/students
export const getStudents = async (_req: Request, res: Response): Promise<void> => {
  try {
    const students = await User.find({ role: 'student' }).sort({ createdAt: -1 });
    const studentsWithEnrollments = await Promise.all(
      students.map(async (student) => {
        const enrollmentCount = await Enrollment.countDocuments({ userId: student._id });
        return { ...student.toJSON(), enrollmentCount };
      })
    );
    res.json({ success: true, students: studentsWithEnrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch students.' });
  }
};

// @desc  Get all orders
// @route GET /api/admin/orders
export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('courseId', 'title price')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
};
