import { Request, Response } from "express";
import { FavoritesService } from "../services/favorites.service";

export class FavoritesController {
    private getUserId(req: Request): number {
        const u = req.user as any;
        if (!u) throw new Error("Usuario no autenticado");
        return u.userId ?? u.id;
    }

    async getFavorites(req: Request, res: Response) {
        try {
            const userId = this.getUserId(req);
            const service = new FavoritesService();
            const result = await service.getFavorites(userId);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Usuario no autenticado") {
                    return res.status(401).json({ message: error.message });
                }
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async addFavorite(req: Request, res: Response) {
        try {
            const userId = this.getUserId(req);
            const productId = Number(req.params.productId);
            if (!productId) {
                return res.status(400).json({ message: "productId inválido" });
            }
            const service = new FavoritesService();
            const result = await service.addFavorite(userId, productId);
            return res.status(201).json(result);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Usuario no autenticado") {
                    return res.status(401).json({ message: error.message });
                }
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async removeFavorite(req: Request, res: Response) {
        try {
            const userId = this.getUserId(req);
            const productId = Number(req.params.productId);
            if (!productId) {
                return res.status(400).json({ message: "productId inválido" });
            }
            const service = new FavoritesService();
            const result = await service.removeFavorite(userId, productId);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Usuario no autenticado") {
                    return res.status(401).json({ message: error.message });
                }
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
