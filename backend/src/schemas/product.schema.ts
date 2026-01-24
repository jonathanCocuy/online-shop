import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    price: z.coerce.number().min(0, 'Price must be greater than 0'), // ✅ Convierte string a number
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    image_url: z.string().url('Must be a valid URL').min(10, 'Image must be at least 10 characters long'),
    category: z.string().min(3, 'Category must be at least 3 characters long'),
    stock: z.coerce.number().int().min(0, 'Stock must be greater than 0'), // ✅ Convierte string a number
    currency: z.string().min(3, 'Currency must be at least 3 characters long'),
});