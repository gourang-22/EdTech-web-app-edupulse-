import { Request, Response } from 'express';
import Lesson from '../models/Lesson';

// @desc  Get lessons for a module
// @route GET /api/lessons/module/:moduleId
export const getLessonsByModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const lessons = await Lesson.find({ moduleId: req.params.moduleId }).sort({ order: 1 });
    res.json({ success: true, lessons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch lessons.' });
  }
};

// @desc  Get single lesson
// @route GET /api/lessons/:id
export const getLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) { res.status(404).json({ success: false, message: 'Lesson not found.' }); return; }
    res.json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch lesson.' });
  }
};

// @desc  Create lesson
// @route POST /api/lessons
export const createLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const lesson = await Lesson.create(req.body);
    res.status(201).json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create lesson.' });
  }
};

// @desc  Update lesson
// @route PUT /api/lessons/:id
export const updateLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lesson) { res.status(404).json({ success: false, message: 'Lesson not found.' }); return; }
    res.json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update lesson.' });
  }
};

// @desc  Delete lesson
// @route DELETE /api/lessons/:id
export const deleteLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Lesson deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete lesson.' });
  }
};
