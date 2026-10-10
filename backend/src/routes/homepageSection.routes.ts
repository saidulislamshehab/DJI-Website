import { Router } from "express";
import { HomepageSectionController } from "../controllers/homepageSection.controller";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", HomepageSectionController.getSections);
router.get("/:key", HomepageSectionController.getSectionByKey);

// Admin protected endpoints
router.post("/", requireAuth as any, requireAdmin as any, HomepageSectionController.createSection);
router.put("/reorder", requireAuth as any, requireAdmin as any, HomepageSectionController.reorderSections);
router.put("/:key", requireAuth as any, requireAdmin as any, HomepageSectionController.updateSection);
router.delete("/:key", requireAuth as any, requireAdmin as any, HomepageSectionController.deleteSection);
router.post("/seed-reset", requireAuth as any, requireAdmin as any, HomepageSectionController.resetSeedData);

export default router;
