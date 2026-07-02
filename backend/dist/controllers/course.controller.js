"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCoursesAdmin = exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourse = exports.getCourses = void 0;
const Course_1 = __importDefault(require("../models/Course"));
// @desc  Get all published courses (with search/filter/pagination)
// @route GET /api/courses
const getCourses = async (req, res) => {
    try {
        const { search, category, level, page = 1, limit = 12 } = req.query;
        const query = { isPublished: true };
        if (search) {
            query.$text = { $search: search };
        }
        if (category)
            query.category = category;
        if (level)
            query.level = level;
        const skip = (Number(page) - 1) * Number(limit);
        const [courses, total] = await Promise.all([
            Course_1.default.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            Course_1.default.countDocuments(query),
        ]);
        res.json({
            success: true,
            courses,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch courses.' });
    }
};
exports.getCourses = getCourses;
// @desc  Get single course
// @route GET /api/courses/:id
const getCourse = async (req, res) => {
    try {
        const course = await Course_1.default.findById(req.params.id).populate('createdBy', 'name email');
        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found.' });
            return;
        }
        res.json({ success: true, course });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch course.' });
    }
};
exports.getCourse = getCourse;
// @desc  Create course (admin)
// @route POST /api/courses
const createCourse = async (req, res) => {
    try {
        const course = await Course_1.default.create({ ...req.body, createdBy: req.user._id });
        res.status(201).json({ success: true, course });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create course.' });
    }
};
exports.createCourse = createCourse;
// @desc  Update course (admin)
// @route PUT /api/courses/:id
const updateCourse = async (req, res) => {
    try {
        const course = await Course_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found.' });
            return;
        }
        res.json({ success: true, course });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update course.' });
    }
};
exports.updateCourse = updateCourse;
// @desc  Delete course (admin)
// @route DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
    try {
        const course = await Course_1.default.findByIdAndDelete(req.params.id);
        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found.' });
            return;
        }
        res.json({ success: true, message: 'Course deleted.' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete course.' });
    }
};
exports.deleteCourse = deleteCourse;
// @desc  Get all courses including unpublished (admin)
// @route GET /api/courses/admin/all
const getAllCoursesAdmin = async (_req, res) => {
    try {
        const courses = await Course_1.default.find().sort({ createdAt: -1 }).populate('createdBy', 'name');
        res.json({ success: true, courses });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch courses.' });
    }
};
exports.getAllCoursesAdmin = getAllCoursesAdmin;
//# sourceMappingURL=course.controller.js.map