import { Router } from "express";
import { ProductsController } from "../controllers/products.controller";
import { productMiddleware } from "../middlewares/product.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
/* import { roleMiddleware } from "../middlewares/role.middleware"; */

const router = Router();


router.post('/products'/* , roleMiddleware('seller') */, productMiddleware, new ProductsController().createProduct);
router.get('/products', new ProductsController().getProducts);
router.get('/products/:id', new ProductsController().getProductById);
router.put('/products/:id'/* , roleMiddleware('seller') */, productMiddleware, new ProductsController().updateProduct);
router.delete('/products/:id'/* , roleMiddleware('seller') */, new ProductsController().deleteProduct);

export default router;