import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { OrderModel } from "../models/order.model";
import { ProductModel } from "../models/product.model";
import { OrderService } from "../services/order.service";
import { CartService } from "../services/cart.service";
import { ApiResponse } from "../utils/apiResponse";
import { IAuthRequest } from "../middleware/auth.middleware";

export class OrderController {
  /**
   * POST /api/orders
   * Securely places an order with database persistence, stock check & deduction, and invoice generation
   */
  static async createOrder(req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> {
    try {
      const {
        customer,
        billingAddress,
        items,
        shippingMethod = "Standard Courier",
        couponCode,
        paymentMethod = "Credit Card",
        paymentDetails,
        notes,
      } = req.body;

      // 1. Validate customer information
      if (!customer || !customer.email || !customer.firstName || !customer.lastName || !customer.address || !customer.city || !customer.postcode) {
        ApiResponse.error(res, "Please provide complete customer contact and shipping address details.", 400, "Bad Request");
        return;
      }

      // Basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customer.email)) {
        ApiResponse.error(res, "Please provide a valid email address.", 400, "Bad Request");
        return;
      }

      // 2. Validate line items
      if (!items || !Array.isArray(items) || items.length === 0) {
        ApiResponse.error(res, "Your cart is empty. Please add items before placing an order.", 400, "Bad Request");
        return;
      }

      // 3. User association if logged in
      const userId = req.user ? String(req.user._id) : null;

      // 4. Create order through OrderService (performs DB validation, atomic inventory updates, and invoice number creation)
      const order = await OrderService.createOrder({
        customer,
        billingAddress,
        items,
        shippingMethod,
        couponCode,
        paymentMethod,
        paymentDetails,
        notes,
        userId,
      });

      // 5. Clear DB cart if user is authenticated
      if (userId) {
        await CartService.clearCart(userId).catch(() => {});
      }

      ApiResponse.success(
        res,
        order,
        `Order ${order.orderNumber} placed successfully!`,
        201
      );
    } catch (error: any) {
      console.error("[OrderController] createOrder error:", error.message);
      ApiResponse.error(res, error.message || "Failed to process order. Please try again.", 400);
    }
  }

  /**
   * POST /api/orders/validate
   * Pre-flight checkout calculation verifying prices, stock, shipping, coupons, and GST
   */
  static async validateCheckout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { items, shippingMethod = "Standard Courier", couponCode } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        ApiResponse.error(res, "No items provided for validation", 400);
        return;
      }

      const itemValidation = await OrderService.validateAndPriceItems(items);
      if (!itemValidation.valid) {
        ApiResponse.error(res, itemValidation.error || "Item validation failed", 400);
        return;
      }

      const { subtotal } = itemValidation;
      const couponResult = OrderService.validateCoupon(couponCode, subtotal);
      const discountAmount = couponResult.valid ? couponResult.discountAmount : 0;
      const netSubtotal = Math.max(0, subtotal - discountAmount);

      const shippingFee = OrderService.calculateShippingFee(shippingMethod, netSubtotal, couponResult.freeShipping);
      const total = Math.round((netSubtotal + shippingFee) * 100) / 100;
      const gstTax = Math.round((total / 11) * 100) / 100;

      ApiResponse.success(
        res,
        {
          items: itemValidation.items,
          subtotal,
          discountAmount,
          discountCode: couponResult.valid ? couponResult.code : null,
          couponMessage: couponResult.message,
          shippingFee,
          shippingMethod,
          tax: gstTax,
          total,
          currency: "AUD",
        },
        "Checkout calculations verified"
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * GET /api/orders
   * Retrieves orders for the authenticated user, or all orders if admin
   */
  static async getOrders(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, orderNumber } = req.query;

      // Guest lookup by email + orderNumber
      if (email && orderNumber) {
        const guestOrder = await OrderModel.findOne({
          orderNumber: String(orderNumber).trim().toUpperCase(),
          "customer.email": String(email).trim().toLowerCase(),
        });
        if (!guestOrder) {
          ApiResponse.error(res, "No order found matching the provided details.", 404);
          return;
        }
        ApiResponse.success(res, [guestOrder], "Order retrieved successfully");
        return;
      }

      // If user is authenticated:
      if (req.user) {
        const isAdmin = req.user.role === "admin";
        const query: any = {};

        if (!isAdmin) {
          // Regular customer: only see their own orders (by userId or matching email)
          query.$or = [{ userId: req.user._id }, { "customer.email": req.user.email.toLowerCase() }];
        }

        const orders = await OrderModel.find(query).sort({ createdAt: -1 }).limit(100);
        ApiResponse.success(res, orders, "Orders retrieved successfully", 200, {
          count: orders.length,
        });
        return;
      }

      // If not authenticated and no guest lookup provided:
      ApiResponse.error(res, "Authentication required to view order history.", 401);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/orders/:id
   * Retrieves order by database ID or orderNumber
   */
  static async getOrderById(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        ApiResponse.error(res, "Order ID is required", 400);
        return;
      }

      // Find by MongoDB _id or orderNumber
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      const query = isObjectId ? { $or: [{ _id: id }, { orderNumber: id.toUpperCase() }] } : { orderNumber: id.toUpperCase() };

      const order = await OrderModel.findOne(query);
      if (!order) {
        ApiResponse.error(res, `Order '${id}' not found`, 404);
        return;
      }

      // Access control:
      // If user is logged in, verify ownership or admin role.
      // If guest, allow lookup if email param matches or public reference.
      if (req.user) {
        const isOwner =
          (order.userId && String(order.userId) === String(req.user._id)) ||
          order.customer?.email?.toLowerCase() === req.user.email.toLowerCase();
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
          ApiResponse.error(res, "You do not have permission to view this order.", 403);
          return;
        }
      }

      ApiResponse.success(res, order, "Order retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/orders/:id/invoice
   * Retrieves official Australian tax invoice data
   */
  static async getOrderInvoice(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        ApiResponse.error(res, "Order reference is required", 400);
        return;
      }

      const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      const query = isObjectId ? { $or: [{ _id: id }, { orderNumber: id.toUpperCase() }] } : { orderNumber: id.toUpperCase() };

      const order = await OrderModel.findOne(query);
      if (!order) {
        ApiResponse.error(res, "Tax invoice not found", 404);
        return;
      }

      const invoiceData = OrderService.generateInvoiceData(order.toObject() as any);
      ApiResponse.success(res, invoiceData, "Tax invoice retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/orders/:id/status
   * Updates order status or payment status
   */
  static async updateOrderStatus(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { status, paymentStatus, trackingNumber, trackingCompany, fulfillmentStatus } = req.body;

      const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      const query = isObjectId ? { $or: [{ _id: id }, { orderNumber: id.toUpperCase() }] } : { orderNumber: id.toUpperCase() };

      const order = await OrderModel.findOne(query);
      if (!order) {
        ApiResponse.error(res, `Order '${id}' not found`, 404);
        return;
      }

      if (status) order.status = status;
      if (paymentStatus) order.paymentStatus = paymentStatus;
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (trackingCompany) order.trackingCompany = trackingCompany;
      if (fulfillmentStatus) order.fulfillmentStatus = fulfillmentStatus;

      if (!order.history) {
        order.history = [];
      }
      order.history.push({
        status: order.status,
        note: `Status updated to ${order.status}${paymentStatus ? `, Payment: ${paymentStatus}` : ""}.`,
        timestamp: new Date(),
      });

      await order.save();
      ApiResponse.success(res, order, "Order status updated successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/orders/:id/cancel
   * Allows customer to cancel a pending order and restores inventory
   */
  static async cancelOrder(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { reason = "Customer requested cancellation" } = req.body;

      const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      const query = isObjectId ? { $or: [{ _id: id }, { orderNumber: id.toUpperCase() }] } : { orderNumber: id.toUpperCase() };

      const order = await OrderModel.findOne(query);
      if (!order) {
        ApiResponse.error(res, "Order not found", 404);
        return;
      }

      if (order.status !== "Pending") {
        ApiResponse.error(res, `Order cannot be cancelled as it is already ${order.status.toLowerCase()}. Please contact support.`, 400);
        return;
      }

      // Check permission
      if (req.user) {
        const isOwner =
          (order.userId && String(order.userId) === String(req.user._id)) ||
          order.customer.email.toLowerCase() === req.user.email.toLowerCase();
        const isAdmin = req.user.role === "admin";
        if (!isOwner && !isAdmin) {
          ApiResponse.error(res, "Unauthorized to cancel this order", 403);
          return;
        }
      }

      order.status = "Cancelled";
      if (!order.history) {
        order.history = [];
      }
      order.history.push({
        status: "Cancelled",
        note: `Order cancelled. Reason: ${reason}`,
        timestamp: new Date(),
      });

      await order.save();

      // Restore stock
      for (const it of order.items) {
        try {
          const filter = mongoose.Types.ObjectId.isValid(it.productId) ? { _id: it.productId } : { slug: it.slug };
          await ProductModel.updateOne(
            filter,
            { $inc: { stockCount: it.quantity } }
          );
        } catch (e) {
          console.warn("Could not revert stock for cancelled item:", it.slug);
        }
      }

      ApiResponse.success(res, order, "Order has been cancelled successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/orders/:id
   * Admin endpoint to delete an order record
   */
  static async deleteOrder(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      const query = isObjectId ? { $or: [{ _id: id }, { orderNumber: id.toUpperCase() }] } : { orderNumber: id.toUpperCase() };

      const deleted = await OrderModel.findOneAndDelete(query);
      if (!deleted) {
        ApiResponse.error(res, `Order '${id}' not found`, 404);
        return;
      }
      ApiResponse.success(res, { id, orderNumber: deleted.orderNumber }, "Order deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
