// Extracted 1:1 from live D1 Store navigation
export interface MegaMenuItem {
  title: string;
  href: string;
  badge?: "Sale" | "New" | "Hot" | string;
}

export interface MegaMenuColumn {
  seriesTitle: string;
  seriesHref?: string;
  img?: string;
  items: MegaMenuItem[];
}

export interface MegaMenuCategory {
  id: string;
  label: string;
  href: string;
  columns: MegaMenuColumn[];
}

export const d1MegaMenus: MegaMenuCategory[] = [
  {
    "id": "drones",
    "label": "Drones",
    "href": "/collections/drones",
    "columns": [
      {
        "seriesTitle": "DJI Mavic",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/cc2128f7-0a63-4b8c-924b-d37d38f8b2e6/005-website-categoryimages-mavic4p-fa.webp",
        "items": [
          {
            "title": "DJI Mavic 4 Pro",
            "href": "/collections/dji-mavic-4-pro",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "DJI Air",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/cf5b01a1-2901-4709-b63b-32d4cd7a10dd/005-website-categoryimages-air3s-fa.webp",
        "items": [
          {
            "title": "DJI Air 3S",
            "href": "/collections/dji-air-3s",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "DJI Mini",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/619a4dc0-0846-4e64-9dd8-f30feb3937c5/cat-thumb-fis26-mini5pro-01-v1.webp",
        "items": [
          {
            "title": "DJI Mini 5 Pro",
            "href": "/collections/dji-mini-5-pro",
            "badge": "Sale"
          },
          {
            "title": "DJI Mini 4 Pro",
            "href": "/collections/dji-mini-4-pro",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "DJI Lito",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/69a3c699-bbf5-44b1-a8d1-682eabd1116f/005-website-categoryimages-litox1-fa.webp",
        "items": [
          {
            "title": "DJI Lito X1",
            "href": "/collections/dji-lito-x1",
            "badge": ""
          },
          {
            "title": "DJI Lito 1",
            "href": "/collections/dji-lito-1",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "DJI Flip",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/41ed0af0-4117-48dc-95f3-eeffb0a06cf0/cat-thumb-flip-fis26-v2.jpg",
        "items": [
          {
            "title": "DJI Flip",
            "href": "/collections/dji-flip",
            "badge": "Sale"
          }
        ]
      },
      {
        "seriesTitle": "DJI Neo",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/c8150de7-006f-4f9b-84a4-526f5b082b97/005-website-categoryimages-neo2-fa.webp",
        "items": [
          {
            "title": "DJI Neo 2",
            "href": "/collections/dji-neo-2",
            "badge": ""
          },
          {
            "title": "DJI Neo",
            "href": "/collections/dji-neo",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "DJI Avata",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/6cb925f3-3d84-47a4-a3a6-50c70bf7bbde/005-website-categoryimages-avata360-fa.webp",
        "items": [
          {
            "title": "DJI Avata 360",
            "href": "/collections/dji-avata-360",
            "badge": ""
          },
          {
            "title": "DJI Avata 2",
            "href": "/collections/dji-avata-2",
            "badge": ""
          },
          {
            "title": "DJI O4 Air Unit",
            "href": "/collections/dji-o4-air-unit",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "DJI Inspire",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/27f4ae33-7883-41fa-84d1-e50c47aae9dd/005-website-categoryimages-inspire3-fa.webp",
        "items": [
          {
            "title": "DJI Inspire 3",
            "href": "/collections/dji-inspire-3",
            "badge": ""
          }
        ]
      }
    ]
  },
  {
    "id": "handhelds",
    "label": "Handhelds",
    "href": "/collections/handhelds",
    "columns": [
      {
        "seriesTitle": "Osmo Pocket",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/9a4fcda6-2e7a-47eb-84ab-5e63c963423b/005-website-categoryimages-batch2-osmopocket4p-fa.jpg",
        "items": [
          {
            "title": "Osmo Pocket 4P",
            "href": "/collections/osmo-pocket-4p",
            "badge": ""
          },
          {
            "title": "Osmo Pocket 4",
            "href": "/collections/osmo-pocket-4",
            "badge": ""
          },
          {
            "title": "Osmo Pocket 3",
            "href": "/collections/osmo-pocket-3",
            "badge": "Sale"
          }
        ]
      },
      {
        "seriesTitle": "Osmo Action",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/ae4e2e01-568d-4fa0-9450-eef56b6293ce/005-website-categoryimages-osmoaction6-fa.webp",
        "items": [
          {
            "title": "Osmo Action 6",
            "href": "/collections/osmo-action-6",
            "badge": ""
          },
          {
            "title": "Osmo Action 5 Pro",
            "href": "/collections/osmo-action-5-pro",
            "badge": "Sale"
          },
          {
            "title": "Osmo Action 4",
            "href": "/collections/osmo-action-4",
            "badge": "Sale"
          }
        ]
      },
      {
        "seriesTitle": "Osmo Nano",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/b6f58c8e-35a2-4a05-a279-2e3f7cee8b33/005-website-categoryimages-osmonano-fa.webp",
        "items": [
          {
            "title": "Osmo Nano",
            "href": "/collections/osmo-nano",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "Osmo 360",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/e5fd73f5-cb1a-4767-8ba3-2af0bdc1e8e5/005-website-categoryimages-osmo360-fa.webp",
        "items": [
          {
            "title": "Osmo 360 II",
            "href": "/collections/osmo-360-2",
            "badge": "New"
          },
          {
            "title": "Osmo 360",
            "href": "/collections/osmo-360",
            "badge": "Sale"
          }
        ]
      },
      {
        "seriesTitle": "Osmo Mobile",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/3b5ddb8e-3439-45b9-ad20-e51cc7567de7/005-website-categoryimages-mobile8p-fa.webp",
        "items": [
          {
            "title": "Osmo Mobile 8P",
            "href": "/collections/osmo-mobile-8p",
            "badge": ""
          },
          {
            "title": "Osmo Mobile 8",
            "href": "/collections/osmo-mobile-8",
            "badge": "Sale"
          },
          {
            "title": "Osmo Mobile 7P",
            "href": "/collections/osmo-mobile-7p",
            "badge": "Sale"
          }
        ]
      },
      {
        "seriesTitle": "DJI Mic",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/e3fbcd72-7430-4544-a29c-70bd325df8eb/005-website-categoryimages-micmini2-fa.webp",
        "items": [
          {
            "title": "DJI Mic Mini 2S",
            "href": "/collections/dji-mic-mini-2s",
            "badge": ""
          },
          {
            "title": "DJI Mic Mini 2",
            "href": "/collections/dji-mic-mini-2",
            "badge": ""
          },
          {
            "title": "DJI Mic 3",
            "href": "/collections/dji-mic-3",
            "badge": ""
          },
          {
            "title": "DJI Mic 2",
            "href": "/collections/dji-mic-2",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "DJI Ronin Stabilisers",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/bcac584c-5bf5-43fe-9586-dc7ad83c9052/005-website-categoryimages-rs5-fa.webp",
        "items": [
          {
            "title": "DJI RS 5",
            "href": "/collections/dji-rs-5",
            "badge": ""
          },
          {
            "title": "DJI RS 4 Pro",
            "href": "/collections/dji-rs-4-pro",
            "badge": ""
          },
          {
            "title": "DJI RS 4",
            "href": "/collections/dji-rs-4",
            "badge": ""
          },
          {
            "title": "DJI RS 4 Mini",
            "href": "/collections/dji-rs-4-mini",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "DJI Pro",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/a5749975-cf24-41c2-8f2a-edb046770734/005-website-categoryimages-ronin4d-fa.webp",
        "items": [
          {
            "title": "DJI Ronin 4D",
            "href": "/collections/dji-ronin-4d",
            "badge": ""
          },
          {
            "title": "DJI SDR Transmission 2",
            "href": "/collections/dji-sdr-transmission-2",
            "badge": ""
          },
          {
            "title": "DJI SDR Transmission",
            "href": "/collections/dji-sdr-transmission",
            "badge": ""
          },
          {
            "title": "DJI Transmission",
            "href": "/collections/dji-transmission",
            "badge": ""
          },
          {
            "title": "DJI Focus Pro",
            "href": "/collections/dji-focus-pro",
            "badge": ""
          }
        ]
      }
    ]
  },
  {
    "id": "lifestyle-tech",
    "label": "Lifestyle Tech",
    "href": "/collections/lifestyle-tech",
    "columns": [
      {
        "seriesTitle": "Power Stations",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/cb6768be-2e8b-4105-913e-9c04d779c50d/cat-thumb-power-station.webp",
        "items": [
          {
            "title": "DJI Power 1000 Mini",
            "href": "/collections/dji-power-1000-mini",
            "badge": ""
          },
          {
            "title": "DJI Power 2000",
            "href": "/collections/dji-power-2000",
            "badge": ""
          },
          {
            "title": "DJI Power 1000 V2",
            "href": "/collections/dji-power-1000-v2",
            "badge": ""
          },
          {
            "title": "DJI Power 1000",
            "href": "/collections/dji-power-1000",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "Robot Vacuums",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/76fef2dc-2dfe-4839-bfc4-9b7a4ac01062/category-thumbnail-sale-romo-2.webp",
        "items": [
          {
            "title": "DJI ROMO 2",
            "href": "/collections/dji-romo-2",
            "badge": "Sale"
          },
          {
            "title": "DJI ROMO",
            "href": "/collections/dji-romo",
            "badge": ""
          }
        ]
      }
    ]
  },
  {
    "id": "enterprise-agriculture",
    "label": "Enterprise & Agriculture",
    "href": "/collections/enterprise",
    "columns": [
      {
        "seriesTitle": "DJI Enterprise Drones",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/2de6a6be-602b-4566-aba8-f2ff689b0c17/005-website-categoryimages-matrice400-fa.webp",
        "items": [
          {
            "title": "DJI Matrice 400",
            "href": "/collections/dji-matrice-400",
            "badge": ""
          },
          {
            "title": "DJI Matrice 4D Series",
            "href": "/collections/dji-matrice-4d",
            "badge": ""
          },
          {
            "title": "DJI Matrice 4 Series",
            "href": "/collections/dji-matrice-4",
            "badge": ""
          },
          {
            "title": "Matrice 30",
            "href": "/collections/matrice-30",
            "badge": ""
          },
          {
            "title": "DJI Mavic 3 Enterprise",
            "href": "/collections/dji-mavic-3-enterprise",
            "badge": ""
          },
          {
            "title": "Matrice 350 RTK",
            "href": "/collections/matrice-350-rtk",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "Payloads",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/6366e536-66d4-4561-b592-a2f495fc5170/005-website-categoryimages-zenmusel3-fa.webp",
        "items": [
          {
            "title": "LiDAR",
            "href": "/collections/lidar",
            "badge": ""
          },
          {
            "title": "Public Safety",
            "href": "/collections/public-safety",
            "badge": ""
          },
          {
            "title": "Thermal",
            "href": "/collections/thermal",
            "badge": ""
          },
          {
            "title": "Gas Detection",
            "href": "/collections/gas-detection",
            "badge": ""
          },
          {
            "title": "Photogrammetry",
            "href": "/collections/photogrammetry",
            "badge": ""
          },
          {
            "title": "Water Sampling",
            "href": "/collections/water-sampling",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "DJI Dock",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/8517e0cf-665b-43f8-a636-453be9903cf9/005-website-categoryimages-dock3-fa.webp",
        "items": [
          {
            "title": "DJI Dock 3",
            "href": "/collections/dji-dock-3",
            "badge": ""
          },
          {
            "title": "DJI Dock 2",
            "href": "/collections/dji-dock-2",
            "badge": ""
          },
          {
            "title": "DJI Dock",
            "href": "/collections/dji-dock",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "AGRAS",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/c6d03193-125d-45e5-a9e4-826469dec05d/005-website-categoryimages-agrast100-fa.webp",
        "items": [
          {
            "title": "DJI AGRAS T100",
            "href": "/collections/dji-agras-t100",
            "badge": ""
          },
          {
            "title": "DJI AGRAS T70P",
            "href": "/collections/dji-agras-t70p",
            "badge": ""
          },
          {
            "title": "DJI AGRAS T50",
            "href": "/collections/dji-agras-t50",
            "badge": ""
          },
          {
            "title": "DJI AGRAS T25P",
            "href": "/collections/dji-agras-t25p",
            "badge": ""
          },
          {
            "title": "DJI Mavic 3 Multispectral",
            "href": "/collections/dji-mavic-3-multispectral",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "DJI Delivery",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/a743ac05-d8fa-4b7b-9812-ceb184e763b9/005-website-categoryimages-flycart100-fa.webp",
        "items": [
          {
            "title": "DJI FlyCart 100",
            "href": "/collections/dji-flycart-100",
            "badge": ""
          },
          {
            "title": "DJI FlyCart 30",
            "href": "/collections/dji-flycart-30",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "DJI Enterprise Accessories",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/aecc0759-a91a-487b-a9db-92d141996100/005-website-categoryimages-d-rk3-fa.webp",
        "items": [
          {
            "title": "D-RTK 3",
            "href": "/collections/d-rtk-3",
            "badge": ""
          },
          {
            "title": "Manifold 3",
            "href": "/collections/manifold-3",
            "badge": ""
          },
          {
            "title": "DJI FlightHub 2 AIO",
            "href": "/collections/dji-flighthub-2-aio",
            "badge": ""
          },
          {
            "title": "DJI O4 Ground Station",
            "href": "/collections/dji-o4-ground-station",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "Software",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/349a9be6-0f79-4bbd-9a44-75e903f6532c/005-website-categoryimages-fligthhub2-fa.webp",
        "items": [
          {
            "title": "DJI FlightHub 2",
            "href": "/collections/dji-flighthub-2",
            "badge": ""
          },
          {
            "title": "DJI Terra",
            "href": "/collections/dji-terra",
            "badge": ""
          },
          {
            "title": "DJI Modify",
            "href": "/collections/dji-modify",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "Hardware",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/c3c58550-8733-4405-832f-90efd1c83454/005-website-categoryimages-emlidreachrs4-fa.webp",
        "items": [
          {
            "title": "Emlid Reach",
            "href": "/collections/emlid-reach",
            "badge": ""
          },
          {
            "title": "AVSS",
            "href": "/collections/avss",
            "badge": ""
          },
          {
            "title": "Unitree Robotics",
            "href": "/collections/unitree-robotics",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "Services",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/c59dc776-ef24-4b2c-8de0-7b7053193f05/005-website-categoryimages-djicareenterprise-fa.webp",
        "items": [
          {
            "title": "DJI Care Enterprise",
            "href": "/collections/dji-care-enterprise",
            "badge": ""
          },
          {
            "title": "DJI Maintenance Program",
            "href": "/collections/dji-maintenance-program",
            "badge": ""
          }
        ]
      }
    ]
  },
  {
    "id": "hasselblad",
    "label": "Hasselblad",
    "href": "/collections/hasselblad",
    "columns": [
      {
        "seriesTitle": "Cameras",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/7e2a0013-bac8-48f4-a377-c2e5d562ec76/005-website-categoryimages-hb-x2dii100c-fa.webp",
        "items": [
          {
            "title": "Cameras",
            "href": "/collections/hasselblad-cameras",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "Lenses",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/2e8ad0d1-f7cd-4e1d-9499-e230ad0203a6/005-website-categoryimages-hb-xcd35-100mm-fa.webp",
        "items": [
          {
            "title": "XCD V Series Lenses",
            "href": "/collections/hasselblad-xcd-v-series-lenses",
            "badge": ""
          },
          {
            "title": "XCD E Series Lenses",
            "href": "/collections/hasselblad-xcd-e-series-lenses",
            "badge": ""
          },
          {
            "title": "XCD P Series Lenses",
            "href": "/collections/hasselblad-xcd-p-series-lenses",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "Hasselblad Accessories",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/1ee20ed9-8d24-4656-91af-21c65bbdb01b/005-website-categoryimages-hb-camerabackpack-fa.webp",
        "items": [
          {
            "title": "Camera Accessories",
            "href": "/collections/hasselblad-camera-accessories",
            "badge": ""
          },
          {
            "title": "Lens Accessories",
            "href": "/collections/hasselblad-lens-accessories",
            "badge": ""
          }
        ]
      }
    ]
  },
  {
    "id": "accessories",
    "label": "Accessories",
    "href": "/collections/accessories",
    "columns": [
      {
        "seriesTitle": "Services",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/e8b5a82c-2a32-4690-b757-cf8ad0169481/005-website-categoryimages-services-fa.webp",
        "items": [
          {
            "title": "DJI Care Refresh",
            "href": "/collections/dji-care-refresh",
            "badge": ""
          },
          {
            "title": "DJI Care Pro",
            "href": "/collections/dji-care-pro",
            "badge": ""
          },
          {
            "title": "Gift Cards",
            "href": "/collections/gift-cards",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "Brands",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/17383c23-d80c-4650-98fd-401a558cc81a/005-website-categoryimages-brands-fa.webp",
        "items": [
          {
            "title": "D1 Labs",
            "href": "/collections/d1-labs",
            "badge": ""
          },
          {
            "title": "UGREEN",
            "href": "/collections/ugreen",
            "badge": ""
          },
          {
            "title": "Freewell",
            "href": "/collections/freewell",
            "badge": ""
          },
          {
            "title": "GPC",
            "href": "/collections/gpc",
            "badge": ""
          },
          {
            "title": "PGYTECH",
            "href": "/collections/pgytech",
            "badge": ""
          },
          {
            "title": "BRDRC",
            "href": "/collections/brdrc",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "Creator Essentials",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/cfb566ad-af80-45c5-948c-1c58804c8b2e/005-website-categoryimages-creatoressentials-fa.webp",
        "items": [
          {
            "title": "Landing Pads",
            "href": "/collections/landing-pads",
            "badge": ""
          },
          {
            "title": "Chargers",
            "href": "/collections/chargers",
            "badge": ""
          },
          {
            "title": "SD Cards",
            "href": "/collections/sd-cards",
            "badge": ""
          },
          {
            "title": "Cables",
            "href": "/collections/cables",
            "badge": ""
          },
          {
            "title": "Safety Cases",
            "href": "/collections/safety-cases",
            "badge": ""
          },
          {
            "title": "Drone Safety",
            "href": "/collections/drone-safety",
            "badge": ""
          },
          {
            "title": "NAS Systems",
            "href": "/collections/nas-systems",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "Drone Accessories",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/0a566000-c324-4a66-92e2-509379dfcaa5/005-website-categoryimages-droneaccessories-fa.webp",
        "items": [
          {
            "title": "DJI Mavic Series",
            "href": "/collections/dji-mavic-series-accessories",
            "badge": ""
          },
          {
            "title": "DJI Air Series",
            "href": "/collections/dji-air-series-accessories",
            "badge": ""
          },
          {
            "title": "DJI Mini Series",
            "href": "/collections/dji-mini-series-accessories",
            "badge": ""
          },
          {
            "title": "DJI Lito Series",
            "href": "/collections/dji-lito-series-accessories",
            "badge": ""
          },
          {
            "title": "DJI Avata Series",
            "href": "/collections/dji-avata-series-accessories",
            "badge": ""
          },
          {
            "title": "Phantom Series",
            "href": "/collections/phantom-series-accessories",
            "badge": ""
          },
          {
            "title": "DJI FPV Accessories",
            "href": "/collections/dji-fpv-accessories",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "Handheld Accessories",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/865506e2-9272-4551-9d55-841b9f8e02bf/005-website-categoryimages-handheldaccessories-fa.webp",
        "items": [
          {
            "title": "Osmo Pocket Series",
            "href": "/collections/osmo-pocket-series-accessories",
            "badge": ""
          },
          {
            "title": "Osmo Action Series",
            "href": "/collections/osmo-action-series-accessories",
            "badge": ""
          },
          {
            "title": "Osmo 360 Series",
            "href": "/collections/osmo-360-series-accessories",
            "badge": ""
          },
          {
            "title": "Osmo Mobile Series",
            "href": "/collections/osmo-mobile-series-accessories",
            "badge": ""
          },
          {
            "title": "DJI Mic Series",
            "href": "/collections/dji-mic-series-accessories",
            "badge": ""
          },
          {
            "title": "DJI RS Series",
            "href": "/collections/dji-rs-series-accessories",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "Enterprise Accessories",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/61289fd7-35b2-4103-aad2-6f96cd326bd5/005-website-categoryimages-enterpriseaccessories-fa.webp",
        "items": [
          {
            "title": "Matrice Series",
            "href": "/collections/matrice-series-accessories",
            "badge": ""
          },
          {
            "title": "Mavic 2 Enterprise Series Accessories",
            "href": "/collections/mavic-2-enterprise-series-accessories",
            "badge": ""
          }
        ]
      }
    ]
  },
  {
    "id": "sale",
    "label": "Sale",
    "href": "/collections/sale",
    "columns": [
      {
        "seriesTitle": "DJI Deals",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/77aa140a-fe95-4305-90f2-f2dad008a8d6/005-website-categoryimages-sale-v2.png",
        "items": [
          {
            "title": "DJI Deals",
            "href": "/collections/dji-sale",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "DJI Bundles",
        "seriesHref": "",
        "img": "https://www.d1store.com.au/cdn/shop/collections/dji-bundles.jpg?v=1790046698&width=360",
        "items": [
          {
            "title": "Drone Bundles",
            "href": "/collections/drone-bundles",
            "badge": ""
          },
          {
            "title": "Handheld Bundles",
            "href": "/collections/handheld-bundles",
            "badge": ""
          },
          {
            "title": "Power Bundles",
            "href": "/collections/power-bundles",
            "badge": ""
          }
        ]
      },
      {
        "seriesTitle": "Ex-Demo",
        "seriesHref": "",
        "img": "https://cdn.d1store.app/shopify/product-page-editor/assets/42db7738-65fb-4a41-a22e-f81e39db4de2/005-website-categoryimages-hb-exdemo-fa.png",
        "items": [
          {
            "title": "Ex-Demo Drones",
            "href": "/collections/ex-demo-drones",
            "badge": ""
          },
          {
            "title": "Ex-Demo Handhelds",
            "href": "/collections/ex-demo-handhelds",
            "badge": ""
          }
        ]
      }
    ]
  }
];
