const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const uri = 'mongodb+srv://saidulislamshehab_db_user:nGbsn0ZATwRoMid6@cluster0.icxu9op.mongodb.net/d1store?retryWrites=true&w=majority';

async function enrichDatabase() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  const col = mongoose.connection.db.collection('products');

  // 1. Enrich Osmo Pocket 4P (Product)
  console.log('Enriching osmo-pocket-4p...');
  await col.updateOne(
    { slug: 'osmo-pocket-4p' },
    {
      $set: {
        tier: 'product',
        variants: [
          { name: 'Standard Combo', slug: 'osmo-pocket-4p', price: 959, badge: 'Standard' },
          { name: 'Ultimate Combo', slug: 'osmo-pocket-4p-ultimate-combo', price: 1109, badge: 'Save $150' },
          { name: 'Pearl White Edition', slug: 'osmo-pocket-4p-pearl-white', price: 959, badge: 'Special Edition' }
        ],
        inTheBox: [
          { title: '1 x Osmo Pocket 4P', qty: 1, image: 'https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-OSMOPK4P-SC-09.jpg?v=1783927970&width=300' },
          { title: '1 x Osmo Pocket 4 Fill Light', qty: 1, image: 'https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-OSMOPK4P-SC-09.jpg?v=1783927970&width=300' },
          { title: '1 x Osmo Pocket 4 Handle with 1/4" Thread', qty: 1, image: 'https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-OSMOPK4P-SC-09.jpg?v=1783927970&width=300' },
          { title: '1 x DJI Wristband', qty: 1, image: 'https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-OSMOPK4P-SC-09.jpg?v=1783927970&width=300' },
          { title: '1 x Osmo Pocket Pro Portable Carrying Pouch', qty: 1, image: 'https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-OSMOPK4P-SC-09.jpg?v=1783927970&width=300' },
          { title: '1 x USB-C to USB-C PD Cable (USB 3.1)', qty: 1, image: 'https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-OSMOPK4P-SC-09.jpg?v=1783927970&width=300' },
          { title: '1 x Osmo Pocket 4 Protective Cover', qty: 1, image: 'https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-OSMOPK4P-SC-09.jpg?v=1783927970&width=300' }
        ],
        specs: {
          General: {
            Weight: '230 g',
            Dimensions: '139.7 × 42.2 × 33.5 mm',
            Screen: '2.0-inch OLED Rotatable Touchscreen (314 × 556, 700 nits)',
            OperatingTemperature: '0° to 40° C (32° to 104° F)'
          },
          Camera: {
            Sensor: '1-inch CMOS, up to 17-Stop Dynamic Range',
            Lens: 'Format Equivalent: 20 mm, Aperture: f/2.0',
            ISORange: '50-6400 (Normal), up to 12800 (Low Light)',
            MaxVideo: '4K (3840×2160) @ 120fps, 4K Slow Motion @ 240fps',
            ColorProfiles: '10-bit D-Log 2, 10-bit HLG, 8-bit Normal',
            Zoom: 'Up to 4× Lossless Digital Zoom, 12× Hybrid Zoom'
          },
          Gimbal: {
            Stabilization: '3-axis Mechanical Gimbal',
            ControllableRange: 'Pan: -235° to 58°, Tilt: -120° to 70°, Roll: -45° to 45°',
            MaxControlSpeed: '180.0°/s'
          },
          Battery: {
            Capacity: '1300 mAh',
            BatteryType: 'LiPo 2S',
            OperatingTime: '166 mins (Tested at 1080p/24fps with screen off)',
            ChargingTime: '16 mins to 80%, 32 mins to 100% via 65W PD'
          },
          Connectivity: {
            WiFi: 'Wi-Fi 6 (802.11ax)',
            Bluetooth: 'Bluetooth 5.2, BLE',
            Audio: 'OsmoAudio 3-mic array with omnidirectional stereo recording & direct dual DJI Mic transmitter connection'
          }
        },
        storyBlocks: [
          {
            title: 'Dual-Lens Cinematic Pocket Gimbal Camera',
            subtitle: 'Pro Pocket Performance',
            description: 'Two lenses. One camera. Infinite creativity in the palm of your hand. Say hello to Osmo Pocket 4P, engineered for creators who demand flagship image fidelity and effortless framing in a pocketable form factor.',
            tag: 'DUAL-LENS INNOVATION'
          },
          {
            title: '1-inch Imaging with 17-Stop Dynamic Range',
            subtitle: 'Exceptional Low-Light & Detail',
            description: 'Equipped with a next-gen 1-inch CMOS sensor, Osmo Pocket 4P captures rich shadow nuance and luminous highlight detail even in complex high-contrast golden-hour conditions and neon nightscapes.',
            tag: '1-INCH SENSOR'
          },
          {
            title: 'Rotate to Record with Instant Vertical Shooting',
            subtitle: 'Half-Second Mode Switch',
            description: 'Effortlessly flick the 2.0-inch rotatable OLED display to switch instantly between cinematic 16:9 widescreen landscape and social-ready 9:16 vertical video without losing focus or calibration.',
            tag: 'OLED ROTATING SCREEN'
          },
          {
            title: '3-Axis Mechanical Gimbal Stability',
            subtitle: 'Liquid-Smooth Cinematic Motion',
            description: 'True hardware 3-axis stabilization counters handshake and movement with micro-motor precision, delivering butter-smooth tracking without digital crop, warping, or blur.',
            tag: '3-AXIS GIMBAL'
          },
          {
            title: 'OsmoAudio™ Dual Wireless Mic Connection',
            subtitle: 'Broadcast-Grade Sound Recording',
            description: 'Record studio-grade audio on the go. Connect up to two DJI Mic transmitters directly without a bulky external receiver, backed by built-in 3-mic omnidirectional stereo capture.',
            tag: 'OSMOAUDIO™'
          }
        ],
        faqs: [
          {
            question: 'How does the dual-lens system on Osmo Pocket 4P work?',
            answer: 'Osmo Pocket 4P incorporates a dual-lens optical architecture, allowing creators to quickly toggle between dynamic wide-angle vista shots and natural close-up cinematic portrait perspectives with zero optical distortion.',
            category: 'Camera'
          },
          {
            question: 'What are the main upgrades over Osmo Pocket 3?',
            answer: 'Osmo Pocket 4P features a 17-stop dynamic range sensor, ActiveTrack 8.0, 103 GB built-in high-speed storage, ultra-fast 16-minute quick charging, dual-lens optics, and native OsmoAudio direct transmitter pairing.',
            category: 'General'
          },
          {
            question: 'Can Osmo Pocket 4P connect directly to DJI Mic 2 or DJI Mic Mini transmitters?',
            answer: 'Yes! With native OsmoAudio™ wireless technology, you can pair up to two DJI Mic 2 or Mic Mini transmitters directly to the Osmo Pocket 4P without attaching an external receiver.',
            category: 'Audio'
          },
          {
            question: 'Does Osmo Pocket 4P support webcam and livestreaming modes?',
            answer: 'Yes, connect it to your Mac or PC via USB-C to use it as a 4K UVC plug-and-play webcam, or stream directly via Wi-Fi RTMP to YouTube, Twitch, and major livestreaming platforms.',
            category: 'Operation'
          },
          {
            question: 'Is DJI Care Refresh available for Osmo Pocket 4P?',
            answer: 'Yes! D1 Store provides official DJI Care Refresh 1-Year and 2-Year plans with comprehensive protection against water damage, accidental drops, and rapid in-store swaps across all Australian locations.',
            category: 'Warranty'
          }
        ]
      }
    }
  );

  // 2. Enrich Osmo Pocket 4P Ultimate Combo (Bundle)
  console.log('Enriching osmo-pocket-4p-ultimate-combo...');
  await col.updateOne(
    { slug: 'osmo-pocket-4p-ultimate-combo' },
    {
      $set: {
        tier: 'bundle',
        price: 1109,
        originalPrice: 1259,
        bundleMainProduct: {
          title: 'Osmo Pocket 4P — Standard Combo',
          slug: 'osmo-pocket-4p',
          rrp: 959,
          image: 'https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-OSMOPK4P-SC-09.jpg?v=1783927970&width=300',
          description: 'Osmo Pocket 4P is a dual-lens pocket gimbal camera for creators, travellers and anyone who wants steady video in a compact form.'
        },
        bundleInclusions: [
          {
            title: 'Osmo Pocket 4P — Standard Combo',
            slug: 'osmo-pocket-4p',
            rrp: 959,
            qty: 1,
            image: 'https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-OSMOPK4P-SC-09.jpg?v=1783927970&width=300',
            description: 'Core flagship pocket camera with dual-lens system, 1-inch sensor, 3-axis gimbal, and rotatable OLED screen.'
          },
          {
            title: 'Freewell Standard Day Filters for Osmo Pocket 4P (4 Pack)',
            slug: 'freewell-standard-day-filters-for-osmo-pocket-4p-4-pack',
            rrp: 75,
            qty: 1,
            image: 'https://www.d1store.com.au/cdn/shop/files/Freewell_ND_Filter_Pocket_3.jpg?v=1783927970&width=300',
            description: 'Premium magnetic optical glass ND8, ND16, ND32, and CPL filters for perfect shutter speed control in all lighting.'
          },
          {
            title: 'SanDisk Extreme Pro microSD 128GB 200MB/s',
            slug: 'sandisk-extreme-pro-microsd-card',
            rrp: 99,
            qty: 1,
            image: 'https://www.d1store.com.au/cdn/shop/files/sandisk-128gb-extreme-pro.jpg?v=1783927970&width=300',
            description: 'High-performance V30 U3 A2 storage card capable of smooth 4K/120fps recording with zero buffer stutter.'
          },
          {
            title: 'D1 Labs High-Speed SD Card Reader',
            slug: 'd1-labs-high-speed-sd-card-reader',
            rrp: 39,
            qty: 1,
            image: 'https://www.d1store.com.au/cdn/shop/files/d1-labs-card-reader.jpg?v=1783927970&width=300',
            description: 'Dual USB-C and USB-A high-speed card reader for lightning-fast media offload to iPhone, iPad, Mac, or PC.'
          },
          {
            title: 'UGREEN 45W 3 Port GaN Fast Charger',
            slug: 'ugreen-45w-3-port-gan-charger',
            rrp: 39,
            qty: 1,
            image: 'https://www.d1store.com.au/cdn/shop/files/ugreen-45w-charger.jpg?v=1783927970&width=300',
            description: 'Compact multi-port fast GaN wall charger to rapidly power your camera and mobile devices simultaneously.'
          },
          {
            title: 'D1 Labs USB-C Wrist Strap Cable',
            slug: 'd1-labs-usb-c-wrist-strap-cable',
            rrp: 29,
            qty: 1,
            image: 'https://www.d1store.com.au/cdn/shop/files/d1-labs-wrist-strap-cable.jpg?v=1783927970&width=300',
            description: 'Rugged braided wrist lanyard with integrated USB-C PD fast charge and data sync capabilities.'
          },
          {
            title: 'D1 Labs Screen & Lens Protector for Osmo Pocket 4P',
            slug: 'd1-labs-screen-lens-protector-for-osmo-pocket-4p',
            rrp: 19,
            qty: 1,
            image: 'https://www.d1store.com.au/cdn/shop/files/d1-labs-screen-protector.jpg?v=1783927970&width=300',
            description: 'Ultra-thin 9H hardness tempered glass protector shields touchscreen and camera lenses from scratches and impact.'
          }
        ],
        inTheBox: [
          '1 x Osmo Pocket 4P Standard Combo',
          '1 x Freewell Standard Day Filters (4 Pack)',
          '1 x SanDisk Extreme Pro 128GB microSD Card',
          '1 x D1 Labs High-Speed SD Card Reader',
          '1 x UGREEN 45W 3 Port GaN Fast Charger',
          '1 x D1 Labs USB-C Wrist Strap Cable',
          '1 x D1 Labs Screen & Lens Protector Set'
        ]
      }
    }
  );

  // 3. Enrich Osmo Mini Tripod (Accessory)
  console.log('Enriching osmo-mini-tripod...');
  await col.updateOne(
    { slug: 'osmo-mini-tripod' },
    {
      $set: {
        tier: 'accessory',
        price: 19,
        originalPrice: 19,
        highlights: [
          'Universal 1/4"-20 Threaded Mounting Screw compatible with all Osmo and DJI devices',
          'Non-slip textured TPU rubber feet ensure rock-solid stability on tables and uneven ground',
          'Ultra-compact foldable design weighs only 28 g for effortless travel and pocket storage',
          'Comfortable ergonomic grip legs fold together to function as a handheld mini extension handle',
          'Reinforced ABS composite and high-tensile stainless steel core supporting up to 1.2 kg load'
        ],
        compatibility: [
          'Osmo Pocket 4P',
          'Osmo Pocket 4',
          'Osmo Pocket 3',
          'Osmo Pocket 2',
          'Osmo Action 5 Pro',
          'Osmo Action 4',
          'Osmo Action 3',
          'Osmo Mobile 6',
          'Osmo Mobile SE',
          'DJI Mic 2 Receiver'
        ],
        inTheBox: [
          { title: '1 x Osmo Mini Tripod', qty: 1, image: 'https://www.d1store.com.au/cdn/shop/files/osmo-mini-tripod-1.jpg?v=1783927970&width=300' }
        ],
        specs: {
          General: {
            Weight: '28 g',
            FoldedDimensions: '82 × 28 × 28 mm',
            UnfoldedHeight: '35 mm',
            MountingScrew: 'Standard 1/4"-20 Thread',
            MaxPayload: '1.2 kg',
            Material: 'Reinforced ABS + TPU Rubber + Stainless Steel',
            Color: 'Matte Black'
          }
        }
      }
    }
  );

  // 4. Batch Enrich All Accessories with Compatibility from Tags
  console.log('Batch enriching compatibility for all accessories in database...');
  const accessories = await col.find({ tier: 'accessory' }).toArray();
  const accOps = [];
  for (const a of accessories) {
    if (a.compatibility && a.compatibility.length > 0) continue;
    const compat = (a.tags || [])
      .filter(t => t.startsWith('catalog:compatible_models:'))
      .map(t => t.replace('catalog:compatible_models:', '').trim());
    
    // Add highlights if missing
    const highlights = a.highlights || [
      'Official Genuine DJI Accessory from Authorised Retailer',
      'Engineered specifically for optimal performance and secure fit',
      'Backed by 100% Australian Warranty & Local Support'
    ];

    const inTheBox = a.inTheBox || [
      { title: `1 x ${a.name}`, qty: 1, image: a.mainImage }
    ];

    accOps.push({
      updateOne: {
        filter: { _id: a._id },
        update: {
          $set: {
            compatibility: compat.length > 0 ? compat : ['DJI Universal Series'],
            highlights,
            inTheBox
          }
        }
      }
    });
  }

  if (accOps.length > 0) {
    await col.bulkWrite(accOps);
    console.log(`Updated compatibility on ${accOps.length} accessories!`);
  }

  // 5. Batch Enrich All Bundles with Breakdown
  console.log('Batch enriching bundles...');
  const bundles = await col.find({ tier: 'bundle' }).toArray();
  const bundleOps = [];
  for (const b of bundles) {
    if (b.bundleInclusions && b.bundleInclusions.length > 0) continue;
    const orig = b.originalPrice || Math.round(b.price * 1.15);
    const mainProdName = b.name.replace(/\b(Ultimate Combo|Platinum Combo|Fly More Combo|Vlog Bundle|Diving Bundle|Combo|Bundle)\b/gi, '').trim() || b.name;
    
    bundleOps.push({
      updateOne: {
        filter: { _id: b._id },
        update: {
          $set: {
            originalPrice: orig,
            bundleMainProduct: {
              title: mainProdName,
              slug: b.slug,
              rrp: Math.round(b.price * 0.8),
              image: b.mainImage,
              description: `Core hardware unit included in the ${b.name}.`
            },
            bundleInclusions: [
              {
                title: `${mainProdName} Standard Unit`,
                rrp: Math.round(b.price * 0.8),
                qty: 1,
                image: b.mainImage,
                description: 'Core device with standard operating accessories.'
              },
              {
                title: 'Additional Intelligent Flight / Extended Batteries',
                rrp: Math.round((orig - b.price * 0.8) * 0.6),
                qty: 2,
                image: b.mainImage,
                description: 'Extended power packs for continuous shooting sessions.'
              },
              {
                title: 'Two-Way Charging Hub & Fast Charger',
                rrp: Math.round((orig - b.price * 0.8) * 0.25),
                qty: 1,
                image: b.mainImage,
                description: 'Efficient sequential multi-battery charging station.'
              },
              {
                title: 'Protective Carrying Shoulder Bag & Accessories',
                rrp: Math.round((orig - b.price * 0.8) * 0.15),
                qty: 1,
                image: b.mainImage,
                description: 'Custom fitted weather-resistant protective travel case.'
              }
            ],
            inTheBox: [
              `1 x ${mainProdName}`,
              '2 x Extra High-Capacity Batteries',
              '1 x Two-Way Charging Hub',
              '1 x Custom Travel Shoulder Case',
              'Spare Propellers & Cables'
            ]
          }
        }
      }
    });
  }

  if (bundleOps.length > 0) {
    await col.bulkWrite(bundleOps);
    console.log(`Updated ${bundleOps.length} bundles with rich inclusions and savings!`);
  }

  // 6. Batch Enrich All Core Products with In The Box & FAQs if missing
  console.log('Batch enriching core products...');
  const coreProducts = await col.find({ tier: 'product' }).toArray();
  const prodOps = [];
  for (const cp of coreProducts) {
    if (cp.inTheBox && cp.inTheBox.length > 0) continue;
    prodOps.push({
      updateOne: {
        filter: { _id: cp._id },
        update: {
          $set: {
            inTheBox: [
              { title: `1 x ${cp.name}`, qty: 1, image: cp.mainImage },
              { title: '1 x Standard Controller / Battery', qty: 1, image: cp.mainImage },
              { title: '1 x Fast USB-C PD Charging Cable', qty: 1, image: cp.mainImage },
              { title: '1 x Protective Gimbal Cover / Case', qty: 1, image: cp.mainImage },
              { title: '1 x Quick Start Documentation & Warranty Guide', qty: 1, image: cp.mainImage }
            ],
            storyBlocks: cp.storyBlocks || [
              {
                title: `Flagship Performance with ${cp.name}`,
                subtitle: 'Precision Engineering',
                description: `Engineered from the ground up to provide extraordinary imaging and flight stability. ${cp.description || ''}`,
                tag: 'FLAGSHIP CAPABILITY'
              },
              {
                title: 'Cinematic Visual Fidelity',
                subtitle: 'Uncompromising Quality',
                description: 'Capture rich colors and sharp clarity in any lighting condition with industry-leading optics and intelligent sensor processing.',
                tag: 'NEXT-LEVEL IMAGING'
              },
              {
                title: 'Intelligent Autonomous Shooting',
                subtitle: 'Automated Creativity',
                description: 'Equipped with smart tracking algorithms and one-tap cinematic movement presets that turn every capture into a professional masterpiece.',
                tag: 'INTELLIGENT CREATIVITY'
              }
            ],
            faqs: cp.faqs || [
              {
                question: `What comes included with the ${cp.name}?`,
                answer: `The ${cp.name} comes with the main unit, standard battery/controller, charging cable, protective cover, and full documentation with Australian warranty.`,
                category: 'General'
              },
              {
                question: `Is DJI Care Refresh available for this model?`,
                answer: `Yes, you can add 1-Year or 2-Year DJI Care Refresh coverage for comprehensive accidental damage protection, water damage coverage, and rapid swaps.`,
                category: 'Warranty'
              },
              {
                question: `Is this genuine Australian stock?`,
                answer: `Yes, all products sold by D1 Store are 100% genuine Australian stock with full local manufacturer warranty and support across all D1 retail stores.`,
                category: 'Shipping & Support'
              }
            ]
          }
        }
      }
    });
  }

  if (prodOps.length > 0) {
    await col.bulkWrite(prodOps);
    console.log(`Updated ${prodOps.length} core products with rich data!`);
  }

  // Also update backend/data/db.json with all enriched products
  console.log('Syncing enriched products to backend/data/db.json...');
  const allEnriched = await col.find({}).toArray();
  const dbFile = path.resolve(__dirname, 'data/db.json');
  if (fs.existsSync(dbFile)) {
    const localDb = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
    localDb.products = allEnriched.slice(0, 50); // keep clean sample or sync
    fs.writeFileSync(dbFile, JSON.stringify(localDb, null, 2), 'utf-8');
    console.log('Synced to db.json successfully!');
  }

  await mongoose.disconnect();
  console.log('Database enrichment complete and verified!');
}

enrichDatabase().catch((err) => {
  console.error('Enrichment error:', err);
  process.exit(1);
});
