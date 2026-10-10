import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { DbStore } from "../services/dbStore";
import { HomepageSectionModel } from "../models/homepageSection.model";
import { ProductModel } from "../models/product.model";
import { ApiResponse } from "../utils/apiResponse";
import { IProduct } from "../types";

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

  static async createSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, subtitle, sectionKey, productIds, isEnabled, order, spotlight } = req.body;

      if (!title || typeof title !== "string") {
        ApiResponse.error(res, "Section title is required", 400);
        return;
      }

      const generatedKey = (sectionKey || title)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

      const finalKey = generatedKey || `section_${Date.now()}`;

      if (HomepageSectionController.isMongoConnected()) {
        const existing = await HomepageSectionModel.findOne({ sectionKey: finalKey }).lean();
        if (existing) {
          ApiResponse.error(res, `A section with key '${finalKey}' already exists. Please choose a unique key.`, 400);
          return;
        }

        let finalOrder = order;
        if (finalOrder === undefined || typeof finalOrder !== "number") {
          const highestOrderDoc = await HomepageSectionModel.findOne().sort({ order: -1 }).lean();
          finalOrder = highestOrderDoc && typeof (highestOrderDoc as any).order === "number" ? (highestOrderDoc as any).order + 1 : 1;
        }

        const newDoc = await HomepageSectionModel.create({
          sectionKey: finalKey,
          title: title.trim(),
          subtitle: (subtitle || "").trim(),
          productIds: Array.isArray(productIds) ? productIds : [],
          isEnabled: isEnabled !== false,
          order: finalOrder,
          spotlight: spotlight || undefined,
        });

        const products = await HomepageSectionController.populateProducts(newDoc.productIds || []);
        ApiResponse.success(
          res,
          { ...newDoc.toObject(), products },
          "Homepage section created successfully in database",
          201
        );
        return;
      }

      // Fallback
      HomepageSectionController.store.createHomepageSection({
        sectionKey: finalKey,
        title: title.trim(),
        subtitle: (subtitle || "").trim(),
        productIds: Array.isArray(productIds) ? productIds : [],
        isEnabled: isEnabled !== false,
        order,
        spotlight,
      });

      const fullSection = HomepageSectionController.store.getHomepageSectionByKey(finalKey);
      ApiResponse.success(res, fullSection, "Homepage section created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
      const { productIds, title, subtitle, isEnabled, spotlight, order, sectionKey } = req.body;

      if (HomepageSectionController.isMongoConnected()) {
        const query: any = mongoose.Types.ObjectId.isValid(key)
          ? { $or: [{ sectionKey: key }, { _id: key }] }
          : { sectionKey: key };

        const updateData: any = {};
        if (productIds !== undefined) updateData.productIds = productIds;
        if (title !== undefined) updateData.title = title;
        if (subtitle !== undefined) updateData.subtitle = subtitle;
        if (isEnabled !== undefined) updateData.isEnabled = isEnabled;
        if (order !== undefined) updateData.order = order;
        if (sectionKey !== undefined) updateData.sectionKey = sectionKey;
        if (spotlight !== undefined) {
          updateData.spotlight = spotlight;
          updateData.featured = spotlight;
        }

        const updatedDoc = await (HomepageSectionModel as any).findOneAndUpdate(
          query,
          { $set: updateData },
          { new: true, upsert: false }
        ).lean();

        if (!updatedDoc) {
          // If not found, try inserting if upsert intended or return 404
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
        spotlight,
        order,
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

  static async deleteSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;

      if (HomepageSectionController.isMongoConnected()) {
        const query: any = mongoose.Types.ObjectId.isValid(key)
          ? { $or: [{ sectionKey: key }, { _id: key }] }
          : { sectionKey: key };

        const deletedDoc = await HomepageSectionModel.findOneAndDelete(query).lean();
        if (!deletedDoc) {
          ApiResponse.error(res, `Homepage section '${key}' not found`, 404, "Not Found");
          return;
        }

        ApiResponse.success(
          res,
          { deletedKey: key, deletedDoc },
          `Homepage section '${key}' deleted successfully from database`
        );
        return;
      }

      const deleted = HomepageSectionController.store.deleteHomepageSection(key);
      if (!deleted) {
        ApiResponse.error(res, `Homepage section '${key}' not found`, 404, "Not Found");
        return;
      }

      ApiResponse.success(res, { deletedKey: key }, `Homepage section '${key}' deleted successfully`);
    } catch (error) {
      next(error);
    }
  }

  static async reorderSections(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orders } = req.body;
      if (!Array.isArray(orders)) {
        ApiResponse.error(res, "Expected 'orders' array with [{ sectionKey, order }]", 400);
        return;
      }

      if (HomepageSectionController.isMongoConnected()) {
        for (const item of orders) {
          if (item.sectionKey && typeof item.order === "number") {
            await HomepageSectionModel.updateOne(
              { sectionKey: item.sectionKey },
              { $set: { order: item.order } }
            );
          }
        }
        const updatedDocs = await HomepageSectionModel.find().sort({ order: 1 }).lean();
        ApiResponse.success(res, updatedDocs, "Homepage sections reordered successfully");
        return;
      }

      for (const item of orders) {
        if (item.sectionKey && typeof item.order === "number") {
          HomepageSectionController.store.updateHomepageSection(item.sectionKey, { order: item.order });
        }
      }
      const sections = HomepageSectionController.store.getHomepageSections();
      ApiResponse.success(res, sections, "Homepage sections reordered successfully");
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
