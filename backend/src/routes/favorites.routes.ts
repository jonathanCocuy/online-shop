import { Router } from "express";
import { FavoritesController } from "../controllers/favorites.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new FavoritesController();

router.get("/favorites", authMiddleware, controller.getFavorites.bind(controller));
router.post("/favorites/:productId", authMiddleware, controller.addFavorite.bind(controller));
router.delete("/favorites/:productId", authMiddleware, controller.removeFavorite.bind(controller));

export default router;
