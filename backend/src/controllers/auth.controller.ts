import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../services/jwt.service.js";
import crypto from "node:crypto";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { getGoogleClient } from "../utils/auth.utils.js";
import bcrypt from "bcryptjs";

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

export const googleAuthStart = async (req: Request, res: Response) => {
    try {
        const client = await getGoogleClient();
        const url = client.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: ["openid", "email", "profile"],
        });
        return res.redirect(url);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error!",
        });
    }
};


export const googleAuthCallback = async (req: Request, res: Response) => {
    const code = req.query.code as string | undefined;
    if (!code) {
        return res.status(400).json({ message: "Missing Code in CallBack" });
    }
    try {
        const client = await getGoogleClient();
        const { tokens } = await client.getToken(code);
        if (!tokens.id_token) {
            return res.status(400).json({
                message: "No google id_token found!",
            });
        }

        //* Verify Token and get user info
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID as string,
            //^ Google signed this token, AND Google explicitly generated it for MY app (GOOGLE_CLIENT_ID), not someone else's app.
        });

        const payload = ticket.getPayload();
        const email = payload?.email;
        const emailVerified = payload?.email_verified;

        if (!email || !emailVerified) {
            return res.status(400).json({
                message: "Email verification failed!",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            const baseName =
                payload?.name?.trim().replace(/\s+/g, "_").toLowerCase() ||
                normalizedEmail.split("@")[0];
            const uniqueSuffix = crypto.randomBytes(3).toString("hex");
            const username = `${baseName}_${uniqueSuffix}`;

            user = await User.create({
                username,
                email: normalizedEmail,
                // Use Google profile picture if available; otherwise schema falls back to DiceBear avatar
                ...(payload?.picture && { avatar: payload.picture }),
                isUserVerified: true,
            });
        } else {
            if (!user.isUserVerified) {
                user.isUserVerified = true;
                await user.save();
            }
        }

        //* Tokens
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Replace JSON response with a redirect to the frontend after setting the auth cookie
        const clientUrl = process.env.CLIENT_URL;
        if (!clientUrl) {
            console.error("CLIENT_URL environment variable is missing");
            return res.status(500).json({
                message: "Server redirect configuration error",
            });
        }

        // Redirect browser to frontend (optionally pass ?auth=success so UI can show a toast)
        const redirectTarget = new URL(clientUrl);
        redirectTarget.searchParams.set("auth", "success");
        return res.redirect(redirectTarget.toString());
    } catch (err) {
        console.error("Google OAuth Callback Error:", err);
        return res.status(500).json({
            message: "Internal server Error",
        });
    }
};