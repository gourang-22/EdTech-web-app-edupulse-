import mongoose, { Document, Types } from 'mongoose';
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
    duration?: number;
    isPreview: boolean;
    createdAt: Date;
}
declare const _default: mongoose.Model<ILesson, {}, {}, {}, mongoose.Document<unknown, {}, ILesson, {}, {}> & ILesson & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Lesson.d.ts.map