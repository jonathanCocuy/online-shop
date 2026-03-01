import { env } from "./env.js";
import cors from "cors";

export const corsMiddleware = cors({
    origin: [
        env.PRODUCTION_URL,
        env.DEVELOPMENT_URL
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
});

export default corsMiddleware;