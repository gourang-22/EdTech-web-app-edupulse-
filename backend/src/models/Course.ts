import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  instructor: string;
  instructorBio?: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  duration?: string;
  totalLessons?: number;
  learningOutcomes: string[];
  requirements: string[];
  tags: string[];
  rating: number;
  totalReviews: number;
  totalStudents: number;
  isPublished: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    thumbnail: { type: String, required: true },
    instructor: { type: String, required: true },
    instructorBio: { type: String },
    category: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    language: { type: String, default: 'English' },
    duration: { type: String },
    totalLessons: { type: Number, default: 0 },
    learningOutcomes: [{ type: String }],
    requirements: [{ type: String }],
    tags: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

courseSchema.index({ title: 'text', description: 'text', instructor: 'text', category: 'text' });

export default mongoose.model<ICourse>('Course', courseSchema);
