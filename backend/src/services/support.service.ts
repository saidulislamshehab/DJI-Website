import crypto from "crypto";
import mongoose from "mongoose";
import { SupportTicketModel } from "../models/supportTicket.model";
import { ISupportTicket } from "../types";

export interface ICreateTicketInput {
  name: string;
  email: string;
  message: string;
  subject?: string;
  userId?: string | null;
}

export interface IAddReplyInput {
  sender: "customer" | "agent";
  senderName: string;
  message: string;
}

// In-memory fallback if Mongo is disconnected
const memoryTickets: ISupportTicket[] = [];

export class SupportService {
  private static isMongoConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  public static generateTicketNumber(): string {
    const year = new Date().getFullYear();
    const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
    return `D1-SUP-${year}-${rand}`;
  }

  static async createTicket(input: ICreateTicketInput): Promise<ISupportTicket> {
    const { name, email, message, subject, userId } = input;
    const ticketNumber = this.generateTicketNumber();
    const now = new Date();

    const customerMessage = {
      sender: "customer" as const,
      senderName: name.trim(),
      message: message.trim(),
      createdAt: now,
    };

    const agentGreeting = {
      sender: "agent" as const,
      senderName: "D1 Store Support Specialist",
      message: `G'day ${name.trim()}! Thanks for reaching out to D1 Store Australia. We've received your enquiry under ticket #${ticketNumber}. Our team will review your details and respond directly via email or here in your Messages tab.`,
      createdAt: new Date(now.getTime() + 1000),
    };

    if (this.isMongoConnected()) {
      try {
        const ticketDoc = await SupportTicketModel.create({
          ticketNumber,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          subject: subject?.trim() || "Customer Support Enquiry",
          status: "open",
          priority: "normal",
          messages: [customerMessage, agentGreeting],
          userId: userId && mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null,
        });

        return ticketDoc.toObject() as unknown as ISupportTicket;
      } catch (err) {
        console.warn("[SupportService] MongoDB create failed, falling back to in-memory store:", err);
      }
    }

    const fallbackTicket: ISupportTicket = {
      _id: "sup_" + Math.random().toString(36).substring(2, 11),
      ticketNumber,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject?.trim() || "Customer Support Enquiry",
      status: "open",
      priority: "normal",
      messages: [customerMessage, agentGreeting],
      userId: userId || null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    memoryTickets.unshift(fallbackTicket);
    return fallbackTicket;
  }

  static async getTickets(query: { email?: string; userId?: string }): Promise<ISupportTicket[]> {
    const email = query.email ? query.email.trim().toLowerCase() : undefined;
    const userId = query.userId;

    if (this.isMongoConnected()) {
      try {
        const filter: any = {};
        if (email && userId) {
          filter.$or = [
            { email },
            { userId: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null },
          ];
        } else if (email) {
          filter.email = email;
        } else if (userId && mongoose.Types.ObjectId.isValid(userId)) {
          filter.userId = new mongoose.Types.ObjectId(userId);
        }

        const docs = await SupportTicketModel.find(filter).sort({ updatedAt: -1 }).lean();
        return docs as unknown as ISupportTicket[];
      } catch (err) {
        console.warn("[SupportService] MongoDB find failed, falling back to memory:", err);
      }
    }

    return memoryTickets.filter((t) => {
      if (email && t.email === email) return true;
      if (userId && t.userId === userId) return true;
      return !email && !userId;
    });
  }

  static async getTicketById(idOrTicketNumber: string): Promise<ISupportTicket | null> {
    if (!idOrTicketNumber) return null;

    if (this.isMongoConnected()) {
      try {
        const query = mongoose.Types.ObjectId.isValid(idOrTicketNumber)
          ? { $or: [{ _id: idOrTicketNumber }, { ticketNumber: idOrTicketNumber }] }
          : { ticketNumber: idOrTicketNumber };

        const doc = await SupportTicketModel.findOne(query).lean();
        if (doc) return doc as unknown as ISupportTicket;
      } catch (err) {
        console.warn("[SupportService] MongoDB query failed, falling back to memory:", err);
      }
    }

    const found = memoryTickets.find(
      (t) => t._id === idOrTicketNumber || t.ticketNumber === idOrTicketNumber
    );
    return found || null;
  }

  static async addReply(
    idOrTicketNumber: string,
    reply: IAddReplyInput
  ): Promise<ISupportTicket | null> {
    const newMsgDoc = {
      sender: reply.sender,
      senderName: reply.senderName,
      message: reply.message.trim(),
      createdAt: new Date(),
    };

    if (this.isMongoConnected()) {
      try {
        const query = mongoose.Types.ObjectId.isValid(idOrTicketNumber)
          ? { $or: [{ _id: idOrTicketNumber }, { ticketNumber: idOrTicketNumber }] }
          : { ticketNumber: idOrTicketNumber };

        const updated = await SupportTicketModel.findOneAndUpdate(
          query,
          {
            $push: { messages: newMsgDoc },
            $set: { updatedAt: new Date(), status: reply.sender === "customer" ? "open" : "in-progress" },
          },
          { new: true }
        ).lean();

        if (updated) return updated as unknown as ISupportTicket;
      } catch (err) {
        console.warn("[SupportService] MongoDB reply failed, falling back to memory:", err);
      }
    }

    const ticket = memoryTickets.find(
      (t) => t._id === idOrTicketNumber || t.ticketNumber === idOrTicketNumber
    );
    if (!ticket) return null;

    ticket.messages.push({
      _id: "msg_" + Math.random().toString(36).substring(2, 9),
      sender: reply.sender,
      senderName: reply.senderName,
      message: reply.message.trim(),
      createdAt: new Date().toISOString(),
    });
    ticket.updatedAt = new Date().toISOString();
    return ticket;
  }
}
