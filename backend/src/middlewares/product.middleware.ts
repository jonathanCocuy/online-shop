import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { productSchema } from "../schemas/product.schema";

export const productMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { name, price, description, image_url, category, stock, currency } = req.body;
    if (!name || !price || !description || !image_url || !category || !stock || !currency	) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const validatedData = productSchema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}