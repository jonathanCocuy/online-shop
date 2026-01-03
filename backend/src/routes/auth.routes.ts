import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.post('/register', new AuthController().register);
router.post('/login', new AuthController().login);

export default router;