const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const p = await mongoose.connection.db.collection('products').find({
    name: { $regex: 'Mavic 4 Pro', $options: 'i' }
  }).toArray();
  console.log('Mavic 4 Pro main products:', p.map(x => ({ name: x.name, slug: x.slug, price: x.price, collections: x.collections })));
  await mongoose.disconnect();
}
check();
