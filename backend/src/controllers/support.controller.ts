import { Request, Response, NextFunction } from "express";
import { SupportService } from "../services/support.service";
import { ApiResponse } from "../utils/apiResponse";
import { IAuthRequest } from "../middleware/auth.middleware";

export class SupportController {
  /**
   * POST /api/support/tickets
   * Submits a customer support message and opens a ticket
   */
  static async createTicket(req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { name, email, message, subject } = req.body;

      if (!name || typeof name !== "string" || name.trim().length < 2) {
        ApiResponse.error(res, "Please provide your name (at least 2 characters).", 400);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
        ApiResponse.error(res, "Please provide a valid email address.", 400);
        return;
      }

      if (!message || typeof message !== "string" || message.trim().length < 3) {
        ApiResponse.error(res, "Please enter your message (at least 3 characters).", 400);
        return;
      }

      const userId = req.user ? String(req.user._id) : null;

      const ticket = await SupportService.createTicket({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        subject: subject ? String(subject).trim() : undefined,
        userId,
      });

      ApiResponse.success(
        res,
        ticket,
        `Thank you ${name.trim()}! Your support ticket #${ticket.ticketNumber} has been logged.`,
        201
      );
    } catch (error: any) {
      console.error("[SupportController] createTicket error:", error);
      ApiResponse.error(res, error.message || "Failed to submit support request.", 500);
    }
  }

  /**
   * GET /api/support/tickets
   * Retrieves support conversations for a customer by email or authenticated account
   */
  static async getTickets(req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> {
    try {
      const email = typeof req.query.email === "string" ? req.query.email : req.user?.email;
      const userId = req.user ? String(req.user._id) : undefined;

      const tickets = await SupportService.getTickets({ email, userId });
      ApiResponse.success(res, tickets, "Support conversations retrieved successfully");
    } catch (error: any) {
      console.error("[SupportController] getTickets error:", error);
      ApiResponse.error(res, error.message || "Failed to retrieve conversations.", 500);
    }
  }

  /**
   * GET /api/support/tickets/:id
   * Retrieves details and messages for a specific ticket
   */
  static async getTicketById(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id || "");
      const ticket = await SupportService.getTicketById(id);

      if (!ticket) {
        ApiResponse.error(res, "Conversation not found", 404);
        return;
      }

      ApiResponse.success(res, ticket, "Conversation details retrieved");
    } catch (error: any) {
      console.error("[SupportController] getTicketById error:", error);
      ApiResponse.error(res, error.message || "Failed to retrieve conversation.", 500);
    }
  }

  /**
   * POST /api/support/tickets/:id/replies
   * Adds a reply to an ongoing conversation
   */
  static async addReply(req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id || "");
      const { message, senderName } = req.body;

      if (!message || typeof message !== "string" || message.trim().length === 0) {
        ApiResponse.error(res, "Message cannot be empty", 400);
        return;
      }

      const sender = req.user?.role === "admin" ? "agent" : "customer";
      const name = senderName || req.user?.name || "Customer";

      const updated = await SupportService.addReply(id, {
        sender,
        senderName: name,
        message: message.trim(),
      });

      if (!updated) {
        ApiResponse.error(res, "Conversation not found", 404);
        return;
      }

      ApiResponse.success(res, updated, "Reply sent successfully");
    } catch (error: any) {
      console.error("[SupportController] addReply error:", error);
      ApiResponse.error(res, error.message || "Failed to send reply.", 500);
    }
  }
}
