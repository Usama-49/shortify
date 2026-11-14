import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
            select: false,
        },
        avatar: {
            type: String,
            required: false,
            default: function (): string {
                // Automatically generates a unique, deterministic avatar based on their username or email!
                return `https://api.dicebear.com/7.x/bottts/svg?seed=${this.username || 'default'}`;
            },
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre<IUser>("save", async function () {
    if (!this.isModified("password")) return;

    try {
        const salt = await bcrypt.genSalt(10);
        if (this.password) {
            this.password = await bcrypt.hash(this.password, salt);
        }
    } catch (error: any) {
        throw error;
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);