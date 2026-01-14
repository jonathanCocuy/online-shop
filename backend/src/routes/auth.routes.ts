import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { ProductsController } from "../controllers/products.controller";

const router = Router();

// Auth public routes
router.post('/register', new AuthController().register);
router.post('/login', new AuthController().login);

router.get('/products', new ProductsController().getProducts);

export default router;