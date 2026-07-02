import { Request, Response, NextFunction } from 'express';
export declare const notFound: (req: Request, res: Response, _next: NextFunction) => void;
interface AppError extends Error {
    statusCode?: number;
    code?: number;
}
export declare const errorHandler: (err: AppError, _req: Request, res: Response, _next: NextFunction) => void;
export {};
//# sourceMappingURL=error.middleware.d.ts.map