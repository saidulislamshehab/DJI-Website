const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const uri = 'mongodb+srv://saidulislamshehab_db_user:nGbsn0ZATwRoMid6@cluster0.icxu9op.mongodb.net/d1store?retryWrites=true&w=majority';

function classifyProduct(p) {
  const tags = (p.tags || []).map(t => String(t).trim().toLowerCase());
  const name = (p.name || '').toLowerCase();
  const slug = (p.slug || '').toLowerCase();
  const category = (p.category || '').toLowerCase();
  const subCategory = (p.subCategory || '').toLowerCase();

  // 1. Explicit Bundle Tag from D1 Store
  if (tags.includes('bundle-listing') || tags.includes('bundle')) {
    return 'bundle';
  }

  // 2. High-priority Bundle names (Combos, Bundles, Packages of drones/cameras/mics/power)
  const isExcludedBundle = /\b(filter|propeller|cable|screw|cleaning|lanyard|strap|mount|nozzle|sprinkler|lens hood)\b/i.test(name);
  const isExplicitBundle =
    /\b(combo|bundle|fly more|creator combo|ultimate combo|adventure combo|pro combo|standard combo|plus combo|cinema combo|enterprise combo|rtk combo|travel combo|diving bundle|vlog bundle|biking bundle|vlog combo)\b/i.test(name) ||
    slug.includes('-combo') ||
    slug.includes('-bundle') ||
    slug.includes('fly-more');

  if (isExplicitBundle && !isExcludedBundle) {
    return 'bundle';
  }

  // 3. Explicit Service / Warranty / Software / Accessory indicators that should NEVER be a Core product
  const strictAccessoryWords = [
    'care refresh', 'care enterprise', 'maintenance program', 'dji terra', 'warranty',
    'service plan', 'parachute', 'landing gear', 'gimbal clamp', 'propeller', 'battery',
    'charging hub', 'charger', 'filter', 'case', 'mount', 'lanyard', 'strap', 'cable',
    'hood', 'stick', 'adapter', 'bracket', 'arm', 'bag', 'protector', 'antenna',
    'receiver', 'guard', 'landing pad', 'cover', 'tripod', 'holder', 'harness',
    'sun hood', 'silicone case', 'corrective lenses', 'water sampling', 'sampling system'
  ];
  if (strictAccessoryWords.some(w => name.includes(w) || slug.includes(w))) {
    return 'accessory';
  }

  // 4. Explicit Accessory Tag
  if (tags.includes('catalog:product_role:accessory') || tags.includes('accessory') || tags.includes('accessories')) {
    return 'accessory';
  }

  // 5. Category is accessories
  if (category.includes('accessor') || subCategory.includes('accessor') || tags.includes('catalog:top_category:accessories')) {
    return 'accessory';
  }

  // 6. Explicit Core Tag -> "product"
  if (tags.includes('catalog:product_role:core')) {
    return 'product';
  }

  // 7. General accessory brand/type names
  const accessoryWords = [
    'd1 labs', 'lifthor', 'freewell', 'sunnylife', 'pgytech', 'pgtech', 'ugreen', 'sandisk',
    'polariser', 'remote controller', 'control stick', 'dji rc'
  ];
  if (accessoryWords.some(w => name.includes(w) || slug.includes(w))) {
    return 'accessory';
  }

  // Default to product
  return 'product';
}

async function migrate() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('Connected to MongoDB Atlas!');

  const col = mongoose.connection.db.collection('products');
  const products = await col.find({}).toArray();
  console.log(`Found ${products.length} products in MongoDB.`);

  const stats = { product: 0, bundle: 0, accessory: 0 };
  const bulkOps = [];

  for (const p of products) {
    const tier = classifyProduct(p);
    stats[tier]++;
    bulkOps.push({
      updateOne: {
        filter: { _id: p._id },
        update: { $set: { tier } }
      }
    });
  }

  if (bulkOps.length > 0) {
    console.log(`Executing bulk update for ${bulkOps.length} products in MongoDB...`);
    const res = await col.bulkWrite(bulkOps);
    console.log(`MongoDB update complete! Matched: ${res.matchedCount}, Modified: ${res.modifiedCount}`);
  }

  console.log('\n--- MONGODB CLASSIFICATION SUMMARY ---');
  console.log(stats);

  // Check specific user requested items
  const checkSlugs = [
    'dji-neo-2',
    'osmo-pocket-4p-ultimate-combo',
    'osmo-mini-tripod',
    'dji-neo',
    'osmo-pocket-3'
  ];
  console.log('\n--- VERIFYING USER-SPECIFIED ITEMS IN DATABASE ---');
  const verified = await col.find({ slug: { $in: checkSlugs } }).toArray();
  for (const v of verified) {
    console.log(`[${v.slug}] -> tier: "${v.tier}" (name: "${v.name}")`);
  }

  // Also update backend/data/db.json if it exists
  const dbFile = path.resolve(__dirname, 'data/db.json');
  if (fs.existsSync(dbFile)) {
    console.log('\nUpdating backend/data/db.json...');
    const localDb = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
    if (localDb.products && Array.isArray(localDb.products)) {
      for (const lp of localDb.products) {
        lp.tier = classifyProduct(lp);
      }
      fs.writeFileSync(dbFile, JSON.stringify(localDb, null, 2), 'utf-8');
      console.log(`Updated ${localDb.products.length} products in db.json!`);
    }
  }

  await mongoose.disconnect();
  console.log('\nMigration complete and verified!');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
