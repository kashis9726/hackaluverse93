import mongoose from 'mongoose';
declare const _default: mongoose.Model<any, {}, {}, {}, any, any, any> | mongoose.Model<{
    id: string;
    description: string;
    authorId: mongoose.Types.ObjectId;
    title: string;
    submissions: mongoose.Types.DocumentArray<{
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    }> & {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    }>;
    industry: string;
    deadline?: NativeDate | null;
    budget?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    id: string;
    description: string;
    authorId: mongoose.Types.ObjectId;
    title: string;
    submissions: mongoose.Types.DocumentArray<{
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    }> & {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    }>;
    industry: string;
    deadline?: NativeDate | null;
    budget?: string | null;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    id: string;
    description: string;
    authorId: mongoose.Types.ObjectId;
    title: string;
    submissions: mongoose.Types.DocumentArray<{
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    }> & {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    }>;
    industry: string;
    deadline?: NativeDate | null;
    budget?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    id: string;
    description: string;
    authorId: mongoose.Types.ObjectId;
    title: string;
    submissions: mongoose.Types.DocumentArray<{
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    }> & {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    }>;
    industry: string;
    deadline?: NativeDate | null;
    budget?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    id: string;
    description: string;
    authorId: mongoose.Types.ObjectId;
    title: string;
    submissions: mongoose.Types.DocumentArray<{
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    }> & {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    }>;
    industry: string;
    deadline?: NativeDate | null;
    budget?: string | null;
} & mongoose.DefaultTimestampProps, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & {
    id: string;
    description: string;
    authorId: mongoose.Types.ObjectId;
    title: string;
    submissions: mongoose.Types.DocumentArray<{
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    }> & {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    }>;
    industry: string;
    deadline?: NativeDate | null;
    budget?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        id: string;
        description: string;
        authorId: mongoose.Types.ObjectId;
        title: string;
        submissions: mongoose.Types.DocumentArray<{
            id: string;
            createdAt: NativeDate;
            content: string;
            attachments: string[];
            studentId: mongoose.Types.ObjectId;
            status?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            id: string;
            createdAt: NativeDate;
            content: string;
            attachments: string[];
            studentId: mongoose.Types.ObjectId;
            status?: string | null;
        }> & {
            id: string;
            createdAt: NativeDate;
            content: string;
            attachments: string[];
            studentId: mongoose.Types.ObjectId;
            status?: string | null;
        }>;
        industry: string;
        deadline?: NativeDate | null;
        budget?: string | null;
    } & mongoose.DefaultTimestampProps, {}, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & {
        id: string;
        description: string;
        authorId: mongoose.Types.ObjectId;
        title: string;
        submissions: mongoose.Types.DocumentArray<{
            id: string;
            createdAt: NativeDate;
            content: string;
            attachments: string[];
            studentId: mongoose.Types.ObjectId;
            status?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            id: string;
            createdAt: NativeDate;
            content: string;
            attachments: string[];
            studentId: mongoose.Types.ObjectId;
            status?: string | null;
        }> & {
            id: string;
            createdAt: NativeDate;
            content: string;
            attachments: string[];
            studentId: mongoose.Types.ObjectId;
            status?: string | null;
        }>;
        industry: string;
        deadline?: NativeDate | null;
        budget?: string | null;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
}, {
    id: string;
    description: string;
    authorId: mongoose.Types.ObjectId;
    title: string;
    submissions: mongoose.Types.DocumentArray<{
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    } | {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: string;
        status?: string | null;
        _id: string;
    }, mongoose.Types.Subdocument<string | mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    } | {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: string;
        status?: string | null;
        _id: string;
    }> & ({
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    } | {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: string;
        status?: string | null;
        _id: string;
    })>;
    industry: string;
    deadline?: NativeDate | null;
    budget?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    id: string;
    description: string;
    authorId: mongoose.Types.ObjectId;
    title: string;
    submissions: mongoose.Types.DocumentArray<{
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    } | {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: string;
        status?: string | null;
        _id: string;
    }, mongoose.Types.Subdocument<string | mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    } | {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: string;
        status?: string | null;
        _id: string;
    }> & ({
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: mongoose.Types.ObjectId;
        status?: string | null;
    } | {
        id: string;
        createdAt: NativeDate;
        content: string;
        attachments: string[];
        studentId: string;
        status?: string | null;
        _id: string;
    })>;
    industry: string;
    deadline?: NativeDate | null;
    budget?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default _default;
//# sourceMappingURL=ReversePitch.d.ts.map