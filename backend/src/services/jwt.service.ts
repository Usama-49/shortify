import jwt from "jsonwebtoken";

export interface JwtPayload {
    userId: string;
    email: string;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
};