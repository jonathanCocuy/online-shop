import { z } from 'zod';

export const registerSchema = z.object({
    user_name: z.string().min(1, { message: 'Name is required' }),
    last_name: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});
