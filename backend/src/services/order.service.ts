import crypto from "crypto";
import mongoose from "mongoose";
import { OrderModel, IOrderDocument } from "../models/order.model";
import { ProductModel } from "../models/product.model";
import { ProductService } from "./product.service";
import { IOrder, IOrderItem, IInvoice } from "../types";

function isValidObjectId(id?: string): boolean {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;
}

export interface IDiscountResult {
  valid: boolean;
  code: string;
  discountAmount: number;
  freeShipping: boolean;
  message: string;
}

export class OrderService {
  /**
   * Generates a unique, human-friendly order reference like D1-ORD-2026-A8K2F9
   */
  static async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    for (let attempts = 0; attempts < 10; attempts++) {
      const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
      const candidate = `D1-ORD-${year}-${rand}`;
      const exists = await OrderModel.findOne({ orderNumber: candidate });
      if (!exists) return candidate;
    }
    return `D1-ORD-${year}-${Date.now().toString(36).toUpperCase()}`;
  }

  /**
   * Generates a unique tax invoice number like D1-INV-2026-A8K2F9
   */
  static async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    for (let attempts = 0; attempts < 10; attempts++) {
      const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
      const candidate = `D1-INV-${year}-${rand}`;
      const exists = await OrderModel.findOne({ invoiceNumber: candidate });
      if (!exists) return candidate;
    }
    return `D1-INV-${year}-${Date.now().toString(36).toUpperCase()}`;
  }

  /**
   * Validates promotional coupons against business rules
   */
  static validateCoupon(code?: string, subtotal: number = 0): IDiscountResult {
    if (!code || !code.trim()) {
      return { valid: false, code: "", discountAmount: 0, freeShipping: false, message: "" };
    }

    const clean = code.trim().toUpperCase();

    if (clean === "DJI10" || clean === "WELCOME10") {
      const discount = Math.round(subtotal * 0.1 * 100) / 100;
      return {
        valid: true,
        code: clean,
        discountAmount: discount,
        freeShipping: false,
        message: "10% discount applied to subtotal!",
      };
    }

    if (clean === "FREESHIP") {
      return {
        valid: true,
        code: clean,
        discountAmount: 0,
        freeShipping: true,
        message: "Free Express Shipping unlocked!",
      };
    }

    if (clean === "D1SAVE50") {
      if (subtotal >= 500) {
        return {
          valid: true,
          code: clean,
          discountAmount: 50,
          freeShipping: false,
          message: "$50 store credit coupon applied!",
        };
      }
      return {
        valid: false,
        code: clean,
        discountAmount: 0,
        freeShipping: false,
        message: "D1SAVE50 requires a minimum order of $500 AUD.",
      };
    }

    if (clean === "FLYMORE") {
      const discount = Math.round(subtotal * 0.05 * 100) / 100;
      return {
        valid: true,
        code: clean,
        discountAmount: discount,
        freeShipping: false,
        message: "5% Fly More bundle discount applied!",
      };
    }

    return {
      valid: false,
      code: clean,
      discountAmount: 0,
      freeShipping: false,
      message: "Invalid coupon code. Try 'DJI10' for 10% off.",
    };
  }

  /**
   * Authoritative Australian shipping fee calculation
   */
  static calculateShippingFee(method: string = "Standard Courier", subtotal: number, freeShippingCoupon = false): number {
    if (freeShippingCoupon) return 0;

    const normalized = (method || "standard").toLowerCase();
    if (normalized.includes("pickup") || normalized.includes("collect")) {
      return 0;
    }
    if (normalized.includes("express")) {
      return 25;
    }
    // Standard Courier: Free for orders >= $99 AUD, else $15 AUD
    return subtotal >= 99 ? 0 : 15;
  }

  /**
   * Validates client line items against database products and returns authoritative pricing
   */
  static async validateAndPriceItems(rawItems: any[]): Promise<{
    valid: boolean;
    error?: string;
    items: IOrderItem[];
    subtotal: number;
  }> {
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return { valid: false, error: "Cart is empty", items: [], subtotal: 0 };
    }

    const verifiedItems: IOrderItem[] = [];
    let subtotal = 0;

    for (const raw of rawItems) {
      const pId = raw.productId || raw.id || (typeof raw.product === "string" ? raw.product : raw.product?._id);
      const slug = raw.slug || (typeof raw.product === "string" ? raw.product : raw.product?.slug);
      const qty = parseInt(String(raw.quantity), 10);

      if (isNaN(qty) || qty <= 0) {
        return { valid: false, error: `Invalid quantity for item '${raw.name || pId || slug}'`, items: [], subtotal: 0 };
      }

      // Find product in MongoDB database or local store safely via ProductService
      let product: any =
        (pId ? await ProductService.getProductById(pId) : null) ||
        (slug ? await ProductService.getProductBySlug(slug) : null);

      if (!product) {
        return {
          valid: false,
          error: `Product '${raw.name || pId}' was not found in our catalog.`,
          items: [],
          subtotal: 0,
        };
      }

      // Stock validation
      if (product.inStock === false || (typeof product.stockCount === "number" && product.stockCount <= 0)) {
        return {
          valid: false,
          error: `Sorry, '${product.name}' is currently out of stock.`,
          items: [],
          subtotal: 0,
        };
      }

      if (typeof product.stockCount === "number" && product.stockCount < qty) {
        return {
          valid: false,
          error: `Only ${product.stockCount} units of '${product.name}' available in stock.`,
          items: [],
          subtotal: 0,
        };
      }

      // Check variant price if provided
      let authoritativePrice = product.price;
      let variantName = raw.variantName || "";

      if (raw.variantId && Array.isArray(product.variants)) {
        const matchedVariant = product.variants.find(
          (v: any) => v.variantId === raw.variantId || v.name === raw.variantId || v.sku === raw.variantId
        );
        if (matchedVariant) {
          authoritativePrice = matchedVariant.price || product.price;
          variantName = matchedVariant.name || variantName;
        }
      }

      const lineTotal = Math.round(authoritativePrice * qty * 100) / 100;
      subtotal += lineTotal;

      verifiedItems.push({
        productId: String(product._id || product.slug),
        name: product.name,
        slug: product.slug,
        variantId: raw.variantId || undefined,
        variantName: variantName || undefined,
        sku: raw.sku || product.sku,
        image: raw.image || raw.img || product.mainImage,
        price: authoritativePrice,
        quantity: qty,
        total: lineTotal,
      });
    }

    subtotal = Math.round(subtotal * 100) / 100;
    return { valid: true, items: verifiedItems, subtotal };
  }

  /**
   * Creates an order with strict server validation and inventory updates
   */
  static async createOrder(orderPayload: {
    customer: any;
    billingAddress?: any;
    items: any[];
    shippingMethod?: string;
    couponCode?: string;
    paymentMethod?: string;
    paymentDetails?: any;
    notes?: string;
    userId?: string | null;
  }): Promise<IOrderDocument> {
    const { customer, billingAddress, items: rawItems, shippingMethod = "Standard Courier", couponCode, paymentMethod = "Credit Card", notes, userId } = orderPayload;

    // Validate items against real database products
    const validation = await this.validateAndPriceItems(rawItems);
    if (!validation.valid) {
      throw new Error(validation.error || "Invalid order items");
    }

    const { items, subtotal } = validation;

    // Calculate coupon
    const couponResult = this.validateCoupon(couponCode, subtotal);
    const discountAmount = couponResult.valid ? couponResult.discountAmount : 0;
    const netSubtotal = Math.max(0, subtotal - discountAmount);

    // Calculate shipping fee
    const shippingFee = this.calculateShippingFee(shippingMethod, netSubtotal, couponResult.freeShipping);

    // Grand total
    const total = Math.round((netSubtotal + shippingFee) * 100) / 100;

    // Australian GST calculation (10% inclusive of taxable total)
    const gstTax = Math.round((total / 11) * 100) / 100;

    const orderNumber = await this.generateOrderNumber();
    const invoiceNumber = await this.generateInvoiceNumber();

    // Determine initial payment status based on payment method
    let paymentStatus: "Paid" | "Pending" = "Pending";
    if (paymentMethod.toLowerCase().includes("test") || paymentMethod.toLowerCase().includes("instant")) {
      paymentStatus = "Paid";
    }

    const order = new OrderModel({
      orderNumber,
      invoiceNumber,
      userId: userId || null,
      customer: {
        firstName: customer.firstName.trim(),
        lastName: customer.lastName.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        apartment: customer.apartment?.trim() || "",
        city: customer.city.trim(),
        state: customer.state.trim().toUpperCase(),
        postcode: customer.postcode.trim(),
        country: customer.country?.trim() || "Australia",
        company: customer.company?.trim() || "",
      },
      billingAddress: billingAddress || { sameAsShipping: true },
      items,
      subtotal,
      discountCode: couponResult.valid ? couponResult.code : null,
      discountAmount,
      shippingMethod,
      shippingFee,
      tax: gstTax,
      total,
      currency: "AUD",
      status: paymentStatus === "Paid" ? "Processing" : "Pending",
      paymentMethod,
      paymentStatus,
      paymentDetails: orderPayload.paymentDetails || {},
      fulfillmentStatus: "Unfulfilled",
      notes: notes?.trim() || "",
      history: [
        {
          status: paymentStatus === "Paid" ? "Processing" : "Pending",
          note: `Order placed online via ${paymentMethod}. Total: $${total.toFixed(2)} AUD.`,
          timestamp: new Date(),
        },
      ],
    });

    await order.save();

    // Decrement inventory stock safely in background
    for (const it of items) {
      try {
        const filter = isValidObjectId(it.productId) ? { _id: it.productId } : { slug: it.slug };
        const prod = await ProductModel.findOne(filter);
        if (prod) {
          const newCount = Math.max(0, (prod.stockCount ?? 0) - it.quantity);
          prod.stockCount = newCount;
          prod.inStock = newCount > 0;
          await prod.save();
        }
      } catch (e) {
        console.warn(`Could not decrement stock for product ${it.slug}:`, e);
      }
    }

    return order;
  }

  /**
   * Generates structured tax invoice data conforming to Australian GST / ABN guidelines
   */
  static generateInvoiceData(order: IOrder): IInvoice {
    const subtotalExGst = Math.round((order.subtotal / 1.1) * 100) / 100;
    const gstAmount = Math.round((order.total / 11) * 100) / 100;

    return {
      invoiceNumber: order.invoiceNumber || `D1-INV-${order.orderNumber.replace(/^[^-]+-[^-]+-/, "")}`,
      orderNumber: order.orderNumber,
      date: order.createdAt || new Date(),
      customer: order.customer,
      billingAddress: order.billingAddress,
      items: order.items,
      subtotal: order.subtotal,
      subtotalExGst,
      gstAmount,
      discountAmount: order.discountAmount || 0,
      shippingFee: order.shippingFee || 0,
      total: order.total,
      currency: order.currency || "AUD",
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      company: {
        name: "D1 Store Pty Ltd",
        tradingAs: "D1 Store — Australia's First DJI Authorised Retailer",
        abn: "84 624 487 186",
        address: "Unit 121, 25-27 Berry Street, North Sydney NSW 2060, Australia",
        phone: "1300 000 310",
        email: "sales@d1store.com.au",
        website: "www.d1store.com.au",
      },
    };
  }
}
