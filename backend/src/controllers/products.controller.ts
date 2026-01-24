import { Request, Response } from "express";
import { productSchema } from "../schemas/product.schema";
import { z } from "zod";
import { ProductService } from "../services/product.service";

export class ProductsController {
    
    async createProduct(req: Request, res: Response) {
        try {

            const productService = new ProductService();
            const result = await productService.createProduct(req.body);

            return res.status(201).json(result);

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getProducts(_req: Request, res: Response) {
        try {
            const productService = new ProductService();
            const result = await productService.getProducts();

            return res.status(200).json(result);

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getProductById(req: Request, res: Response) {
        try {
            const productService = new ProductService();
            const result = await productService.getProductById(Number(req.params.id));

            return res.status(200).json(result);

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateProduct(req: Request, res: Response) {
        try {
            const productService = new ProductService();
            const result = await productService.updateProduct(Number(req.params.id), req.body);

            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteProduct(req: Request, res: Response) {
        try {
            const productService = new ProductService();
            const result = await productService.deleteProduct(Number(req.params.id));

            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}