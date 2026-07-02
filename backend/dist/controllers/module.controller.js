"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteModule = exports.updateModule = exports.createModule = exports.getModulesByCourse = void 0;
const Module_1 = __importDefault(require("../models/Module"));
const Lesson_1 = __importDefault(require("../models/Lesson"));
// @desc  Get modules for a course
// @route GET /api/modules/course/:courseId
const getModulesByCourse = async (req, res) => {
    try {
        const modules = await Module_1.default.find({ courseId: req.params.courseId }).sort({ order: 1 });
        // Attach lessons to each module
        const modulesWithLessons = await Promise.all(modules.map(async (mod) => {
            const lessons = await Lesson_1.default.find({ moduleId: mod._id }).sort({ order: 1 });
            return { ...mod.toObject(), lessons };
        }));
        res.json({ success: true, modules: modulesWithLessons });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch modules.' });
    }
};
exports.getModulesByCourse = getModulesByCourse;
// @desc  Create module
// @route POST /api/modules
const createModule = async (req, res) => {
    try {
        const module = await Module_1.default.create(req.body);
        res.status(201).json({ success: true, module });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create module.' });
    }
};
exports.createModule = createModule;
// @desc  Update module
// @route PUT /api/modules/:id
const updateModule = async (req, res) => {
    try {
        const module = await Module_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!module) {
            res.status(404).json({ success: false, message: 'Module not found.' });
            return;
        }
        res.json({ success: true, module });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update module.' });
    }
};
exports.updateModule = updateModule;
// @desc  Delete module
// @route DELETE /api/modules/:id
const deleteModule = async (req, res) => {
    try {
        await Module_1.default.findByIdAndDelete(req.params.id);
        await Lesson_1.default.deleteMany({ moduleId: req.params.id });
        res.json({ success: true, message: 'Module and its lessons deleted.' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete module.' });
    }
};
exports.deleteModule = deleteModule;
//# sourceMappingURL=module.controller.js.map