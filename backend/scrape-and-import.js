const https = require("https");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "d1store";

console.log("==================================================");
console.log("🚀 Starting Full D1 Store Data Scraper & Importer");
console.log("Source: https://www.d1store.com.au/");
console.log("Target Database: " + dbName);
console.log("==================================================\n");

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "application/json",
          },
        },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return resolve(fetchJson(res.headers.location));
          }
          let data = "";
          res.on("data", (c) => (data += c));
          res.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (err) {
              reject(new Error(`Failed to parse JSON from ${url}: ${err.message}`));
            }
          });
        }
      )
      .on("error", reject);
  });
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return resolve(fetchText(res.headers.location));
          }
          let data = "";
          res.on("data", (c) => (data += c));
          res.on("end", () => resolve(data));
        }
      )
      .on("error", reject);
  });
}

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractFeatures(html) {
  if (!html) return [];
  const listItems = html.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
  const features = listItems
    .map((li) => stripHtml(li))
    .filter((f) => f.length > 5 && f.length < 200)
    .slice(0, 8);
  return features;
}

function categorizeProduct(title, tags, productType) {
  const lower = (title + " " + tags.join(" ") + " " + (productType || "")).toLowerCase();

  // 1. Hasselblad
  if (lower.includes("hasselblad") || lower.includes("xcd") || lower.includes("907x") || lower.includes("x2d")) {
    let sub = "Hasselblad Accessories";
    if (lower.includes("x2d") || lower.includes("907x") || lower.includes("camera")) sub = "Hasselblad Cameras";
    else if (lower.includes("lens") || lower.includes("xcd")) sub = "Hasselblad Lenses";
    return {
      category: "Hasselblad Cameras",
      categorySlug: "hasselblad",
      subCategory: sub,
    };
  }

  // 2. Enterprise & Agriculture
  if (
    lower.includes("matrice") ||
    lower.includes("agras") ||
    lower.includes("zenmuse") ||
    lower.includes("dock") ||
    lower.includes("enterprise") ||
    lower.includes("t40") ||
    lower.includes("t25") ||
    lower.includes("t50") ||
    lower.includes("m350") ||
    lower.includes("m30t") ||
    lower.includes("m30")
  ) {
    let sub = "Enterprise Accessories";
    if (lower.includes("matrice")) sub = "Matrice Series";
    else if (lower.includes("agras")) sub = "Agras Series";
    else if (lower.includes("dock")) sub = "DJI Dock";
    else if (lower.includes("zenmuse")) sub = "Payloads & Zenmuse";
    return {
      category: "Enterprise & Agriculture",
      categorySlug: "enterprise",
      subCategory: sub,
    };
  }

  // 3. Professional Cinema / Filmmaking
  if (
    lower.includes("inspire") ||
    lower.includes("ronin 4d") ||
    lower.includes("transmission") ||
    lower.includes("focus pro") ||
    lower.includes("high-bright")
  ) {
    let sub = "Cinema Accessories";
    if (lower.includes("inspire")) sub = "Inspire Series";
    else if (lower.includes("ronin 4d")) sub = "Ronin 4D Cinema";
    else if (lower.includes("transmission")) sub = "DJI Transmission";
    return {
      category: "Professional Drones & Cinema",
      categorySlug: "professional",
      subCategory: sub,
    };
  }

  // 4. Handheld Cameras & Gimbals
  if (
    lower.includes("osmo pocket") ||
    lower.includes("pocket 3") ||
    lower.includes("pocket 4") ||
    lower.includes("osmo action") ||
    lower.includes("action 5") ||
    lower.includes("action 4") ||
    lower.includes("action 6") ||
    lower.includes("osmo mobile") ||
    lower.includes("dji mic") ||
    lower.includes("mic 2") ||
    lower.includes("mic mini") ||
    lower.includes("rs 4") ||
    lower.includes("rs 3") ||
    lower.includes("ronin-sc") ||
    lower.includes("gimbal") ||
    lower.includes("osmo")
  ) {
    let sub = "Handheld Accessories";
    if (lower.includes("pocket")) sub = "Osmo Pocket";
    else if (lower.includes("action")) sub = "Osmo Action";
    else if (lower.includes("mobile") || lower.includes("om ")) sub = "Osmo Mobile";
    else if (lower.includes("mic")) sub = "DJI Mic";
    else if (lower.includes("rs ") || lower.includes("ronin")) sub = "Ronin Camera Gimbals";
    return {
      category: "Handheld Cameras & Gimbals",
      categorySlug: "handheld",
      subCategory: sub,
    };
  }

  // 5. Consumer DJI Drones
  if (
    lower.includes("mavic") ||
    lower.includes("air 3") ||
    lower.includes("air 2") ||
    lower.includes("mini 4") ||
    lower.includes("mini 3") ||
    lower.includes("mini 2") ||
    lower.includes("mini 5") ||
    lower.includes("mini 4k") ||
    lower.includes("dji neo") ||
    lower.includes("neo 2") ||
    lower.includes("avata") ||
    lower.includes("fpv") ||
    lower.includes("drone")
  ) {
    let sub = "Drone Accessories";
    if (lower.includes("mavic")) sub = "Mavic Series";
    else if (lower.includes("air 3") || lower.includes("air 2") || lower.includes("air 3s")) sub = "Air Series";
    else if (lower.includes("mini")) sub = "Mini Series";
    else if (lower.includes("neo")) sub = "DJI Neo";
    else if (lower.includes("avata") || lower.includes("fpv")) sub = "Avata & FPV Series";
    return {
      category: "DJI Drones",
      categorySlug: "drones",
      subCategory: sub,
    };
  }

  // 6. Care Refresh & Services
  if (lower.includes("care refresh") || lower.includes("warranty")) {
    return {
      category: "Accessories & Services",
      categorySlug: "accessories",
      subCategory: "Care Refresh",
    };
  }

  // Default Accessories
  return {
    category: "Accessories & Gear",
    categorySlug: "accessories",
    subCategory: "Accessories",
  };
}

async function scrapeAndImport() {
  // 1. Fetch Homepage Media (Videos & Banners)
  console.log("📡 1. Fetching Homepage media from https://www.d1store.com.au/ ...");
  const homeHtml = await fetchText("https://www.d1store.com.au/");

  // Video URLs
  const videoRegex = /https?:[^\s"'<>\\]+?\.(mp4|webm)/gi;
  const rawVideos = homeHtml.match(videoRegex) || [];
  const uniqueVideos = [...new Set(rawVideos)];

  // Homepage media items
  const homepageVideos = [
    {
      title: "Osmo Pocket 4P Hero Video",
      url: "https://cdn.d1store.app/shopify/Home-Page/Pocket%204P%20Homepage%20Video.mp4",
      product: "Osmo Pocket 4P",
    },
    {
      title: "Mavic 4 Pro Hero Video",
      url: "https://cdn.d1store.app/shopify/Home-Page/Mavic%204%20Pro%20Homepage.mp4",
      product: "Mavic 4 Pro",
    },
    {
      title: "Osmo Action 6 Hero Video",
      url: "https://cdn.d1store.app/shopify/Home-Page/Osmo-Action-6-Home-Page.mp4",
      product: "Osmo Action 6",
    },
    {
      title: "Mic Mini 2S Hero Video",
      url: "https://cdn.d1store.app/shopify/Home-Page/Mic%20Mini%202S%20Home.mp4",
      product: "Mic Mini 2S",
    },
    {
      title: "Matrice 400 Enterprise Video",
      url: "https://cdn.d1store.app/shopify/Home-Page/Matrice%20400%20Homepage.mp4",
      product: "Matrice 400",
    },
    {
      title: "Osmo 360 II Video",
      url: "https://cdn.d1store.app/shopify/Home-Page/Osmo%20360%20II%20Home%20Video.mp4",
      product: "Osmo 360 II",
    },
  ];

  for (const v of uniqueVideos) {
    if (!homepageVideos.some((hv) => hv.url === v)) {
      homepageVideos.push({
        title: path.basename(decodeURIComponent(v)),
        url: v,
        product: "DJI Featured",
      });
    }
  }

  console.log(`✅ Extracted ${homepageVideos.length} official MP4 video URLs.`);

  // 2. Fetch Collections
  console.log("\n📡 2. Fetching Collections / Categories from collections.json ...");
  const collectionsData = await fetchJson("https://www.d1store.com.au/collections.json?limit=250");
  const rawCollections = collectionsData.collections || [];
  console.log(`✅ Extracted ${rawCollections.length} collections from D1 Store.`);

  // 3. Fetch All Products (Pagination: pages 1 to 5)
  console.log("\n📡 3. Scraping full product catalog (998+ products) from products.json ...");
  const allScrapedProducts = [];
  let page = 1;

  while (page <= 6) {
    const pageUrl = `https://www.d1store.com.au/products.json?limit=250&page=${page}`;
    process.stdout.write(`Fetching page ${page}... `);
    try {
      const pageData = await fetchJson(pageUrl);
      const prods = pageData.products || [];
      console.log(`found ${prods.length} products.`);
      if (prods.length === 0) break;
      allScrapedProducts.push(...prods);
      if (prods.length < 250) break;
      page++;
    } catch (err) {
      console.error(`Error fetching page ${page}:`, err.message);
      break;
    }
  }

  console.log(`\n🎉 Total products fetched: ${allScrapedProducts.length}`);

  // 4. Transform and Normalize Products
  console.log("\n🔄 4. Normalizing product records into Mongoose document structure...");
  const processedProducts = [];
  const categoryMap = new Map();

  for (const raw of allScrapedProducts) {
    const variant = raw.variants?.[0] || {};
    const price = parseFloat(variant.price) || 0;
    const compareAt = parseFloat(variant.compare_at_price) || 0;
    const discount = compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

    const { category, categorySlug, subCategory } = categorizeProduct(
      raw.title,
      raw.tags || [],
      raw.product_type
    );

    // Track category product counts
    if (!categoryMap.has(categorySlug)) {
      categoryMap.set(categorySlug, {
        name: category,
        slug: categorySlug,
        subCategories: new Set(),
        productCount: 0,
      });
    }
    const catEntry = categoryMap.get(categorySlug);
    catEntry.productCount += 1;
    if (subCategory) catEntry.subCategories.add(subCategory);

    // Extract images
    const images = (raw.images || []).map((img) => img.src).filter(Boolean);
    const mainImage = images[0] || "https://www-cdn.djiits.com/dji/image/default-product.png";

    // Extract clean description & features
    const cleanDesc = stripHtml(raw.body_html) || raw.title;
    const features = extractFeatures(raw.body_html);

    // Determine badges & flags
    let badge = "";
    if (discount > 0) badge = `SAVE ${discount}%`;
    else if (raw.tags?.some((t) => t.toLowerCase().includes("new"))) badge = "NEW";
    else if (raw.tags?.some((t) => t.toLowerCase().includes("hot") || t.toLowerCase().includes("bestseller"))) badge = "BESTSELLER";

    const isFeatured =
      price > 500 &&
      (raw.title.includes("Pro") ||
        raw.title.includes("Pocket") ||
        raw.title.includes("Air 3") ||
        raw.title.includes("Mavic") ||
        raw.title.includes("Mini 4") ||
        raw.title.includes("Neo") ||
        raw.title.includes("Action"));

    processedProducts.push({
      _id: "d1_" + raw.id,
      name: raw.title,
      slug: raw.handle,
      sku: variant.sku || `D1-${raw.id}`,
      category: category,
      categorySlug: categorySlug,
      subCategory: subCategory,
      price: price,
      originalPrice: compareAt > price ? compareAt : price,
      discountPercentage: discount,
      badge: badge || undefined,
      description: cleanDesc,
      features: features.length > 0 ? features : ["Official DJI Product", "100% Australian Warranty", "Authorised DJI Retailer"],
      specs: {
        productType: raw.product_type || "Hardware",
        vendor: raw.vendor || "DJI",
        tagsCount: (raw.tags || []).length,
      },
      images: images,
      mainImage: mainImage,
      inStock: variant.available !== false,
      stockCount: variant.inventory_quantity > 0 ? variant.inventory_quantity : 25,
      rating: 4.8 + Number((Math.random() * 0.2).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 45) + 5,
      isFeatured: isFeatured,
      isNewArrival: raw.tags?.some((t) => t.toLowerCase().includes("new")) || false,
      isBestSeller: discount > 15 || raw.tags?.some((t) => t.toLowerCase().includes("core")),
      createdAt: raw.created_at ? new Date(raw.created_at) : new Date(),
      updatedAt: raw.updated_at ? new Date(raw.updated_at) : new Date(),
    });
  }

  // Format categories
  const processedCategories = Array.from(categoryMap.values()).map((cat, index) => ({
    name: cat.name,
    slug: cat.slug,
    description: `Official DJI ${cat.name} available at D1 Store Australia.`,
    icon: cat.slug,
    subCategories: Array.from(cat.subCategories),
    productCount: cat.productCount,
    featuredOrder: index + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  // Demo user data for d1store.users
  const demoUsers = [
    {
      name: "D1 Store Administrator",
      email: "admin@d1store.com.au",
      role: "admin",
      isVerified: true,
      phone: "(03) 9288 7882",
      address: {
        street: "437 Bourke St",
        city: "Melbourne",
        state: "VIC",
        postcode: "3000",
        country: "Australia",
      },
      createdAt: new Date(),
    },
    {
      name: "Saidul Islam",
      email: "saidul@d1store.com.au",
      role: "customer",
      isVerified: true,
      phone: "+61 400 123 456",
      address: {
        city: "Melbourne",
        state: "VIC",
        country: "Australia",
      },
      createdAt: new Date(),
    },
  ];

  // 5. Connect and Write to MongoDB Atlas (d1store database)
  console.log(`\n💾 5. Connecting to MongoDB Atlas database '${dbName}'...`);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    dbName: dbName,
  });

  console.log(`Connected to ${mongoose.connection.host}/${dbName}!`);
  const db = mongoose.connection.db;

  // Insert Products
  console.log(`Writing ${processedProducts.length} products to collection '${dbName}.products'...`);
  const prodColl = db.collection("products");
  await prodColl.deleteMany({});
  const prodInsert = await prodColl.insertMany(processedProducts);
  console.log(`✅ Successfully inserted ${prodInsert.insertedCount} products into MongoDB Atlas!`);

  // Insert Categories
  console.log(`Writing ${processedCategories.length} categories to collection '${dbName}.categories'...`);
  const catColl = db.collection("categories");
  await catColl.deleteMany({});
  const catInsert = await catColl.insertMany(processedCategories);
  console.log(`✅ Successfully inserted ${catInsert.insertedCount} categories into MongoDB Atlas!`);

  // Insert Media & Videos
  console.log(`Writing ${homepageVideos.length} media records to collection '${dbName}.media'...`);
  const mediaColl = db.collection("media");
  await mediaColl.deleteMany({});
  const mediaInsert = await mediaColl.insertMany(homepageVideos);
  console.log(`✅ Successfully inserted ${mediaInsert.insertedCount} media/video URLs into MongoDB Atlas!`);

  // Seed Users
  console.log(`Updating users in collection '${dbName}.users'...`);
  const userColl = db.collection("users");
  for (const u of demoUsers) {
    await userColl.updateOne({ email: u.email }, { $set: u }, { upsert: true });
  }
  const userCount = await userColl.countDocuments();
  console.log(`✅ Collection '${dbName}.users' now has ${userCount} users.`);

  // 6. Update local backend/data/db.json so offline store stays 100% in sync
  const dbJsonPath = path.resolve(__dirname, "data", "db.json");
  const localDb = {
    products: processedProducts,
    categories: processedCategories,
    media: homepageVideos,
    orders: [],
    users: demoUsers,
  };
  fs.writeFileSync(dbJsonPath, JSON.stringify(localDb, null, 2), "utf-8");
  console.log(`✅ Updated local disk backup at ${dbJsonPath} with all ${processedProducts.length} products.`);

  // 7. Final Verification
  const totalAtlasProducts = await prodColl.countDocuments();
  const totalAtlasCategories = await catColl.countDocuments();
  const totalAtlasMedia = await mediaColl.countDocuments();
  const totalAtlasUsers = await userColl.countDocuments();

  console.log("\n==================================================");
  console.log("🏁 D1 STORE SCRAPE & IMPORT COMPLETE!");
  console.log(`Database: ${dbName}`);
  console.log(`- Products: ${totalAtlasProducts} documents`);
  console.log(`- Categories: ${totalAtlasCategories} documents`);
  console.log(`- Media & Videos: ${totalAtlasMedia} documents`);
  console.log(`- Users: ${totalAtlasUsers} documents`);
  console.log("==================================================\n");

  await mongoose.disconnect();
  console.log("Connection closed cleanly.");
}

scrapeAndImport().catch((err) => {
  console.error("\n❌ Scraping & Import failed:", err);
  process.exit(1);
});
