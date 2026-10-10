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

  /**
   * POST /api/users
   * Creates a new user or administrator account from the admin dashboard.
   */
  static async createUser(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { email, name, password, role = "customer" } = req.body;

      if (!email || !email.trim()) {
        ApiResponse.error(res, "Email address is required.", 400);
        return;
      }

      const cleanEmail = email.toLowerCase().trim();
      const existing = await UserModel.findOne({ email: cleanEmail });
      if (existing) {
        ApiResponse.error(res, "A user with this email address already exists.", 400);
        return;
      }

      const newUser = new UserModel({
        email: cleanEmail,
        name: name ? name.trim() : cleanEmail.split("@")[0],
        password: password || "D1StoreAdminPass123!",
        role: role === "admin" ? "admin" : "customer",
        isVerified: true,
      });

      await newUser.save();

      ApiResponse.success(
        res,
        {
          _id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          createdAt: newUser.createdAt,
        },
        `User ${newUser.email} created successfully.`,
        201
      );
    } catch (error: any) {
      console.error("[UserController.createUser] Error:", error);
      ApiResponse.error(res, error.message || "Failed to create user", 500);
    }
  }
}
