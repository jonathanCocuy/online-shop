import { Request, Response, NextFunction } from "express";
import { z } from "zod";
// When you create a category schema, import it here:
// import { categorySchema } from "../schemas/category.schema";

export const categoryMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    
    // Basic validation - check required fields
    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    // Simple validation for now - you can replace this with categorySchema.parse() later
    try {
        // Basic validation: name should be a string with at least 2 characters
        if (typeof name !== 'string' || name.trim().length < 2) {
            return res.status(400).json({ message: 'Category name must be at least 2 characters long' });
        }

        // When you have categorySchema, use this instead:
        // const validatedData = categorySchema.parse(req.body);
        // req.body = validatedData;

        // For now, just ensure name is trimmed
        req.body = {
            ...req.body,
            name: name.trim(),
        };

        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}
