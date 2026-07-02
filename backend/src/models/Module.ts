import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IModule extends Document {
  courseId: Types.ObjectId;
  title: string;
  order: number;
  createdAt: Date;
}

const moduleSchema = new Schema<IModule>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IModule>('Module', moduleSchema);
