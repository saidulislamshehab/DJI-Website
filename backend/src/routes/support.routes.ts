import { Router } from "express";
import { SupportController } from "../controllers/support.controller";
import { optionalAuth } from "../middleware/auth.middleware";

const router = Router();

// POST /api/support/tickets - Submit a customer support message
router.post("/tickets", optionalAuth, SupportController.createTicket);

// GET /api/support/tickets - Get customer tickets/conversations
router.get("/tickets", optionalAuth, SupportController.getTickets);

// GET /api/support/tickets/:id - Get specific conversation thread
router.get("/tickets/:id", optionalAuth, SupportController.getTicketById);

// POST /api/support/tickets/:id/replies - Reply to a conversation
router.post("/tickets/:id/replies", optionalAuth, SupportController.addReply);

export default router;
