import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new CartController();

router.get("/cart", authMiddleware, controller.getCart.bind(controller));
router.post("/cart/:productId", authMiddleware, controller.addToCart.bind(controller));
router.patch("/cart/:productId", authMiddleware, controller.updateQuantity.bind(controller));
router.delete("/cart/:productId", authMiddleware, controller.removeFromCart.bind(controller));

export default router;
