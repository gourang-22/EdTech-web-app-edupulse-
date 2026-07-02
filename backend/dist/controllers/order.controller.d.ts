import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const createOrder: (req: AuthRequest, res: Response) => Promise<void>;
export declare const verifyPayment: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getMyOrders: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=order.controller.d.ts.map