const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const fs = require('fs');

// MongoDB connection
const MONGO_URI = process.env.MONGODB_URI;

const collectionSchema = new mongoose.Schema(
  {
    shopifyId: { type: Number, index: true },
    title: { type: String, required: true },
    handle: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    heroBannerImage: { type: String, default: "" },
    breadcrumbs: [{ type: String }],
    tabs: [{ type: String }],
    subTabs: [
      {
        title: String,
        handle: String,
      },
    ],
    productsCount: { type: Number, default: 0 },
    sortOrder: { type: String, default: "best-selling" },
  },
  { timestamps: true }
);

const Collection = mongoose.models.Collection || mongoose.model('Collection', collectionSchema);

const MISSING_COLLECTIONS = [
  {
    title: "PGYTECH",
    handle: "pgytech",
    description: "Premium photography and drone accessories by PGYTECH for DJI creators.",
    image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/collections/pgytech.jpg?v=1788936695",
    heroBannerImage: "https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-PGYTECH-01.jpg?v=1781492650&width=1200",
    breadcrumbs: ["Home", "Accessories", "Brands", "PGYTECH"],
    tabs: ["Products", "Accessories"],
    productsCount: 12
  },
  {
    title: "DJI Air Series Accessories",
    handle: "dji-air-series-accessories",
    description: "Official accessories, batteries, filters, and safety gear for DJI Air drones.",
    image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/collections/PRODUCT-THUMB-DJIAIR3P2-01.jpg?v=1781492018",
    heroBannerImage: "https://cdn.d1store.app/shopify/product-page-editor/assets/cf5b01a1-2901-4709-b63b-32d4cd7a10dd/005-website-categoryimages-air3s-fa.webp",
    breadcrumbs: ["Home", "Accessories", "Drones", "DJI Air Series Accessories"],
    tabs: ["Products", "Accessories"],
    productsCount: 18
  },
  {
    title: "Phantom Series Accessories",
    handle: "phantom-series-accessories",
    description: "Batteries, props, and charging solutions for DJI Phantom series drones.",
    image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/collections/phantom.jpg?v=1788936695",
    heroBannerImage: "https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-PHANTOM4-01.jpg?v=1781492650&width=1200",
    breadcrumbs: ["Home", "Accessories", "Drones", "Phantom Series Accessories"],
    tabs: ["Products", "Accessories"],
    productsCount: 8
  },
  {
    title: "DJI FPV Accessories",
    handle: "dji-fpv-accessories",
    description: "FPV goggles, motion controllers, batteries, and props for DJI FPV and Avata.",
    image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/collections/fpv.jpg?v=1788936695",
    heroBannerImage: "https://cdn.d1store.app/shopify/product-page-editor/assets/6cb925f3-3d84-47a4-a3a6-50c70bf7bbde/005-website-categoryimages-avata360-fa.webp",
    breadcrumbs: ["Home", "Accessories", "Drones", "DJI FPV Accessories"],
    tabs: ["Products", "Accessories"],
    productsCount: 14
  },
  {
    title: "Osmo Pocket Series Accessories",
    handle: "osmo-pocket-series-accessories",
    description: "Wide-angle lenses, battery handles, mounts, and adapters for Osmo Pocket 3 and 4.",
    image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/collections/pocket-accessories.jpg?v=1788936695",
    heroBannerImage: "https://cdn.d1store.app/shopify/product-page-editor/assets/9a4fcda6-2e7a-47eb-84ab-5e63c963423b/005-website-categoryimages-batch2-osmopocket4p-fa.jpg",
    breadcrumbs: ["Home", "Accessories", "Handhelds", "Osmo Pocket Series Accessories"],
    tabs: ["Products", "Accessories"],
    productsCount: 22
  },
  {
    title: "Osmo Mobile Series Accessories",
    handle: "osmo-mobile-series-accessories",
    description: "Magnetic clamps, tripods, extension rods, and lights for Osmo Mobile gimbals.",
    image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/collections/mobile-accessories.jpg?v=1788936695",
    heroBannerImage: "https://cdn.d1store.app/shopify/product-page-editor/assets/3b5ddb8e-3439-45b9-ad20-e51cc7567de7/005-website-categoryimages-mobile8p-fa.webp",
    breadcrumbs: ["Home", "Accessories", "Handhelds", "Osmo Mobile Series Accessories"],
    tabs: ["Products", "Accessories"],
    productsCount: 16
  }
];

const HERO_FALLBACKS = {
  "dji-mic-mini-2s": "https://cdn.d1store.app/shopify/product-page-editor/assets/e3fbcd72-7430-4544-a29c-70bd325df8eb/005-website-categoryimages-micmini2-fa.webp",
  "hasselblad-xcd-v-series-lenses": "https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-XCD90V-01.jpg?v=1781492650&width=1200",
  "cables": "https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-DJICABLE-01.jpg?v=1781492650&width=1200",
  "osmo-action-series-accessories": "https://cdn.d1store.app/shopify/product-page-editor/assets/ae4e2e01-568d-4fa0-9450-eef56b6293ce/005-website-categoryimages-osmoaction6-fa.webp"
};

async function syncCollections() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // 1. Insert missing collections
    for (const item of MISSING_COLLECTIONS) {
      const existing = await Collection.findOne({ handle: item.handle });
      if (!existing) {
        await Collection.create({
          shopifyId: Math.floor(Math.random() * 900000000000) + 100000000000,
          ...item
        });
        console.log(`+ Inserted missing collection: ${item.handle}`);
      } else {
        console.log(`= Already exists: ${item.handle}`);
      }
    }

    // 2. Patch collections missing heroBannerImage, breadcrumbs, or tabs
    const all = await Collection.find({});
    let updatedCount = 0;

    for (const col of all) {
      let needsSave = false;

      // Fix missing heroBannerImage
      if (!col.heroBannerImage) {
        if (HERO_FALLBACKS[col.handle]) {
          col.heroBannerImage = HERO_FALLBACKS[col.handle];
          needsSave = true;
        } else if (col.image) {
          col.heroBannerImage = col.image;
          needsSave = true;
        }
      }

      // Fix missing tabs
      if (!col.tabs || col.tabs.length === 0) {
        col.tabs = ["Products", "Bundles", "Accessories"];
        needsSave = true;
      }

      // Fix missing breadcrumbs
      if (!col.breadcrumbs || col.breadcrumbs.length === 0) {
        col.breadcrumbs = ["Home", "Collections", col.title];
        needsSave = true;
      }

      if (needsSave) {
        await col.save();
        updatedCount++;
      }
    }

    console.log(`Updated ${updatedCount} collections with missing fields`);

    // 3. Export all collections to frontend JSON file
    const finalCollections = await Collection.find({}).lean();
    console.log(`Total collections in database now: ${finalCollections.length}`);

    const exportPath = path.resolve(__dirname, '../../frontend/src/data/d1_collections.json');
    fs.writeFileSync(exportPath, JSON.stringify(finalCollections, null, 2), 'utf8');
    console.log(`Successfully exported all ${finalCollections.length} collections to: ${exportPath}`);

    process.exit(0);
  } catch (err) {
    console.error("Sync error:", err);
    process.exit(1);
  }
}

syncCollections();
