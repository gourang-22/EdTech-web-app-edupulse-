import mongoose, { Document, Types } from 'mongoose';
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
declare const _default: mongoose.Model<ICourse, {}, {}, {}, mongoose.Document<unknown, {}, ICourse, {}, {}> & ICourse & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Course.d.ts.map