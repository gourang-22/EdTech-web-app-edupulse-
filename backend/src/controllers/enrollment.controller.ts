import { Response } from 'express';
import Enrollment from '../models/Enrollment';
import Lesson from '../models/Lesson';
import Module from '../models/Module';
import Course from '../models/Course';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc  Get my enrollments
// @route GET /api/enrollments/my-courses
export const getMyCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user!._id })
      .populate('courseId')
      .sort({ purchasedAt: -1 });
    res.json({ success: true, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch enrollments.' });
  }
};

// @desc  Get single enrollment + curriculum
// @route GET /api/enrollments/:enrollmentId
export const getEnrollment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      userId: req.user!._id,
    }).populate('courseId');

    if (!enrollment) {
      res.status(404).json({ success: false, message: 'Enrollment not found.' });
      return;
    }

    const modules = await Module.find({ courseId: (enrollment.courseId as any)._id }).sort({ order: 1 });
    const modulesWithLessons = await Promise.all(
      modules.map(async (mod) => {
        const lessons = await Lesson.find({ moduleId: mod._id }).sort({ order: 1 });
        return { ...mod.toObject(), lessons };
      })
    );

    res.json({ success: true, enrollment, curriculum: modulesWithLessons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch enrollment.' });
  }
};

// @desc  Mark lesson as complete + update progress
// @route PUT /api/enrollments/:enrollmentId/complete-lesson
export const completeLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.body;
    const enrollment = await Enrollment.findOne({ _id: req.params.enrollmentId, userId: req.user!._id });
    if (!enrollment) {
      res.status(404).json({ success: false, message: 'Enrollment not found.' });
      return;
    }

    const lessonObjId = lessonId;
    if (!enrollment.completedLessons.map(String).includes(String(lessonObjId))) {
      enrollment.completedLessons.push(lessonObjId);
    }
    enrollment.lastWatchedLesson = lessonObjId;

    // Calculate progress
    const modules = await Module.find({ courseId: enrollment.courseId });
    const allLessons = await Lesson.find({ moduleId: { $in: modules.map((m) => m._id) } });
    const totalLessons = allLessons.length;
    enrollment.progressPercent = totalLessons > 0
      ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
      : 0;
    enrollment.isCompleted = enrollment.progressPercent === 100;

    await enrollment.save();

    // Update course totalStudents if first-time completion
    if (enrollment.isCompleted) {
      await Course.findByIdAndUpdate(enrollment.courseId, { $inc: { totalStudents: 0 } });
    }

    res.json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update progress.' });
  }
};

// @desc  Check if user is enrolled in course
// @route GET /api/enrollments/check/:courseId
export const checkEnrollment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const enrollment = await Enrollment.findOne({ userId: req.user!._id, courseId: req.params.courseId });
    res.json({ success: true, enrolled: !!enrollment, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to check enrollment.' });
  }
};
