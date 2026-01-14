import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    price: z.number().min(0, 'Price must be greater than 0'),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    image: z.string().min(10, 'Image must be at least 10 characters long'),
});