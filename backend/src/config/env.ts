import 'dotenv/config'

export const env = {
    PORT: Number(process.env.PORT) || 4000,
    DATABASE_URL: process.env.DATABASE_URL!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
}
