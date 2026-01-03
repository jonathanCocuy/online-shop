import { Request, Response } from "express";
import { z } from "zod";
import { RowDataPacket } from "mysql2";
import { AuthService } from "../services/auth.service";

// Validations schema
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

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            // Validate request body
            const validatedData = registerSchema.parse(req.body);

            // Create a new instance of the AuthService
            const authService = new AuthService();

            // Register the user
            const result = await authService.registerUser(validatedData);

            // Return the result
            return res.status(201).json(result);

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: error.message });
            }
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const validatedData = loginSchema.parse(req.body);

            const authService = new AuthService();

            const result = await authService.loginUser(validatedData);

            return res.status(200).json(result);

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: error.message });
            }
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}