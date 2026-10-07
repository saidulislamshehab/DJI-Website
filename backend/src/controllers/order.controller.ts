import { Request, Response, NextFunction } from "express";
import { DbStore } from "../services/dbStore";
import { ApiResponse } from "../utils/apiResponse";

export class OrderController {
  private static store = DbStore.getInstance();

  static async getOrders(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orders = OrderController.store.getOrders();
      ApiResponse.success(res, orders, "Orders retrieved successfully", 200, {
        count: orders.length,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        ApiResponse.error(res, "Order ID is required", 400, "Bad Request");
        return;
      }

      const order = OrderController.store.getOrderById(id);
      if (!order) {
        ApiResponse.error(res, `Order '${id}' not found`, 404, "Not Found");
        return;
      }

      ApiResponse.success(res, order, "Order retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { customer, items, shippingMethod, shippingFee, paymentMethod, notes } = req.body;

      if (!customer || !customer.email || !customer.firstName || !customer.address) {
        ApiResponse.error(res, "Valid customer details are required", 400, "Bad Request");
        return;
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        ApiResponse.error(res, "Order must contain at least one item", 400, "Bad Request");
        return;
      }

      const order = OrderController.store.createOrder({
        customer,
        items,
        shippingMethod,
        shippingFee,
        paymentMethod,
        notes,
      });

      ApiResponse.success(res, order, "Order placed successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { status, paymentStatus } = req.body;

      if (!status) {
        ApiResponse.error(res, "Status is required", 400, "Bad Request");
        return;
      }

      const updated = OrderController.store.updateOrderStatus(id, status, paymentStatus);
      if (!updated) {
        ApiResponse.error(res, `Order '${id}' not found`, 404, "Not Found");
        return;
      }

      ApiResponse.success(res, updated, "Order status updated successfully");
    } catch (error) {
      next(error);
    }
  }
}
