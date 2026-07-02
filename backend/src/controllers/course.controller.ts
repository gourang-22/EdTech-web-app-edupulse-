import { Request, Response } from 'express';
import Course from '../models/Course';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc  Get all published courses (with search/filter/pagination)
// @route GET /api/courses
export const getCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, level, page = 1, limit = 12 } = req.query;
    const query: Record<string, unknown> = { isPublished: true };

    if (search) {
      query.$text = { $search: search as string };
    }
    if (category) query.category = category;
    if (level) query.level = level;

    const skip = (Number(page) - 1) * Number(limit);
    const [courses, total] = await Promise.all([
      Course.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Course.countDocuments(query),
    ]);

    res.json({
      success: true,
      courses,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch courses.' });
  }
};

// @desc  Get single course
// @route GET /api/courses/:id
export const getCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id).populate('createdBy', 'name email');
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch course.' });
  }
};

// @desc  Create course (admin)
// @route POST /api/courses
export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.create({ ...req.body, createdBy: req.user!._id });
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create course.' });
  }
};

// @desc  Update course (admin)
// @route PUT /api/courses/:id
export const updateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update course.' });
  }
};

// @desc  Delete course (admin)
// @route DELETE /api/courses/:id
export const deleteCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }
    res.json({ success: true, message: 'Course deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete course.' });
  }
};

// @desc  Get all courses including unpublished (admin)
// @route GET /api/courses/admin/all
export const getAllCoursesAdmin = async (_req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }).populate('createdBy', 'name');
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch courses.' });
  }
};
