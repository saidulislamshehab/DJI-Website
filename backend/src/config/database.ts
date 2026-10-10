import mongoose from "mongoose";
import { DbStore } from "../services/dbStore";
import { ProductModel } from "../models/product.model";
import { CategoryModel } from "../models/category.model";
import { air3sProductData } from "../data/air3sData";

export const connectDatabase = async (): Promise<void> => {
  // Always initialize local persistent store
  DbStore.getInstance();

  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/d1store";
  const dbName = process.env.MONGODB_DB_NAME || "d1store";

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      dbName: dbName,
    });
    console.log(`[Database] MongoDB connected successfully to ${mongoose.connection.host}/${mongoose.connection.name}`);
    await seedDatabaseIfEmpty();
  } catch (error: any) {
    if (process.env.NODE_ENV === "production" && process.env.STRICT_DB === "true") {
      console.error("[Database] Production MongoDB error:", error);
      process.exit(1);
    } else {
      console.warn(`[Database] MongoDB connection attempt failed (${error?.message || error}).`);
      console.log("[Database] Active embedded persistent store is operating with full persistence.");
    }
  }
  
  mongoose.connection.on("disconnected", () => {
    console.warn("[Database] MongoDB disconnected.");
  });

  mongoose.connection.on("error", (err) => {
    console.error("[Database] MongoDB connection error:", err);
  });
};

export const seedDatabaseIfEmpty = async (): Promise<void> => {
  try {
    const count = await ProductModel.countDocuments();
    if (count === 0) {
      console.log("[Database] MongoDB Atlas is connected and empty. Seeding products and categories from local store...");
      const store = DbStore.getInstance();
      const localCats = store.getCategories();
      const localProds = store.getProducts({ limit: 1000 }).products;

      if (localCats.length > 0) {
        const formattedCats = localCats.map(({ _id, ...rest }) => rest);
        await CategoryModel.insertMany(formattedCats);
        console.log(`[Database] Seeded ${formattedCats.length} categories to MongoDB Atlas.`);
      }

      if (localProds.length > 0) {
        const formattedProds = localProds.map(({ _id, ...rest }) => rest);
        await ProductModel.insertMany(formattedProds);
        console.log(`[Database] Seeded ${formattedProds.length} products to MongoDB Atlas.`);
      }
    } else {
      console.log(`[Database] MongoDB Atlas already has ${count} products.`);
      // Ensure critical products like dji-air-3s have full rich details
      const air3sInDb = await ProductModel.findOne({ slug: "dji-air-3s" });
      if (!air3sInDb) {
        const { _id, ...rest } = air3sProductData;
        await ProductModel.create(rest);
        console.log("[Database] Created DJI Air 3S in MongoDB Atlas with full rich specifications.");
      } else {
        const inTheBoxKeys = air3sInDb.inTheBoxVariants ? Object.keys(air3sInDb.inTheBoxVariants) : [];
        const featureCardsCount = Array.isArray(air3sInDb.featureCards) ? air3sInDb.featureCards.length : 0;
        const specsCount = Array.isArray(air3sInDb.rawSpecs) ? air3sInDb.rawSpecs.length : 0;
        if (featureCardsCount === 0 || inTheBoxKeys.length === 0 || specsCount < 10) {
          const { _id, ...rest } = air3sProductData;
          await ProductModel.findOneAndUpdate({ slug: "dji-air-3s" }, { $set: rest }, { new: true });
          console.log("[Database] Synchronized DJI Air 3S in MongoDB Atlas with full media, variants, and specifications.");
        }
      }
    }
  } catch (err) {
    console.error("[Database] Error seeding MongoDB Atlas:", err);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("[Database] MongoDB disconnected cleanly.");
  } catch (error) {
    console.error("[Database] Error disconnecting MongoDB:", error);
  }
};
