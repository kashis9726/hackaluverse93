import mongoose from 'mongoose';
declare const _default: mongoose.Model<any, {}, {}, {}, any, any, any> | mongoose.Model<{
    id: string;
    type: "text" | "file";
    timestamp: NativeDate;
    content: string;
    senderId: mongoose.Types.ObjectId;
    roomId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    id: string;
    type: "text" | "file";
    timestamp: NativeDate;
    content: string;
    senderId: mongoose.Types.ObjectId;
    roomId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    id: string;
    type: "text" | "file";
    timestamp: NativeDate;
    content: string;
    senderId: mongoose.Types.ObjectId;
    roomId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    id: string;
    type: "text" | "file";
    timestamp: NativeDate;
    content: string;
    senderId: mongoose.Types.ObjectId;
    roomId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    id: string;
    type: "text" | "file";
    timestamp: NativeDate;
    content: string;
    senderId: mongoose.Types.ObjectId;
    roomId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & {
    id: string;
    type: "text" | "file";
    timestamp: NativeDate;
    content: string;
    senderId: mongoose.Types.ObjectId;
    roomId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        id: string;
        type: "text" | "file";
        timestamp: NativeDate;
        content: string;
        senderId: mongoose.Types.ObjectId;
        roomId: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps, {}, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & {
        id: string;
        type: "text" | "file";
        timestamp: NativeDate;
        content: string;
        senderId: mongoose.Types.ObjectId;
        roomId: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
}, {
    id: string;
    type: "text" | "file";
    timestamp: NativeDate;
    content: string;
    senderId: mongoose.Types.ObjectId;
    roomId: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    id: string;
    type: "text" | "file";
    timestamp: NativeDate;
    content: string;
    senderId: mongoose.Types.ObjectId;
    roomId: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default _default;
//# sourceMappingURL=Message.d.ts.map