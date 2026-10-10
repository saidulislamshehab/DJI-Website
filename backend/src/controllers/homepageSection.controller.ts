import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { DbStore } from "../services/dbStore";
import { HomepageSectionModel } from "../models/homepageSection.model";
import { ProductModel } from "../models/product.model";
import { ApiResponse } from "../utils/apiResponse";
import { IHomepageSection, IProduct } from "../types";

export class HomepageSectionController {
  private static store = DbStore.getInstance();

  private static isMongoConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  private static async seedDefaultMongoSections(): Promise<void> {
    const defaultSections = [
      {
        sectionKey: "new_arrivals",
        title: "New Arrivals",
        subtitle: "The very latest releases and cutting-edge innovations from DJI",
        productIds: [
          "d1_8674164408481",
          "d1_8476788392097",
          "d1_8574880972961",
          "d1_8476437741729",
        ],
        isEnabled: true,
        order: 1,
      },
      {
        sectionKey: "dji_drones",
        title: "DJI Drones",
        subtitle: "Consumer & camera drones engineered for creators of every skill level",
        productIds: [
          "d1_8574880972961",
          "d1_8736976470177",
          "d1_8579588489377",
          "d1_8526626455713",
        ],
        isEnabled: true,
        order: 2,
      },
      {
        sectionKey: "pro_drones",
        title: "Professional Drones",
        subtitle: "Cinema-grade flagships and heavy-lift platforms for commercial creators",
        productIds: [
          "d1_8526626455713",
          "d1_8522433396897",
          "d1_8755568902305",
          "d1_8681526427809",
        ],
        isEnabled: true,
        order: 3,
      },
      {
        sectionKey: "enterprise_agriculture",
        title: "Enterprise & Agriculture",
        subtitle: "Industrial drones, thermal payloads, and agricultural sprayers for mission-critical operations",
        productIds: [
          "d1_8701074866337",
          "d1_8590857666721",
          "d1_8660585152673",
          "d1_8755568902305",
        ],
        isEnabled: true,
        order: 4,
      },
    ];

    for (const sec of defaultSections) {
      await (HomepageSectionModel as any).findOneAndUpdate(
        { sectionKey: sec.sectionKey },
        { $setOnInsert: sec },
        { upsert: true, new: true }
      );
    }
  }

  private static async populateProducts(productIds: string[]): Promise<IProduct[]> {
    if (!productIds || productIds.length === 0) return [];

    const products = await ProductModel.find({
      $or: [
        { _id: { $in: productIds } },
        { slug: { $in: productIds } },
        { sku: { $in: productIds } },
      ],
    }).lean();

    // Preserve productIds order
    const productMap = new Map<string, any>();
    for (const p of products) {
      productMap.set(String(p._id), p);
      if (p.slug) productMap.set(p.slug, p);
      if (p.sku) productMap.set(p.sku, p);
    }

    const ordered: IProduct[] = [];
    const seen = new Set<string>();

    for (const id of productIds) {
      const match = productMap.get(id);
      if (match && !seen.has(String(match._id))) {
        seen.add(String(match._id));
        ordered.push(match as unknown as IProduct);
      }
    }

    return ordered;
  }

  static async getSections(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (HomepageSectionController.isMongoConnected()) {
        let count = await HomepageSectionModel.countDocuments();
        if (count === 0) {
          await HomepageSectionController.seedDefaultMongoSections();
        }

        const docs = await HomepageSectionModel.find().sort({ order: 1 }).lean();
        const sectionsWithProducts = await Promise.all(
          docs.map(async (doc) => {
            const products = await HomepageSectionController.populateProducts(doc.productIds || []);
            return {
              ...doc,
              products,
            };
          })
        );

        ApiResponse.success(
          res,
          sectionsWithProducts,
          "Homepage sections retrieved successfully",
          200,
          { count: sectionsWithProducts.length }
        );
        return;
      }

      // Fallback
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

      if (HomepageSectionController.isMongoConnected()) {
        let doc = await (HomepageSectionModel as any).findOne({ sectionKey: key }).lean();
        if (!doc) {
          // If empty in DB, seed and try again
          const count = await HomepageSectionModel.countDocuments();
          if (count === 0) {
            await HomepageSectionController.seedDefaultMongoSections();
            doc = await (HomepageSectionModel as any).findOne({ sectionKey: key }).lean();
          }
        }

        if (!doc) {
          ApiResponse.error(res, `Homepage section '${key}' not found`, 404, "Not Found");
          return;
        }

        const products = await HomepageSectionController.populateProducts(doc.productIds || []);
        ApiResponse.success(
          res,
          { ...doc, products },
          "Homepage section retrieved successfully"
        );
        return;
      }

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

      if (HomepageSectionController.isMongoConnected()) {
        const updateData: Partial<IHomepageSection> = {};
        if (productIds !== undefined) updateData.productIds = productIds;
        if (title !== undefined) updateData.title = title;
        if (subtitle !== undefined) updateData.subtitle = subtitle;
        if (isEnabled !== undefined) updateData.isEnabled = isEnabled;

        const updatedDoc = await (HomepageSectionModel as any).findOneAndUpdate(
          { sectionKey: key },
          { $set: updateData },
          { new: true, upsert: true }
        ).lean();

        if (!updatedDoc) {
          ApiResponse.error(res, `Homepage section '${key}' not found`, 404, "Not Found");
          return;
        }

        const products = await HomepageSectionController.populateProducts(updatedDoc.productIds || []);
        ApiResponse.success(
          res,
          { ...updatedDoc, products },
          "Homepage section updated successfully"
        );
        return;
      }

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
      if (HomepageSectionController.isMongoConnected()) {
        await HomepageSectionModel.deleteMany({});
        await HomepageSectionController.seedDefaultMongoSections();
        ApiResponse.success(res, null, "Homepage sections re-seeded in MongoDB Atlas successfully");
        return;
      }

      HomepageSectionController.store.seedInitialData();
      ApiResponse.success(res, null, "Catalog data reset and re-seeded successfully");
    } catch (error) {
      next(error);
    }
  }
}
