import { Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth.service";
import { registerSchema, loginSchema } from "../schemas/auth.schemas";

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