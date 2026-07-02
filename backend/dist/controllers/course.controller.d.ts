import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const getCourses: (req: Request, res: Response) => Promise<void>;
export declare const getCourse: (req: Request, res: Response) => Promise<void>;
export declare const createCourse: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateCourse: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteCourse: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllCoursesAdmin: (_req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=course.controller.d.ts.map