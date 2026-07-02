"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLesson = exports.updateLesson = exports.createLesson = exports.getLesson = exports.getLessonsByModule = void 0;
const Lesson_1 = __importDefault(require("../models/Lesson"));
// @desc  Get lessons for a module
// @route GET /api/lessons/module/:moduleId
const getLessonsByModule = async (req, res) => {
    try {
        const lessons = await Lesson_1.default.find({ moduleId: req.params.moduleId }).sort({ order: 1 });
        res.json({ success: true, lessons });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch lessons.' });
    }
};
exports.getLessonsByModule = getLessonsByModule;
// @desc  Get single lesson
// @route GET /api/lessons/:id
const getLesson = async (req, res) => {
    try {
        const lesson = await Lesson_1.default.findById(req.params.id);
        if (!lesson) {
            res.status(404).json({ success: false, message: 'Lesson not found.' });
            return;
        }
        res.json({ success: true, lesson });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch lesson.' });
    }
};
exports.getLesson = getLesson;
// @desc  Create lesson
// @route POST /api/lessons
const createLesson = async (req, res) => {
    try {
        const lesson = await Lesson_1.default.create(req.body);
        res.status(201).json({ success: true, lesson });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create lesson.' });
    }
};
exports.createLesson = createLesson;
// @desc  Update lesson
// @route PUT /api/lessons/:id
const updateLesson = async (req, res) => {
    try {
        const lesson = await Lesson_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!lesson) {
            res.status(404).json({ success: false, message: 'Lesson not found.' });
            return;
        }
        res.json({ success: true, lesson });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update lesson.' });
    }
};
exports.updateLesson = updateLesson;
// @desc  Delete lesson
// @route DELETE /api/lessons/:id
const deleteLesson = async (req, res) => {
    try {
        await Lesson_1.default.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Lesson deleted.' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete lesson.' });
    }
};
exports.deleteLesson = deleteLesson;
//# sourceMappingURL=lesson.controller.js.map