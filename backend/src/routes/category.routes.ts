import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { categoryMiddleware } from "../middlewares/category.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
/* import { roleMiddleware } from "../middlewares/role.middleware"; */

const router = Router();

router.post('/categories'/* , roleMiddleware('admin') */, categoryMiddleware, new CategoryController().createCategory);
router.get('/categories', new CategoryController().getCategories);
router.get('/categories/:id/products', new CategoryController().getProductsByCategory);
router.get('/categories/:id', new CategoryController().getCategoryById);
router.put('/categories/:id'/* , roleMiddleware('admin') */, categoryMiddleware, new CategoryController().updateCategory);
router.delete('/categories/:id'/* , roleMiddleware('admin') */, new CategoryController().deleteCategory);

export default router;
