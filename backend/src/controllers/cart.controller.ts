import { Request, Response, NextFunction } from "express";
import { CartService } from "../services/cart.service";
import { OrderService } from "../services/order.service";
import { ApiResponse } from "../utils/apiResponse";
import { IAuthRequest } from "../middleware/auth.middleware";

export class CartController {
  /**
   * GET /api/cart
   * Retrieves persistent user cart
   */
  static async getCart(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.success(res, { items: [] }, "Guest cart initialized");
        return;
      }

      const cart = await CartService.getCart(String(req.user._id));
      ApiResponse.success(res, cart, "Cart retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/cart/sync
   * Merges or replaces user's database cart
   */
  static async syncCart(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.error(res, "Authentication required to persist server cart.", 401);
        return;
      }

      const { items } = req.body;
      const cart = await CartService.syncCart(String(req.user._id), items || []);
      ApiResponse.success(res, cart, "Cart synchronized successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/cart/validate
   * Validates cart line items, refreshes current prices and stock availability
   */
  static async validateCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { items } = req.body;
      const result = await CartService.validateCart(items || []);
      ApiResponse.success(res, result, "Cart validation completed");
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/cart/coupon
   * Validates promotional coupon against current cart subtotal
   */
  static async applyCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, subtotal = 0 } = req.body;
      const result = OrderService.validateCoupon(code, Number(subtotal));

      if (!result.valid) {
        ApiResponse.error(res, result.message, 400);
        return;
      }

      ApiResponse.success(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/cart
   * Clears authenticated user's cart in database
   */
  static async clearCart(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user) {
        await CartService.clearCart(String(req.user._id));
      }
      ApiResponse.success(res, null, "Cart cleared successfully");
    } catch (error) {
      next(error);
    }
  }
}
