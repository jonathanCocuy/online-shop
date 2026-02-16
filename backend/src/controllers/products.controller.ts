import { Request, Response } from "express";
import { productSchema } from "../schemas/product.schema";
import { z } from "zod";
import { ProductService } from "../services/product.service";

export class ProductsController {
    
    async createProduct(req: Request, res: Response) {
        try {

            const productService = new ProductService();
            const userId = (req.user as any).userId;
            if (!userId) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }
            const result = await productService.createProduct(req.body, userId);

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

    async getMyProducts(req: Request, res: Response) {
        try {
            const userId = (req.user as any).userId;
            if (!userId) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }
            const productService = new ProductService();
            const result = await productService.getProductsByUser(userId);

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

            if (!result) {
                return res.status(404).json({ message: "Product not found" });
            }
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
            const userId = (req.user as any).userId;
            if (!userId) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }

            const productService = new ProductService();
            const existing = await productService.getProductById(Number(req.params.id));
            if (!existing) {
                return res.status(404).json({ message: "Product not found" });
            }
            if (existing.user_id !== userId) {
                return res.status(403).json({ message: "No tienes permiso para editar este producto" });
            }

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
            const userId = (req.user as any).userId;
            if (!userId) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }

            const productService = new ProductService();
            const existing = await productService.getProductById(Number(req.params.id));
            if (!existing) {
                return res.status(404).json({ message: "Product not found" });
            }
            if (existing.user_id !== userId) {
                return res.status(403).json({ message: "No tienes permiso para eliminar este producto" });
            }

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