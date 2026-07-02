"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEnrollment = exports.completeLesson = exports.getEnrollment = exports.getMyCourses = void 0;
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
const Lesson_1 = __importDefault(require("../models/Lesson"));
const Module_1 = __importDefault(require("../models/Module"));
const Course_1 = __importDefault(require("../models/Course"));
// @desc  Get my enrollments
// @route GET /api/enrollments/my-courses
const getMyCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment_1.default.find({ userId: req.user._id })
            .populate('courseId')
            .sort({ purchasedAt: -1 });
        res.json({ success: true, enrollments });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch enrollments.' });
    }
};
exports.getMyCourses = getMyCourses;
// @desc  Get single enrollment + curriculum
// @route GET /api/enrollments/:enrollmentId
const getEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment_1.default.findOne({
            _id: req.params.enrollmentId,
            userId: req.user._id,
        }).populate('courseId');
        if (!enrollment) {
            res.status(404).json({ success: false, message: 'Enrollment not found.' });
            return;
        }
        const modules = await Module_1.default.find({ courseId: enrollment.courseId._id }).sort({ order: 1 });
        const modulesWithLessons = await Promise.all(modules.map(async (mod) => {
            const lessons = await Lesson_1.default.find({ moduleId: mod._id }).sort({ order: 1 });
            return { ...mod.toObject(), lessons };
        }));
        res.json({ success: true, enrollment, curriculum: modulesWithLessons });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch enrollment.' });
    }
};
exports.getEnrollment = getEnrollment;
// @desc  Mark lesson as complete + update progress
// @route PUT /api/enrollments/:enrollmentId/complete-lesson
const completeLesson = async (req, res) => {
    try {
        const { lessonId } = req.body;
        const enrollment = await Enrollment_1.default.findOne({ _id: req.params.enrollmentId, userId: req.user._id });
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
        const modules = await Module_1.default.find({ courseId: enrollment.courseId });
        const allLessons = await Lesson_1.default.find({ moduleId: { $in: modules.map((m) => m._id) } });
        const totalLessons = allLessons.length;
        enrollment.progressPercent = totalLessons > 0
            ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
            : 0;
        enrollment.isCompleted = enrollment.progressPercent === 100;
        await enrollment.save();
        // Update course totalStudents if first-time completion
        if (enrollment.isCompleted) {
            await Course_1.default.findByIdAndUpdate(enrollment.courseId, { $inc: { totalStudents: 0 } });
        }
        res.json({ success: true, enrollment });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update progress.' });
    }
};
exports.completeLesson = completeLesson;
// @desc  Check if user is enrolled in course
// @route GET /api/enrollments/check/:courseId
const checkEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment_1.default.findOne({ userId: req.user._id, courseId: req.params.courseId });
        res.json({ success: true, enrolled: !!enrollment, enrollment });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to check enrollment.' });
    }
};
exports.checkEnrollment = checkEnrollment;
//# sourceMappingURL=enrollment.controller.js.map