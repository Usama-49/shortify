import { Request, Response, NextFunction } from "express";
import { JwtPayload, verifyToken } from "../services/jwt.service.js";

// Extend Express Request interface so TypeScript recognizes req.user
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export const protectRoute = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const token = req.cookies?.token || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);
        if (!token) {
            const error: any = new Error("Not authorized, token missing");
            error.status = 401;
            return next(error);
        }

        const decodedPayload = verifyToken(token);
        req.user = decodedPayload;
        next();
    } catch (error: any) {
        const err: any = new Error("Not authorized, token failed or expired");
        err.status = 401;
        return next(err);
    }
};

export const optionalProtect = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const token = req.cookies?.token || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);

        if (token) {
            const decodedPayload = verifyToken(token);
            req.user = decodedPayload; // Attach user if valid
        }
        // Always proceed, whether token existed or not
        next();
    } catch (error) {
        // If token is invalid/expired, we don't throw an error for an optional route;
        // we just treat them as an unauthenticated guest and move on.
        next();
    }
};