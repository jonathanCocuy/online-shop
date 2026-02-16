import { z } from "zod";

export const productSchema = z
    .object({
        name: z.string().min(3, 'Name must be at least 3 characters long'),
        price: z.coerce.number().min(0, 'Price must be greater than 0'),
        description: z.string().min(10, 'Description must be at least 10 characters long'),
        image_url: z.string().url('Must be a valid URL').min(10, 'Image must be at least 10 characters long'),
        category: z.string().min(3, 'Category must be at least 3 characters long').optional(),
        category_id: z.coerce.number().int().min(1, 'Category ID must be at least 1').optional(),
        stock: z.coerce.number().int().min(0, 'Stock must be greater than 0'),
        currency: z.string().min(3, 'Currency must be at least 3 characters long'),
    })
    .refine((data) => data.category_id != null || (data.category != null && data.category.length >= 3), {
        message: 'Either category or category_id is required',
        path: ['category'],
    });