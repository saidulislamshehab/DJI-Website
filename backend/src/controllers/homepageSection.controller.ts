import { Request, Response, NextFunction } from "express";
import { DbStore } from "../services/dbStore";
import { ApiResponse } from "../utils/apiResponse";

export class HomepageSectionController {
  private static store = DbStore.getInstance();

  static async getSections(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sections = HomepageSectionController.store.getHomepageSections();
      ApiResponse.success(res, sections, "Homepage sections retrieved successfully", 200, {
        count: sections.length,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSectionByKey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
      const section = HomepageSectionController.store.getHomepageSectionByKey(key);
      if (!section) {
        ApiResponse.error(res, `Homepage section '${key}' not found`, 404, "Not Found");
        return;
      }
      ApiResponse.success(res, section, "Homepage section retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async updateSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
      const { productIds, title, subtitle, isEnabled } = req.body;

      const updated = HomepageSectionController.store.updateHomepageSection(key, {
        productIds,
        title,
        subtitle,
        isEnabled,
      });

      if (!updated) {
        ApiResponse.error(res, `Homepage section '${key}' not found`, 404, "Not Found");
        return;
      }

      const fullSection = HomepageSectionController.store.getHomepageSectionByKey(key);
      ApiResponse.success(res, fullSection, "Homepage section updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async resetSeedData(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      HomepageSectionController.store.seedInitialData();
      ApiResponse.success(res, null, "Catalog data reset and re-seeded successfully");
    } catch (error) {
      next(error);
    }
  }
}
