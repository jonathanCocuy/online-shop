import { env } from "./env";
import cors from "cors";

export const corsMiddleware = cors({
    origin: [
        env.PRODUCTION_URL
    ],
    credentials: true,
});

export default corsMiddleware;