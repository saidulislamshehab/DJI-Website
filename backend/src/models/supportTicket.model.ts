import mongoose, { Schema, Document } from "mongoose";

export interface ISupportMessageDocument {
  sender: "customer" | "agent";
  senderName: string;
  message: string;
  createdAt: Date;
}

export interface ISupportTicketDocument extends Document {
  ticketNumber: string;
  name: string;
  email: string;
  subject: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "normal" | "high";
  messages: ISupportMessageDocument[];
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SupportMessageSchema = new Schema<ISupportMessageDocument>(
  {
    sender: { type: String, enum: ["customer", "agent"], required: true, default: "customer" },
    senderName: { type: String, required: true },
    message: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const SupportTicketSchema = new Schema<ISupportTicketDocument>(
  {
    ticketNumber: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    subject: { type: String, default: "Customer Support Enquiry" },
    status: { type: String, enum: ["open", "in-progress", "resolved"], default: "open", index: true },
    priority: { type: String, enum: ["low", "normal", "high"], default: "normal" },
    messages: [SupportMessageSchema],
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
  },
  { timestamps: true }
);

export const SupportTicketModel =
  mongoose.models.SupportTicket ||
  mongoose.model<ISupportTicketDocument>("SupportTicket", SupportTicketSchema);
