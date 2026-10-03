export interface MenuItem {
  title: string;
  href: string;
  badge?: string;
  img?: string;
}

export interface MenuSection {
  title: string;
  href?: string;
  items: MenuItem[];
}

export interface NavCategory {
  id: string;
  label: string;
  href: string;
  badge?: string;
  featured?: {
    title: string;
    description: string;
    image: string;
    href: string;
  };
  sections: MenuSection[];
}

export const navigationCategories: NavCategory[] = [
  {
    id: "drones",
    label: "Drones",
    href: "/collections/drones",
    featured: {
      title: "DJI Mavic 4 Pro",
      description: "Flagship 3-Camera Imaging System & 360° Omnidirectional Sensing",
      image: "https://cdn.d1store.app/shopify/product-page-editor/assets/2d431330-99da-464d-9f0a-1815ed9aa61e/005-website-categoryimages-mavic4p-fa.webp",
      href: "/collections/dji-mavic-4-pro"
    },
    sections: [
      {
        title: "Consumer Drones",
        href: "/collections/drones",
        items: [
          {
            title: "DJI Mavic 4 Pro",
            href: "/collections/dji-mavic-4-pro",
            badge: "New",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/2d431330-99da-464d-9f0a-1815ed9aa61e/005-website-categoryimages-mavic4p-fa.webp"
          },
          {
            title: "DJI Air 3S",
            href: "/collections/dji-air-3s",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/8d54172f-b19b-4754-a06e-a5561e1c0cfe/cat-thumb-air3s.webp"
          },
          {
            title: "DJI Mini 5 Pro",
            href: "/collections/dji-mini-5-pro",
            badge: "Sale",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/619a4dc0-0846-4e64-9dd8-f30feb3937c5/cat-thumb-fis26-mini5pro-01-v1.webp"
          },
          {
            title: "DJI Mini 4 Pro",
            href: "/collections/dji-mini-4-pro",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/8a80f44f-bfb5-4656-be70-75fb3979cd80/005-website-categoryimages-batch2-mini4pro-fa.webp"
          },
          {
            title: "DJI Lito X1",
            href: "/collections/dji-lito-x1",
            badge: "New",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/69a3c699-bbf5-44b1-a8d1-682eabd1116f/005-website-categoryimages-litox1-fa.webp"
          },
          {
            title: "DJI Lito 1",
            href: "/collections/dji-lito-1",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/5f9c1cc6-56ea-4232-98b6-6d1efec84264/cat-thumb-fis26-lito1-01-v1.webp"
          },
          {
            title: "DJI Flip",
            href: "/collections/dji-flip",
            badge: "Sale",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/918411ff-37e5-478e-a24f-d561bb58d8bc/cat-thumb-flip-fis26-v2.jpg"
          },
          {
            title: "DJI Neo 2",
            href: "/collections/dji-neo-2",
            badge: "New",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/c8150de7-006f-4f9b-84a4-526f5b082b97/005-website-categoryimages-neo2-fa.webp"
          }
        ]
      },
      {
        title: "FPV & Professional",
        href: "/collections/fpv-drones",
        items: [
          {
            title: "DJI Avata 360",
            href: "/collections/dji-avata-360",
            badge: "New",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/6cb925f3-3d84-47a4-a3a6-50c70bf7bbde/005-website-categoryimages-avata360-fa.webp"
          },
          {
            title: "DJI Avata 2",
            href: "/collections/dji-avata-2",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/cd2e4bf4-e8e1-4b77-a06e-ac0b9c183646/005-website-categoryimages-batch2-avata2-fa.webp"
          },
          {
            title: "DJI O4 Air Unit",
            href: "/collections/dji-o4-air-unit",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/6671325b-1130-4828-b116-58923af5f426/005-website-categoryimages-batch2-o4airunitpro-fa.jpg"
          },
          {
            title: "DJI Inspire 3",
            href: "/collections/dji-inspire-3",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/27f4ae33-7883-41fa-84d1-e50c47aae9dd/005-website-categoryimages-inspire3-fa.webp"
          }
        ]
      }
    ]
  },
  {
    id: "handhelds",
    label: "Handhelds",
    href: "/collections/handhelds",
    featured: {
      title: "Osmo Pocket 4P",
      description: "1-Inch CMOS Sensor & Dual OLED Touchscreens",
      image: "https://cdn.d1store.app/shopify/product-page-editor/assets/2199914d-50ca-4726-83ac-36c929f5a850/005-website-categoryimages-batch2-osmopocket4p-fa.jpg",
      href: "/collections/osmo-pocket-4p"
    },
    sections: [
      {
        title: "Pocket & Action Cameras",
        href: "/collections/handhelds",
        items: [
          {
            title: "Osmo Pocket 4P",
            href: "/collections/osmo-pocket-4p",
            badge: "New",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/2199914d-50ca-4726-83ac-36c929f5a850/005-website-categoryimages-batch2-osmopocket4p-fa.jpg"
          },
          {
            title: "Osmo Pocket 4",
            href: "/collections/osmo-pocket-4",
            badge: "New",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/14c0de48-f095-4bca-941a-6c852827f275/005-website-categoryimages-osmopocket4p-fa.webp"
          },
          {
            title: "Osmo Pocket 3",
            href: "/collections/osmo-pocket-3",
            badge: "Sale",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/5c98a721-3838-4898-835b-ad34003e2404/cat-thumb-op3-fis26.jpg"
          },
          {
            title: "Osmo Action 6",
            href: "/collections/osmo-action-6",
            badge: "New",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/ae4e2e01-568d-4fa0-9450-eef56b6293ce/005-website-categoryimages-osmoaction6-fa.webp"
          },
          {
            title: "Osmo Action 5 Pro",
            href: "/collections/osmo-action-5-pro",
            badge: "Sale",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/94c37c80-ad14-4092-bc28-768c76fd22a7/cat-thumb-oa5pro-fis26-v1.jpg"
          },
          {
            title: "Osmo Nano",
            href: "/collections/osmo-nano",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/b6f58c8e-35a2-4a05-a279-2e3f7cee8b33/005-website-categoryimages-osmonano-fa.webp"
          },
          {
            title: "Osmo 360 II",
            href: "/collections/osmo-360-2",
            badge: "New",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/082d5d09-c0b4-4554-9d65-48ea74b10929/cat-thumb-osmo36011-2026.webp"
          }
        ]
      },
      {
        title: "Audio & Gimbals",
        href: "/collections/audio-gimbals",
        items: [
          {
            title: "DJI Mic 3",
            href: "/collections/dji-mic-3",
            badge: "New",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/7be5a073-6fc9-4674-bf4b-eef4fce32386/005-website-categoryimages-batch2-mic3-fa.webp"
          },
          {
            title: "DJI Mic Mini 2S",
            href: "/collections/dji-mic-mini-2s",
            badge: "New",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/a23d4681-36ce-468f-a9cb-b2f5b5f3ee6b/005-website-categoryimages-batch2-micmini2s-fa.jpg"
          },
          {
            title: "Osmo Mobile 8P",
            href: "/collections/osmo-mobile-8p",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/3b5ddb8e-3439-45b9-ad20-e51cc7567de7/005-website-categoryimages-mobile8p-fa.webp"
          },
          {
            title: "Osmo Mobile 8",
            href: "/collections/osmo-mobile-8",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/3b5ddb8e-3439-45b9-ad20-e51cc7567de7/005-website-categoryimages-mobile8p-fa.webp"
          }
        ]
      }
    ]
  },
  {
    id: "lifestyle-tech",
    label: "Lifestyle Tech",
    href: "/collections/lifestyle-tech",
    featured: {
      title: "DJI ROMO P2",
      description: "Intelligent Robot Cleaning Station with Active LiDAR Navigation",
      image: "https://cdn.d1store.app/shopify/product-page-editor/assets/ceced266-a544-4451-ba31-e7338eb11755/005-website-categoryimages-romop-fa.webp",
      href: "/collections/dji-romo-2"
    },
    sections: [
      {
        title: "Power Stations",
        href: "/collections/power-stations",
        items: [
          {
            title: "DJI Power 1000 Mini",
            href: "/collections/dji-power-1000-mini",
            badge: "New",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/ceced266-a544-4451-ba31-e7338eb11755/005-website-categoryimages-romop-fa.webp"
          },
          {
            title: "DJI Power 2000",
            href: "/collections/dji-power-2000",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/ceced266-a544-4451-ba31-e7338eb11755/005-website-categoryimages-romop-fa.webp"
          },
          {
            title: "DJI Power 1000 V2",
            href: "/collections/dji-power-1000-v2",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/ceced266-a544-4451-ba31-e7338eb11755/005-website-categoryimages-romop-fa.webp"
          }
        ]
      },
      {
        title: "Robot Vacuums",
        href: "/collections/robot-vacuums",
        items: [
          {
            title: "DJI ROMO P2",
            href: "/collections/dji-romo-p2",
            badge: "New",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/ceced266-a544-4451-ba31-e7338eb11755/005-website-categoryimages-romop-fa.webp"
          },
          {
            title: "DJI ROMO 2",
            href: "/collections/dji-romo-2",
            badge: "Sale",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/ceced266-a544-4451-ba31-e7338eb11755/005-website-categoryimages-romop-fa.webp"
          }
        ]
      }
    ]
  },
  {
    id: "enterprise",
    label: "Enterprise & Agriculture",
    href: "/collections/enterprise",
    featured: {
      title: "DJI Matrice 400",
      description: "Industrial Multi-Rotor Drone with Upgraded Flight Safety and Payloads",
      image: "https://cdn.d1store.app/shopify/product-page-editor/assets/a743ac05-d8fa-4b7b-9812-ceb184e763b9/005-website-categoryimages-flycart100-fa.webp",
      href: "/collections/dji-matrice-400"
    },
    sections: [
      {
        title: "Enterprise Solutions",
        href: "/collections/enterprise",
        items: [
          {
            title: "DJI Matrice 400",
            href: "/collections/dji-matrice-400",
            badge: "Flagship",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/a743ac05-d8fa-4b7b-9812-ceb184e763b9/005-website-categoryimages-flycart100-fa.webp"
          },
          {
            title: "DJI Matrice 4E",
            href: "/collections/dji-matrice-4e",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/a743ac05-d8fa-4b7b-9812-ceb184e763b9/005-website-categoryimages-flycart100-fa.webp"
          },
          {
            title: "DJI Dock 3",
            href: "/collections/dji-dock-3",
            badge: "Autonomous",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/8517e0cf-665b-43f8-a636-453be9903cf9/005-website-categoryimages-dock3-fa.webp"
          },
          {
            title: "DJI FlyCart 100",
            href: "/collections/dji-flycart-100",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/a743ac05-d8fa-4b7b-9812-ceb184e763b9/005-website-categoryimages-flycart100-fa.webp"
          }
        ]
      },
      {
        title: "Agriculture (AGRAS)",
        href: "/collections/agras",
        items: [
          {
            title: "DJI AGRAS T70P",
            href: "/collections/dji-agras-t70p",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/a743ac05-d8fa-4b7b-9812-ceb184e763b9/005-website-categoryimages-flycart100-fa.webp"
          },
          {
            title: "DJI AGRAS T100",
            href: "/collections/dji-agras-t100",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/a743ac05-d8fa-4b7b-9812-ceb184e763b9/005-website-categoryimages-flycart100-fa.webp"
          },
          {
            title: "D-RTK 3 Base Station",
            href: "/collections/d-rtk-3",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/a743ac05-d8fa-4b7b-9812-ceb184e763b9/005-website-categoryimages-flycart100-fa.webp"
          }
        ]
      }
    ]
  },
  {
    id: "hasselblad",
    label: "Hasselblad",
    href: "/collections/hasselblad",
    featured: {
      title: "Hasselblad X2D II 100C",
      description: "100MP Medium Format BSI CMOS Sensor with 16-Bit Colour",
      image: "https://cdn.d1store.app/shopify/product-page-editor/assets/7e2a0013-bac8-48f4-a377-c2e5d562ec76/005-website-categoryimages-hb-x2dii100c-fa.webp",
      href: "/collections/hasselblad-cameras"
    },
    sections: [
      {
        title: "Medium Format Cameras",
        href: "/collections/hasselblad-cameras",
        items: [
          {
            title: "X2D II 100C",
            href: "/products/hasselblad-x2d-ii-100c",
            badge: "Flagship",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/7e2a0013-bac8-48f4-a377-c2e5d562ec76/005-website-categoryimages-hb-x2dii100c-fa.webp"
          },
          {
            title: "907X & CFV 100C",
            href: "/products/hasselblad-907x-cfv-100c-au",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/7e2a0013-bac8-48f4-a377-c2e5d562ec76/005-website-categoryimages-hb-x2dii100c-fa.webp"
          }
        ]
      },
      {
        title: "XCD Lenses",
        href: "/collections/hasselblad-lenses",
        items: [
          {
            title: "XCD 2.5/25mm V Lens",
            href: "/products/hb-xcd-25",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/7e2a0013-bac8-48f4-a377-c2e5d562ec76/005-website-categoryimages-hb-x2dii100c-fa.webp"
          },
          {
            title: "XCD 4.5 20 - 35mm",
            href: "/products/hb-xcd-20-35",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/7e2a0013-bac8-48f4-a377-c2e5d562ec76/005-website-categoryimages-hb-x2dii100c-fa.webp"
          },
          {
            title: "XCD 2,5/38V",
            href: "/products/hasselblad-xcd-lens-38",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/7e2a0013-bac8-48f4-a377-c2e5d562ec76/005-website-categoryimages-hb-x2dii100c-fa.webp"
          }
        ]
      }
    ]
  },
  {
    id: "accessories",
    label: "Accessories",
    href: "/collections/accessories",
    sections: [
      {
        title: "Popular Categories",
        href: "/collections/accessories",
        items: [
          { title: "Drone Accessories", href: "/collections/drone-accessories" },
          { title: "Handheld Accessories", href: "/collections/handheld-accessories" },
          { title: "Batteries & Chargers", href: "/collections/batteries-chargers" },
          { title: "Filters & Optics", href: "/collections/filters-optics" },
          { title: "Hard Cases & Backpacks", href: "/collections/cases-backpacks" },
          { title: "Landing Pads", href: "/collections/landing-pads" }
        ]
      },
      {
        title: "Top Brands",
        href: "/collections/brands",
        items: [
          { title: "D1 Labs", href: "/collections/d1-labs" },
          { title: "PGYTECH", href: "/collections/pgytech" },
          { title: "Freewell", href: "/collections/freewell" },
          { title: "GPC Cases", href: "/collections/gpc" },
          { title: "BRDRC", href: "/collections/brdrc" },
          { title: "UGREEN", href: "/collections/ugreen" }
        ]
      }
    ]
  },
  {
    id: "sale",
    label: "Sale",
    href: "/collections/sale",
    badge: "Deals",
    featured: {
      title: "DJI Spring & Summer Deals",
      description: "Save up to $600 on select drones, gimbals, and creator bundles.",
      image: "https://cdn.d1store.app/shopify/product-page-editor/assets/77aa140a-fe95-4305-90f2-f2dad008a8d6/005-website-categoryimages-sale-v2.png",
      href: "/collections/dji-sale"
    },
    sections: [
      {
        title: "Deals & Clearance",
        href: "/collections/sale",
        items: [
          {
            title: "DJI Deals & Specials",
            href: "/collections/dji-sale",
            badge: "Hot",
            img: "https://cdn.d1store.app/shopify/product-page-editor/assets/77aa140a-fe95-4305-90f2-f2dad008a8d6/005-website-categoryimages-sale-v2.png"
          },
          { title: "Drone Bundles", href: "/collections/drone-bundles" },
          { title: "Handheld Bundles", href: "/collections/handheld-bundles" },
          { title: "Power Bundles", href: "/collections/power-bundles" },
          { title: "Ex-Demo Drones", href: "/collections/ex-demo-drones", badge: "Refurbished" },
          { title: "Ex-Demo Handhelds", href: "/collections/ex-demo-handhelds" }
        ]
      }
    ]
  }
];
