import fs from "fs";
import path from "path";
import { IProduct, ICategory, IOrder, IHomepageSection } from "../types";
import { air3sProductData } from "../data/air3sData";

export interface IDatabaseState {
  products: IProduct[];
  categories: ICategory[];
  orders: IOrder[];
  homepageSections: IHomepageSection[];
}

const DATA_DIR = path.resolve(__dirname, "../../data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Helper to generate IDs
const generateId = (): string => {
  return "d1_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

export class DbStore {
  private static instance: DbStore;
  private state: IDatabaseState = {
    products: [],
    categories: [],
    orders: [],
    homepageSections: [],
  };
  private isInitialized = false;

  private constructor() {
    this.ensureDataDirectory();
    this.load();
  }

  public get initialized(): boolean {
    return this.isInitialized;
  }

  public static getInstance(): DbStore {
    if (!DbStore.instance) {
      DbStore.instance = new DbStore();
    }
    return DbStore.instance;
  }

  private ensureDataDirectory(): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): void {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        this.state = JSON.parse(raw);
        console.log(`[DbStore] Loaded ${this.state.products.length} products, ${this.state.categories.length} categories, ${this.state.orders.length} orders from disk.`);
        this.ensureCriticalProducts();
        this.isInitialized = true;
      } else {
        this.seedInitialData();
        this.save();
        this.isInitialized = true;
      }
    } catch (err) {
      console.error("[DbStore] Error loading db.json, re-initializing:", err);
      this.seedInitialData();
      this.save();
      this.isInitialized = true;
    }
  }

  private ensureCriticalProducts(): void {
    const existingIndex = this.state.products.findIndex((p) => p.slug === "dji-air-3s");
    if (existingIndex === -1) {
      this.state.products.unshift(air3sProductData);
      this.save();
      console.log("[DbStore] Added DJI Air 3S with full rich specifications to local database.");
    } else {
      const existing = this.state.products[existingIndex];
      const inTheBoxKeys = existing.inTheBoxVariants ? Object.keys(existing.inTheBoxVariants) : [];
      if (!existing.featureCards || existing.featureCards.length === 0 || inTheBoxKeys.length === 0 || !existing.rawSpecs || existing.rawSpecs.length < 10) {
        this.state.products[existingIndex] = {
          ...existing,
          ...air3sProductData,
          _id: existing._id,
        };
        this.save();
        console.log("[DbStore] Synchronized DJI Air 3S in local database with full rich specifications.");
      }
    }
  }

  public save(): void {
    try {
      this.ensureDataDirectory();
      fs.writeFileSync(DB_FILE, JSON.stringify(this.state, null, 2), "utf-8");
    } catch (err) {
      console.error("[DbStore] Failed to save state to disk:", err);
    }
  }

  // --- PRODUCTS ---
  public getProducts(filter?: {
    category?: string;
    subCategory?: string;
    collection?: string;
    tag?: string;
    isFeatured?: boolean;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    isProfessional?: boolean;
    isEnterprise?: boolean;
    tier?: string;
    inStock?: boolean;
    lowStock?: boolean;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): { products: IProduct[]; total: number; totalPages: number } {
    let result = [...this.state.products];

    if (filter) {
      if (filter.category) {
        const cat = filter.category.toLowerCase();
        const aliases: Record<string, string[]> = {
          drones: ["drones", "dji-drones", "professional-drones"],
          "dji-drones": ["drones", "dji-drones", "professional-drones"],
          handhelds: ["handhelds", "handheld", "handheld-cameras"],
          handheld: ["handhelds", "handheld", "handheld-cameras"],
          "handheld-cameras": ["handhelds", "handheld", "handheld-cameras"],
          "lifestyle-tech": ["handheld", "handhelds", "lifestyle-tech"],
          enterprise: ["enterprise-agriculture", "enterprise"],
          "enterprise-agriculture": ["enterprise-agriculture", "enterprise"],
        };
        const keys = aliases[cat] || [cat];
        result = result.filter((p) => {
          const slug = p.categorySlug.toLowerCase();
          const name = p.category.toLowerCase();
          return keys.includes(slug) || keys.includes(name) || name.includes(cat) || slug.includes(cat);
        });
      }
      if (filter.subCategory) {
        const sub = filter.subCategory.toLowerCase();
        result = result.filter((p) => p.subCategory?.toLowerCase() === sub);
      }
      if (filter.collection) {
        const col = filter.collection.toLowerCase();
        result = result.filter(
          (p) => Array.isArray(p.collections) && p.collections.some((c) => c.toLowerCase() === col)
        );
      }
      if (filter.tag) {
        const tag = filter.tag.toLowerCase();
        result = result.filter(
          (p) => Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase() === tag)
        );
      }
      if (typeof filter.isFeatured === "boolean") {
        result = result.filter((p) => p.isFeatured === filter.isFeatured);
      }
      if (typeof filter.isNewArrival === "boolean") {
        result = result.filter((p) => p.isNewArrival === filter.isNewArrival);
      }
      if (typeof filter.isBestSeller === "boolean") {
        result = result.filter((p) => p.isBestSeller === filter.isBestSeller);
      }
      if (typeof filter.isProfessional === "boolean") {
        result = result.filter((p) => p.isProfessional === filter.isProfessional);
      }
      if (typeof filter.isEnterprise === "boolean") {
        result = result.filter((p) => p.isEnterprise === filter.isEnterprise);
      }
      if (typeof filter.inStock === "boolean") {
        result = result.filter((p) => p.inStock === filter.inStock);
      }
      if (filter.tier) {
        result = result.filter((p) => p.tier === filter.tier || (filter.tier === "product" && !p.tier));
      }
      if (filter.lowStock !== undefined) {
        result = result.filter((p) => filter.lowStock ? ((p.stockCount ?? 0) <= 5 || !p.inStock) : ((p.stockCount ?? 0) > 5 && p.inStock));
      }
      if (typeof filter.minPrice === "number") {
        result = result.filter((p) => p.price >= filter.minPrice!);
      }
      if (typeof filter.maxPrice === "number") {
        result = result.filter((p) => p.price <= filter.maxPrice!);
      }
      if (filter.search) {
        const q = filter.search.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q)
        );
      }

      // Sort
      if (filter.sortBy === "price_asc") {
        result.sort((a, b) => a.price - b.price);
      } else if (filter.sortBy === "price_desc") {
        result.sort((a, b) => b.price - a.price);
      } else if (filter.sortBy === "name_asc") {
        result.sort((a, b) => a.name.localeCompare(b.name));
      } else if (filter.sortBy === "newest") {
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
      } else {
        // default by updated/created
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
      }
    }

    const total = result.length;
    const page = Math.max(1, filter?.page || 1);
    const limit = Math.max(1, Math.min(100, filter?.limit || 20));
    const skip = (page - 1) * limit;
    const paginated = result.slice(skip, skip + limit);

    return {
      products: paginated,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public getProductBySlug(slug?: string): IProduct | null {
    if (!slug || typeof slug !== "string") return null;
    const s = slug.toLowerCase();
    return this.state.products.find((p) => p.slug && p.slug.toLowerCase() === s) || null;
  }

  public getProductById(id?: string): IProduct | null {
    if (!id || typeof id !== "string") return null;
    const s = id.toLowerCase();
    return (
      this.state.products.find(
        (p) => p._id === id || (p.slug && p.slug.toLowerCase() === s) || p.sku === id
      ) || null
    );
  }

  public createProduct(data: Partial<IProduct>): IProduct {
    const now = new Date().toISOString();
    const newProd: IProduct = {
      ...data,
      _id: data._id || generateId(),
      name: data.name || "Untitled Product",
      slug: data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : generateId()),
      sku: data.sku || "DJI-" + Math.floor(100000 + Math.random() * 900000),
      category: data.category || "Drones",
      categorySlug: data.categorySlug || (data.category ? data.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "drones"),
      subCategory: data.subCategory || "Camera Drones",
      price: Number(data.price) || 0,
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      discountPercentage: data.discountPercentage || 0,
      badge: data.badge || "",
      tagline: data.tagline || "",
      description: data.description || "",
      features: data.features || [],
      specs: data.specs || {},
      images: data.images && data.images.length > 0 ? data.images : [data.mainImage || "/placeholder.jpg"],
      mainImage: data.mainImage || (data.images && data.images[0]) || "/placeholder.jpg",
      inStock: data.inStock !== undefined ? data.inStock : true,
      stockCount: Number(data.stockCount) || 10,
      rating: Math.round((Number(data.rating) || 4.9) * 10) / 10,
      reviewCount: Number(data.reviewCount) || 12,
      isFeatured: Boolean(data.isFeatured),
      isNewArrival: Boolean(data.isNewArrival),
      isBestSeller: Boolean(data.isBestSeller),
      isProfessional: Boolean(data.isProfessional),
      isEnterprise: Boolean(data.isEnterprise),
      tier: (data.tier as any) || "product",
      collections: data.collections || ["all"],
      tags: data.tags || [],
      highlights: data.highlights || [],
      inTheBox: data.inTheBox || [],
      inTheBoxVariants: data.inTheBoxVariants,
      rawSpecs: data.rawSpecs || [],
      faqs: data.faqs || [],
      featureCards: data.featureCards || [],
      overviewBanner: data.overviewBanner,
      variants: data.variants || [],
      videoShowcases: data.videoShowcases || [],
      storyBlocks: data.storyBlocks || [],
      compatibility: data.compatibility || [],
      bundleInclusions: data.bundleInclusions || [],
      bundleMainProduct: data.bundleMainProduct,
      createdAt: now,
      updatedAt: now,
    };

    this.state.products.unshift(newProd);
    this.save();
    return newProd;
  }

  public updateProduct(id: string, data: Partial<IProduct>): IProduct | null {
    const s = id.toLowerCase();
    const index = this.state.products.findIndex(
      (p) => p._id === id || p.slug === id || (p.slug && p.slug.toLowerCase() === s) || p.sku === id
    );
    if (index === -1) return null;

    const existing = this.state.products[index];
    const updated: IProduct = {
      ...existing,
      ...data,
      _id: existing._id,
      updatedAt: new Date().toISOString(),
    };

    if (data.stockCount !== undefined) {
      updated.stockCount = Number(data.stockCount);
      updated.inStock = updated.stockCount > 0;
    }

    this.state.products[index] = updated;
    this.save();
    return updated;
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.state.products.length;
    this.state.products = this.state.products.filter((p) => p._id !== id && p.slug !== id);
    if (this.state.products.length !== initialLen) {
      // Also remove from homepage sections
      this.state.homepageSections.forEach((sec) => {
        sec.productIds = sec.productIds.filter((pid) => pid !== id);
      });
      this.save();
      return true;
    }
    return false;
  }

  // --- CATEGORIES ---
  public getCategories(): ICategory[] {
    return [...this.state.categories];
  }

  public getCategoryBySlug(slug: string): ICategory | null {
    const s = slug.toLowerCase();
    const aliases: Record<string, string> = {
      drones: "dji-drones",
      handhelds: "handheld",
      "handheld-cameras": "handheld",
      "lifestyle-tech": "handheld",
      enterprise: "enterprise-agriculture",
    };
    const resolved = aliases[s] || s;
    return (
      this.state.categories.find((c) => c.slug.toLowerCase() === resolved) ||
      this.state.categories.find((c) => c.slug.toLowerCase() === s) ||
      null
    );
  }

  public createCategory(data: Partial<ICategory>): ICategory {
    const now = new Date().toISOString();
    const newCat: ICategory = {
      _id: data._id || generateId(),
      name: data.name || "New Category",
      slug: data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : generateId()),
      description: data.description || "",
      icon: data.icon || "",
      image: data.image || "",
      subCategories: data.subCategories || [],
      productCount: data.productCount || 0,
      featuredOrder: data.featuredOrder || 0,
      createdAt: now,
      updatedAt: now,
    };
    this.state.categories.push(newCat);
    this.save();
    return newCat;
  }

  public updateCategory(id: string, data: Partial<ICategory>): ICategory | null {
    const index = this.state.categories.findIndex((c) => c._id === id || c.slug === id);
    if (index === -1) return null;
    const existing = this.state.categories[index];
    const updated: ICategory = {
      ...existing,
      ...data,
      _id: existing._id,
      updatedAt: new Date().toISOString(),
    };
    this.state.categories[index] = updated;
    this.save();
    return updated;
  }

  public deleteCategory(id: string): boolean {
    const initialLen = this.state.categories.length;
    this.state.categories = this.state.categories.filter((c) => c._id !== id && c.slug !== id);
    if (this.state.categories.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- ORDERS ---
  public getOrders(): IOrder[] {
    return [...this.state.orders].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  public getOrderById(id: string): IOrder | null {
    return this.state.orders.find((o) => o._id === id || o.orderNumber === id) || null;
  }

  public createOrder(data: {
    customer: IOrder["customer"];
    items: IOrder["items"];
    shippingMethod?: string;
    shippingFee?: number;
    paymentMethod?: string;
    notes?: string;
  }): IOrder {
    const now = new Date().toISOString();
    const orderNum = "D1-" + Math.floor(10000 + Math.random() * 90000);

    const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = data.shippingFee !== undefined ? data.shippingFee : subtotal >= 99 ? 0 : 15;
    const tax = Math.round(subtotal * 0.1 * 100) / 100; // 10% GST included
    const total = subtotal + shippingFee;

    const newOrder: IOrder = {
      _id: generateId(),
      orderNumber: orderNum,
      customer: data.customer,
      items: data.items,
      subtotal,
      shippingFee,
      shippingMethod: data.shippingMethod || "Standard Delivery (Free over $99)",
      tax,
      total,
      status: "Processing",
      paymentMethod: data.paymentMethod || "Credit Card",
      paymentStatus: "Paid",
      notes: data.notes || "",
      createdAt: now,
      updatedAt: now,
    };

    // Deduct stock for each product
    data.items.forEach((item) => {
      const prod = this.getProductById(item.productId) || this.getProductBySlug(item.slug);
      if (prod) {
        const newStock = Math.max(0, prod.stockCount - item.quantity);
        this.updateProduct(prod._id!, { stockCount: newStock, inStock: newStock > 0 });
      }
    });

    this.state.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  public updateOrderStatus(
    orderId: string,
    status: IOrder["status"],
    paymentStatus?: IOrder["paymentStatus"]
  ): IOrder | null {
    const index = this.state.orders.findIndex((o) => o._id === orderId || o.orderNumber === orderId);
    if (index === -1) return null;
    this.state.orders[index].status = status;
    if (paymentStatus) {
      this.state.orders[index].paymentStatus = paymentStatus;
    }
    this.state.orders[index].updatedAt = new Date().toISOString();
    this.save();
    return this.state.orders[index];
  }

  // --- HOMEPAGE SECTIONS ---
  public getHomepageSections(): (IHomepageSection & { products: IProduct[] })[] {
    return this.state.homepageSections.map((sec) => {
      const products = sec.productIds
        .map((pid) => this.getProductById(pid) || this.getProductBySlug(pid))
        .filter((p): p is IProduct => p !== null);
      return {
        ...sec,
        products,
      };
    });
  }

  public getHomepageSectionByKey(key: string): (IHomepageSection & { products: IProduct[] }) | null {
    const sec = this.state.homepageSections.find((s) => s.sectionKey === key);
    if (!sec) return null;
    const products = sec.productIds
      .map((pid) => this.getProductById(pid) || this.getProductBySlug(pid))
      .filter((p): p is IProduct => p !== null);
    return {
      ...sec,
      products,
    };
  }

  public updateHomepageSection(
    key: string,
    data: { productIds?: string[]; title?: string; subtitle?: string; isEnabled?: boolean }
  ): IHomepageSection | null {
    const index = this.state.homepageSections.findIndex((s) => s.sectionKey === key);
    if (index === -1) return null;

    if (data.productIds) this.state.homepageSections[index].productIds = data.productIds;
    if (data.title) this.state.homepageSections[index].title = data.title;
    if (data.subtitle) this.state.homepageSections[index].subtitle = data.subtitle;
    if (data.isEnabled !== undefined) this.state.homepageSections[index].isEnabled = data.isEnabled;
    this.state.homepageSections[index].updatedAt = new Date().toISOString();

    this.save();
    return this.state.homepageSections[index];
  }

  // --- SEED CATALOG ---
  public seedInitialData(): void {
    console.log("[DbStore] Seeding authentic D1 Store catalog data...");

    const initialCategories: ICategory[] = [
      {
        _id: "cat_drones",
        name: "DJI Drones",
        slug: "dji-drones",
        description: "Explore the complete lineup of consumer and aerial camera drones.",
        image: "https://www.d1store.com.au/cdn/shop/files/Lito_X1_Homepage.jpg?v=1783910988&width=3000",
        subCategories: ["Mini Series", "Air Series", "Mavic Series", "FPV & Avata", "Neo Series"],
        productCount: 8,
        featuredOrder: 1,
      },
      {
        _id: "cat_handheld",
        name: "Handheld Cameras & Gimbals",
        slug: "handheld",
        description: "Pocket cameras, action cams, microphones, and camera stabilizers.",
        image: "https://www.d1store.com.au/cdn/shop/files/Osmo_Pocket_4P_Product_KV.jpg?v=1784606000&width=1920",
        subCategories: ["Osmo Pocket", "Osmo Action", "Osmo Mobile", "DJI Mic", "Ronin Gimbal"],
        productCount: 7,
        featuredOrder: 2,
      },
      {
        _id: "cat_pro",
        name: "Professional Drones",
        slug: "professional-drones",
        description: "High-end filmmaking drones including Inspire 3, Mavic 3 Cine, and Matrix.",
        image: "https://cdn.d1store.app/shopify/product-page-editor/assets/941ba0da-246e-440e-b7d5-d0693510e1ea/003-launch-mavic4pro-webbanner-desktop-2560x700px-nov25-fa.jpg",
        subCategories: ["Inspire Series", "Mavic 3 Pro Cine", "Ronin 4D"],
        productCount: 4,
        featuredOrder: 3,
      },
      {
        _id: "cat_enterprise",
        name: "Enterprise & Agriculture",
        slug: "enterprise-agriculture",
        description: "Commercial drone solutions for thermal inspection, surveying, mapping, and crop spraying.",
        image: "https://www.d1store.com.au/cdn/shop/files/M350RTK-DO-08_c4b4a162-8173-455b-bf99-2a9f4588be57.jpg?v=1784512965&width=800",
        subCategories: ["Matrice Series", "Mavic 3 Enterprise", "Agras Agriculture", "Zenmuse Payloads", "DJI Dock"],
        productCount: 6,
        featuredOrder: 4,
      },
      {
        _id: "cat_hasselblad",
        name: "Hasselblad Cameras",
        slug: "hasselblad",
        description: "Legendary medium format cameras and prime lenses engineered for pure photographic mastery.",
        image: "https://www.d1store.com.au/cdn/shop/files/x2d-ii-100c-d1-08.jpg?v=1784513076&width=800",
        subCategories: ["Medium Format Cameras", "XCD Lenses", "Accessories"],
        productCount: 3,
        featuredOrder: 5,
      },
    ];

    const initialProducts: IProduct[] = [
      // 1. Osmo Pocket 4P (Main evaluation target)
      {
        _id: "prod_osmo_pocket_4p",
        name: "Osmo Pocket 4P",
        slug: "osmo-pocket-4p",
        sku: "DJI-OP4P-001",
        category: "Handheld Cameras & Gimbals",
        categorySlug: "handheld",
        subCategory: "Osmo Pocket",
        price: 899,
        originalPrice: 999,
        discountPercentage: 10,
        badge: "NEW ARRIVAL",
        tagline: "Dual Lens Gimbal Camera • See More. Share More.",
        description:
          "The Osmo Pocket 4P revolutionizes handheld cinematography with a dual-lens 1-inch CMOS camera system, 3-axis mechanical gimbal stabilization, dual OLED touchscreens, and crystal-clear 4K/120fps HDR capture. Ideal for vloggers, travelers, and content creators demanding pro image quality in their pocket.",
        features: [
          "Dual 1-inch CMOS Flagship Sensors",
          "4K/120fps High Frame Rate & 10-bit D-Log M",
          "Full 3-Axis Mechanical Stabilization",
          "Rotatable 2.0-inch OLED Touchscreen Display",
          "Omnidirectional Audio with DJI Mic 2 Wireless Integration",
          "ActiveTrack 6.0 Subject Following & AI Framing",
        ],
        specs: {
          Sensor: "Dual 1-inch CMOS Sensors",
          Resolution: "4K UHD (3840×2160) @ 120fps",
          Stabilization: "3-Axis Mechanical Gimbal",
          BatteryLife: "166 minutes @ 1080p/24fps",
          Weight: "179 grams",
          Connectivity: "Wi-Fi 6, Bluetooth 5.2, USB-C",
          Dimensions: "139.7 × 42.2 × 33.5 mm",
        },
        images: [
          "https://www.d1store.com.au/cdn/shop/files/Osmo_Pocket_4P_Product_KV.jpg?v=1784606000&width=1920",
          "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_Batch2_OsmoPocket4P_FA.jpg?v=1785398783&width=960",
          "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_OsmoPocket4P_FA.png?v=1784185553&width=960",
        ],
        mainImage: "https://cdn.d1store.app/shopify/product-page-editor/assets/14c0de48-f095-4bca-941a-6c852827f275/005-website-categoryimages-osmopocket4p-fa.webp",
        inStock: true,
        stockCount: 25,
        rating: 4.9,
        reviewCount: 38,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
      },

      // 2. DJI Mic Mini 2S (From user's screenshot)
      {
        _id: "prod_dji_mic_mini_2s",
        name: "DJI Mic Mini 2S",
        slug: "dji-mic-mini-2s",
        sku: "DJI-MICM2S-002",
        category: "Handheld Cameras & Gimbals",
        categorySlug: "handheld",
        subCategory: "DJI Mic",
        price: 249,
        originalPrice: 289,
        discountPercentage: 14,
        badge: "HOT",
        tagline: "Pro Wireless Mic for Creators • Capture Every Detail",
        description:
          "Ultra-compact, featherlight wireless microphone delivering studio-grade 32-bit float audio, two-level active noise cancelling, and 48-hour battery longevity with magnetic quick-snap attachment.",
        features: [
          "32-Bit Float Internal Recording",
          "Intelligent 2-Stage Noise Cancellation",
          "Ultra-Lightweight 10g Magnetic Transmitter",
          "Up to 48 Hours Runtime with Charging Case",
          "250m Lossless Audio Transmission Range",
          "Universal compatibility with Cameras, Phones, and PCs",
        ],
        specs: {
          Frequency: "2.400 - 2.4835 GHz",
          AudioResolution: "32-bit Float, 48 kHz",
          OperatingRange: "250m (LOS)",
          TransmitterWeight: "10 grams",
          BatteryCaseCapacity: "1950 mAh",
        },
        images: [
          "https://cdn.d1store.app/shopify/product-page-editor/assets/1ffb3967-df39-4404-b903-88ee1b753cb7/003-launch-micmini2s-webbanner-desktop-2560x700px-jan26-fa.jpg",
          "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_Batch2_MicMini2s_FA.jpg?v=1785897087&width=960",
          "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_MicMini2_FA.png?v=1784185904&width=960",
        ],
        mainImage: "https://cdn.d1store.app/shopify/product-page-editor/assets/e3fbcd72-7430-4544-a29c-70bd325df8eb/005-website-categoryimages-micmini2-fa.webp",
        inStock: true,
        stockCount: 42,
        rating: 5.0,
        reviewCount: 45,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
      },

      // 3. Osmo 360 II
      {
        _id: "prod_osmo_360_ii",
        name: "Osmo 360 II",
        slug: "osmo-360-ii",
        sku: "DJI-O360-003",
        category: "Handheld Cameras & Gimbals",
        categorySlug: "handheld",
        subCategory: "Osmo Action",
        price: 749,
        originalPrice: 829,
        discountPercentage: 10,
        badge: "8K 360°",
        tagline: "Next Generation Video • Unreal 8K 360",
        description:
          "Capture immersive 8K 360-degree footage with dual 1/1.3-inch square sensors, optical flow stabilization, and AI auto-reframing for endless creative angles.",
        features: [
          "8K/30fps & 5.7K/60fps 360° Capture",
          "Dual 1/1.3-inch HDR Image Sensors",
          "RockSteady 3.0+ & HorizonSteady",
          "Invisible Selfie Stick Stitching Effect",
          "Waterproof to 10m Without Case",
        ],
        specs: {
          Resolution: "8K (7680×3840) @ 30fps",
          Aperture: "f/1.9",
          Battery: "2200 mAh (135 min runtime)",
          Waterproofing: "10m IP68",
        },
        images: [
          "https://www.d1store.com.au/cdn/shop/files/Osmo_360_II_Homw.jpg?v=1788477098&width=1920",
          "https://www.d1store.com.au/cdn/shop/files/cat-thumb-osmo36011-2026.webp?v=1788424158&width=960",
        ],
        mainImage: "https://cdn.d1store.app/shopify/product-page-editor/assets/efcccf55-eb18-4e42-93f6-77f0f561db64/cat-thumb-fis26-osmo360-01-v1.webp",
        inStock: true,
        stockCount: 18,
        rating: 4.8,
        reviewCount: 22,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: false,
      },

      // 4. DJI Neo 2
      {
        _id: "prod_dji_neo_2",
        name: "DJI Neo 2",
        slug: "dji-neo-2",
        sku: "DJI-NEO2-004",
        category: "DJI Drones",
        categorySlug: "dji-drones",
        subCategory: "Neo Series",
        price: 409,
        originalPrice: 459,
        discountPercentage: 11,
        badge: "POPULAR",
        tagline: "Ultra-Light Palm Takeoff Drone",
        description:
          "At just 135 grams, DJI Neo 2 takes off and lands directly on your palm with no remote controller required. Featuring AI Subject Tracking, 4K Ultra-Stabilized Video, and full propeller guards for effortless creator flights.",
        features: [
          "Palm Takeoff & Landing Without Controller",
          "AI Subject Tracking & QuickShots",
          "4K Ultra-HD Image Stabilization",
          "Full Propeller Guard Enclosure for Max Safety",
          "Ultra-Light 135g Takeoff Weight",
        ],
        specs: {
          Weight: "135 grams",
          FlightTime: "18 minutes",
          MaxRange: "7 km with O4 transmission",
          Resolution: "4K @ 30fps",
        },
        images: [
          "https://cdn.d1store.app/shopify/product-page-editor/assets/c8150de7-006f-4f9b-84a4-526f5b082b97/005-website-categoryimages-neo2-fa.webp",
          "https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-NEO2-D1DO-09_4f01eb0c-8c98-4400-9113-d354dc5c41b0.jpg?v=1784512786&width=800",
        ],
        mainImage: "https://cdn.d1store.app/shopify/product-page-editor/assets/c8150de7-006f-4f9b-84a4-526f5b082b97/005-website-categoryimages-neo2-fa.webp",
        inStock: true,
        stockCount: 35,
        rating: 4.8,
        reviewCount: 64,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
      },

      // 5. DJI Flip
      {
        _id: "prod_dji_flip",
        name: "DJI Flip",
        slug: "dji-flip",
        sku: "DJI-FLIP-005",
        category: "DJI Drones",
        categorySlug: "dji-drones",
        subCategory: "Mini Series",
        price: 449,
        originalPrice: 499,
        discountPercentage: 10,
        badge: "SALE",
        tagline: "Compact Aerobatic Camera Drone",
        description:
          "Push the boundaries of aerial fun with 360-degree flip tricks, automatic obstacle sensing, and a high-definition 4K gimbal camera.",
        features: [
          "One-Touch 360° Acrobatic Aerial Flips",
          "4K Crisp Video with 3-Axis Gimbal",
          "Tri-Directional Obstacle Sensing",
          "31-Minute Flight Time",
        ],
        specs: {
          Weight: "249 grams",
          FlightTime: "31 minutes",
          MaxSpeed: "16 m/s",
        },
        images: [
          "https://cdn.d1store.app/shopify/product-page-editor/assets/918411ff-37e5-478e-a24f-d561bb58d8bc/cat-thumb-flip-fis26-v2.jpg",
          "https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-FLIPDO-10.jpg?v=1788241292&width=800",
        ],
        mainImage: "https://cdn.d1store.app/shopify/product-page-editor/assets/918411ff-37e5-478e-a24f-d561bb58d8bc/cat-thumb-flip-fis26-v2.jpg",
        inStock: true,
        stockCount: 15,
        rating: 4.7,
        reviewCount: 19,
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
      },

      // 6. DJI Mini 5 Pro
      {
        _id: "prod_dji_mini_5_pro",
        name: "DJI Mini 5 Pro",
        slug: "dji-mini-5-pro",
        sku: "DJI-M5P-006",
        category: "DJI Drones",
        categorySlug: "dji-drones",
        subCategory: "Mini Series",
        price: 1009,
        originalPrice: 1199,
        discountPercentage: 16,
        badge: "UNDER 249G",
        tagline: "Flagship Mini Drone • True Vertical Shooting",
        description:
          "Sub-249g lightweight regulation-friendly drone featuring Omnidirectional Active Obstacle Sensing, 4K/60fps HDR True Vertical Shooting, and 34-minute standard flight endurance.",
        features: [
          "Under 249g Regulation-Friendly Body",
          "Omnidirectional Active Obstacle Avoidance",
          "True Vertical Shooting for TikTok & Reels",
          "4K/60fps HDR & 10-bit D-Log M",
          "Up to 20 km FHD Video Transmission with O4",
        ],
        specs: {
          Weight: "249 grams",
          Sensor: "1/1.3-inch CMOS Sensor (48 MP)",
          FlightTime: "34 minutes (optional 45 min plus)",
          Range: "20 km (FCC) / 10 km (CE)",
        },
        images: [
          "https://cdn.d1store.app/shopify/product-page-editor/assets/619a4dc0-0846-4e64-9dd8-f30feb3937c5/cat-thumb-fis26-mini5pro-01-v1.webp",
          "https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-MINI5PRO-FMCP-10.jpg?v=1785071277&width=800",
        ],
        mainImage: "https://cdn.d1store.app/shopify/product-page-editor/assets/619a4dc0-0846-4e64-9dd8-f30feb3937c5/cat-thumb-fis26-mini5pro-01-v1.webp",
        inStock: true,
        stockCount: 20,
        rating: 5.0,
        reviewCount: 94,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
      },

      // 7. DJI Air 3S
      {
        _id: "prod_dji_air_3s",
        name: "DJI Air 3S",
        slug: "dji-air-3s",
        sku: "DJIAIR3S",
        category: "DJI Drones",
        categorySlug: "dji-drones",
        subCategory: "Air Series",
        price: 1699,
        originalPrice: 1899,
        discountPercentage: 11,
        badge: "DUAL CAMERA",
        tagline: "Dual-Camera Flagship • Wide & 3x Medium Telephoto",
        description:
          "DJI Air 3S features a 1-inch CMOS primary camera and a 70mm medium telephoto camera, each with up to 14 stops of dynamic range. Equipped with Nightscape omnidirectional obstacle sensing with forward LiDAR, 45-minute flight time, and next-gen Smart RTH, Air 3S is built for cinematic aerial storytelling day and night.",
        features: [
          "1-inch CMOS Primary + 70mm Medium Telephoto Camera",
          "Nightscape Omnidirectional Obstacle Sensing with Forward LiDAR",
          "4K/60fps HDR Video & 10-bit D-Log M / HLG",
          "Up to 45 Minutes Max Flight Time",
          "Next-Gen Smart RTH Return-to-Home",
          "42GB Built-in Storage + Off-State QuickTransfer",
        ],
        specs: {
          Weight: "724 grams",
          PrimarySensor: "1-inch CMOS (50 MP)",
          TeleSensor: "1/1.3-inch CMOS (48 MP)",
          FlightTime: "45 minutes",
          Transmission: "DJI O4 (20 km)",
          InternalStorage: "42 GB",
        },
        mainImage: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09_d1f6a795-631f-43e3-a655-8d37b54f65ff.jpg?v=1783478497",
        images: [
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09_d1f6a795-631f-43e3-a655-8d37b54f65ff.jpg?v=1783478497",
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-06.jpg?v=1783468477",
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-07.jpg?v=1783468482",
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-04.jpg?v=1783475426",
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-05.jpg?v=1783476721",
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-06_47fa0442-79f8-44dc-9195-5c9779d26d94.jpg?v=1783476724",
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-11.jpg?v=1783476741",
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09.jpg?v=1783476734",
          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3SRC2C-09.jpg?v=1784512808",
        ],
        variants: [
          {
            id: "var_air3s_n3",
            variantId: "46634789896353",
            name: "DJI Air 3S (DJI RC-N3)",
            sku: "DJIAIR3S",
            price: 1699,
            originalPrice: 1899,
            badge: "Standard",
            image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09_d1f6a795-631f-43e3-a655-8d37b54f65ff.jpg?v=1783478497",
            inStock: true,
            stockCount: 15,
          },
          {
            id: "var_air3s_flymore_n3",
            variantId: "46634789929121",
            name: "DJI Air 3S Fly More Combo (DJI RC-N3)",
            sku: "DJIAIR3SC",
            price: 2129,
            originalPrice: 2299,
            badge: "Fly More",
            image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-06.jpg?v=1783468477",
            inStock: true,
            stockCount: 20,
          },
          {
            id: "var_air3s_flymore_rc2",
            variantId: "46634789961889",
            name: "DJI Air 3S Fly More Combo (DJI RC 2)",
            sku: "DJIAIR3SRC2C",
            price: 2429,
            originalPrice: 2599,
            badge: "Best Value",
            image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3SRC2C-09.jpg?v=1784512808",
            inStock: true,
            stockCount: 18,
          },
        ],
        inTheBoxVariants: {
          standard: [
            {
              title: "DJI Air 3S Aircraft",
              qty: 1,
              image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09_d1f6a795-631f-43e3-a655-8d37b54f65ff.jpg?v=1783478497",
            },
            {
              title: "DJI RC-N3 Remote Controller",
              qty: 1,
              image: "https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-D1L-LHB-01.jpg?v=1781493013",
            },
            {
              title: "Intelligent Flight Battery",
              qty: 1,
              image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-05.jpg?v=1783476721",
            },
            {
              title: "Spare Propellers (Pair)",
              qty: 3,
              image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-06.jpg?v=1783468477",
            },
            {
              title: "Gimbal Protector",
              qty: 1,
              image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09.jpg?v=1783476734",
            },
            {
              title: "Type-C to Type-C PD Cable",
              qty: 1,
              image: "https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-D1L-USBC-100W-01.jpg?v=1784511536",
            },
          ],
          "fly-more-rc-n3": [
            {
              title: "DJI Air 3S Aircraft",
              qty: 1,
              image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09_d1f6a795-631f-43e3-a655-8d37b54f65ff.jpg?v=1783478497",
            },
            {
              title: "DJI RC-N3 Remote Controller",
              qty: 1,
              image: "https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-D1L-LHB-01.jpg?v=1781493013",
            },
            {
              title: "Intelligent Flight Battery",
              qty: 3,
              image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-05.jpg?v=1783476721",
            },
            {
              title: "Battery Charging Hub",
              qty: 1,
              image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-06.jpg?v=1783468477",
            },
            {
              title: "ND Filter Set (ND8/32/128)",
              qty: 1,
              image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-07.jpg?v=1783468482",
            },
            {
              title: "DJI Shoulder Bag",
              qty: 1,
              image: "https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-D1L-OP3-CC-01.jpg?v=1784511560",
            },
            {
              title: "Spare Propellers (Pair)",
              qty: 6,
              image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-06.jpg?v=1783468477",
            },
            {
              title: "Gimbal Protector",
              qty: 1,
              image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09.jpg?v=1783476734",
            },
          ],
          "fly-more-rc-2": [
            {
              title: "DJI Air 3S Aircraft",
              qty: 1,
              image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09_d1f6a795-631f-43e3-a655-8d37b54f65ff.jpg?v=1783478497",
            },
            {
              title: "DJI RC 2 Remote Controller (Built-in Screen)",
              qty: 1,
              image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3SRC2C-09.jpg?v=1784512808",
            },
            {
              title: "Intelligent Flight Battery",
              qty: 3,
              image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-05.jpg?v=1783476721",
            },
            {
              title: "Battery Charging Hub",
              qty: 1,
              image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-06.jpg?v=1783468477",
            },
            {
              title: "ND Filter Set (ND8/32/128)",
              qty: 1,
              image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-07.jpg?v=1783468482",
            },
            {
              title: "DJI Shoulder Bag",
              qty: 1,
              image: "https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-D1L-OP3-CC-01.jpg?v=1784511560",
            },
            {
              title: "Spare Propellers (Pair)",
              qty: 6,
              image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-06.jpg?v=1783468477",
            },
            {
              title: "Gimbal Protector",
              qty: 1,
              image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09.jpg?v=1783476734",
            },
          ],
        },
        overviewBanner: {
          badge: "DUAL-CAMERA TRAVEL DRONE",
          title: "Chase the Scene.",
          description:
            "Dual-primary cameras, nightscape omnidirectional sensing with forward LiDAR, and 45-minute flight time give aerial creators the power to capture breathtaking landscapes and cities day and night.",
          bgImage: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-04.jpg?v=1783475426",
          videoUrl: "https://www.youtube.com/watch?v=kYJvM9d150c",
          stats: [
            { label: "Primary Camera", value: "1-Inch CMOS (50MP)" },
            { label: "Telephoto Camera", value: "70mm (48MP)" },
            { label: "Flight Time", value: "45 Minutes" },
            { label: "Night Sensing", value: "LiDAR Omnidirectional" },
            { label: "Internal Storage", value: "42 GB Built-in" },
          ],
        },
        featureCards: [
          {
            title: "1-Inch CMOS Dual-Camera",
            tag: "Imaging Master",
            description:
              "Large 1-inch primary camera paired with a 70mm telephoto lens delivers cinematic depth of field and up to 14 stops of dynamic range.",
            image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09.jpg?v=1783476734",
          },
          {
            title: "Nightscape Sensing with LiDAR",
            tag: "Night Flight Safety",
            description:
              "Pioneering forward-facing LiDAR sensor and vision sensors detect low-light obstacles and skyscrapers effortlessly.",
            image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-05.jpg?v=1783476721",
          },
          {
            title: "Next-Gen Smart RTH",
            tag: "Advanced Navigation",
            description:
              "Returns safely to home even without GPS satellite reception by mapping night-time environment in real time.",
            image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-11.jpg?v=1783476741",
          },
        ],
        rawSpecs: [
          { group: "Aircraft", label: "Takeoff Weight", value: "724 g" },
          { group: "Aircraft", label: "Dimensions (Folded)", value: "214.19 × 100.63 × 89.17 mm" },
          { group: "Aircraft", label: "Dimensions (Unfolded)", value: "266.11 × 325.47 × 106.00 mm" },
          { group: "Aircraft", label: "Max Flight Time", value: "45 minutes" },
          { group: "Aircraft", label: "Max Wind Speed Resistance", value: "12 m/s" },
          { group: "Aircraft", label: "Internal Storage", value: "42 GB Built-in" },
          { group: "Camera", label: "Wide-Angle Sensor", value: "1-inch CMOS, Effective Pixels: 50 MP (24mm equiv, f/1.8)" },
          { group: "Camera", label: "Medium Telephoto Sensor", value: "1/1.3-inch CMOS, Effective Pixels: 48 MP (70mm equiv, f/2.8)" },
          { group: "Camera", label: "Max Video Resolution", value: "4K (3840×2160) @ 60fps HDR, 4K/120fps Slow-mo" },
          { group: "Camera", label: "Color Profiles", value: "10-bit D-Log M, 10-bit HLG, 8-bit Normal" },
          { group: "Sensing", label: "Sensing Type", value: "Omnidirectional Vision System + Forward LiDAR" },
          { group: "Transmission", label: "Video Transmission System", value: "DJI O4 (OcuSync 4)" },
          { group: "Transmission", label: "Max Transmission Range", value: "20 km (FCC), 10 km (CE/SRRC/MIC)" },
          { group: "Battery", label: "Capacity", value: "4276 mAh" },
          { group: "Battery", label: "Battery Type", value: "Li-ion 4S" },
        ],
        faqs: [
          {
            group: "General",
            category: "General",
            question: "What are the major upgrades of DJI Air 3S compared to DJI Air 3?",
            answer:
              "DJI Air 3S features an upgraded 1-inch CMOS primary camera (vs 1/1.3-inch on Air 3), forward-facing LiDAR for nighttime omnidirectional obstacle sensing, next-generation Smart RTH that functions in low light without satellite signals, and 42GB of built-in storage with Off-State QuickTransfer.",
          },
          {
            group: "Camera",
            category: "Camera",
            question: "Does DJI Air 3S support vertical shooting and panorama modes?",
            answer:
              "Yes! DJI Air 3S supports 2.7K Vertical Shooting across both cameras, plus a brand new Free Panorama feature that lets you customize the shooting range and stitch expansive panoramas with either camera lens.",
          },
          {
            group: "Accessories",
            category: "Accessories",
            question: "Which remote controllers are compatible with DJI Air 3S?",
            answer:
              "DJI Air 3S is fully compatible with DJI RC-N3, DJI RC 2 (with built-in 5.5-inch 1080p 700-nit screen), and DJI RC-N2 remote controllers.",
          },
          {
            group: "Warranty & Support",
            category: "Warranty & Support",
            question: "Does my DJI Air 3S come with official Australian warranty from D1 Store?",
            answer:
              "Yes. All DJI products sold by D1 Store are 100% genuine Australian stock and include the full 2-Year Official Australian Manufacturer Warranty and local Australian DJI-certified repair service.",
          },
        ],
        inStock: true,
        stockCount: 24,
        rating: 4.9,
        reviewCount: 51,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
      },

      // 8. DJI Mavic 4 Pro (Professional Drone section)
      {
        _id: "prod_dji_mavic_4_pro",
        name: "DJI Mavic 4 Pro",
        slug: "dji-mavic-4-pro",
        sku: "DJI-M4P-008",
        category: "Professional Drones",
        categorySlug: "professional-drones",
        subCategory: "Mavic Series",
        price: 3299,
        originalPrice: 3699,
        discountPercentage: 11,
        badge: "TRIPLE-LENS",
        tagline: "Triple-Lens Flagship • Spin Your World",
        description:
          "The crowning jewel of aerial imaging. Features Hasselblad 4/3 CMOS camera, dual telephoto cameras (70mm & 166mm), 5.1K Apple ProRes video encoding, and 46-minute flight endurance.",
        features: [
          "Hasselblad 4/3 CMOS Main Camera + Dual Telephoto Lenses",
          "Apple ProRes 422 HQ Recording Across All 3 Cameras",
          "Omnidirectional APAS 5.0 Obstacle Avoidance",
          "15 km O3+ Transmission with High-Gain Antennas",
          "Cruise Control & Waypoint Flight 3.0",
        ],
        specs: {
          MainSensor: "4/3 CMOS Hasselblad (20 MP)",
          VideoResolution: "5.1K @ 50fps, 4K @ 120fps",
          FlightTime: "46 minutes",
          Weight: "958 grams",
          InternalStorage: "1TB SSD (Cine Version)",
        },
        images: [
          "https://cdn.d1store.app/shopify/product-page-editor/assets/941ba0da-246e-440e-b7d5-d0693510e1ea/003-launch-mavic4pro-webbanner-desktop-2560x700px-nov25-fa.jpg",
          "https://www.d1store.com.au/cdn/shop/files/Mavic_3_Pro_Fly_More_Combo_DJI_RC_Product_KV.jpg?v=1784606112&width=800",
        ],
        mainImage: "https://cdn.d1store.app/shopify/product-page-editor/assets/2d431330-99da-464d-9f0a-1815ed9aa61e/005-website-categoryimages-mavic4p-fa.webp",
        inStock: true,
        stockCount: 8,
        rating: 5.0,
        reviewCount: 31,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        isProfessional: true,
      },

      // 9. DJI Inspire 3 (Professional Drone section)
      {
        _id: "prod_dji_inspire_3",
        name: "DJI Inspire 3",
        slug: "dji-inspire-3",
        sku: "DJI-INS3-009",
        category: "Professional Drones",
        categorySlug: "professional-drones",
        subCategory: "Inspire Series",
        price: 17499,
        originalPrice: 17999,
        discountPercentage: 3,
        badge: "CINEMA 8K",
        tagline: "Master the Unseen • Full-Frame 8K Cinema Drone",
        description:
          "Cinema-grade aerial powerhouse with full-frame Zenmuse X9-8K Air gimbal camera, dual native ISO, 8K/75fps Apple ProRes RAW and CinemaDNG, and RTK centimeter-level waypoint repeatability.",
        features: [
          "Full-Frame 8K/75fps ProRes RAW & 8K/25fps CinemaDNG",
          "Centimeter-Level RTK Positioning & Waypoint Pro",
          "161° Ultra-Wide Night-Vision FPV Camera",
          "Dual-Control Configuration for Pilot & Gimbal Operator",
          "Repeatable Route Tracking for Hollywood Productions",
        ],
        specs: {
          Camera: "Zenmuse X9-8K Air Gimbal Camera",
          MaxSpeed: "94 km/h",
          FlightTime: "28 minutes",
          Transmission: "O3 Pro Dual Control (15 km)",
          Weight: "3995 grams",
        },
        images: [
          "https://www.d1store.com.au/cdn/shop/files/inspire-3-d1-08.jpg?v=1784512918&width=800",
        ],
        mainImage: "https://cdn.d1store.app/shopify/product-page-editor/assets/27f4ae33-7883-41fa-84d1-e50c47aae9dd/005-website-categoryimages-inspire3-fa.webp",
        inStock: true,
        stockCount: 3,
        rating: 5.0,
        reviewCount: 9,
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: false,
        isProfessional: true,
      },

      // 10. DJI Matrice 350 RTK (Enterprise & Agriculture section)
      {
        _id: "prod_dji_m350_rtk",
        name: "DJI Matrice 350 RTK",
        slug: "dji-matrice-350-rtk",
        sku: "DJI-M350-010",
        category: "Enterprise & Agriculture",
        categorySlug: "enterprise-agriculture",
        subCategory: "Matrice Series",
        price: 14299,
        originalPrice: 15499,
        discountPercentage: 8,
        badge: "ENTERPRISE",
        tagline: "Rugged Commercial Drone Platform • IP55 Ingress Protection",
        description:
          "Built for industrial inspections, search and rescue, public safety, and infrastructure mapping. Supports multi-payload configurations up to 2.7 kg with 55 minutes of flight endurance.",
        features: [
          "IP55 Rating for Harsh All-Weather Operation",
          "55-Minute Max Flight Time with TB65 Batteries",
          "2.7 kg Max Multi-Payload Capacity (Zenmuse H20N, P1, L2)",
          "Six-Directional Sensing & Night-Vision FPV Camera",
          "O3 Enterprise 20 km Triple-Channel Video Link",
        ],
        specs: {
          MaxPayload: "2.7 kg",
          FlightTime: "55 minutes",
          IngressProtection: "IP55",
          WindResistance: "12 m/s",
        },
        images: [
          "https://www.d1store.com.au/cdn/shop/files/M350RTK-DO-08_c4b4a162-8173-455b-bf99-2a9f4588be57.jpg?v=1784512965&width=800",
        ],
        mainImage: "https://www.d1store.com.au/cdn/shop/files/PRODUCT-THUMB-MATRICE4E-03.jpg?v=1783989705&width=800",
        inStock: true,
        stockCount: 5,
        rating: 5.0,
        reviewCount: 14,
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        isEnterprise: true,
      },

      // 11. DJI Agras T50 (Enterprise & Agriculture section)
      {
        _id: "prod_dji_agras_t50",
        name: "DJI Agras T50",
        slug: "dji-agras-t50",
        sku: "DJI-AGT50-011",
        category: "Enterprise & Agriculture",
        categorySlug: "enterprise-agriculture",
        subCategory: "Agras Agriculture",
        price: 26999,
        originalPrice: 28499,
        discountPercentage: 5,
        badge: "AGRICULTURE",
        tagline: "Heavy-Duty Agricultural Drone • 40 kg Spray / 50 kg Spread",
        description:
          "Empower precision farming with a coaxial twin-rotor design delivering 40 kg spraying or 50 kg spreading capacity, dual atomizing centrifugal nozzles, and active phased-array radar.",
        features: [
          "40 kg (50L) Liquid Spraying Payload Capacity",
          "50 kg (75L) Granular Spreading Payload Capacity",
          "Dual Atomizing Centrifugal Sprayers with 16 L/min Flow",
          "Front and Rear Active Phased Array Radars",
          "High-Definition FPV Gimbal for Real-Time Field Surveying",
        ],
        specs: {
          SprayingCapacity: "40 kg (50 Liters)",
          SpreadingCapacity: "50 kg (75 Liters)",
          Radar: "Active Phased Array + Binocular Vision",
          MaxOperatingEfficiency: "21 hectares/hour",
        },
        images: [
          "https://www.d1store.com.au/cdn/shop/files/agras-t50-d1-08.jpg?v=1784513021&width=800",
        ],
        mainImage: "https://cdn.d1store.app/shopify/product-page-editor/assets/6d9bb970-4fc2-4399-a9cc-0705b9325d38/005-website-categoryimages-batch2-agrast70p-fa.jpg",
        inStock: true,
        stockCount: 4,
        rating: 4.9,
        reviewCount: 8,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: false,
        isEnterprise: true,
      },

      // 12. DJI Mavic 3 Enterprise Thermal (Enterprise & Agriculture section)
      {
        _id: "prod_dji_m3t",
        name: "DJI Mavic 3 Thermal (M3T)",
        slug: "dji-mavic-3-thermal",
        sku: "DJI-M3T-012",
        category: "Enterprise & Agriculture",
        categorySlug: "enterprise-agriculture",
        subCategory: "Mavic 3 Enterprise",
        price: 7899,
        originalPrice: 8499,
        discountPercentage: 7,
        badge: "THERMAL",
        tagline: "Compact Commercial Drone with 640×512 Thermal Camera",
        description:
          "Pocket-sized commercial drone equipped with high-resolution 640×512 thermal sensor, 56× hybrid zoom visual camera, and RTK module support for firefighting and nighttime inspections.",
        features: [
          "640×512 Radiometric Thermal Sensor @ 30 Hz",
          "56× Hybrid Zoom Visual Camera",
          "Centimeter-Level RTK Positioning Option",
          "45-Minute Long Inspection Flights",
          "Loudspeaker & Searchlight Accessory Compatibility",
        ],
        specs: {
          ThermalResolution: "640×512 pixels",
          ThermalFocalLength: "40mm equivalent",
          VisualSensor: "1/2-inch CMOS (48 MP)",
          FlightTime: "45 minutes",
        },
        images: [
          "https://www.d1store.com.au/cdn/shop/files/m3t-thermal-d1-08.jpg?v=1784513000&width=800",
        ],
        mainImage: "https://www.d1store.com.au/cdn/shop/files/m3t-thermal-d1-08.jpg?v=1784513000&width=800",
        inStock: true,
        stockCount: 9,
        rating: 4.9,
        reviewCount: 27,
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        isEnterprise: true,
      },

      // 13. Hasselblad X2D 100C
      {
        _id: "prod_hasselblad_x2d",
        name: "Hasselblad X2D 100C",
        slug: "hasselblad-x2d-100c",
        sku: "HB-X2D-013",
        category: "Hasselblad Cameras",
        categorySlug: "hasselblad",
        subCategory: "Medium Format Cameras",
        price: 12999,
        originalPrice: 13999,
        discountPercentage: 7,
        badge: "100 MP",
        tagline: "100MP Medium Format Mirrorless Camera",
        description:
          "Uncompromising medium format photographic perfection with 100MP BSI CMOS sensor, Hasselblad Natural Colour Solution (HNCS), 5-axis 7-stop in-body stabilization, and built-in 1TB NVMe SSD.",
        features: [
          "100MP Medium Format BSI CMOS Sensor",
          "15-Stop Dynamic Range & 16-Bit Color Depth",
          "5-Axis 7-Stop In-Body Image Stabilization (IBIS)",
          "Phase Detection Autofocus with 294 Zones",
          "Built-in High-Speed 1TB SSD Storage",
        ],
        specs: {
          SensorSize: "43.8 × 32.9 mm (Medium Format)",
          Resolution: "11656 × 8742 (100 MP)",
          InternalMemory: "1TB SSD",
          Weight: "895 grams with battery",
        },
        images: [
          "https://www.d1store.com.au/cdn/shop/files/x2d-ii-100c-d1-08.jpg?v=1784513076&width=800",
        ],
        mainImage: "https://cdn.d1store.app/shopify/product-page-editor/assets/7e2a0013-bac8-48f4-a377-c2e5d562ec76/005-website-categoryimages-hb-x2dii100c-fa.webp",
        inStock: true,
        stockCount: 4,
        rating: 5.0,
        reviewCount: 16,
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
      },

      // 14. Osmo Action 6
      {
        _id: "prod_osmo_action_6",
        name: "Osmo Action 6",
        slug: "osmo-action-6",
        sku: "DJI-OA6-014",
        category: "Handheld Cameras & Gimbals",
        categorySlug: "handheld",
        subCategory: "Osmo Action",
        price: 599,
        originalPrice: 659,
        discountPercentage: 9,
        badge: "WATERPROOF 20M",
        tagline: "Flagship Action Camera • Jump into Action",
        description:
          "Next-gen square-sensor action camera engineered for extreme adventures. Waterproof to 20 meters without housing, dual bright touchscreens, and 4-hour freezing-temperature battery life.",
        features: [
          "Next-Gen 1/1.1-inch Low-Light Sensor",
          "4K/120fps Extreme Action Video",
          "360° HorizonSteady Electronic Stabilization",
          "Bare-Metal 20m Waterproofing",
          "Quick-Release Magnetic Mounting",
        ],
        specs: {
          Waterproof: "20m without case",
          Screens: "Dual OLED Touchscreens",
          Battery: "1950 mAh (up to 240 mins)",
        },
        images: [
          "https://cdn.d1store.app/shopify/product-page-editor/assets/69eb3c1a-2831-4fa3-b1d5-2e6f43e5e408/003-launch-osmoaction6-webbanner-desktop-2560x700px-jan26-fa.jpg",
        ],
        mainImage: "https://cdn.d1store.app/shopify/product-page-editor/assets/ae4e2e01-568d-4fa0-9450-eef56b6293ce/005-website-categoryimages-osmoaction6-fa.webp",
        inStock: true,
        stockCount: 30,
        rating: 4.8,
        reviewCount: 41,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: false,
      },

      // 15. DJI ROMO P2
      {
        _id: "prod_dji_romo_p2",
        name: "DJI ROMO P2",
        slug: "dji-romo-p2-water-tank-version",
        sku: "DJI-ROMO-015",
        category: "Handheld Cameras & Gimbals",
        categorySlug: "handheld",
        subCategory: "Intelligent Robotics",
        price: 1299,
        originalPrice: 1799,
        discountPercentage: 28,
        badge: "EARLY BIRD",
        tagline: "Intelligent Robot Vacuum with Auto Water Tank",
        description:
          "Next-gen smart robotic floor cleaner featuring DJI drone-derived dual LiDAR 3D navigation, 8000Pa cyclone suction, high-pressure auto-mop washing, and self-emptying dock.",
        features: [
          "Drone-Heritage Dual LiDAR 3D Mapping & Obstacle Avoidance",
          "8,000 Pa Cyclone Powerful Suction",
          "Self-Cleaning & Auto-Refilling Heated Base Station",
          "Precision Edge-to-Edge Cleaning Rollers",
        ],
        specs: {
          SuctionPower: "8000 Pa",
          Navigation: "Dual Solid-State LiDAR + AI Camera",
          DustbinCapacity: "3.5L Self-Emptying Bag",
        },
        images: [
          "https://www.d1store.com.au/cdn/shop/files/Romo_P2_Home.webp?v=1788477314&width=1920",
        ],
        mainImage: "https://www.d1store.com.au/cdn/shop/files/Romo_P2_Home.webp?v=1788477314&width=1920",
        inStock: true,
        stockCount: 12,
        rating: 4.9,
        reviewCount: 15,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: false,
      },
    ];

    const initialHomepageSections: IHomepageSection[] = [
      {
        _id: "sec_new_arrivals",
        sectionKey: "new_arrivals",
        title: "New Arrivals",
        subtitle: "The very latest releases and cutting-edge innovations from DJI",
        productIds: [
          "prod_osmo_pocket_4p",
          "prod_dji_mic_mini_2s",
          "prod_osmo_360_ii",
          "prod_dji_mini_5_pro",
          "prod_dji_neo_2",
          "prod_osmo_action_6",
          "prod_dji_romo_p2",
        ],
        isEnabled: true,
        order: 1,
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "sec_dji_drones",
        sectionKey: "dji_drones",
        title: "DJI Drones",
        subtitle: "Consumer & camera drones engineered for creators of every skill level",
        productIds: [
          "prod_dji_neo_2",
          "prod_dji_flip",
          "prod_dji_mini_5_pro",
          "prod_dji_air_3s",
          "prod_dji_mavic_4_pro",
        ],
        isEnabled: true,
        order: 2,
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "sec_pro_drones",
        sectionKey: "pro_drones",
        title: "Professional Drones",
        subtitle: "Cinema-grade flagships and triple-camera setups for commercial filmmakers",
        productIds: [
          "prod_dji_mavic_4_pro",
          "prod_dji_inspire_3",
          "prod_dji_air_3s",
          "prod_hasselblad_x2d",
        ],
        isEnabled: true,
        order: 3,
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "sec_enterprise_agriculture",
        sectionKey: "enterprise_agriculture",
        title: "Enterprise & Agriculture",
        subtitle: "Industrial surveying, thermal inspection, and heavy-duty aerial spraying",
        productIds: [
          "prod_dji_m350_rtk",
          "prod_dji_agras_t50",
          "prod_dji_m3t",
        ],
        isEnabled: true,
        order: 4,
        updatedAt: new Date().toISOString(),
      },
    ];

    // Seed dummy initial order for demonstration
    const initialOrders: IOrder[] = [
      {
        _id: "ord_sample_10024",
        orderNumber: "D1-10024",
        customer: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "+61 412 345 678",
          address: "124 George Street",
          apartment: "Suite 4B",
          city: "Sydney",
          state: "NSW",
          postcode: "2000",
          country: "Australia",
        },
        items: [
          {
            productId: "prod_osmo_pocket_4p",
            name: "Osmo Pocket 4P",
            slug: "osmo-pocket-4p",
            image: "https://www.d1store.com.au/cdn/shop/files/Osmo_Pocket_4P_Product_KV.jpg?v=1784606000&width=1920",
            price: 899,
            quantity: 1,
            total: 899,
          },
          {
            productId: "prod_dji_mic_mini_2s",
            name: "DJI Mic Mini 2S",
            slug: "dji-mic-mini-2s",
            image: "https://cdn.d1store.app/shopify/product-page-editor/assets/1ffb3967-df39-4404-b903-88ee1b753cb7/003-launch-micmini2s-webbanner-desktop-2560x700px-jan26-fa.jpg",
            price: 249,
            quantity: 1,
            total: 249,
          },
        ],
        subtotal: 1148,
        shippingFee: 0,
        shippingMethod: "Express Courier Delivery (Free for orders over $99)",
        tax: 114.8,
        total: 1148,
        status: "Processing",
        paymentMethod: "Credit Card (Visa)",
        paymentStatus: "Paid",
        notes: "Please leave at reception if not home.",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    this.state = {
      products: initialProducts,
      categories: initialCategories,
      orders: initialOrders,
      homepageSections: initialHomepageSections,
    };

    this.save();
    console.log("[DbStore] Database seeded successfully with authentic D1 Store catalog!");
  }
}
