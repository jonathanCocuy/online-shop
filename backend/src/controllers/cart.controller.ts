import { Request, Response } from "express";
import { CartService } from "../services/cart.service";

export class CartController {
    private getUserId(req: Request): number {
        const u = req.user as any;
        if (!u) throw new Error("Usuario no autenticado");
        return u.userId ?? u.id;
    }

    async getCart(req: Request, res: Response) {
        try {
            const userId = this.getUserId(req);
            const service = new CartService();
            const result = await service.getCart(userId);
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

    async addToCart(req: Request, res: Response) {
        try {
            const userId = this.getUserId(req);
            const productId = Number(req.params.productId);
            const quantity = Math.max(1, Number(req.body?.quantity) || 1);
            if (!productId) {
                return res.status(400).json({ message: "productId inválido" });
            }
            const service = new CartService();
            const result = await service.addToCart(userId, productId, quantity);
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

    async updateQuantity(req: Request, res: Response) {
        try {
            const userId = this.getUserId(req);
            const productId = Number(req.params.productId);
            const quantity = Number(req.body?.quantity);
            if (!productId) {
                return res.status(400).json({ message: "productId inválido" });
            }
            if (typeof quantity !== "number" || quantity < 0) {
                return res.status(400).json({ message: "quantity debe ser un número >= 0" });
            }
            const service = new CartService();
            const result = await service.updateQuantity(userId, productId, quantity);
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

    async removeFromCart(req: Request, res: Response) {
        try {
            const userId = this.getUserId(req);
            const productId = Number(req.params.productId);
            if (!productId) {
                return res.status(400).json({ message: "productId inválido" });
            }
            const service = new CartService();
            const result = await service.removeFromCart(userId, productId);
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
