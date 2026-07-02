import mongoose, { Document, Types } from 'mongoose';
export interface IEnrollment extends Document {
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    completedLessons: Types.ObjectId[];
    lastWatchedLesson?: Types.ObjectId;
    progressPercent: number;
    isCompleted: boolean;
    purchasedAt: Date;
}
declare const _default: mongoose.Model<IEnrollment, {}, {}, {}, mongoose.Document<unknown, {}, IEnrollment, {}, {}> & IEnrollment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Enrollment.d.ts.map