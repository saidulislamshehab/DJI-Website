const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  const collection = mongoose.connection.collection('products');

  const products = await collection.find({}, { projection: { _id: 1, name: 1, rating: 1 } }).toArray();
  console.log(`Analyzing ${products.length} products...`);

  let updatedCount = 0;
  const bulkOps = [];

  for (const p of products) {
    const rawRating = Number(p.rating) || 4.9;
    const cleanRating = Math.round(rawRating * 10) / 10;
    if (p.rating !== cleanRating) {
      bulkOps.push({
        updateOne: {
          filter: { _id: p._id },
          update: { $set: { rating: cleanRating } }
        }
      });
      updatedCount++;
    }
  }

  console.log(`Products with non-clean ratings: ${updatedCount}`);
  if (bulkOps.length > 0) {
    const result = await collection.bulkWrite(bulkOps);
    console.log(`Successfully updated ${result.modifiedCount} products in MongoDB!`);
  }

  const distinctRatings = await collection.distinct('rating');
  console.log('All distinct ratings in database now:', distinctRatings);

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
