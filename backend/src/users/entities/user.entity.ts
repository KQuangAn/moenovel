import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
    clerkId: string; // Clerk user ID
    preferences: {
        theme: string;
        language: string;
    };
    readingHistory: {
        bookId: string;
        lastRead: Date;
    }[];
}

const UserSchema = new Schema<IUser>({
    clerkId: { type: String, required: true, unique: true },
    preferences: {
        theme: { type: String, default: 'light' },
        language: { type: String, default: 'en' },
    },
    readingHistory: [
        {
            bookId: { type: String, required: true },
            lastRead: { type: Date, default: Date.now },
        },
    ],
});

export const UserModel = model<IUser>('User', UserSchema);
