const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const fs = require('fs');

const MONGO_URI = process.env.MONGODB_URI;

const scraped = JSON.parse(fs.readFileSync('C:/Users/saidu/.gemini/antigravity/brain/dde8b407-2594-4a9c-95aa-058a49f41e65/scratch/scraped_categories.json', 'utf8'));

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
    productsCount: { type: Number, default: 0 },
    sortOrder: { type: String, default: "best-selling" },
    category: { type: String, default: "products" },
    categoryGroup: { type: String, default: "products" },
    isCategoryListing: { type: Boolean, default: false },
    dataTitle: { type: String, default: "" },
  },
  { timestamps: true, strict: false }
);

const Collection = mongoose.models.Collection || mongoose.model('Collection', collectionSchema);

async function updateCategories() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas");

    let updatedCount = 0;
    let insertedCount = 0;

    for (const [handle, item] of Object.entries(scraped)) {
      const existing = await Collection.findOne({ handle });
      if (existing) {
        existing.category = item.category;
        existing.categoryGroup = item.category;
        existing.isCategoryListing = true;
        existing.dataTitle = item.dataTitle || item.title.toLowerCase();
        if (item.image && (!existing.image || existing.image.includes('placeholder'))) {
          existing.image = item.image;
        }
        await existing.save();
        updatedCount++;
      } else {
        await Collection.create({
          shopifyId: Math.floor(Math.random() * 900000000000) + 100000000000,
          title: item.title,
          handle: item.handle,
          category: item.category,
          categoryGroup: item.category,
          isCategoryListing: true,
          dataTitle: item.dataTitle || item.title.toLowerCase(),
          image: item.image,
          productsCount: 1,
          tabs: ["Products", "Accessories"],
          breadcrumbs: ["Home", "Collections", item.title]
        });
        insertedCount++;
      }
    }

    console.log(`Updated: ${updatedCount}, Inserted: ${insertedCount}`);

    // Verify how many collections now have isCategoryListing = true
    const count = await Collection.countDocuments({ isCategoryListing: true });
    console.log(`Total isCategoryListing collections in MongoDB: ${count}`);

    // Let's verify category distribution in DB
    const dist = await Collection.aggregate([
      { $match: { isCategoryListing: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    console.log('Category breakdown in DB:', dist);

    process.exit(0);
  } catch (err) {
    console.error("Error updating collections in DB:", err);
    process.exit(1);
  }
}

updateCategories();
