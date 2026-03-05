import { Request, Response } from "express";
import { UserService } from "../services/user.service.js";

export class UserController {
    private readonly userService = new UserService();

    private getUserId(req: Request): number {
        const payload = req.user as any;
        if (!payload) {
            throw new Error("Usuario no autenticado");
        }
        return payload.userId ?? payload.id;
    }

    async getMyProfile(req: Request, res: Response) {
        try {
            const userId = this.getUserId(req);
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            return res.status(200).json(user);
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

    async getUserById(req: Request, res: Response) {
        try {
            const targetId = Number(req.params.id);
            if (!Number.isInteger(targetId) || targetId <= 0) {
                return res.status(400).json({ message: "id inválido" });
            }
            const user = await this.userService.getUserById(targetId);
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            return res.status(200).json(user);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
