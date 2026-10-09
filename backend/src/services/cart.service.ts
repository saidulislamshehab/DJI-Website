import { CartModel, ICartDocument, ICartItem } from "../models/cart.model";
import { ProductModel } from "../models/product.model";
import { OrderService } from "./order.service";

export class CartService {
  /**
   * Retrieves persistent user cart from MongoDB
   */
  static async getCart(userId: string): Promise<ICartDocument | null> {
    if (!userId) return null;
    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = new CartModel({ userId, items: [] });
      await cart.save();
    }
    return cart;
  }

  /**
   * Syncs and merges guest cart with authenticated user's cart in MongoDB
   */
  static async syncCart(userId: string, items: any[]): Promise<ICartDocument | null> {
    if (!userId) return null;
    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = new CartModel({ userId, items: [] });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return cart;
    }

    // Validate items through OrderService
    const validated = await OrderService.validateAndPriceItems(items);
    if (!validated.valid) {
      // Filter out invalid items and keep valid ones
      console.warn("Some cart items failed validation during sync:", validated.error);
    }

    const mergedMap = new Map<string, ICartItem>();

    // 1. Existing cart items
    for (const it of cart.items) {
      const key = `${it.productId}_${it.variantId || ""}`;
      const itemObj = (it as any).toObject ? (it as any).toObject() : it;
      mergedMap.set(key, { ...itemObj });
    }

    // 2. Incoming items
    for (const it of validated.items) {
      const key = `${it.productId}_${it.variantId || ""}`;
      if (mergedMap.has(key)) {
        const existing = mergedMap.get(key)!;
        existing.quantity += it.quantity;
        existing.total = Math.round(existing.price * existing.quantity * 100) / 100;
      } else {
        mergedMap.set(key, {
          productId: it.productId,
          name: it.name,
          slug: it.slug,
          variantId: it.variantId,
          variantName: it.variantName,
          sku: it.sku,
          image: it.image,
          price: it.price,
          quantity: it.quantity,
          total: it.total,
        });
      }
    }

    cart.items = Array.from(mergedMap.values());
    await cart.save();
    return cart;
  }

  /**
   * Clears user cart in database
   */
  static async clearCart(userId: string): Promise<void> {
    if (!userId) return;
    await CartModel.updateOne({ userId }, { $set: { items: [], couponCode: null } });
  }

  /**
   * Validates cart items on-demand, updating current prices and stock availability
   */
  static async validateCart(items: any[]): Promise<{
    valid: boolean;
    error?: string;
    items: any[];
    subtotal: number;
    hasStockIssues: boolean;
  }> {
    if (!Array.isArray(items) || items.length === 0) {
      return { valid: true, items: [], subtotal: 0, hasStockIssues: false };
    }

    const validatedItems: any[] = [];
    let subtotal = 0;
    let hasStockIssues = false;

    for (const raw of items) {
      const pId = raw.productId || raw.id;
      const slug = raw.slug;
      const qty = Math.max(1, parseInt(String(raw.quantity), 10) || 1);

      const product = await ProductModel.findOne({
        $or: [{ _id: pId }, { slug: slug }, { slug: pId }],
      });

      if (!product) {
        validatedItems.push({
          ...raw,
          isAvailable: false,
          errorMessage: "Item is discontinued or unavailable",
        });
        hasStockIssues = true;
        continue;
      }

      let price = product.price;
      let variantName = raw.variantName || raw.subtitle || "";

      if (raw.variantId && Array.isArray(product.variants)) {
        const v = product.variants.find(
          (item: any) => item.variantId === raw.variantId || item.name === raw.variantId || item.sku === raw.variantId
        );
        if (v) {
          price = v.price || product.price;
          variantName = v.name || variantName;
        }
      }

      const isOutOfStock = product.inStock === false;
      const maxAvailable = product.stockCount !== undefined ? product.stockCount : 99;
      const exceedsStock = maxAvailable > 0 && qty > maxAvailable;

      if (isOutOfStock || exceedsStock) {
        hasStockIssues = true;
      }

      const lineTotal = Math.round(price * qty * 100) / 100;
      subtotal += lineTotal;

      validatedItems.push({
        id: raw.id || `${product._id}_${raw.variantId || ""}`,
        productId: String(product._id || product.slug),
        slug: product.slug,
        title: product.name,
        name: product.name,
        subtitle: variantName,
        variantId: raw.variantId,
        variantName,
        sku: raw.sku || product.sku,
        img: product.mainImage,
        image: product.mainImage,
        price,
        originalPrice: product.originalPrice,
        quantity: qty,
        lineTotal,
        inStock: product.inStock,
        maxStock: maxAvailable,
        isOutOfStock,
        exceedsStock,
      });
    }

    subtotal = Math.round(subtotal * 100) / 100;

    return {
      valid: !hasStockIssues,
      items: validatedItems,
      subtotal,
      hasStockIssues,
    };
  }
}
