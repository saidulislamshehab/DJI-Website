import { Router } from "express";
import { HomepageSectionController } from "../controllers/homepageSection.controller";

const router = Router();

router.get("/", HomepageSectionController.getSections);
router.get("/:key", HomepageSectionController.getSectionByKey);
router.put("/:key", HomepageSectionController.updateSection);
router.post("/seed-reset", HomepageSectionController.resetSeedData);

export default router;
