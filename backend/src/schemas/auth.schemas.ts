import { z } from "zod"
import { RowDataPacket } from "mysql2";

export const registerSchema = z.object({
    user_name: z.string().min(3, 'Username must be at least 3 characters long'),
    last_name: z.string().min(3, 'Lastname must be at least 3 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

// Define the user row type (RowDataPacket is a type from mysql2)
export type UserRow = RowDataPacket & {
    id: number;
    user_name: string;
    last_name: string;
    email: string;
    password: string;
};