import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", CategoryController.getCategories);
router.get("/subcategories", CategoryController.getSubCategories);
router.get("/subcategories/:slug", CategoryController.getSubCategoryBySlug);
router.get("/options", CategoryController.getCategoryOptions);
router.get("/:slug", CategoryController.getCategoryBySlug);

// Admin protected endpoints
router.post("/", requireAuth as any, requireAdmin as any, CategoryController.createCategory);
router.put("/:id", requireAuth as any, requireAdmin as any, CategoryController.updateCategory);
router.delete("/:id", requireAuth as any, requireAdmin as any, CategoryController.deleteCategory);

export default router;
