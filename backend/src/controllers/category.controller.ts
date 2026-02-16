import { Request, Response } from "express";
import { z } from "zod";
import { CategoryService } from "../services/category.service";

export class CategoryController {

    // POST /categories
    async createCategory(req: Request, res: Response) {
        try {
            const categoryService = new CategoryService();
            const result = await categoryService.createCategory(req.body);

            return res.status(201).json(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: error.message });
            }
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // GET /categories
    async getCategories(_req: Request, res: Response) {
        try {
            const categoryService = new CategoryService();
            const result = await categoryService.getCategories();

            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // GET /categories/:id/products — productos de una categoría
    async getProductsByCategory(req: Request, res: Response) {
        try {
            const categoryService = new CategoryService();
            const result = await categoryService.getProductsByCategoryId(Number(req.params.id));
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // GET /categories/:id
    async getCategoryById(req: Request, res: Response) {
        try {
            const categoryService = new CategoryService();
            const result = await categoryService.getCategoryById(Number(req.params.id));

            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // PUT/PATCH /categories/:id
    async updateCategory(req: Request, res: Response) {
        try {
            const categoryService = new CategoryService();
            await categoryService.updateCategory(Number(req.params.id), req.body);

            return res.status(200).json({ message: "Category updated successfully" });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: error.message });
            }
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // DELETE /categories/:id
    async deleteCategory(req: Request, res: Response) {
        try {
            const categoryService = new CategoryService();
            await categoryService.deleteCategory(Number(req.params.id));

            return res.status(200).json({ message: "Category deleted successfully" });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

