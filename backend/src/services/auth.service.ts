import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db } from "../config/db";
import { env } from "../config/env";
import { registerSchema, loginSchema, UserRow } from "../schemas/auth.schemas";

// Define the input types for the register and login functions
type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

export class AuthService {

    private async checkIfUserExists(email: string): Promise<UserRow | null> {
        const [ users ] = await db.query<UserRow[]>('SELECT * FROM users WHERE email = ?', [email]);
        // Return the first user if it exists, but return null if it doesn't
        return users[0] || null
    }
    
    async registerUser(validatedData: RegisterInput) {
        const existingUser = await this.checkIfUserExists(validatedData.email);

        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        await db.query(
            'INSERT INTO users (user_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)', 
            [validatedData.user_name, validatedData.last_name, validatedData.email, hashedPassword, validatedData.role]
        );

        return { message: 'User created successfully' }
    }

    async loginUser(validatedData: LoginInput) {
        const existingUser = await this.checkIfUserExists(validatedData.email);

        if (!existingUser) {
            throw new Error('User not found');
        }

        // Compare the password with the hashed password in the database
        const isCorrectPassword = await bcrypt.compare(validatedData.password, existingUser.password);

        if (!isCorrectPassword) {
            throw new Error('Invalid password');
        }

        // Sign the token with the user's id and email
        const token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, env.JWT_SECRET, { expiresIn: '1h' });

        return {
            // Return the token
            message: 'Login successful',
            token,
        }
    }
}