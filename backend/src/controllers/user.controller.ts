import { Response } from "express";
import { UserModel } from "../models/user.model";
import { ApiResponse } from "../utils/apiResponse";
import { IAuthRequest } from "../middleware/auth.middleware";

export class UserController {
  /**
   * GET /api/users
   * Returns list of registered users with optional search and role filtering.
   */
  static async getUsers(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { search, role, page = 1, limit = 50 } = req.query;

      const query: any = {};
      if (role && (role === "admin" || role === "customer")) {
        query.role = role;
      }

      if (search && typeof search === "string" && search.trim() !== "") {
        const s = search.trim();
        query.$or = [
          { email: { $regex: s, $options: "i" } },
          { name: { $regex: s, $options: "i" } },
        ];
      }

      const pageNum = Math.max(1, Number(page) || 1);
      const limitNum = Math.max(1, Math.min(100, Number(limit) || 50));
      const skip = (pageNum - 1) * limitNum;

      const [users, total] = await Promise.all([
        UserModel.find(query)
          .select("-__v")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        UserModel.countDocuments(query),
      ]);

      ApiResponse.success(
        res,
        users,
        "Users retrieved successfully",
        200,
        {
          count: users.length,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum) || 1,
          },
        }
      );
    } catch (error: any) {
      console.error("[UserController.getUsers] Error:", error);
      ApiResponse.error(res, error.message || "Failed to retrieve users", 500);
    }
  }

  /**
   * GET /api/users/stats
   * Aggregated user stats for admin dashboard.
   */
  static async getUserStats(_req: IAuthRequest, res: Response): Promise<void> {
    try {
      const [totalUsers, totalAdmins, totalCustomers] = await Promise.all([
        UserModel.countDocuments(),
        UserModel.countDocuments({ role: "admin" }),
        UserModel.countDocuments({ role: "customer" }),
      ]);

      ApiResponse.success(
        res,
        {
          totalUsers,
          totalAdmins,
          totalCustomers,
        },
        "User stats retrieved successfully"
      );
    } catch (error: any) {
      console.error("[UserController.getUserStats] Error:", error);
      ApiResponse.error(res, error.message || "Failed to retrieve user stats", 500);
    }
  }

  /**
   * PATCH /api/users/:id/role
   * Updates user role to "admin" or "customer".
   */
  static async updateUserRole(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role || (role !== "admin" && role !== "customer")) {
        ApiResponse.error(res, "Invalid role. Role must be either 'admin' or 'customer'.", 400);
        return;
      }

      // Safeguard: Prevent admin from demoting themselves
      if (req.user && req.user._id.toString() === id && role !== "admin") {
        ApiResponse.error(res, "You cannot remove admin privileges from your own account.", 400);
        return;
      }

      const user = await UserModel.findById(id);
      if (!user) {
        ApiResponse.error(res, `User with ID '${id}' not found.`, 404);
        return;
      }

      user.role = role;
      await user.save();

      ApiResponse.success(
        res,
        {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          updatedAt: user.updatedAt,
        },
        `User ${user.email} role updated to ${role} successfully.`
      );
    } catch (error: any) {
      console.error("[UserController.updateUserRole] Error:", error);
      ApiResponse.error(res, error.message || "Failed to update user role", 500);
    }
  }

  /**
   * DELETE /api/users/:id
   * Removes a user account.
   */
  static async deleteUser(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Safeguard: Prevent admin from deleting themselves
      if (req.user && req.user._id.toString() === id) {
        ApiResponse.error(res, "You cannot delete your own account while logged in.", 400);
        return;
      }

      const deleted = await UserModel.findByIdAndDelete(id);
      if (!deleted) {
        ApiResponse.error(res, `User with ID '${id}' not found.`, 404);
        return;
      }

      ApiResponse.success(
        res,
        { id: deleted._id, email: deleted.email },
        `User ${deleted.email} deleted successfully.`
      );
    } catch (error: any) {
      console.error("[UserController.deleteUser] Error:", error);
      ApiResponse.error(res, error.message || "Failed to delete user", 500);
    }
  }
}
