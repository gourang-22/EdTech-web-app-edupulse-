import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const getMyCourses: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getEnrollment: (req: AuthRequest, res: Response) => Promise<void>;
export declare const completeLesson: (req: AuthRequest, res: Response) => Promise<void>;
export declare const checkEnrollment: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=enrollment.controller.d.ts.map