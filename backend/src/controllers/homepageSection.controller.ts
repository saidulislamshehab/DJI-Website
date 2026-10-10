import { Request, Response, NextFunction } from "express";
import { DbStore } from "../services/dbStore";
import { ProductService } from "../services/product.service";
import { ApiResponse } from "../utils/apiResponse";
import { IHomepageSection, IProduct } from "../types";

export class HomepageSectionController {
  private static store = DbStore.getInstance();

  private static async resolveSectionProducts(section: IHomepageSection): Promise<IProduct[]> {
    const resolvedProducts: IProduct[] = [];

    // 1. Resolve manually curated productIds if defined
    if (Array.isArray(section.productIds) && section.productIds.length > 0) {
      for (const pid of section.productIds) {
        try {
          const prod = await ProductService.getProductById(pid) || await ProductService.getProductBySlug(pid);
          if (prod && !resolvedProducts.some((p) => String(p._id) === String(prod._id) || p.slug === prod.slug)) {
            resolvedProducts.push(prod);
          }
        } catch (e) {
          console.warn(`[HomepageSectionController] Error resolving product ID ${pid}:`, e);
        }
      }
    }

    // 2. If fewer than 8 products resolved (or empty/missing), supplement from catalog query
    if (resolvedProducts.length < 8) {
      try {
        let supplementProducts: IProduct[] = [];
        switch (section.sectionKey) {
          case "new_arrivals": {
            const res = await ProductService.getAllProducts({ isNewArrival: true, limit: 12 });
            supplementProducts = res.products || [];
            if (supplementProducts.length < 6) {
              const newest = await ProductService.getAllProducts({ sortBy: "newest", limit: 12 });
              supplementProducts = [...supplementProducts, ...(newest.products || [])];
            }
            break;
          }
          case "dji_drones": {
            const res = await ProductService.getAllProducts({ category: "drones", limit: 12 });
            supplementProducts = res.products || [];
            if (supplementProducts.length === 0) {
              const alt = await ProductService.getAllProducts({ category: "DJI Drones", limit: 12 });
              supplementProducts = alt.products || [];
            }
            break;
          }
          case "pro_drones": {
            const res = await ProductService.getAllProducts({ category: "professional", limit: 12 });
            supplementProducts = res.products || [];
            if (supplementProducts.length === 0) {
              const alt = await ProductService.getAllProducts({ category: "Professional Drones & Cinema", limit: 12 });
              supplementProducts = alt.products || [];
            }
            break;
          }
          case "enterprise_agriculture": {
            const res = await ProductService.getAllProducts({ category: "enterprise", limit: 12 });
            supplementProducts = res.products || [];
            if (supplementProducts.length === 0) {
              const alt = await ProductService.getAllProducts({ category: "Enterprise & Agriculture", limit: 12 });
              supplementProducts = alt.products || [];
            }
            break;
          }
          default: {
            const res = await ProductService.getAllProducts({ limit: 12 });
            supplementProducts = res.products || [];
            break;
          }
        }

        for (const sp of supplementProducts) {
          if (!resolvedProducts.some((p) => String(p._id) === String(sp._id) || p.slug === sp.slug)) {
            resolvedProducts.push(sp);
          }
          if (resolvedProducts.length >= 12) break;
        }
      } catch (err) {
        console.warn(`[HomepageSectionController] Supplement lookup failed for ${section.sectionKey}:`, err);
      }
    }

    return resolvedProducts;
  }

  static async getSections(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawSections = HomepageSectionController.store.getHomepageSectionsRaw();
      const populatedSections = await Promise.all(
        rawSections.map(async (sec) => {
          const products = await HomepageSectionController.resolveSectionProducts(sec);
          return {
            ...sec,
            products,
          };
        })
      );

      // Sort by order ascending
      populatedSections.sort((a, b) => (a.order || 0) - (b.order || 0));

      ApiResponse.success(res, populatedSections, "Homepage sections retrieved successfully", 200, {
        count: populatedSections.length,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSectionByKey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
      const rawSection = HomepageSectionController.store.getHomepageSectionByKeyRaw(key);
      if (!rawSection) {
        ApiResponse.error(res, `Homepage section '${key}' not found`, 404, "Not Found");
        return;
      }

      const products = await HomepageSectionController.resolveSectionProducts(rawSection);
      ApiResponse.success(res, { ...rawSection, products }, "Homepage section retrieved successfully");
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

      const products = await HomepageSectionController.resolveSectionProducts(updated);
      ApiResponse.success(res, { ...updated, products }, "Homepage section updated successfully");
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
