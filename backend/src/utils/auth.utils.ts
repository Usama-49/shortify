import { OAuth2Client } from "google-auth-library";

//* npm i google-auth-library
export const getGoogleClient = async () => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    if (!clientSecret || !clientId) {
        throw new Error("Google Client-id or Client-secret missing!");
    }
    return new OAuth2Client({
        clientId,
        clientSecret,
        redirectUri,
    });
};
