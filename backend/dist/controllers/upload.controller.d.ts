import { Request, Response } from 'express';
import multer from 'multer';
export declare const upload: multer.Multer;
export declare const uploadImage: (req: Request, res: Response) => Promise<void>;
export declare const uploadVideo: (req: Request, res: Response) => Promise<void>;
export declare const uploadResource: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=upload.controller.d.ts.map