const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const uri = process.env.MONGODB_URI;

const productsData = [
  {
    slug: 'dji-neo-2',
    name: 'DJI Neo 2',
    tagline: 'From Your Palm to the Sky — Effortlessly.',
    badge: 'Palm-Sized AI Drone',
    price: 409,
    originalPrice: 449,
    mainImage: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-D1DO-01.jpg?v=1783657771',
    images: [
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-D1DO-01.jpg?v=1783657771',
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-FMC-02.jpg?v=1783657771',
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-MC-03.jpg?v=1783657771',
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-DETAIL-04.jpg?v=1783657771'
    ],
    overviewBanner: {
      title: 'DJI Neo 2',
      tagline: 'From Your Palm to the Sky — Effortlessly.',
      description: 'Weighing just 135 grams, DJI Neo 2 takes off and lands smoothly right on your palm without needing a remote controller. Capture high-fidelity 4K ultra-stabilized video and stay locked on the action with intelligent AI subject tracking.',
      badge: 'Palm-Sized AI Drone',
      features: ['135g Ultra-Lightweight', 'Palm Takeoff & Landing', 'AI Subject Tracking', '4K Ultra-Stabilized Video', 'Full-Coverage Propeller Guards', 'Voice & Mobile Control']
    },
    variants: [
      { name: 'Standard (Drone Only)', price: 409, sku: 'NEO2-DO', variantId: '46244871864481' },
      { name: 'Fly More Combo (Drone Only)', price: 549, sku: 'NEO2-FMC-DO', variantId: '46244871897249' },
      { name: 'Fly More Combo', price: 709, sku: 'NEO2-FMC', variantId: '46244871930017', badge: 'Most Popular' },
      { name: 'Motion Fly More Combo', price: 989, sku: 'NEO2-MC', variantId: '46244871962785', badge: 'FPV Combo' }
    ],
    videoShowcases: [
      {
        id: 'palm-takeoff',
        title: 'Palm Takeoff & Landing',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/49df1551-298d-4131-9c95-125e8ed790aa/f7422fa4-6ce4-4938-80c4-c0a70d3349c5.webm',
        description: 'DJI Neo 2 takes off and lands gracefully from your hand. Simply press the mode button on Neo 2, select your desired shooting angle, and Neo 2 automatically handles the rest to capture jaw-dropping footage without a remote controller.',
        subcards: [
          { title: 'No Controller Needed', description: 'Fingertip mode selection lets you take off in seconds.' },
          { title: 'Gentle Palm Return', description: 'Safely lands back into an open hand with optical palm detection.' }
        ]
      },
      {
        id: 'ai-tracking',
        title: 'Take Center Stage with AI Subject Tracking',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/11fec542-b969-4751-9b2c-50d078b00927/629f8072-53b7-4052-8a60-48a811ca64ba.mp4',
        description: 'Whether cycling, skateboarding, or hiking, Neo 2 follows alongside as your personal airborne videographer. Smart AI algorithms keep your subject centered in the frame throughout active sports and high-speed motion.',
        modes: ['Cycling Follow', 'Skate Tracking', 'Walking Vlogs', 'Running Shots']
      },
      {
        id: 'quickshots',
        title: 'QuickShots & Intelligent Angles',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/0539feea-4f62-43f9-b07b-061c48e4764f/d201c63f-45da-4cf2-982e-70c7a6ce26f9.mp4',
        description: 'With a single tap, let DJI Neo 2 automatically shoot cinematic Hollywood maneuvers. Six intelligent shooting modes offer dynamic angles to elevate your social feed.',
        subcards: [
          { title: 'Dronie & Circle', description: 'Dynamic outward pull-back and 360-degree circling shots.' },
          { title: 'Rocket & Spotlight', description: 'Dramatic overhead ascents with lens locked downwards.' }
        ]
      },
      {
        id: 'stabilization',
        title: 'RockSteady & HorizonBalancing',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/2cc9bf93-079f-4ffe-a90c-ba3b8e54e39a/2aef3d90-5312-421f-b7df-21f29eeae8e2.mp4',
        description: 'Equipped with a single-axis mechanical gimbal coupled with RockSteady and HorizonBalancing stabilization, Neo 2 handles high-speed flight and Level-4 wind conditions while preserving razor-sharp horizon stability.'
      }
    ],
    inTheBox: [
      { title: '1 x DJI Neo 2 Aircraft', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-D1DO-01.jpg?v=1783657771' },
      { title: '1 x Intelligent Flight Battery', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-DETAIL-04.jpg?v=1783657771' },
      { title: '1 x Propeller Guard (Pair)', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-D1DO-01.jpg?v=1783657771' },
      { title: '1 x Spare Propellers (Pair)', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-DETAIL-04.jpg?v=1783657771' },
      { title: '1 x Gimbal Protector', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-D1DO-01.jpg?v=1783657771' },
      { title: '1 x Type-C to Type-C PD Cable', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-DETAIL-04.jpg?v=1783657771' }
    ],
    inTheBoxVariants: {
      standard: [
        { title: '1 x DJI Neo 2 Aircraft', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-D1DO-01.jpg?v=1783657771' },
        { title: '1 x Intelligent Flight Battery', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-DETAIL-04.jpg?v=1783657771' },
        { title: '1 x Propeller Guard (Pair)', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-D1DO-01.jpg?v=1783657771' },
        { title: '1 x Spare Propellers (Pair)', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-DETAIL-04.jpg?v=1783657771' },
        { title: '1 x Gimbal Protector', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-D1DO-01.jpg?v=1783657771' },
        { title: '1 x Type-C to Type-C PD Cable', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-DETAIL-04.jpg?v=1783657771' }
      ],
      vlog: [
        { title: '1 x DJI Neo 2 Aircraft', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-D1DO-01.jpg?v=1783657771' },
        { title: '1 x DJI RC-N3 Remote Controller', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-FMC-02.jpg?v=1783657771' },
        { title: '3 x Intelligent Flight Batteries', qty: 3, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-DETAIL-04.jpg?v=1783657771' },
        { title: '1 x Two-Way Charging Hub', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-DETAIL-04.jpg?v=1783657771' },
        { title: '1 x Propeller Guard (Pair)', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-D1DO-01.jpg?v=1783657771' },
        { title: '3 x Spare Propellers (Pairs)', qty: 3, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-DETAIL-04.jpg?v=1783657771' },
        { title: '1 x Gimbal Protector', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-D1DO-01.jpg?v=1783657771' },
        { title: '1 x Neo 2 Shoulder Bag', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-NEO2-FMC-02.jpg?v=1783657771' }
      ]
    },
    rawSpecs: [
      { group: 'Aircraft', label: 'Takeoff Weight', value: 'Approx. 135 g' },
      { group: 'Aircraft', label: 'Dimensions', value: '130×157×48.5 mm (L×W×H)' },
      { group: 'Aircraft', label: 'Max Flight Time', value: 'Approx. 18 minutes (17 minutes with Propeller Guards)' },
      { group: 'Camera', label: 'Image Sensor', value: '1/2-inch image sensor, 12 MP Effective Pixels' },
      { group: 'Camera', label: 'Lens', value: 'FOV: 117.6°, Format Equivalent: 14 mm, Aperture: f/2.8' },
      { group: 'Camera', label: 'Video Resolution', value: '4K (3840×2880@30fps), 1080p (1920×1080@60/50/30fps)' },
      { group: 'Battery', label: 'Capacity', value: '1435 mAh Li-ion 2S' },
      { group: 'Connectivity', label: 'Internal Storage', value: '22 GB High-Speed Flash Memory' }
    ],
    faqs: [
      { question: 'Do I need a remote controller to fly DJI Neo 2?', answer: 'No! DJI Neo 2 supports palm takeoff and landing, and can be operated entirely with palm gestures, on-body buttons, or voice control without a remote controller.' },
      { question: 'What is the video resolution of DJI Neo 2?', answer: 'DJI Neo 2 records crisp 4K ultra-stabilized video at 30 fps and Full HD 1080p video at up to 60 fps.' },
      { question: 'What is the weight and registration requirement for DJI Neo 2 in Australia?', answer: 'DJI Neo 2 weighs just 135 grams. In Australia, drones under 250 grams do not require CASA registration for recreational use.' }
    ]
  },

  {
    slug: 'dji-avata-2',
    name: 'DJI Avata 2',
    tagline: 'All-Thrills FPV Flight Experience',
    badge: 'Flagship FPV Drone',
    price: 1049,
    originalPrice: 1199,
    mainImage: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAVATA2-D1DO-10.jpg?v=1783663409',
    images: [
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAVATA2-D1DO-10.jpg?v=1783663409',
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAVATA2-FSC-01.jpg?v=1783663409',
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAVATA2-FMC-02.jpg?v=1783663409'
    ],
    overviewBanner: {
      title: 'DJI Avata 2',
      tagline: 'All-Thrills FPV Flight Experience',
      description: 'DJI Avata 2 delivers an adrenaline-packed, immersive FPV drone experience with improved imaging, safety, and battery life. Pair with the new DJI Goggles 3 and DJI RC Motion 3 for effortless flips, rolls, and tight 4K ultra-wide cinematic passes.',
      badge: 'Flagship Immersive FPV',
      features: ['Easy ACRO Acrobatics', '1/1.3-inch CMOS Super-Wide 4K/60fps', 'Integrated Propeller Guard', '10-Bit D-Log M', '23-Minute Max Flight Time', 'DJI O4 13km HD Video Transmission']
    },
    variants: [
      { name: 'Fly Smart Combo (Single Battery)', price: 1049, sku: 'DJIAVATA2-FSC', variantId: '46244868849825' },
      { name: 'Fly Smart Combo (Three Batteries)', price: 1279, sku: 'DJIAVATA2-FSC3', variantId: '46244868882593' },
      { name: 'Fly More Combo (Single Battery)', price: 1269, sku: 'DJIAVATA2C', variantId: '46244868915361', badge: 'Popular Combo' },
      { name: 'Fly More Combo (Three Batteries)', price: 1559, sku: 'DJIAVATA2C3', variantId: '46244868948129', badge: 'Best Value' }
    ],
    videoShowcases: [
      {
        id: 'immersion',
        title: 'Immersion Reimagined — Next-Gen FPV',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/24715b82-f4a3-4970-840a-377a596809a4/hero-13bc678fa4.mp4',
        description: 'Feel the rush of total immersion. Pair with DJI Goggles 3 featuring Real View PiP (Picture-in-Picture) so you can observe your physical surroundings without taking off the goggles.'
      },
      {
        id: 'easy-acro',
        title: 'Easy ACRO — Flip, Roll & 180° Drift',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/f8676b07-7045-4993-9444-c494d9087bb3/one-push-power-loop-e27fca795a.mp4',
        description: 'Pull off breathtaking aerobatics with a single push of the motion controller joystick. Anyone can perform soaring flips, lateral rolls, and 180° high-speed yaw drifts effortlessly.',
        modes: ['One-Push Flip', 'One-Push Roll', 'One-Push 180° Drift']
      },
      {
        id: 'super-wide',
        title: 'Tight Shots in Super-Wide 4K',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/88a36ef5-2f8c-45fc-915a-dfbf84878452/fpv-drone-835572b321.mp4',
        description: 'Create breathtaking visuals with the 155° ultra-wide-angle FOV and high-speed low-altitude flight capabilities, squeezing through dense tree canopies and tight architectural gaps.'
      },
      {
        id: 'o4-transmission',
        title: 'O4 Video Transmission & Safety Shield',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/b19ea465-a449-4f28-ab19-0b840c1a5d38/o4-video-transmission-enhanced-perception-2caa390121.mp4',
        description: 'Enhanced two-transmitter four-receiver antenna design ensures robust anti-interference performance and ultra-low 24ms transmission latency.'
      }
    ],
    inTheBox: [
      { title: '1 x DJI Avata 2 Aircraft', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAVATA2-D1DO-10.jpg?v=1783663409' },
      { title: '1 x DJI Goggles 3', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAVATA2-FSC-01.jpg?v=1783663409' },
      { title: '1 x DJI RC Motion 3', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAVATA2-FSC-01.jpg?v=1783663409' },
      { title: '1 x Intelligent Flight Battery', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAVATA2-D1DO-10.jpg?v=1783663409' },
      { title: '2 x Propellers (Pair)', qty: 2, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAVATA2-D1DO-10.jpg?v=1783663409' },
      { title: '1 x Gimbal Protector', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAVATA2-D1DO-10.jpg?v=1783663409' }
    ],
    rawSpecs: [
      { group: 'Aircraft', label: 'Takeoff Weight', value: 'Approx. 377 g' },
      { group: 'Aircraft', label: 'Max Flight Time', value: 'Approx. 23 minutes' },
      { group: 'Camera', label: 'Sensor', value: '1/1.3-inch CMOS Effective Pixels: 12 MP' },
      { group: 'Camera', label: 'FOV', value: '155° Ultra-Wide Angle' },
      { group: 'Camera', label: 'Video Resolution', value: '4K (3840×2160@60fps), 2.7K (2688×1512@120fps)' },
      { group: 'Transmission', label: 'Max Range', value: '13 km (FCC), 10 km (CE/SRRC/MIC)' }
    ],
    faqs: [
      { question: 'What goggles and controllers are compatible with DJI Avata 2?', answer: 'DJI Avata 2 is natively compatible with DJI Goggles 3, DJI RC Motion 3, and the DJI FPV Remote Controller 3.' },
      { question: 'What is Turtle Mode on DJI Avata 2?', answer: 'If Avata 2 lands upside down, Turtle Mode automatically flips the drone right-side-up with the push of a button so you can immediately take off again.' }
    ]
  },

  {
    slug: 'osmo-action-5-pro',
    name: 'Osmo Action 5 Pro',
    tagline: 'Revolutionary Pro Imagery in Action',
    badge: 'Pro Action Camera',
    price: 399,
    originalPrice: 429,
    mainImage: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOA5PRO-SC-05.jpg?v=1783653434',
    images: [
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOA5PRO-SC-05.jpg?v=1783653434',
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOA5PRO-AC-01.jpg?v=1783653434'
    ],
    overviewBanner: {
      title: 'Osmo Action 5 Pro',
      tagline: 'Revolutionary Pro Imagery in Action',
      description: 'Osmo Action 5 Pro sets a new benchmark in action cameras. Featuring a revolutionary next-generation 1/1.3-inch sensor with 13.5 stops of dynamic range, 4-hour extended battery runtime, dual high-brightness OLED touchscreens, and 20m bare-machine waterproof capability.',
      badge: 'Pro Action Camera',
      features: ['Next-Gen 1/1.3-inch Sensor', '13.5-Stop Dynamic Range', '4-Hour Extended Battery Life', 'Dual High-Brightness OLED Touchscreens', '20m Waterproof Without Case', 'Subject Centering & Tracking']
    },
    variants: [
      { name: 'Standard Combo', price: 399, sku: 'OSMOA5PRO-SC', variantId: '46355068387489' },
      { name: 'Adventure Combo', price: 569, sku: 'OSMOA5PRO-AC', variantId: '46355068420257', badge: 'Adventure Pack' }
    ],
    videoShowcases: [
      {
        id: 'sensor-range',
        title: 'Next-Gen 1/1.3-inch Sensor with 13.5 Stops Dynamic Range',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/e1e63586-47ab-4e04-ae3d-928c33f936d4/f21-ac204-feature-clean-10s-v2-1920x1080.webm',
        description: 'Equipped with a custom-engineered 4nm high-performance chip and 2.4μm pixel size, Action 5 Pro captures crisp highlights and deep shadows with unprecedented clarity.'
      },
      {
        id: 'super-night',
        title: 'SuperNight Mode with AI Noise Reduction',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/49f7fe0d-4989-4a11-b23f-2ba66c1f78c2/0917eee8-353f-4098-a19c-2bcde81027b0.mp4',
        description: 'Deep-learning AI algorithms overcome low-light challenges, capturing stunningly clean nighttime cityscapes and low-light sports.'
      },
      {
        id: 'subject-tracking',
        title: 'Intelligent Subject Centering & Tracking',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/291efa3f-91e0-4657-b648-0a4044d8b69f/5ce3b03b-d33e-40eb-854e-d2c19cabeb9b.mp4',
        description: 'Action 5 Pro intelligently detects the subject position and adjusts composition dynamically, keeping you centered in every frame.'
      },
      {
        id: 'battery-runtime',
        title: '4-Hour Extended Battery Life',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/f9e633a5-f71e-4207-b83e-2ac6a2d73918/37d2eff1-feaa-48ee-9b49-19d6dd19a030.webm',
        description: 'Up to 4 hours of continuous recording per battery — a 50% increase over previous generations. Even in freezing conditions down to -20°C, enjoy up to 3.6 hours of battery life.'
      }
    ],
    inTheBox: [
      { title: '1 x Osmo Action 5 Pro', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOA5PRO-SC-05.jpg?v=1783653434' },
      { title: '1 x Osmo Action Extreme Battery Plus (1950 mAh)', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOA5PRO-SC-05.jpg?v=1783653434' },
      { title: '1 x Horizontal-Vertical Protective Frame', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOA5PRO-SC-05.jpg?v=1783653434' },
      { title: '1 x Quick-Release Adapter Mount', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOA5PRO-SC-05.jpg?v=1783653434' },
      { title: '1 x Curved Adhesive Base', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOA5PRO-SC-05.jpg?v=1783653434' },
      { title: '1 x Locking Screw & USB-C Cable', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOA5PRO-SC-05.jpg?v=1783653434' }
    ],
    rawSpecs: [
      { group: 'Camera', label: 'Sensor', value: '1/1.3-inch CMOS Sensor' },
      { group: 'Camera', label: 'Dynamic Range', value: '13.5 Stops' },
      { group: 'Camera', label: 'Max Video', value: '4K (3840×2160) at up to 120fps' },
      { group: 'Battery', label: 'Capacity', value: '1950 mAh Extreme Battery Plus' },
      { group: 'Battery', label: 'Operating Time', value: '240 minutes' },
      { group: 'Durability', label: 'Waterproof Depth', value: '20 m without waterproof case' }
    ],
    faqs: [
      { question: 'Is Osmo Action 5 Pro waterproof without a case?', answer: 'Yes! Osmo Action 5 Pro is waterproof down to 20 meters without requiring any external case.' },
      { question: 'How long does the battery last?', answer: 'The new Extreme Battery Plus provides up to 240 minutes (4 hours) of continuous recording in standard conditions.' }
    ]
  },

  {
    slug: 'dji-air-3s',
    name: 'DJI Air 3S',
    tagline: 'Chase the Light with Dual Primary Cameras',
    badge: 'Dual-Camera Drone',
    price: 1699,
    originalPrice: 1799,
    mainImage: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09_d1f6a795-631f-43e3-a655-8d37b54f65ff.jpg?v=1783478497',
    images: [
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09_d1f6a795-631f-43e3-a655-8d37b54f65ff.jpg?v=1783478497',
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3SC-01.jpg?v=1783478497',
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3SRC2C-02.jpg?v=1783478497'
    ],
    overviewBanner: {
      title: 'DJI Air 3S',
      tagline: 'Chase the Light with Dual Primary Cameras',
      description: 'DJI Air 3S is a dual-camera drone designed for travel photography. It integrates a 1-inch CMOS primary camera and a 70mm medium telephoto camera, both delivering up to 14 stops of dynamic range and 4K/60fps HDR video, alongside forward-facing LiDAR nightscape obstacle sensing.',
      badge: 'Dual-Camera Travel Drone',
      features: ['1-inch CMOS Primary Camera', '70mm Medium Telephoto Camera', 'Nightscape Omnidirectional Sensing with LiDAR', '45-Minute Max Flight Time', 'DJI O4 20km Video Transmission', 'Free Panorama 4K/120fps']
    },
    variants: [
      { name: 'Standard (DJI RC-N3)', price: 1699, sku: 'DJIAIR3S', variantId: '46634789896353' },
      { name: 'Fly More Combo (DJI RC-N3)', price: 2129, sku: 'DJIAIR3SC', variantId: '46634789929121', badge: 'Popular Combo' },
      { name: 'Fly More Combo (DJI RC 2)', price: 2429, sku: 'DJIAIR3SRC2C', variantId: '46634789961889', badge: 'Flagship Screen RC' }
    ],
    videoShowcases: [
      {
        id: 'dual-cameras',
        title: 'Dual Primary Cameras — 1-inch CMOS & 70mm Telephoto',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/5e3c86bc-c07a-4461-8e86-c9c30779f218/b7e5922b-6d8a-4534-a9a3-f22188af3795.webm',
        description: 'Both cameras feature 10-bit D-Log M and HLG color modes. The 50MP 1-inch primary camera and 48MP 70mm medium telephoto camera deliver consistent cinematic color science across all focal lengths.'
      },
      {
        id: 'lidar-sensing',
        title: 'Nightscape Omnidirectional Sensing with Forward LiDAR',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/15e6d97a-9ab4-463e-ab6a-e87489f62af3/f8303e77-9000-4578-8562-b1c94bd1b6e6.webm',
        description: 'The first consumer drone to incorporate forward-facing LiDAR. Combined with infrared ToF sensors and vision cameras, Air 3S detects obstacles effortlessly even at night for secure nighttime return-to-home.'
      },
      {
        id: 'free-panorama',
        title: 'Free Panorama & ActiveTrack 360°',
        videoUrl: 'https://cdn.d1store.app/shopify/product-page-editor/assets/31ad3f54-ec7e-46f5-b27a-67d1eb57f983/80108f49-4c0e-498a-ae46-7441a3710e46.webm',
        description: 'Seamlessly stitch ultra-wide panoramic landscape compositions, while ActiveTrack 360° keeps subjects locked in cinematic framing with automatic terrain avoidance.'
      }
    ],
    inTheBox: [
      { title: '1 x DJI Air 3S Aircraft', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09_d1f6a795-631f-43e3-a655-8d37b54f65ff.jpg?v=1783478497' },
      { title: '1 x DJI RC-N3 Remote Controller', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3SC-01.jpg?v=1783478497' },
      { title: '1 x Intelligent Flight Battery', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09_d1f6a795-631f-43e3-a655-8d37b54f65ff.jpg?v=1783478497' },
      { title: '3 x Propellers (Pair)', qty: 3, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09_d1f6a795-631f-43e3-a655-8d37b54f65ff.jpg?v=1783478497' },
      { title: '1 x Gimbal Protector', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09_d1f6a795-631f-43e3-a655-8d37b54f65ff.jpg?v=1783478497' },
      { title: '1 x Type-C to Type-C PD Cable', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09_d1f6a795-631f-43e3-a655-8d37b54f65ff.jpg?v=1783478497' }
    ],
    rawSpecs: [
      { group: 'Aircraft', label: 'Takeoff Weight', value: '724 g' },
      { group: 'Aircraft', label: 'Max Flight Time', value: '45 minutes' },
      { group: 'Camera', label: 'Primary Camera', value: '1-inch CMOS, 50 MP, 24mm equivalent' },
      { group: 'Camera', label: 'Medium Telephoto', value: '1/1.3-inch CMOS, 48 MP, 70mm equivalent' },
      { group: 'Sensing', label: 'Night Sensing', value: 'Forward-facing LiDAR + Omnidirectional Vision' },
      { group: 'Transmission', label: 'Max Distance', value: '20 km (FCC), 10 km (CE)' }
    ],
    faqs: [
      { question: 'What is the main advantage of the forward LiDAR on DJI Air 3S?', answer: 'Forward-facing LiDAR allows DJI Air 3S to actively detect obstacles in pitch black nighttime environments where optical cameras cannot see.' },
      { question: 'What are the two focal lengths on DJI Air 3S?', answer: 'DJI Air 3S features a wide 24mm equivalent 1-inch CMOS lens and a 70mm medium telephoto lens.' }
    ]
  },

  {
    slug: 'dji-mini-4-pro',
    name: 'DJI Mini 4 Pro',
    tagline: 'Mini to the Max — Ultra-Lightweight 4K HDR Camera Drone',
    badge: 'Under 249g Flagship',
    price: 799,
    originalPrice: 899,
    mainImage: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIMINI4PRORC2CP-01.jpg?v=1789709508',
    images: [
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIMINI4PRORC2CP-01.jpg?v=1789709508',
      'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIMINI4PRO-DO-02.jpg?v=1789709508'
    ],
    overviewBanner: {
      title: 'DJI Mini 4 Pro',
      tagline: 'Mini to the Max — Ultra-Lightweight 4K HDR Camera Drone',
      description: 'Weighing under 249 grams, DJI Mini 4 Pro packs flagship capabilities into an ultra-portable body. Equipped with omnidirectional obstacle sensing, 4K/60fps HDR video, True Vertical Shooting, and 20km FHD transmission.',
      badge: 'Under 249g Flagship',
      features: ['Under 249g Regulatory Friendly', 'Omnidirectional Obstacle Sensing', '4K/60fps HDR True Vertical Shooting', '34-Min Flight Time', 'DJI O4 20km FHD Transmission', 'ActiveTrack 360°']
    },
    variants: [
      { name: 'Drone Only (No Battery)', price: 799, sku: 'DJIMINI4PROD1DO', variantId: '47638707929249' },
      { name: 'Fly More Combo Plus', price: 1499, sku: 'DJIMINI4PRORC2CP', variantId: '47638708060321', badge: 'Most Popular' }
    ],
    videoShowcases: [],
    inTheBox: [
      { title: '1 x DJI Mini 4 Pro Aircraft', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIMINI4PRORC2CP-01.jpg?v=1789709508' },
      { title: '1 x Intelligent Flight Battery Plus', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIMINI4PRORC2CP-01.jpg?v=1789709508' },
      { title: '1 x Spare Propellers (Pair)', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIMINI4PRORC2CP-01.jpg?v=1789709508' },
      { title: '1 x Gimbal Protector', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIMINI4PRORC2CP-01.jpg?v=1789709508' },
      { title: '1 x Propeller Holder', qty: 1, image: 'https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIMINI4PRORC2CP-01.jpg?v=1789709508' }
    ],
    rawSpecs: [
      { group: 'Aircraft', label: 'Takeoff Weight', value: '< 249 g' },
      { group: 'Aircraft', label: 'Max Flight Time', value: '34 mins (Standard) / 45 mins (Plus)' },
      { group: 'Camera', label: 'Sensor', value: '1/1.3-inch CMOS Sensor, Dual Native ISO Fusion' },
      { group: 'Camera', label: 'Video', value: '4K/60fps HDR & 4K/100fps Slow Motion' },
      { group: 'Sensing', label: 'Obstacle Sensing', value: 'Omnidirectional Vision Sensing System' },
      { group: 'Transmission', label: 'Transmission System', value: 'DJI O4, up to 20 km FHD' }
    ],
    faqs: [
      { question: 'Do I need to register DJI Mini 4 Pro in Australia?', answer: 'In Australia, recreational drones weighing under 250 grams do not require registration with CASA.' },
      { question: 'Can DJI Mini 4 Pro shoot true vertical video for Instagram and TikTok?', answer: 'Yes! The gimbal mechanically rotates 90 degrees for lossless True Vertical Shooting in full 4K resolution.' }
    ]
  },

  {
    slug: 'osmo-pocket-4p',
    name: 'Osmo Pocket 4P',
    tagline: 'Dual-Lens Cinematic Pocket Gimbal Camera',
    badge: 'Dual-Lens Gimbal Camera',
    price: 959,
    originalPrice: 1059,
    overviewBanner: {
      title: 'See More. Share More.',
      tagline: 'Dual-Lens Cinematic Pocket Gimbal Camera',
      description: 'Two lenses. One camera. Infinite creativity in the palm of your hand. Say hello to Osmo Pocket 4P, engineered for cinematic storytellers who demand high fidelity without carrying bulky gear.',
      badge: 'Dual-Lens Cinematic Pocket Gimbal Camera',
      features: ['17-Stop Dynamic Range', 'Dual 1-inch Optical System', '4K/120fps & 4K/240fps', '103GB High-Speed Storage']
    }
  }
];

async function syncAll() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  const col = mongoose.connection.db.collection('products');

  for (const item of productsData) {
    console.log(`Syncing ${item.name} (${item.slug})...`);
    const updatePayload = {
      name: item.name,
      tagline: item.tagline,
      badge: item.badge,
      price: item.price,
      originalPrice: item.originalPrice,
      mainImage: item.mainImage,
      images: item.images,
      overviewBanner: item.overviewBanner,
      variants: item.variants,
      videoShowcases: item.videoShowcases,
      inTheBox: item.inTheBox,
      rawSpecs: item.rawSpecs,
      faqs: item.faqs
    };
    if (item.inTheBoxVariants) {
      updatePayload.inTheBoxVariants = item.inTheBoxVariants;
    }
    Object.keys(updatePayload).forEach(key => updatePayload[key] === undefined && delete updatePayload[key]);

    const res = await col.updateOne(
      { slug: item.slug },
      { $set: updatePayload },
      { upsert: true }
    );
    console.log(`  Updated ${item.slug}: matched ${res.matchedCount}, modified ${res.modifiedCount}, upserted ${res.upsertedId || 0}`);
  }

  console.log('All flagship products synced successfully!');
  await mongoose.disconnect();
}

syncAll().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
