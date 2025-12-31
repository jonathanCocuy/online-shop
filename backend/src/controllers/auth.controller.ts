import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { RowDataPacket } from "mysql2";
import { db } from "../config/db";

// Validations schema
const registerSchema = z.object({
    user_name: z.string().min(3, 'Username must be at least 3 characters long'),
    last_name: z.string().min(3, 'Lastname must be at least 3 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

// Define the user row type (RowDataPacket is a type from mysql2)
type UserRow = RowDataPacket & {
    id: number;
    user_name: string;
    last_name: string;
    email: string;
    password: string;
};

type ExistingUserRow = RowDataPacket & {
    id: number;
    user_name: string;
    last_name: string;
    email: string;
    password: string;
};

const JWT_SECRET = process.env.JWT_SECRET!;

export const AuthController = {
    async register(req: Request, res: Response) {
        try {
            // Validate request body
            const { user_name, last_name, email, password } = registerSchema.parse(req.body);

            const [existingUser]= await db.query<ExistingUserRow[]>('SELECT * FROM users WHERE email = ?', [email]);  

            if (existingUser.length > 0) {
                return res.status(400).json({ message: 'User already exists, please login' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            await db.query('INSERT INTO users (user_name, last_name, email, password) VALUES (?, ?, ?, ?)', [user_name, last_name, email, hashedPassword]);

            res.status(201).json({ 
                message: 'User created successfully',
                user: {
                    'user_name': user_name,
                    'last_name': last_name,
                    'email': email,
                }
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    async login(req: Request, res: Response) {
        try {
            const validatedData = loginSchema.parse(req.body);
            const { email, password } = validatedData;

            const [userRows] = await db.query<UserRow[]>(
                "SELECT * FROM users WHERE email = ?",
                [email]
            );

            if (userRows.length < 1) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const user = userRows[0];
            // Compare the password with the hashed password in the database
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            // Generate a JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(200).json({
                message: "Login successful",
                token,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}