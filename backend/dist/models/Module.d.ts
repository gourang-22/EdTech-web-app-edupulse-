import mongoose, { Document, Types } from 'mongoose';
export interface IModule extends Document {
    courseId: Types.ObjectId;
    title: string;
    order: number;
    createdAt: Date;
}
declare const _default: mongoose.Model<IModule, {}, {}, {}, mongoose.Document<unknown, {}, IModule, {}, {}> & IModule & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Module.d.ts.map