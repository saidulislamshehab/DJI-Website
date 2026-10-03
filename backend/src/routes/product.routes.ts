import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/featured", ProductController.getFeaturedProducts);
router.get("/:slug", ProductController.getProductBySlug);
router.post("/", ProductController.createProduct);

export default router;
