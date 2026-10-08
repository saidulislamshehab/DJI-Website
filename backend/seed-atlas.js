const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Load .env
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "d1store";

const dbJsonPath = path.resolve(__dirname, "data", "db.json");

async function seed() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
    dbName: dbName,
  });

  console.log("Connected to:", mongoose.connection.host);

  const db = mongoose.connection.db;

  if (!fs.existsSync(dbJsonPath)) {
    console.error("db.json not found at:", dbJsonPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(dbJsonPath, "utf-8");
  const data = JSON.parse(raw);

  console.log(`Found ${data.categories?.length || 0} categories and ${data.products?.length || 0} products in db.json.`);

  // 1. Seed Categories
  if (data.categories && data.categories.length > 0) {
    const catColl = db.collection("categories");
    await catColl.deleteMany({});
    const catsToInsert = data.categories.map((c) => {
      const { _id, ...rest } = c;
      return {
        ...rest,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    const catRes = await catColl.insertMany(catsToInsert);
    console.log(`✅ Seeded ${catRes.insertedCount} categories into MongoDB Atlas.`);
  }

  // 2. Seed Products
  if (data.products && data.products.length > 0) {
    const prodColl = db.collection("products");
    await prodColl.deleteMany({});
    const prodsToInsert = data.products.map((p) => {
      const { _id, ...rest } = p;
      return {
        ...rest,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    const prodRes = await prodColl.insertMany(prodsToInsert);
    console.log(`✅ Seeded ${prodRes.insertedCount} products into MongoDB Atlas.`);
  }

  // 3. Verify counts
  const finalProds = await db.collection("products").countDocuments();
  const finalCats = await db.collection("categories").countDocuments();
  console.log("\n=================================");
  console.log("🎉 Seeding Complete!");
  console.log(`- Atlas Products in '${dbName}.products': ${finalProds}`);
  console.log(`- Atlas Categories in '${dbName}.categories': ${finalCats}`);
  console.log("=================================\n");

  await mongoose.disconnect();
  console.log("Disconnected cleanly.");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
