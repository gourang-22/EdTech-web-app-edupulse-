import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IResource {
  name: string;
  url: string;
  type: 'pdf' | 'video' | 'link' | 'other';
}

export interface ILesson extends Document {
  moduleId: Types.ObjectId;
  title: string;
  videoUrl: string;
  videoPublicId?: string;
  resources: IResource[];
  order: number;
  duration?: number; // in seconds
  isPreview: boolean;
  createdAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true },
    videoPublicId: { type: String },
    resources: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, enum: ['pdf', 'video', 'link', 'other'], default: 'other' },
      },
    ],
    order: { type: Number, required: true, default: 0 },
    duration: { type: Number, default: 0 },
    isPreview: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ILesson>('Lesson', lessonSchema);
