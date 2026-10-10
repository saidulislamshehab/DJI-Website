import { Router } from "express";
import { MediaController } from "../controllers/media.controller";

const router = Router();

// GET /api/media - Hero videos
router.get("/", MediaController.getHeroVideos);
router.get("/test", (_req, res) => {
  res.json({ ok: true });
});

// GET /api/media/all or /api/media/catalog - All media images, videos, and website links
router.get("/all", MediaController.getAllSiteAssets);
router.get("/links", MediaController.getAllSiteAssets);

export default router;
