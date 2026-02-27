import { env } from "./env.js";
import cors from "cors";

export const corsMiddleware = cors({
    origin: [
        env.PRODUCTION_URL,
        env.LOCAL_URL
    ],
    credentials: true,
});

export default corsMiddleware;