import cors from "cors";

export const corsMiddleware = cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "https://onshop.jonathancocuy-dev.online",
            "http://localhost:3000"
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
});