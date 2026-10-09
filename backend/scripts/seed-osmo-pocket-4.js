const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb+srv://d1store:d1store2026@d1store.icxu9op.mongodb.net/d1store?retryWrites=true&w=majority";

async function seedOsmoPocket4() {
  console.log("[Seed] Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGO_URI);
  console.log("[Seed] Connected successfully!");

  const db = mongoose.connection.db;
  const productsCol = db.collection("products");

  const osmoPocket4Data = {
    name: "DJI Osmo Pocket 4",
    slug: "osmo-pocket-4",
    sku: "DJI-OSMOPK4-STD",
    category: "Handhelds",
    categorySlug: "handhelds",
    subCategory: "Osmo Pocket",
    collections: ["handhelds", "osmo-pocket", "all", "just-landed"],
    tags: ["pocket", "osmo", "handheld", "gimbal", "4k", "creator", "vlog"],
    price: 769,
    originalPrice: 849,
    discountPercentage: 9,
    badge: "OFFICIAL RELEASE",
    tagline: "Pocket Gimbal Power.",
    description:
      "Osmo Pocket 4 pairs a 1-inch CMOS sensor with 4K/240fps slow-motion, 14-stop dynamic range, 10-bit D-Log M, and 3-axis mechanical stabilisation for cinema-level results anywhere.",
    features: [
      "1-Inch High-Dynamic CMOS Sensor with 14 Stops of Dynamic Range",
      "4K/240fps & 4K/120fps Slow-Motion High Frame Rate Capture",
      "3-Axis Brushless Mechanical Gimbal Stabilisation",
      "2.0-inch Rotatable OLED Touchscreen (1000 nits Peak Brightness)",
      "Next-Gen ActiveTrack 7.0 Face & Body Auto-Tracking",
      "Direct Pairing with Dual DJI Mic 2 & Mic 3 Transmitters",
      "Fast 65W PD Charging: 80% in 16 Minutes",
      "107GB High-Speed Built-in Storage & USB-C 3.1 800MB/s Offload",
    ],
    mainImage:
      "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK4-SC-03.jpg?v=1783665755",
    images: [
      "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK4-SC-03.jpg?v=1783665755",
      "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK4-SC-04.jpg?v=1783665758",
      "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK4-SC-05.jpg?v=1783665761",
      "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK4-SC-06.jpg?v=1783665766",
      "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK4-SC-07.jpg?v=1783665769",
      "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK4-SC-08.jpg?v=1783665771",
    ],
    inStock: true,
    stockCount: 38,
    rating: 4.9,
    reviewCount: 142,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    tier: "product",

    // Overview Hero Banner
    overviewBanner: {
      badge: "1-INCH CMOS POCKET GIMBAL CAMERA",
      title: "Pocket Gimbal Power.",
      description:
        "Shoot anytime, anywhere with the DJI Osmo Pocket 4. With a large 1-inch CMOS sensor, 4K/240p slow-motion video, and 107 GB internal storage, Pocket 4 is ready to create.",
      bgImage:
        "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK4-SC-08.jpg?v=1783665771",
      stats: [
        { label: "Sensor", value: "1in" },
        { label: "Video", value: "4K/240" },
        { label: "HDR", value: "14-Stop" },
        { label: "D-Log", value: "10-bit" },
        { label: "Built-in Storage", value: "107gb" },
      ],
    },

    // 3 Bento Feature Highlight Cards
    featureCards: [
      {
        title: "Rotatable Screen",
        description:
          "2-inch OLED rotatable touchscreen switches easily between horizontal and vertical shooting with a single intuitive twist.",
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK4-SC-05.jpg?v=1783665761",
        tag: "OLED Display",
      },
      {
        title: "Pocket Form",
        description:
          "Compact, lightweight 190g design slips effortlessly into your pocket so you're always ready to capture cinematic moments instantly.",
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK4-SC-06.jpg?v=1783665766",
        tag: "Ultra Portable",
      },
      {
        title: "Lossless Zoom",
        description:
          "2x optical lossless zoom lets you get closer to the action without compromising resolution, sharpness, or image clarity.",
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK4-SC-07.jpg?v=1783665769",
        tag: "Pure Optics",
      },
    ],

    // In-Depth Feature Story Blocks
    storyBlocks: [
      {
        title: "Masterful 1-Inch CMOS Sensor & 14-Stop Dynamic Range",
        subtitle: "Uncompromising Cinematic Fidelity in Any Light",
        description:
          "Equipped with an enlarged 1-inch sensor, Osmo Pocket 4 captures highlight and shadow details with lifelike precision. Even in challenging high-contrast dusk scenes or nighttime city walks, images remain clean, noise-free, and full of natural depth. With 10-bit D-Log M and 10-bit HLG profiles, record over one billion colors with maximum latitude for post-production color grading.",
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK4-SC-03.jpg?v=1783665755",
        tag: "Imaging Engine",
      },
      {
        title: "ActiveTrack 7.0 & Intelligent Composition Framing",
        subtitle: "Stay Locked on the Subject, Effortlessly",
        description:
          "Next-generation AI tracking algorithms recognise faces, bodies, and subjects with unprecedented speed and accuracy. Whether you are running, cycling, or vlogging in crowded streets, Osmo Pocket 4 keeps you centered in frame. Product Showcase mode automatically shifts focus to items held up to the camera, making it the ultimate tool for tech reviews and beauty tutorials.",
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK4-SC-04.jpg?v=1783665758",
        tag: "Smart Tracking",
      },
      {
        title: "3-Axis Mechanical Gimbal vs. Electronic Stabilisation",
        subtitle: "True Hardware Camera Movement Without Edge Cropping",
        description:
          "Unlike smartphones and action cameras that crop image resolution and introduce digital micro-jitter, Osmo Pocket 4 utilizes physical high-torque brushless motors. Camera motion is mechanically counterbalanced in real time, delivering butter-smooth handheld tracking shots, run-and-gun walks, and creative cinematic camera pans.",
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK4-SC-05.jpg?v=1783665761",
        tag: "Cinema Stabilization",
      },
      {
        title: "Omnidirectional Audio Array & Direct DJI Mic Wireless Pairing",
        subtitle: "Studio-Quality Sound Straight Out of the Box",
        description:
          "A three-microphone omnidirectional array records spatial audio with intelligent wind noise reduction. Furthermore, Pocket 4 has a built-in wireless audio receiver that directly links with up to two DJI Mic transmitters without needing a receiver plugged into the USB port, giving you pristine dialogue on every shoot.",
        image:
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK4-SC-06.jpg?v=1783665766",
        tag: "Pro Audio",
      },
    ],

    // Combos / Variants
    variants: [
      {
        name: "Standard Combo",
        slug: "osmo-pocket-4",
        variantId: "45879513874593",
        sku: "DJI-OSMOPK4-STD",
        price: 769,
        badge: "Essential",
      },
      {
        name: "Creator Combo",
        slug: "osmo-pocket-4-creator-combo",
        variantId: "45879513907361",
        sku: "DJI-OSMOPK4-CC",
        price: 1029,
        badge: "Most Popular",
      },
    ],

    // In The Box Variants (Detailed with real images & roles)
    inTheBoxVariants: {
      standard: [
        {
          title: "DJI Osmo Pocket 4",
          image:
            "https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/1ad5032e-8e79-4763-b92c-9b1f826236c7-itb-osmopk4p-001.webp",
          qty: 1,
          category: "Core Unit",
          description: "Core handheld gimbal camera with 1-inch CMOS sensor and 2-inch OLED touchscreen.",
        },
        {
          title: "Osmo Pocket 4 Protective Cover",
          image:
            "https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/3dea9bbd-bb62-43bb-a5eb-fa6c8d7e0026-itb-osmopk4p-004.webp",
          qty: 1,
          category: "Protection",
          description: "Locks the gimbal securely and stores wide-angle lens and filters while on the go.",
        },
        {
          title: "Osmo Pocket 4 Handle (1/4\" Thread)",
          image:
            "https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/56055376-e17f-4424-9b2f-38d5e1f0e75a-itb-osmopk4p-007.webp",
          qty: 1,
          category: "Ergonomics",
          description: "Extends grip length and adds a standard 1/4\"-20 screw thread for tripods and extension rods.",
        },
        {
          title: "Type-C to Type-C PD Cable (USB 3.1)",
          image:
            "https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/4c20cdba-4475-4089-a2a4-4364024b31a3-itb-osmopk4p-018.webp",
          qty: 1,
          category: "Power & Data",
          description: "High-speed braided cable supporting 65W PD fast charging and up to 800 MB/s data transfer.",
        },
        {
          title: "DJI Wrist Strap",
          image:
            "https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/ec54b638-348e-49b0-9e67-ea9b69b8216a-itb-osmopk4p-008.webp",
          qty: 1,
          category: "Safety",
          description: "Secures camera to your wrist to prevent accidental drops during active filming.",
        },
        {
          title: "Osmo Pocket 4 Carrying Pouch",
          image:
            "https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/4e4ed42e-13c5-430c-b26a-9f5b61033a25-itb-osmopk4p-009.webp",
          qty: 1,
          category: "Storage",
          description: "Soft microfiber storage pouch for scratch-free pocket and backpack transport.",
        },
      ],
      creator: [
        {
          title: "DJI Osmo Pocket 4",
          image:
            "https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/1ad5032e-8e79-4763-b92c-9b1f826236c7-itb-osmopk4p-001.webp",
          qty: 1,
          category: "Core Unit",
          description: "Core handheld gimbal camera with 1-inch CMOS sensor and 2-inch OLED touchscreen.",
        },
        {
          title: "DJI Mic 2 Transmitter (Shadow Black)",
          image:
            "https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/9eb4d0b1-382a-442a-a9e9-270fa67f108f-itb-osmopk4p-003.webp",
          qty: 1,
          category: "Audio",
          description: "Professional wireless audio transmitter with internal 32-bit float backup recording and 250m range.",
        },
        {
          title: "DJI Mic 2 Windscreen",
          image:
            "https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/25710d0a-9d95-4aa3-8fa9-fae26c61f221-itb-osmopk4p-012.webp",
          qty: 1,
          category: "Audio",
          description: "High-density furry windshield eliminates wind noise during outdoor recording.",
        },
        {
          title: "DJI Mic 2 Clip Magnet",
          image:
            "https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/1a69e6b4-2e97-4c07-b2eb-d1cf376b5c90-itb-osmopk4p-014.webp",
          qty: 1,
          category: "Audio",
          description: "Discreet strong magnetic attachment for securing the transmitter to clothing effortlessly.",
        },
        {
          title: "Osmo Pocket 4 Battery Handle",
          image:
            "https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/56055376-e17f-4424-9b2f-38d5e1f0e75a-itb-osmopk4p-007.webp",
          qty: 1,
          category: "Power",
          description: "Built-in 950 mAh battery boosts operating time by approximately 62% and provides a rear audio/charging port.",
        },
        {
          title: "Osmo Mini Tripod",
          image:
            "https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/88256d05-4c0d-4b8c-b0df-0c1ba21a1555-itb-osmopk4p-010.webp",
          qty: 1,
          category: "Support",
          description: "Foldable desktop tripod with 1/4\"-20 thread and non-slip TPU feet for stationary tracking.",
        },
        {
          title: "Osmo Pocket 4 Wide-Angle Lens",
          image:
            "https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/d4cbd70f-1eda-4093-9745-902327043322-itb-osmopk4p-016.webp",
          qty: 1,
          category: "Optics",
          description: "Magnetic wide-angle lens expands field of view to 108° for expansive landscapes and group selfies.",
        },
        {
          title: "Osmo Pocket 4 Carrying Bag",
          image:
            "https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/89bd97ff-25c2-4a00-98ec-640a373b3e8e-itb-osmopk4p-017.webp",
          qty: 1,
          category: "Storage",
          description: "Dedicated custom-molded zip organizer bag that holds the complete Creator Combo neatly.",
        },
        {
          title: "Osmo Pocket 4 Protective Cover",
          image:
            "https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/3dea9bbd-bb62-43bb-a5eb-fa6c8d7e0026-itb-osmopk4p-004.webp",
          qty: 1,
          category: "Protection",
          description: "Full gimbal lock cover with dedicated magnetic slots for filters and the wide-angle lens.",
        },
        {
          title: "Osmo Pocket 4 Handle (1/4\" Thread)",
          image:
            "https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/56055376-e17f-4424-9b2f-38d5e1f0e75a-itb-osmopk4p-007.webp",
          qty: 1,
          category: "Ergonomics",
          description: "Compact handle adapter with universal 1/4\" screw mount.",
        },
        {
          title: "Type-C to Type-C PD Cable (USB 3.1)",
          image:
            "https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/4c20cdba-4475-4089-a2a4-4364024b31a3-itb-osmopk4p-018.webp",
          qty: 1,
          category: "Power & Data",
          description: "High-speed 65W PD fast-charging and 800 MB/s file offload cable.",
        },
        {
          title: "DJI Wrist Strap",
          image:
            "https://cdn.d1store.app/shopify/product-page-editor/products/ITB-OSMOPK4P/ec54b638-348e-49b0-9e67-ea9b69b8216a-itb-osmopk4p-008.webp",
          qty: 1,
          category: "Safety",
          description: "Adjustable quick-release safety wrist tether.",
        },
      ],
    },

    // 36 Exhaustive Technical Specifications Across 6 Core Categories
    rawSpecs: [
      // General
      {
        group: "General",
        label: "Dimensions (Unfolded)",
        value: "144.2 × 44.4 × 33.5 mm (L×W×H)",
      },
      {
        group: "General",
        label: "Dimensions (Folded/Stored)",
        value: "139.7 × 42.2 × 33.5 mm (L×W×H)",
      },
      {
        group: "General",
        label: "Weight",
        value: "190.5 g (Standard Unit)",
      },
      {
        group: "General",
        label: "Touchscreen Display",
        value: "2.0-inch OLED Rotatable Touchscreen, 556×314 resolution, 1000 nits peak brightness",
      },
      {
        group: "General",
        label: "Number of Microphones",
        value: "3 Omnidirectional Studio Array with Directional Audio Zoom",
      },
      {
        group: "General",
        label: "Operating Temperature",
        value: "0° to 40° C (32° to 104° F)",
      },
      {
        group: "General",
        label: "Waterproof Capability",
        value: "Not waterproof (Requires official DJI Waterproof Case for submersible use up to 60m)",
      },
      {
        group: "General",
        label: "Supported App",
        value: "DJI Mimo (iOS 12.0 or later, Android 8.0 or later)",
      },

      // Camera & Optics
      {
        group: "Camera",
        label: "Image Sensor",
        value: "1-inch High-Dynamic CMOS Sensor, 48 MP effective pixels",
      },
      {
        group: "Camera",
        label: "Lens",
        value: "Format Equivalent: 20 mm, Aperture: f/2.0, Focus Range: 0.2 m to ∞",
      },
      {
        group: "Camera",
        label: "ISO Range",
        value: "Photo: 50-6400; Video: 50-6400 (Normal), 50-16000 (Low-Light); Night Mode: 50-32000",
      },
      {
        group: "Camera",
        label: "Electronic Shutter Speed",
        value: "Photo: 1/8000 s to 1 s; Video: 1/8000 s to 1/24 s (or frame-rate limit)",
      },
      {
        group: "Camera",
        label: "Max Photo Resolution",
        value: "64 MP: 9248×6936 (4:3); 48 MP: 8000×6000; 16 MP: 3840×2160 (16:9)",
      },
      {
        group: "Camera",
        label: "Zoom",
        value: "Photo: Up to 2x optical lossless; Video: Up to 4x digital (2x lossless in 4K)",
      },
      {
        group: "Camera",
        label: "4K Video Resolution",
        value: "4K UHD (16:9): 3840×2160 @ 24/25/30/48/50/60/120/240fps",
      },
      {
        group: "Camera",
        label: "2.7K Video Resolution",
        value: "2.7K (16:9): 2688×1512 @ 24/25/30/48/50/60/120/240fps",
      },
      {
        group: "Camera",
        label: "Vertical Video Resolution",
        value: "3K Vertical (9:16): 3072×1728 @ 24/25/30/48/50/60fps; 1080p (9:16) up to 120fps",
      },
      {
        group: "Camera",
        label: "Color Profiles",
        value: "Normal (8-bit), 10-bit D-Log M (over 1 billion colors), 10-bit HLG HDR",
      },
      {
        group: "Camera",
        label: "Max Video Bitrate",
        value: "160 Mbps (H.264 / HEVC MP4)",
      },
      {
        group: "Camera",
        label: "File Formats",
        value: "Photo: JPEG, DNG (RAW); Video: MP4 (H.264/MPEG-4 AVC, H.265/HEVC)",
      },

      // Gimbal
      {
        group: "Gimbal",
        label: "Stabilisation System",
        value: "3-axis mechanical brushless gimbal (Pan, Tilt, Roll)",
      },
      {
        group: "Gimbal",
        label: "Controllable Range",
        value: "Pan: -235° to +58°, Tilt: -120° to +70°, Roll: -45° to +45°",
      },
      {
        group: "Gimbal",
        label: "Mechanical Limit Range",
        value: "Pan: -240° to +63°, Tilt: -180° to +98°, Roll: -220° to +63°",
      },
      {
        group: "Gimbal",
        label: "Max Controllable Speed",
        value: "180.0°/s",
      },
      {
        group: "Gimbal",
        label: "Angular Vibration Range",
        value: "±0.005°",
      },
      {
        group: "Gimbal",
        label: "Gimbal Shooting Modes",
        value: "Follow, Tilt Locked, FPV, SpinShot (360° barrel roll), Story Mode",
      },

      // Battery & Power
      {
        group: "Battery",
        label: "Battery Type",
        value: "Rechargeable Lithium-Ion Polymer (LiPo 1S)",
      },
      {
        group: "Battery",
        label: "Capacity & Energy",
        value: "1545 mAh / 11.66 Wh / 3.86 V",
      },
      {
        group: "Battery",
        label: "Operating Time (Standard)",
        value: "Up to 166 minutes continuous (tested at 1080p/24fps with screen off)",
      },
      {
        group: "Battery",
        label: "Operating Time with Battery Handle",
        value: "Up to 270 minutes (extended by 62% with attached 950 mAh Battery Handle)",
      },
      {
        group: "Battery",
        label: "Charging Speed",
        value: "16 minutes to 80%, 32 minutes to 100% (with 65W PD fast charger)",
      },

      // Connectivity & Audio
      {
        group: "Connection",
        label: "Internal Built-in Storage",
        value: "107 GB High-Speed UFS Solid-State Storage",
      },
      {
        group: "Connection",
        label: "Supported SD Card",
        value: "MicroSD (up to 1 TB, UHS-I Speed Class 3 or V30 recommended)",
      },
      {
        group: "Connection",
        label: "Wi-Fi & Bluetooth",
        value: "Wi-Fi 6 (802.11 a/b/g/n/ac/ax, 2.4/5.8 GHz); Bluetooth 5.3 BLE",
      },
      {
        group: "Connection",
        label: "USB-C Port Specifications",
        value: "USB 3.1 Gen 2 high-speed data transfer (up to 800 MB/s export) & PD charging",
      },
      {
        group: "Connection",
        label: "Direct Wireless Audio Pairing",
        value: "Direct pairing with up to 2x DJI Mic 2 or DJI Mic 3 transmitters without external receiver",
      },
    ],

    // 16 In-Depth FAQs Across All Common Customer Questions
    faqs: [
      {
        category: "General",
        group: "General",
        question: "What are the major upgrades on Osmo Pocket 4 compared to Osmo Pocket 3?",
        answer:
          "Osmo Pocket 4 introduces an all-new 1-inch CMOS sensor with up to 4K/240fps slow-motion recording, an expanded 14-stop dynamic range, 107 GB of ultra-fast built-in solid-state storage, upgraded ActiveTrack 7.0 with dual-person follow, USB 3.1 wired offload speeds up to 800 MB/s, and a brighter 2-inch OLED touchscreen with 1000 nits peak brightness for effortless daylight viewing.",
      },
      {
        category: "General",
        group: "General",
        question: "What is the difference between the Standard Combo and Creator Combo?",
        answer:
          "The Standard Combo includes the Osmo Pocket 4, Protective Cover, Wrist Strap, Handle with 1/4\" Thread, and USB-C Cable. The Creator Combo includes everything in the standard package PLUS the DJI Mic 2 Wireless Transmitter (with clip magnet and furry windshield), Osmo Pocket 4 Battery Handle (giving +62% runtime), Osmo Mini Tripod, Magnetic Wide-Angle Lens, and a dedicated zippered Carrying Bag. Purchasing the Creator Combo saves over $245 AUD compared to buying accessories individually.",
      },
      {
        category: "General",
        group: "General",
        question: "Is the Osmo Pocket 4 waterproof or weather-resistant?",
        answer:
          "No, Osmo Pocket 4 is a precision mechanical gimbal device and is not waterproof. Do not expose it to rain, snow, or submersion. If you plan to shoot underwater or around heavy water sports, use an official DJI Waterproof Case (waterproof to 60 meters) or consider the DJI Osmo Action series.",
      },
      {
        category: "General",
        group: "General",
        question: "Can I use Osmo Pocket 4 as a 4K webcam or livestreaming camera?",
        answer:
          "Yes! Osmo Pocket 4 features plug-and-play UVC/UAC USB webcam support. Simply connect it to your Mac or PC via the included USB-C cable to broadcast in crystal-clear 4K or 1080p for Zoom, Microsoft Teams, and OBS. For mobile livestreaming, connect to the DJI Mimo app and stream directly to YouTube, Twitch, or Facebook via RTMP.",
      },
      {
        category: "Camera",
        group: "Camera & Video",
        question: "How does the 1-inch CMOS sensor perform in low-light and night scenes?",
        answer:
          "The large 1-inch sensor features significantly larger individual pixels that absorb far more ambient light than conventional smartphone sensors. Combined with an f/2.0 aperture and dedicated Low-Light Video mode (ISO up to 32,000 with hardware noise reduction), Osmo Pocket 4 produces vivid, noise-suppressed nighttime cityscapes, campfire moments, and indoor concerts with rich color preservation.",
      },
      {
        category: "Camera",
        group: "Camera & Video",
        question: "What slow-motion frame rates and video resolutions are supported?",
        answer:
          "In 4K UHD (3840×2160), Pocket 4 shoots at 24, 25, 30, 48, 50, 60, 120, and up to a groundbreaking 240 fps. In 2.7K and 1080p Full HD, it also supports smooth 240 fps capture for breathtaking 8x slow-motion playback at 30 fps, capturing rapid action, sports, water droplets, and stunts in extreme clarity.",
      },
      {
        category: "Camera",
        group: "Camera & Video",
        question: "What is 10-bit D-Log M and 10-bit HLG HDR?",
        answer:
          "Standard 8-bit video records approximately 16.7 million colors, whereas 10-bit color records over 1.07 billion colors. D-Log M retains higher dynamic range and preserves subtle tonal gradients in skies and skin tones, giving filmmakers maximum color grading freedom in Premiere Pro, DaVinci Resolve, or Final Cut Pro. 10-bit HLG allows instant HDR playback on compatible HDR TVs and OLED displays without grading.",
      },
      {
        category: "Camera",
        group: "Camera & Video",
        question: "Can I shoot vertical video natively for TikTok, YouTube Shorts, and Instagram Reels?",
        answer:
          "Yes! Simply rotate the 2.0-inch OLED touchscreen 90 degrees into vertical orientation, and the camera sensor switches automatically into 3K native vertical mode (3072×1728 at up to 60 fps). This eliminates the need to crop horizontal 4K video or lose quality in editing apps.",
      },
      {
        category: "Gimbal",
        group: "Stabilization & Tracking",
        question: "How does 3-axis mechanical gimbal stabilization compare to smartphone electronic EIS?",
        answer:
          "Electronic Image Stabilization (EIS) works by digitally cropping into your image frame and warping pixel edges, which degrades resolution, introduces micro-jitter in low light, and causes motion blur distortion. Osmo Pocket 4 uses real three-axis brushless motors that physically tilt, pan, and roll the camera lens in real time to counteract hand movement, delivering full uncropped 4K resolution and cinematic camera sweeps.",
      },
      {
        category: "Gimbal",
        group: "Stabilization & Tracking",
        question: "How does ActiveTrack 7.0 work when vlogging or moving around?",
        answer:
          "ActiveTrack 7.0 uses advanced computer vision deep learning to identify humans, faces, and pets. Once selected by tapping on the touchscreen, the gimbal motors physically rotate to follow the subject everywhere they move. It automatically re-acquires subjects if they briefly turn around or walk behind obstacles.",
      },
      {
        category: "Audio",
        group: "Audio & Microphones",
        question: "Can Osmo Pocket 4 connect directly to DJI Mic transmitters without a receiver?",
        answer:
          "Yes! Osmo Pocket 4 has integrated Wi-Fi and Bluetooth wireless receiver modules directly inside the body. It pairs wirelessly with up to two DJI Mic 2 or DJI Mic 3 transmitters without needing a receiver plugged into the USB port, keeping the gimbal lightweight and fully accessible.",
      },
      {
        category: "Audio",
        group: "Audio & Microphones",
        question: "How does the built-in 3-microphone array perform in windy conditions?",
        answer:
          "Pocket 4 incorporates three studio-grade omnidirectional microphones situated on the front, back, and side of the device. Intelligent directional audio zoom focuses on the speaker's voice in front of the lens while suppressing background ambient noise and wind buffeting.",
      },
      {
        category: "Battery",
        group: "Battery & Power",
        question: "How long does the battery last on a single charge and how fast does it recharge?",
        answer:
          "The internal 1545 mAh battery provides up to 166 minutes of operating time at 1080p/24fps. With the Creator Combo's Battery Handle attached, operating time extends to 270 minutes (over 4.5 hours). Using a 65W PD fast charger, Pocket 4 charges to 80% in just 16 minutes and reaches 100% in 32 minutes.",
      },
      {
        category: "Battery",
        group: "Battery & Power",
        question: "Can I record while charging from a portable power bank?",
        answer:
          "Yes! Osmo Pocket 4 fully supports continuous recording while connected to an external USB-C PD power bank or wall adapter, making it ideal for multi-hour timelapse videos, conference recordings, and all-day wedding shoots.",
      },
      {
        category: "Accessories",
        group: "Accessories & Warranty",
        question: "Are Osmo Pocket 3 accessories compatible with Osmo Pocket 4?",
        answer:
          "Most magnetic optical accessories (such as Black Mist filters, ND filters, and wide-angle lenses) and DJI Mic 2 transmitters are cross-compatible. However, because Pocket 4 features an updated ergonomic grip and enhanced thermal dissipation ports, protective cases and battery handles are specifically tailored for Pocket 4.",
      },
      {
        category: "Accessories",
        group: "Accessories & Warranty",
        question: "What Australian warranty and support is included when buying from D1 Store?",
        answer:
          "As an Authorised DJI Retailer in Australia, every purchase comes with an official 2-Year Australian Manufacturer Warranty, free express insured shipping on orders over $99, 14-day replacement support, and access to D1 Store retail locations across Australia for in-person support, repair, and trade-ins.",
      },
    ],
  };

  const result = await productsCol.updateOne(
    { slug: "osmo-pocket-4" },
    { $set: osmoPocket4Data },
    { upsert: true }
  );

  console.log("[Seed] Osmo Pocket 4 update result:", {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
    upsertedCount: result.upsertedCount,
  });

  await mongoose.disconnect();
  console.log("[Seed] Done!");
}

seedOsmoPocket4().catch((err) => {
  console.error("[Seed] Error:", err);
  process.exit(1);
});
