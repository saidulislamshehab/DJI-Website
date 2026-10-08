const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const uri = process.env.MONGODB_URI;

const productsData = [
  {
    slug: 'dji-mini-5-pro',
    name: 'DJI Mini 5 Pro',
    tagline: 'Mini to the Max — Next-Gen Sub-249g Flagship Drone',
    badge: 'Under 249g Flagship',
    price: 1009,
    originalPrice: 1099,
    mainImage: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-MINI5PRO-RCN3-10.jpg?v=1783639373',
    images: [
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-MINI5PRO-RCN3-10.jpg?v=1783639373',
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-MINI5PRO-FMC-RCN3-05.jpg?v=1781678174',
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-MINI5PRO-FMC-RCN3-04.jpg?v=1781678168',
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-MINI5PRO-RCN3-11.jpg?v=1783639377',
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-MINI5PRO-FMCP-10.jpg?v=1785071277'
    ],
    overviewBanner: {
      title: 'DJI Mini 5 Pro',
      tagline: 'Mini to the Max — Next-Gen Sub-249g Flagship Drone',
      description: 'Weighing under 249g with no CASA registration required for recreational flying, DJI Mini 5 Pro delivers omnidirectional obstacle sensing, upgraded 1-inch CMOS camera, 4K/120fps slow-motion, true vertical video, and 20km O4 FHD transmission.',
      badge: 'Under 249g Flagship',
      features: ['Under 249g Ultralight', 'Upgraded 1-inch CMOS Camera', 'Nightscape Omnidirectional Sensing', '4K/120fps & True Vertical Shooting', 'ActiveTrack 360°', '20km O4 Video Transmission']
    },
    variants: [
      { name: 'Standard (DJI RC-N3)', price: 1009, sku: 'MINI5PRO-RCN3', variantId: '46812102131873' },
      { name: 'Fly More Combo (DJI RC-N3)', price: 1279, sku: 'MINI5PRO-FMC-RCN3', variantId: '45696746455201', badge: 'Popular Value' },
      { name: 'Fly More Combo (DJI RC 2)', price: 1529, sku: 'MINI5PRO-FMC', variantId: '46812102164641', badge: 'Screen Remote' },
      { name: 'Fly More Combo Plus (DJI RC 2)', price: 1619, sku: 'MINI5PRO-FMCP', variantId: '46812102197409', badge: 'Ultimate Extended' }
    ],
    videoShowcases: [
      {
        id: 'header-video',
        title: 'Next-Generation Imaging & Gimbal Freedom',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/products/mini-5-pro/d7dc4a4d-cf27-439a-b790-1cfc48ded702-mini-5-pro-header-video.mp4',
        description: 'Engineered for travel creators and aerial filmmakers, Mini 5 Pro redefines sub-249g drones with a revolutionary gimbal design and expanded tilt range.'
      },
      {
        id: 'new-gimbal',
        title: 'Expanded Gimbal Tilt Range & True Vertical',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/512b133c-c059-4cb4-b325-0f66158c2576/mini5-new-gimbal.mp4',
        description: 'Tilt upwards by up to 60° for dramatic low-angle architectural photography, or rotate the entire camera physically into True Vertical 9:16 portrait orientation.'
      },
      {
        id: 'activetrack-360',
        title: 'ActiveTrack 360° Intelligent Follow',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/f5ffef50-1402-4d4a-a81a-ded67f4e26a2/mini5-active-track-360.mp4',
        description: 'Customize precise tracking flight paths via the intuitive wheel interface. Mini 5 Pro effortlessly keeps your subjects framed while avoiding surrounding obstacles.'
      },
      {
        id: 'slow-mo-4k120',
        title: 'Cinematic 4K/120fps Slow-Motion & 10-Bit D-Log M',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/dddb5ba1-6543-4245-8878-1e68577cf97a/mini5-4k-120-slow-mo.mp4',
        description: 'Capture high-speed sports, surf breaks, and automotive passes with buttery-smooth 4K 120fps slow-motion recording in 10-bit color.'
      }
    ],
    inTheBox: [
      { title: '1 x DJI Mini 5 Pro Aircraft', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-MINI5PRO-RCN3-10.jpg?v=1783639373' },
      { title: '1 x DJI RC-N3 Remote Controller', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-MINI5PRO-RCN3-10.jpg?v=1783639373' },
      { title: '1 x Intelligent Flight Battery', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-MINI5PRO-RCN3-10.jpg?v=1783639373' },
      { title: '1 x Spare Propellers (Pair)', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-MINI5PRO-RCN3-10.jpg?v=1783639373' },
      { title: '1 x Gimbal Protector', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-MINI5PRO-RCN3-10.jpg?v=1783639373' },
      { title: '1 x Type-C to Type-C PD Cable', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-MINI5PRO-RCN3-10.jpg?v=1783639373' }
    ],
    rawSpecs: [
      { group: 'Aircraft', label: 'Takeoff Weight', value: '< 249 g' },
      { group: 'Aircraft', label: 'Max Flight Time', value: '38 minutes (47 minutes with Plus Battery)' },
      { group: 'Camera', label: 'Sensor', value: '1-inch CMOS, 48 MP Effective' },
      { group: 'Camera', label: 'Video Resolution', value: '4K (3840×2160@120/60fps), True Vertical 4K' },
      { group: 'Sensing', label: 'Obstacle Sensing', value: 'Omnidirectional Vision System + LiDAR' },
      { group: 'Transmission', label: 'Transmission System', value: 'DJI O4, up to 20 km (FCC)' }
    ],
    faqs: [
      { question: 'Does DJI Mini 5 Pro require drone registration in Australia?', answer: 'No! Because the DJI Mini 5 Pro weighs under 249 grams with the standard battery, recreational flyers in Australia are not required to register the drone with CASA.' },
      { question: 'What is the main difference between Mini 4 Pro and Mini 5 Pro?', answer: 'Mini 5 Pro features an upgraded larger 1-inch sensor, 4K/120fps recording, expanded upward gimbal tilt angle, and extended battery life.' }
    ]
  },

  {
    slug: 'osmo-pocket-3',
    name: 'Osmo Pocket 3',
    tagline: 'For Moving Moments — 1-inch CMOS Pocket Gimbal Camera',
    badge: 'Creator Gimbal Camera',
    price: 508,
    originalPrice: 599,
    mainImage: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK3CC-05.jpg?v=1783668290',
    images: [
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK3CC-05.jpg?v=1783668290',
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK3CC-08.jpg?v=1783668305',
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK3CC-09.jpg?v=1783668310',
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK3CC-06.jpg?v=1783668295'
    ],
    overviewBanner: {
      title: 'Osmo Pocket 3',
      tagline: 'For Moving Moments — 1-inch CMOS Pocket Gimbal Camera',
      description: 'The all-new Pocket 3 features a powerful 1-inch CMOS sensor that puts detail-rich imaging right in the palm of your hand. With a 2-inch rotatable touchscreen and full-pixel fast focusing, go horizontal or vertical for more precise awareness and control.',
      badge: 'Creator Gimbal Camera',
      features: ['1-inch CMOS Sensor', '4K/120fps High-Frame-Rate', '2-inch Rotatable Touchscreen', '3-Axis Mechanical Stabilization', 'ActiveTrack 6.0', 'Full-Pixel Fast Focusing']
    },
    variants: [
      { name: 'Standard Combo', price: 508, sku: 'OSMOPK3SC', variantId: '45766710100129' },
      { name: 'Creator Combo', price: 665, sku: 'OSMOPK3CC', variantId: '45766710132897', badge: 'Creator Favorite' }
    ],
    videoShowcases: [
      {
        id: '1inch-sensor',
        title: '1-inch CMOS Sensor with 4K/120fps',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/imports/Osmo-Pocket-3/fa2a9418-648d-4033-8bd8-a32d044e1136-infocardhorizontal-vid-2.mp4',
        description: 'Pocket 3’s powerful 1-inch CMOS sensor captures clear highlight-shadow details. Its superior optical performance enables a significant leap in image quality, providing reliable low-light performance.'
      },
      {
        id: 'rotatable-screen',
        title: '2.0-inch Rotatable OLED Display',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/imports/Osmo-Pocket-3/ebd5f72e-2002-477b-a664-8e41a31e88b2-infocardvertical-vid-49.mp4',
        description: 'With a 2-inch full-color OLED touchscreen, Pocket 3 puts vibrant visuals and effortless control right at your fingertips. Rotate to start shooting or simply tap to access parameter adjustments.'
      },
      {
        id: 'fast-focus',
        title: 'Full-Pixel Fast Focusing & Product Showcase',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/imports/Osmo-Pocket-3/6efb9e58-9a76-4617-a967-a9f18ac9a8d3-infocardvertical-vid-20.mp4',
        description: 'Pocket 3’s full-pixel fast focusing locks onto even the fastest-moving subjects with ease. Introduce Product Showcase mode for prioritize foreground items during livestreaming.'
      },
      {
        id: 'activetrack-6',
        title: 'ActiveTrack 6.0 Intelligent Framing',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/imports/Osmo-Pocket-3/c8e1a5f9-7325-4723-ba6b-e898e945e2ec-osmo-pocket-3-001.webm',
        description: 'ActiveTrack 6.0 introduces Face Auto-Detect and Dynamic Framing, letting you produce smooth, cinematic footage with one hand.'
      }
    ],
    inTheBox: [
      { title: '1 x Osmo Pocket 3', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK3CC-05.jpg?v=1783668290' },
      { title: '1 x Type-C to Type-C PD Cable', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK3CC-05.jpg?v=1783668290' },
      { title: '1 x Osmo Pocket 3 Protective Cover', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK3CC-05.jpg?v=1783668290' },
      { title: '1 x DJI Wrist Strap', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK3CC-05.jpg?v=1783668290' },
      { title: '1 x Handle With 1/4″ Thread', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK3CC-05.jpg?v=1783668290' }
    ],
    rawSpecs: [
      { group: 'General', label: 'Dimensions', value: '139.7×42.2×33.5 mm (L×W×H)' },
      { group: 'General', label: 'Weight', value: '179 g' },
      { group: 'Camera', label: 'Sensor', value: '1-inch CMOS' },
      { group: 'Camera', label: 'Max Video', value: '4K (3840×2160) at up to 120fps' },
      { group: 'Battery', label: 'Operating Time', value: '166 mins (1080p/24fps)' },
      { group: 'Battery', label: 'Charging Time', value: '16 mins to 80%' }
    ],
    faqs: [
      { question: 'Does Osmo Pocket 3 have internal storage?', answer: 'Osmo Pocket 3 does not have internal storage for video and requires a microSD card (up to 512GB supported).' },
      { question: 'What is the maximum recording resolution of Osmo Pocket 3?', answer: 'Osmo Pocket 3 records in 4K (3840×2160) at up to 120fps in slow-motion and 60fps standard.' }
    ]
  }
];

async function syncAdditionalProducts() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    for (const p of productsData) {
      const res = await mongoose.connection.collection('products').updateOne(
        { slug: p.slug },
        {
          $set: {
            name: p.name,
            tagline: p.tagline,
            badge: p.badge,
            price: p.price,
            originalPrice: p.originalPrice,
            mainImage: p.mainImage,
            images: p.images,
            overviewBanner: p.overviewBanner,
            variants: p.variants,
            videoShowcases: p.videoShowcases,
            inTheBox: p.inTheBox,
            rawSpecs: p.rawSpecs,
            faqs: p.faqs,
            updatedAt: new Date()
          }
        }
      );
      console.log(`Updated ${p.slug}: matched ${res.matchedCount}, modified ${res.modifiedCount}`);
    }

    console.log('Sync additional products completed successfully!');
  } catch (err) {
    console.error('Error syncing:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

syncAdditionalProducts();
