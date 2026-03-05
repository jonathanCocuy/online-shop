import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
const controller = new UserController();

router.get("/me", authMiddleware, controller.getMyProfile.bind(controller));
router.get("/:id", controller.getUserById.bind(controller));

export default router;
