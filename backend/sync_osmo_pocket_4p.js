const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const uri = process.env.MONGODB_URI;

async function syncOsmoPocket4P() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  const col = mongoose.connection.db.collection('products');

  const faqs = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'osmo_pocket_4p_faqs.json'), 'utf-8'));
  const specs = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'osmo_pocket_4p_specs.json'), 'utf-8'));

  console.log(`Loaded ${faqs.length} FAQs and ${specs.length} specs.`);

  const standardInTheBox = [
    { title: '1 x Osmo Pocket 4P', qty: 1, image: 'https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/1ad5032e-8e79-4763-b92c-9b1f826236c7-itb-osmopk4p-001.webp' },
    { title: '1 x Osmo Pocket 4 Fill Light', qty: 1, image: 'https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/d4cbd70f-1eda-4093-9745-902327043322-itb-osmopk4p-016.webp' },
    { title: '1 x Osmo Pocket 4 Handle with 1/4" Thread', qty: 1, image: 'https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/5605533e-38a8-496a-acff-3e6ccb85519e-itb-osmopk4p-014.webp' },
    { title: '1 x DJI Wristband', qty: 1, image: 'https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/ec54b670-4981-482b-b507-dc2990c2916f-itb-osmopk4p-015.webp' },
    { title: '1 x Osmo Pocket Pro Portable Carrying Pouch', qty: 1, image: 'https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/4e4ed4da-a77b-499d-887a-8bf98e8a4b31-itb-osmopk4p-013.webp' },
    { title: '1 x USB-C to USB-C PD Cable (USB 3.1)', qty: 1, image: 'https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/4c20cd42-d15a-4b50-a049-943e18d274e4-itb-osmopk4p-017.webp' }
  ];

  const vlogInTheBox = [
    ...standardInTheBox,
    { title: '1 x Osmo FrameTap', qty: 1, image: 'https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/3dea9bf6-dd34-4215-897d-bf943d54fb14-itb-osmopk4p-012.webp' },
    { title: '1 x Osmo FrameTap Magnetic Charging Cable', qty: 1, image: 'https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/0bef48ac-2d35-4d07-8f3b-76cc07720280-itb-osmopk4p-011.webp' },
    { title: '1 x DJI Mic Mini 2 Transmitter', qty: 1, image: 'https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/9eb4d03e-5418-4c99-97de-0f370b7f84cf-itb-osmopk4p-010.webp' },
    { title: '1 x DJI Mic Mini 2 Transmitter Magnetic Cable', qty: 1, image: 'https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/fc9f2432-184b-4189-9f17-eee17cc01767-itb-osmopk4p-009.webp' },
    { title: '1 x DJI Mic Mini 2 Windscreen (Black/Gray)', qty: 1, image: 'https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/25710dd4-60e5-4705-a424-c84a914c3128-itb-osmopk4p-008.webp' },
    { title: '1 x DJI Mic Mini 2 Front Cover (Glaze White)', qty: 1, image: 'https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/7dc1c89a-2fd0-460e-b9db-c1f285fe0ac2-itb-osmopk4p-007.webp' },
    { title: '1 x DJI Mic Mini 2 Front Cover (Obsidian Black)', qty: 1, image: 'https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/4442fda4-fbc0-44d0-bb78-fcc8b68a237a-itb-osmopk4p-006.webp' },
    { title: '1 x DJI Mic Mini 2 Magnetic Clip', qty: 1, image: 'https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/1a69e67f-6a5f-4142-b2d9-b096b5d8e5f7-itb-osmopk4p-005.webp' },
    { title: '1 x DJI Mic 3 Magnet', qty: 1, image: 'https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/fd9b345d-b1e7-4155-98b3-6d6003020279-itb-osmopk4p-004.webp' },
    { title: '1 x Osmo Mini Tripod', qty: 1, image: 'https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/88256ded-3c14-4a08-b16d-c02002e7121b-itb-osmopk4p-003.webp' },
    { title: '1 x Osmo Pocket Pro Carrying Bag', qty: 1, image: 'https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/89bd977b-fa9f-4d81-b01d-deaf3edba131-itb-osmopk4p-002.webp' }
  ];

  const videoShowcases = [
    {
      id: 'imaging',
      title: '1-inch Imaging',
      videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/168f0fce-d4c3-41cc-aa08-a0adf634aff4/pocket-4p-stitched.webm',
      description: 'Osmo Pocket 4P is optimised for any shooting environment. Day or night, dark or bright, Osmo Pocket 4P can handle it all with 17-stop dynamic range and a LOFIC-powered sensor. Highlights and shadows remain balanced for dynamic, true-to-life colours.',
      subcards: [
        { title: 'Record in Dark or Light', description: 'Day or night, dark or bright, Osmo Pocket 4P can handle it all with 17-stop dynamic range and a LOFIC-powered sensor. Highlights and shadows remain balanced for dynamic, true-to-life colours.' },
        { title: 'D-Log 2', description: 'Osmo Pocket 4P introduces new D-Log 2 recording and 10-bit colour depth, capturing and preserving more highlight and shadow detail than ever before. Gain full control over colours with richer details and data for grading flexibility.' },
        { title: 'Fantastic Photos', description: 'Osmo Pocket 4P shoots more than just video! Snap phenomenal 37MP photos with crystal-clear details and reframing flexibility in post.' }
      ]
    },
    {
      id: 'portraits',
      title: 'Portrait Perfection',
      videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/7e25af60-be85-47fc-9983-98b46504bea7/d57ee7a6-156f-4a39-bad3-c895320bd922-1.mp4',
      description: 'Capture lifelike skin tones and stunning depth of field across varying lighting environments.',
      modes: ['Neon Cityscapes', 'Blue Hour', 'Cool-Toned Portrait', 'Warm-Toned Portrait']
    },
    {
      id: 'rotate',
      title: 'Rotate to Record',
      videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/6b6cdbae-2f35-4f29-8d74-df9511647958/45d4ac41-d24c-4300-a06f-d78ba24dfee2.webm',
      description: 'Effortlessly rotate the 2.0-inch OLED touchscreen to switch between immersive 16:9 widescreen landscape and social-ready 9:16 vertical video in half a second.',
      subcards: [
        { title: 'OLED Rotating Display', description: 'Full touch responsive screen rotates smoothly with instant orientation lock.' }
      ]
    },
    {
      id: 'dynamic',
      title: 'Dynamic Recording & Subject Tracking',
      videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/d83fd051-9720-485b-81ee-4ec4b27a7485/3f4a2113-0711-4fac-a1c8-4bd1660e273f.webm',
      description: 'Next-generation ActiveTrack 8.0 recognizes multiple subjects and keeps them perfectly centered with fluid 3-axis gimbal compensation.',
      modes: ['Follow Me Fun', 'Keep Subjects Centred']
    }
  ];

  await col.updateOne(
    { slug: 'osmo-pocket-4p' },
    {
      $set: {
        tier: 'product',
        variants: [
          { name: 'Standard Combo', slug: 'osmo-pocket-4p', price: 959, badge: 'Standard Combo', variantId: '46551056089249', sku: 'OSMOPK4P-SC' },
          { name: 'Vlog Combo', slug: 'osmo-pocket-4p', price: 1099, badge: 'Vlog Combo', variantId: '46551056122017', sku: 'OSMOPK4P-VC' },
          { name: 'Ultimate Combo', slug: 'osmo-pocket-4p-ultimate-combo', price: 1109, badge: 'Save $150', variantId: '46551056154785', sku: 'OSMOPK4P-UC' }
        ],
        inTheBox: standardInTheBox,
        inTheBoxVariants: {
          standard: standardInTheBox,
          vlog: vlogInTheBox
        },
        videoShowcases,
        faqs,
        rawSpecs: specs
      }
    }
  );

  console.log('Successfully updated osmo-pocket-4p in MongoDB Atlas!');

  // Sync to backend/data/db.json
  const dbFile = path.resolve(__dirname, 'data/db.json');
  if (fs.existsSync(dbFile)) {
    const localDb = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
    const idx = localDb.products.findIndex(p => p.slug === 'osmo-pocket-4p');
    if (idx !== -1) {
      localDb.products[idx].inTheBox = standardInTheBox;
      localDb.products[idx].inTheBoxVariants = { standard: standardInTheBox, vlog: vlogInTheBox };
      localDb.products[idx].videoShowcases = videoShowcases;
      localDb.products[idx].faqs = faqs;
      localDb.products[idx].rawSpecs = specs;
      fs.writeFileSync(dbFile, JSON.stringify(localDb, null, 2), 'utf-8');
      console.log('Synced to db.json!');
    }
  }

  await mongoose.disconnect();
}

syncOsmoPocket4P().catch(console.error);
