const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb+srv://d1store:d1store2026@d1store.icxu9op.mongodb.net/d1store?retryWrites=true&w=majority";

async function seedOsmoNano() {
  console.log("[Seed] Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGO_URI);
  console.log("[Seed] Connected successfully!");

  const db = mongoose.connection.db;
  const productsCol = db.collection("products");

  const osmoNanoData = {
    name: "DJI Osmo Nano",
    slug: "osmo-nano",
    sku: "OSMON-64",
    category: "Handhelds",
    categorySlug: "handhelds",
    subCategory: "Wearable & Action Cameras",
    collections: ["handhelds", "action-cameras", "all", "just-landed"],
    tags: [
      "osmo-nano",
      "nano",
      "wearable",
      "magnetic",
      "action-camera",
      "4k",
      "waterproof",
      "vlog",
    ],
    price: 529,
    originalPrice: 529,
    discountPercentage: 0,
    badge: "OFFICIAL RELEASE",
    tagline: "Wear the World in 4K.",
    description:
      "Ultra-compact 52g modular wearable camera with a 1/1.3-inch CMOS sensor, 4K/60fps video, 143° ultra-wide FOV, 10-meter native waterproofing, and a Multifunctional Vision Dock with OLED touch display.",
    features: [
      "Ultra-Lightweight 52g Magnetic Camera Body for Wearable Hands-Free POV",
      "1/1.3-inch Flagship CMOS Sensor with 4K/60fps & 143° Ultra-Wide FOV",
      "10-bit & D-Log M Color Profile with over 1 Billion Cinematic Colors",
      "Multifunctional Vision Dock with OLED Touchscreen & Real-Time Wireless Preview",
      "Up to 200 Minutes Combined Operating Battery Life with Fast PD Charging",
      "Native 10-Meter Waterproof Camera Unit (IPX4 Splash-Resistant Dock)",
      "RockSteady 3.0 & HorizonSteady Electronic Image Stabilisation",
      "OsmoAudio™ Direct Pairing with DJI Mic 2 Transmitters (No Receiver Needed)",
    ],
    mainImage:
      "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-09.jpg?v=1783909570",
    images: [
      "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-09.jpg?v=1783909570",
      "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-10.jpg?v=1783909609",
      "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-03.jpg?v=1783898548",
      "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-04.jpg?v=1783898552",
      "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-05.jpg?v=1783898559",
      "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-12_61e03f0f-f855-43d5-a899-4d356348b877.jpg?v=1783910761",
      "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-11_c076e33b-214a-484a-bd0c-15c1ba9b1f28.jpg?v=1783910751",
      "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-08.jpg?v=1783898567",
    ],
    inStock: true,
    stockCount: 45,
    rating: 4.9,
    reviewCount: 48,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    tier: "product",
    compatibility: [
      "DJI Mic 2",
      "DJI Mimo App (iOS / Android)",
      "Osmo Magnetic Mount Ecosystem",
      "USB-C Power Delivery 3.0",
    ],
    highlights: [
      "100% Genuine Australian Stock from Authorised DJI Retailer",
      "Free Express Insured Courier Delivery Across Australia",
      "2-Year Australian Consumer Law Warranty Guarantee",
      "Official DJI Care Refresh Eligible (1-Year & 2-Year Available)",
    ],
    variants: [
      {
        id: "standard-64gb",
        name: "Standard Combo (64GB)",
        price: 529,
        originalPrice: 529,
        sku: "OSMON-64",
        inStock: true,
        stockCount: 25,
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-09.jpg?v=1783909570",
      },
      {
        id: "standard-128gb",
        name: "Standard Combo (128GB)",
        price: 589,
        originalPrice: 589,
        sku: "OSMON-128",
        inStock: true,
        stockCount: 20,
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-10.jpg?v=1783909609",
      },
      {
        id: "creator-128gb",
        name: "Creator Combo (128GB)",
        price: 749,
        originalPrice: 799,
        sku: "OSMON-CREATOR",
        inStock: true,
        stockCount: 15,
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-12_61e03f0f-f855-43d5-a899-4d356348b877.jpg?v=1783910761",
      },
    ],
    inTheBoxVariants: {
      "standard-64gb": [
        {
          title: "Osmo Nano Camera Unit (64GB)",
          qty: 1,
          description: "Ultra-compact 52g magnetic camera with 1/1.3\" sensor and 4K/60fps video.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-09.jpg?v=1783909570",
        },
        {
          title: "Osmo Nano Multifunctional Vision Dock",
          qty: 1,
          description: "OLED touchscreen dock for live preview, wireless remote control, and fast charging.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-03.jpg?v=1783898548",
        },
        {
          title: "Osmo Nano Magnetic Hat Clip",
          qty: 1,
          description: "Snaps securely to caps and visors for first-person POV angles.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-04.jpg?v=1783898552",
        },
        {
          title: "Osmo Nano Magnetic Lanyard",
          qty: 1,
          description: "Wear comfortably under shirts for effortless chest-level shooting.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-05.jpg?v=1783898559",
        },
        {
          title: "Dual-Direction Magnetic Ball-Joint Mount",
          qty: 1,
          description: "360-degree adjustable magnetic swivel mount with reusable adhesive base.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-08.jpg?v=1783898567",
        },
        {
          title: "USB-C to USB-C PD Cable",
          qty: 1,
          description: "High-speed data transfer and 30W Power Delivery fast-charging cable.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-11_c076e33b-214a-484a-bd0c-15c1ba9b1f28.jpg?v=1783910751",
        },
      ],
      "standard-128gb": [
        {
          title: "Osmo Nano Camera Unit (128GB)",
          qty: 1,
          description: "Expanded 128GB onboard storage for hours of 4K/60fps master footage.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-10.jpg?v=1783909609",
        },
        {
          title: "Osmo Nano Multifunctional Vision Dock",
          qty: 1,
          description: "OLED touchscreen dock for live preview, wireless remote control, and fast charging.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-03.jpg?v=1783898548",
        },
        {
          title: "Osmo Nano Magnetic Hat Clip",
          qty: 1,
          description: "Snaps securely to caps and visors for first-person POV angles.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-04.jpg?v=1783898552",
        },
        {
          title: "Osmo Nano Magnetic Lanyard",
          qty: 1,
          description: "Wear comfortably under shirts for effortless chest-level shooting.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-05.jpg?v=1783898559",
        },
        {
          title: "Dual-Direction Magnetic Ball-Joint Mount",
          qty: 1,
          description: "360-degree adjustable magnetic swivel mount with reusable adhesive base.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-08.jpg?v=1783898567",
        },
        {
          title: "USB-C to USB-C PD Cable",
          qty: 1,
          description: "High-speed data transfer and 30W Power Delivery fast-charging cable.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-11_c076e33b-214a-484a-bd0c-15c1ba9b1f28.jpg?v=1783910751",
        },
      ],
      "creator-128gb": [
        {
          title: "Osmo Nano Camera Unit (128GB)",
          qty: 1,
          description: "Expanded 128GB onboard storage for hours of 4K/60fps master footage.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-10.jpg?v=1783909609",
        },
        {
          title: "Osmo Nano Multifunctional Vision Dock",
          qty: 1,
          description: "OLED touchscreen dock for live preview, wireless remote control, and fast charging.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-03.jpg?v=1783898548",
        },
        {
          title: "DJI Mic 2 Transmitter (Shadow Black)",
          qty: 1,
          description: "32-bit float audio transmitter with direct wireless OsmoAudio™ connection.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-12_61e03f0f-f855-43d5-a899-4d356348b877.jpg?v=1783910761",
        },
        {
          title: "Osmo Magnetic Headband",
          qty: 1,
          description: "Elastic, comfortable head strap with magnetic quick-lock for running and action sports.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-04.jpg?v=1783898552",
        },
        {
          title: "Osmo Extension Rod & Mini Tripod",
          qty: 1,
          description: "Telescoping selfie stick that extends to 1.5m with integrated fold-out magnetic legs.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-08.jpg?v=1783898567",
        },
        {
          title: "Osmo Nano Magnetic Lanyard",
          qty: 1,
          description: "Wear comfortably under shirts for effortless chest-level shooting.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-05.jpg?v=1783898559",
        },
        {
          title: "Dual-Direction Magnetic Ball-Joint Mount",
          qty: 1,
          description: "360-degree adjustable magnetic swivel mount with reusable adhesive base.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-08.jpg?v=1783898567",
        },
        {
          title: "USB-C to USB-C PD Cable",
          qty: 1,
          description: "High-speed data transfer and 30W Power Delivery fast-charging cable.",
          image:
            "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-11_c076e33b-214a-484a-bd0c-15c1ba9b1f28.jpg?v=1783910751",
        },
      ],
    },
    inTheBox: [
      {
        title: "Osmo Nano Camera Unit",
        qty: 1,
        description: "52g flagship magnetic camera module.",
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-09.jpg?v=1783909570",
      },
      {
        title: "Osmo Nano Multifunctional Vision Dock",
        qty: 1,
        description: "OLED touchscreen display dock with built-in battery.",
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-03.jpg?v=1783898548",
      },
      {
        title: "Osmo Nano Magnetic Hat Clip",
        qty: 1,
        description: "Secure headwear mount for hands-free POV.",
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-04.jpg?v=1783898552",
      },
      {
        title: "Osmo Nano Magnetic Lanyard",
        qty: 1,
        description: "Comfortable in-shirt magnetic mount.",
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-05.jpg?v=1783898559",
      },
      {
        title: "Dual-Direction Magnetic Ball-Joint Mount",
        qty: 1,
        description: "Adjustable 360-degree angle mount.",
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-08.jpg?v=1783898567",
      },
      {
        title: "USB-C to USB-C PD Cable",
        qty: 1,
        description: "Fast-charging & high-speed transfer cable.",
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-11_c076e33b-214a-484a-bd0c-15c1ba9b1f28.jpg?v=1783910751",
      },
    ],
    overviewBanner: {
      headline: "Wear the World in 4K",
      subheadline:
        "The world’s most compact flagship camera. Weighing just 52 grams with magnetic modularity, 1/1.3-inch sensor clarity, and 10m native waterproofing.",
      badge: "ULTRA-LIGHTWEIGHT WEARABLE CAMERA",
      stats: [
        { label: "Camera Weight", value: "52 g", detail: "Ultra-compact body" },
        { label: "Sensor Size", value: "1/1.3″", detail: "Large CMOS sensor" },
        { label: "Max Resolution", value: "4K/60fps", detail: "10-bit D-Log M" },
        { label: "Waterproof", value: "10 m", detail: "No case required" },
        { label: "Total Runtime", value: "200 min", detail: "With Vision Dock" },
      ],
      heroImage:
        "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-09.jpg?v=1783909570",
    },
    featureCards: [
      {
        tag: "MODULAR DESIGN",
        title: "52g Magnetic Wearability",
        description:
          "Clip it to your hat, wear it magnetically through your shirt with the lanyard, or snap it onto handlebars and drones in seconds.",
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-04.jpg?v=1783898552",
        stats: "52 grams",
      },
      {
        tag: "IMAGING",
        title: "1/1.3-Inch Flagship Sensor",
        description:
          "Captures vivid dynamic range with low noise in twilight and high-contrast sunlight. Delivers pristine 4K/60fps video with 10-bit D-Log M.",
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-03.jpg?v=1783898548",
        stats: "1/1.3″ CMOS",
      },
      {
        tag: "ECOSYSTEM",
        title: "Multifunctional Vision Dock",
        description:
          "Features a responsive OLED touchscreen for live framing, wireless remote control, fast charging, and lightning USB 3.1 file offloading.",
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-10.jpg?v=1783909609",
        stats: "OLED Touch",
      },
    ],
    storyBlocks: [
      {
        subtitle: "FIRST-PERSON POV",
        title: "Capture Life Hands-Free As You Live It",
        description:
          "With the innovative magnetic mounting system and ultra-lightweight 52g chassis, Osmo Nano sits comfortably on clothing, bags, or headwear without dragging you down. Perfect for travel vlogging, running, cycling, and family moments.",
        bullets: [
          "Magnetic hat clip & under-shirt lanyard included in the box",
          "Ultra-stable HorizonSteady keeps horizon dead-level even in 360° spins",
          "One-touch instant recording even when powered off",
        ],
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-05.jpg?v=1783898559",
      },
      {
        subtitle: "VISION DOCK DUALITY",
        title: "Separate or Docked: Full Freedom of Framing",
        description:
          "The Multifunctional Vision Dock connects wirelessly to the camera unit when detached, giving you an ultra-responsive live monitor to preview shots from creative angles while holding the controls comfortably in your hand.",
        bullets: [
          "Real-time low-latency wireless video transmission",
          "Adjust parameters, ISO, shutter, and shooting modes remotely",
          "Charges the camera unit up to 80% in just 18 minutes",
        ],
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-03.jpg?v=1783898548",
      },
      {
        subtitle: "RUGGED & READY",
        title: "Native 10-Meter Waterproofing",
        description:
          "Take Osmo Nano swimming, surfing, or snorkeling down to 10 meters depth without any additional protective casing. The Vision Dock features IPX4 splash resistance for sudden showers and water spray.",
        bullets: [
          "Corrosion-resistant hydrophobic optical glass coating",
          "Operating temperature from -20°C to 45°C",
          "RockSteady 3.0 eliminates shake even on rough mountain descents",
        ],
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-08.jpg?v=1783898567",
      },
      {
        subtitle: "PRO AUDIO & WORKFLOW",
        title: "OsmoAudio™ Direct Wireless Sound",
        description:
          "Osmo Nano connects directly to up to two DJI Mic 2 transmitters via Bluetooth with OsmoAudio™ technology. Eliminate receiver cables and record crisp 48kHz 24-bit vocals straight into your video timeline.",
        bullets: [
          "Three built-in omnidirectional mics with intelligent wind noise reduction",
          "Direct DJI Mic 2 connection without receiver dongle",
          "High-speed Wi-Fi 6 wireless export to DJI Mimo app",
        ],
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMON-64-12_61e03f0f-f855-43d5-a899-4d356348b877.jpg?v=1783910761",
      },
    ],
    rawSpecs: [
      {
        category: "Camera & Optics",
        items: [
          { key: "Image Sensor", value: "1/1.3-inch CMOS Sensor" },
          { key: "Lens FOV", value: "143° Super-Wide Angle" },
          { key: "Aperture", value: "f/2.8" },
          { key: "Focus Range", value: "0.35 m to ∞" },
          { key: "ISO Range", value: "100 - 12800 (Video & Photo)" },
          { key: "Max Photo Resolution", value: "3840 × 2880 (11 MP)" },
          { key: "Max Video Resolution", value: "4K (3840×2160) @ 24/25/30/48/50/60fps" },
          { key: "Slow Motion", value: "2.7K up to 100fps, 1080p up to 240fps" },
          { key: "Color Profiles", value: "Normal (8-bit / 10-bit), D-Log M (10-bit)" },
          { key: "Max Video Bitrate", value: "130 Mbps" },
          { key: "File System", value: "exFAT" },
        ],
      },
      {
        category: "Stabilisation & Features",
        items: [
          { key: "Electronic Stabilisation", value: "RockSteady 3.0, RockSteady 3.0+, HorizonSteady, HorizonBalancing" },
          { key: "HorizonSteady Range", value: "±45° or Full 360° Leveling (depending on resolution)" },
          { key: "Audio System", value: "3 Built-in Microphones with OsmoAudio™ Direct Pairing" },
          { key: "Microphone Support", value: "Direct pairing with DJI Mic 2 & Mic 3 transmitters" },
          { key: "Voice Control", value: "English, Mandarin, Japanese, German, French" },
        ],
      },
      {
        category: "Multifunctional Vision Dock",
        items: [
          { key: "Screen", value: "1.47-inch OLED Touchscreen (800 nits Peak Brightness)" },
          { key: "Screen Resolution", value: "412 × 412 pixels, 326 ppi" },
          { key: "Wireless Preview", value: "Wi-Fi 6 low-latency detached remote preview" },
          { key: "Dock Battery", value: "1300 mAh rechargeable Li-ion" },
          { key: "Water Resistance", value: "IPX4 Splash Resistant" },
          { key: "Dock Weight", value: "72 g" },
        ],
      },
      {
        category: "Battery & Runtime",
        items: [
          { key: "Camera Battery Capacity", value: "580 mAh LiPo 1S" },
          { key: "Camera Standalone Runtime", value: "Up to 70 minutes (1080p/24fps)" },
          { key: "Combined System Runtime", value: "Up to 200 minutes with Vision Dock attached" },
          { key: "Charging Technology", value: "USB Power Delivery 3.0 Fast Charge (Up to 30W)" },
          { key: "Camera Charging Time", value: "80% in 18 minutes (in Vision Dock)" },
          { key: "Operating Temperature", value: "-20°C to 45°C (-4°F to 113°F)" },
        ],
      },
      {
        category: "Dimensions & Physical",
        items: [
          { key: "Camera Weight", value: "52 g" },
          { key: "Camera Dimensions", value: "56.2 × 38.6 × 24.5 mm" },
          { key: "Vision Dock Dimensions", value: "68.5 × 44.8 × 29.2 mm" },
          { key: "Waterproof Rating", value: "10 m (33 ft) Native without case (Camera only)" },
          { key: "Magnetic Mount System", value: "Dual-sided neodymium quick-release latch" },
        ],
      },
      {
        category: "Connectivity & Storage",
        items: [
          { key: "Internal Storage", value: "64GB / 128GB High-Speed eMMC 5.1 onboard" },
          { key: "MicroSD Expansion", value: "Vision Dock supports microSD cards up to 1TB" },
          { key: "Wi-Fi Protocol", value: "802.11 a/b/g/n/ac/ax (2.4 GHz & 5.8 GHz dual-band)" },
          { key: "Bluetooth", value: "Bluetooth 5.2 Low Energy (BLE)" },
          { key: "USB Interface", value: "USB-C 3.1 Gen 1 (up to 5 Gbps transfer speed)" },
        ],
      },
    ],
    faqs: [
      {
        category: "General",
        question: "What is the difference between the Osmo Nano Camera Unit and the Vision Dock?",
        answer:
          "The Osmo Nano camera unit is an ultra-lightweight 52g modular camera capable of recording 4K/60fps video and waterproof up to 10 meters standalone. The Multifunctional Vision Dock adds an OLED touchscreen for framing and menu control, extended battery life up to 200 minutes, fast charging, and wireless detached preview.",
      },
      {
        category: "General",
        question: "Is the Osmo Nano camera completely waterproof without a dive case?",
        answer:
          "Yes! The Osmo Nano camera module is waterproof down to 10 meters (33 feet) natively. However, the Multifunctional Vision Dock is IPX4 splash-resistant and should not be submerged underwater without a waterproof housing.",
      },
      {
        category: "Audio",
        question: "Can I connect the DJI Mic 2 directly to Osmo Nano without a receiver?",
        answer:
          "Yes. With DJI's proprietary OsmoAudio™ technology, the Osmo Nano camera connects directly to up to two DJI Mic 2 transmitters via Bluetooth without requiring the external RX receiver plugged into the USB port.",
      },
      {
        category: "Usage",
        question: "How do I mount the Osmo Nano to my clothing or hats?",
        answer:
          "The Osmo Nano includes both a Magnetic Lanyard (worn under clothing while the camera attaches magnetically through the fabric) and a Magnetic Hat Clip that slides onto cap brims and visors for first-person POV angles.",
      },
      {
        category: "Storage",
        question: "Does Osmo Nano have internal storage or do I need a microSD card?",
        answer:
          "Osmo Nano features built-in high-speed internal storage (64GB or 128GB depending on your chosen combo). The Multifunctional Vision Dock also features a microSD card slot supporting up to 1TB expansion.",
      },
      {
        category: "Warranty & Support",
        question: "What warranty and service comes with Osmo Nano purchased from D1 Store?",
        answer:
          "Every Osmo Nano sold by D1 Store includes a 100% genuine Australian 2-Year Warranty, local Melbourne and Sydney service centers, and eligibility for official DJI Care Refresh 1-Year or 2-Year replacement plans.",
      },
    ],
  };

  const res = await productsCol.updateOne(
    { slug: "osmo-nano" },
    { $set: osmoNanoData },
    { upsert: true }
  );

  console.log("[Seed] Updated osmo-nano product:", res.modifiedCount || res.upsertedCount);
  await mongoose.disconnect();
  console.log("[Seed] Done!");
}

seedOsmoNano().catch((err) => {
  console.error("[Seed] Error:", err);
  process.exit(1);
});
