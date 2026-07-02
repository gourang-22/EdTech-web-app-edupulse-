import mongoose, { Document, Schema, Types } from 'mongoose';

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

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentGateway: { type: String, enum: ['razorpay', 'free'], default: 'razorpay' },
    razorpayOrderId: { type: String },
    transactionId: { type: String },
    razorpaySignature: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', orderSchema);
