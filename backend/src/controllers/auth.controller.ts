import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../services/jwt.service.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

export const registerUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            const error: any = new Error("Please provide username, email, and password");
            error.status = 400;
            throw error;
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            const error: any = new Error("User with this email or username already exists");
            error.status = 400;
            throw error;
        }

        const newUser = await User.create({
            username,
            email,
            password,
        });

        const token = generateToken({
            userId: newUser._id.toString(),
            email: newUser.email,
        });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict" as const,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        res.status(201)
            .cookie("token", token, cookieOptions)
            .json({
                message: "User registered successfully",
                token,
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    avatar: newUser.avatar,
                },
            });
    }
);

export const loginUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, password } = req.body;

        if (!email || !password) {
            const error: any = new Error("Please provide both email and password");
            error.status = 400;
            throw error;
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            const error: any = new Error("Invalid email or password");
            error.status = 401;
            throw error;
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            const error: any = new Error("Invalid email or password");
            error.status = 401;
            throw error;
        }

        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
        });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict" as const,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        };

        res.status(200)
            .cookie("token", token, cookieOptions)
            .json({
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                },
            });
    }
);

export const logoutUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        res.cookie("token", "none", {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict" as const,
        });

        res.status(200).json({
            message: "User logged out successfully",
        });
    }
);

export const verify = asyncHandler(
    async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const userId = (req.user as { userId?: string })?.userId;

        if (!userId) {
            const error: any = new Error("Not authorized");
            error.status = 401;
            throw error;
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            const error: any = new Error("User not found");
            error.status = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            },
        });
    }
);