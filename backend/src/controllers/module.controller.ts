import { Request, Response } from 'express';
import Module from '../models/Module';
import Lesson from '../models/Lesson';

// @desc  Get modules for a course
// @route GET /api/modules/course/:courseId
export const getModulesByCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const modules = await Module.find({ courseId: req.params.courseId }).sort({ order: 1 });
    // Attach lessons to each module
    const modulesWithLessons = await Promise.all(
      modules.map(async (mod) => {
        const lessons = await Lesson.find({ moduleId: mod._id }).sort({ order: 1 });
        return { ...mod.toObject(), lessons };
      })
    );
    res.json({ success: true, modules: modulesWithLessons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch modules.' });
  }
};

// @desc  Create module
// @route POST /api/modules
export const createModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const module = await Module.create(req.body);
    res.status(201).json({ success: true, module });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create module.' });
  }
};

// @desc  Update module
// @route PUT /api/modules/:id
export const updateModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const module = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!module) { res.status(404).json({ success: false, message: 'Module not found.' }); return; }
    res.json({ success: true, module });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update module.' });
  }
};

// @desc  Delete module
// @route DELETE /api/modules/:id
export const deleteModule = async (req: Request, res: Response): Promise<void> => {
  try {
    await Module.findByIdAndDelete(req.params.id);
    await Lesson.deleteMany({ moduleId: req.params.id });
    res.json({ success: true, message: 'Module and its lessons deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete module.' });
  }
};
