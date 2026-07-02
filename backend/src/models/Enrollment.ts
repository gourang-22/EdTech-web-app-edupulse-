import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IEnrollment extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  completedLessons: Types.ObjectId[];
  lastWatchedLesson?: Types.ObjectId;
  progressPercent: number;
  isCompleted: boolean;
  purchasedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    lastWatchedLesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    isCompleted: { type: Boolean, default: false },
    purchasedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);
