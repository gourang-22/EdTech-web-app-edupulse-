import mongoose, { Document, Types } from 'mongoose';
export interface IOrder extends Document {
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    amount: number;
    currency: string;
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentGateway: 'razorpay' | 'free';
    razorpayOrderId?: string;
    transactionId?: string;
    razorpaySignature?: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Order.d.ts.map