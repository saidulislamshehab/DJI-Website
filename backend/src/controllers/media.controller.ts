import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { CategoryService } from "../services/category.service";
import { ProductService } from "../services/product.service";
import { ApiResponse } from "../utils/apiResponse";

export interface IMediaAsset {
  id: string;
  url: string;
  title: string;
  category: string;
  type: "Category Cover" | "Subcategory" | "Product Image" | "Hero Banner" | "Brand Logo" | "Video" | "Graphic";
  source: string;
  format?: string;
}

export interface ISiteLink {
  id: string;
  title: string;
  url: string;
  type: "Collection" | "Product" | "Storefront" | "Policy" | "Support" | "Admin";
  category?: string;
  description?: string;
  external?: boolean;
}

export class MediaController {
  // Legacy /api/media (returns hero videos)
  static async getHeroVideos(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await mongoose.connection.db?.collection("media").find().toArray();
      ApiResponse.success(res, list || [], "Media assets retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // GET /api/media/all or /api/site-links
  static async getAllSiteAssets(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [categories, productsData, videosList] = await Promise.all([
        CategoryService.getAllCategories(),
        ProductService.getAllProducts({ limit: 200 }),
        mongoose.connection.db?.collection("media").find().toArray().catch(() => []),
      ]);

      const mediaItems: IMediaAsset[] = [];
      const seenMediaUrls = new Set<string>();

      const addMedia = (
        url: string | undefined,
        title: string,
        category: string,
        type: IMediaAsset["type"],
        source: string
      ) => {
        if (!url || !url.trim() || seenMediaUrls.has(url)) return;
        seenMediaUrls.add(url);
        const format = url.split("?")[0].split(".").pop()?.toLowerCase() || "img";
        mediaItems.push({
          id: `media-${mediaItems.length + 1}`,
          url,
          title,
          category,
          type,
          source,
          format,
        });
      };

      // 1. Official Core Brand & Public Assets
      addMedia("/dji-d1-logo.png", "DJI D1 Store Official Brand Logo", "Brand Assets", "Brand Logo", "Header & Footer Branding");
      addMedia("/hero-banner.jpg", "Homepage Hero Main Banner", "Store Banners", "Hero Banner", "Homepage Hero Slideshow");
      addMedia("/images/bento/bento-expert.png", "D1 Expert Advice & Setup", "Bento Graphics", "Graphic", "Homepage Trust Bento");
      addMedia("/images/bento/bento-pricematch.png", "Price Match Guarantee Badge", "Bento Graphics", "Graphic", "Homepage Trust Bento");
      addMedia("/images/bento/bento-refresh.png", "DJI Care Refresh Protection", "Bento Graphics", "Graphic", "Homepage Trust Bento");
      addMedia("/images/bento/bento-returns.png", "Hassle-Free 14-Day Returns", "Bento Graphics", "Graphic", "Homepage Trust Bento");
      addMedia("/images/bento/bento-shipping.png", "Free Express Delivery Nationwide", "Bento Graphics", "Graphic", "Homepage Trust Bento");
      addMedia("/images/bento/bento-stores.png", "Official Retail Store Locations", "Bento Graphics", "Graphic", "Homepage Trust Bento");
      addMedia("/images/collections/just-landed.png", "Just Landed New Releases", "Collections", "Category Cover", "Homepage Collections Grid");
      addMedia("/images/collections/mic-mini-2.png", "DJI Mic Mini 2 Audio", "Collections", "Category Cover", "Homepage Collections Grid");
      addMedia("/images/collections/osmo-pocket-4.png", "Osmo Pocket 4 Series", "Collections", "Category Cover", "Homepage Collections Grid");
      addMedia("/images/collections/osmo-360-ii.webp", "Osmo 360 II Action Camera", "Collections", "Category Cover", "Homepage Collections Grid");

      // 2. Categories & Subcategories
      categories.forEach((cat) => {
        if (cat.image) {
          addMedia(cat.image, `${cat.name} Main Cover`, cat.name, "Category Cover", `Category: ${cat.name}`);
        }
        cat.subCategories?.forEach((sub) => {
          if (typeof sub !== "string" && sub?.thumbnail) {
            addMedia(sub.thumbnail, sub.name, cat.name, "Subcategory", `Subcategory under ${cat.name}`);
          }
        });
      });

      // 3. Products
      productsData.products.forEach((prod) => {
        const prodName = prod.name || (prod as any).title || "Product";
        const catName = prod.category || prod.categorySlug || "Products";
        const mainImg = prod.mainImage || (prod as any).thumbnail;
        if (mainImg) {
          addMedia(mainImg, prodName, catName, "Product Image", "Catalog Thumbnail");
        }
        prod.images?.forEach((img, idx) => {
          addMedia(img, `${prodName} (Photo ${idx + 1})`, catName, "Product Image", "Product Gallery");
        });
      });

      // 4. Hero Videos
      (videosList || []).forEach((vid: any) => {
        if (vid.url) {
          addMedia(vid.url, vid.title || "Hero Video", "Videos", "Video", vid.product || "Homepage Video");
        }
      });

      // 5. Aggregate All Website Links
      const siteLinks: ISiteLink[] = [
        // Storefront Core Pages
        { id: "link-home", title: "Store Homepage", url: "/", type: "Storefront", category: "Core Navigation", description: "Main landing page with hero banners, collections, and featured releases." },
        { id: "link-collections-all", title: "All Collections Catalog", url: "/collections", type: "Collection", category: "Storefront", description: "Complete directory of product collections." },
        { id: "link-products-all", title: "Products Directory", url: "/products", type: "Product", category: "Storefront", description: "Searchable catalog of all DJI consumer, enterprise, and camera gear." },
        { id: "link-cart", title: "Shopping Cart", url: "/cart", type: "Storefront", category: "Commerce", description: "Active customer basket with checkout takeoff bar." },
        { id: "link-checkout", title: "Checkout Flow", url: "/checkout", type: "Storefront", category: "Commerce", description: "Secure checkout and payment processing." },
        { id: "link-account", title: "Customer Account Dashboard", url: "/account", type: "Storefront", category: "Customer", description: "Order tracking, address book, and security settings." },
        { id: "link-login", title: "Authentication Portal", url: "/login", type: "Storefront", category: "Customer", description: "Email verification sign-in and account registration." },
        { id: "link-search", title: "Storefront Search", url: "/search", type: "Storefront", category: "Navigation", description: "Search products, collections, and accessories." },
        { id: "link-blog", title: "Articles & News", url: "/blogs/news", type: "Storefront", category: "Content", description: "DJI product announcements, guides, and news." },

        // Policies
        { id: "link-privacy", title: "Privacy Policy", url: "/policies/privacy-policy", type: "Policy", category: "Legal", description: "Customer data protection and privacy notice." },
        { id: "link-terms", title: "Terms of Service", url: "/policies/terms-of-service", type: "Policy", category: "Legal", description: "Terms and conditions of website use and purchase." },
        { id: "link-refund", title: "Refund & Warranty Policy", url: "/policies/refund-policy", type: "Policy", category: "Legal", description: "14-day returns policy and warranty guidelines." },
        { id: "link-shipping", title: "Shipping Information", url: "/policies/shipping-policy", type: "Policy", category: "Legal", description: "Express delivery options, couriers, and dispatch times." },

        // Support
        { id: "link-contact", title: "Contact Us & Support", url: "/pages/contact-us", type: "Support", category: "Support", description: "Direct support contact, phone lines, and email." },
        { id: "link-stores", title: "Retail Stores & Showrooms", url: "/pages/stores", type: "Support", category: "Support", description: "Physical store locator across Australia." },
        { id: "link-repairs", title: "Authorised Service & Repairs", url: "/pages/repairs", type: "Support", category: "Support", description: "Repair request, assessment, and genuine DJI parts." },
        { id: "link-refresh", title: "DJI Care Refresh", url: "/pages/dji-care-refresh", type: "Support", category: "Support", description: "Comprehensive accidental damage protection." },

        // Admin Routes
        { id: "link-admin-dash", title: "Admin Dashboard", url: "/admin", type: "Admin", category: "Management", description: "Store metrics, recent orders, and administrative overview." },
        { id: "link-admin-products", title: "Admin Products Catalog", url: "/admin/products", type: "Admin", category: "Management", description: "Manage product catalog, pricing, inventory, and specs." },
        { id: "link-admin-categories", title: "Admin Categories", url: "/admin/categories", type: "Admin", category: "Management", description: "Manage categories, taxonomy, and cover images." },
        { id: "link-admin-orders", title: "Admin Customer Orders", url: "/admin/orders", type: "Admin", category: "Management", description: "Fulfill orders, track shipping, and manage statuses." },
        { id: "link-admin-sections", title: "Admin Homepage Sections", url: "/admin/homepage-sections", type: "Admin", category: "Management", description: "Configure storefront product sections and display order." },
        { id: "link-admin-users", title: "Admin Users & Roles", url: "/admin/users", type: "Admin", category: "Management", description: "Manage customer and staff administrative permissions." },
        { id: "link-admin-links", title: "Admin Site Links & Media", url: "/admin/links", type: "Admin", category: "Management", description: "Full directory of all website links and media assets." },
      ];

      // Add Collection Links from Categories
      categories.forEach((cat) => {
        siteLinks.push({
          id: `link-cat-${cat.slug}`,
          title: `${cat.name} Collection`,
          url: `/collections/${cat.slug}`,
          type: "Collection",
          category: "Main Categories",
          description: cat.description || `Browse all ${cat.name} products`,
        });

        cat.subCategories?.forEach((sub) => {
          if (typeof sub !== "string" && sub.slug) {
            siteLinks.push({
              id: `link-sub-${sub.slug}`,
              title: `${sub.name}`,
              url: sub.url || `/collections/${sub.slug}`,
              type: "Collection",
              category: `${cat.name} Subcategories`,
              description: `Collection for ${sub.name}`,
            });
          }
        });
      });

      // Add Product Links
      productsData.products.forEach((prod) => {
        if (prod.slug) {
          const prodTitle = prod.name || (prod as any).title || "Product";
          siteLinks.push({
            id: `link-prod-${prod.slug}`,
            title: prodTitle,
            url: `/products/${prod.slug}`,
            type: "Product",
            category: prod.category || "Products",
            description: `Product page for ${prodTitle}`,
          });
        }
      });

      // Deduplicate links by url
      const uniqueLinks: ISiteLink[] = [];
      const seenUrls = new Set<string>();
      siteLinks.forEach((link) => {
        if (!seenUrls.has(link.url)) {
          seenUrls.add(link.url);
          uniqueLinks.push(link);
        }
      });

      ApiResponse.success(
        res,
        {
          media: mediaItems,
          links: uniqueLinks,
          stats: {
            totalMedia: mediaItems.length,
            totalLinks: uniqueLinks.length,
            categoryImages: mediaItems.filter((m) => m.type === "Category Cover" || m.type === "Subcategory").length,
            productImages: mediaItems.filter((m) => m.type === "Product Image").length,
            collections: uniqueLinks.filter((l) => l.type === "Collection").length,
            products: uniqueLinks.filter((l) => l.type === "Product").length,
            storePages: uniqueLinks.filter((l) => l.type === "Storefront" || l.type === "Policy" || l.type === "Support").length,
          },
        },
        "Site assets and links retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}
