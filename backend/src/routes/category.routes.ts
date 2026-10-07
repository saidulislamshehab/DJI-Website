import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";

const router = Router();

router.get("/", CategoryController.getCategories);
router.get("/:slug", CategoryController.getCategoryBySlug);
router.post("/", CategoryController.createCategory);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

export default router;
