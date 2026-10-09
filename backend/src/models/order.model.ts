import { Schema, model, Document } from "mongoose";
import { IOrder } from "../types";

export interface IOrderDocument extends Omit<IOrder, "_id">, Document {}

const orderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    variantId: { type: String },
    variantName: { type: String },
    sku: { type: String },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const customerSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    apartment: { type: String, trim: true, default: "" },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postcode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: "Australia" },
    company: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const billingSchema = new Schema(
  {
    sameAsShipping: { type: Boolean, default: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    address: { type: String, trim: true },
    apartment: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postcode: { type: String, trim: true },
    country: { type: String, trim: true, default: "Australia" },
  },
  { _id: false }
);

const orderSchema = new Schema<any>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    customer: {
      type: customerSchema,
      required: true,
    },
    billingAddress: {
      type: billingSchema,
      default: () => ({ sameAsShipping: true }),
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v: any[]) => Array.isArray(v) && v.length > 0,
        message: "Order must contain at least one item",
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discountCode: {
      type: String,
      trim: true,
      default: null,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    shippingMethod: {
      type: String,
      required: true,
      trim: true,
      default: "Standard Courier",
    },
    shippingFee: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "AUD",
      uppercase: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
      default: "Credit Card",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
      index: true,
    },
    paymentDetails: {
      type: Schema.Types.Mixed,
      default: {},
    },
    fulfillmentStatus: {
      type: String,
      enum: ["Unfulfilled", "Partial", "Fulfilled"],
      default: "Unfulfilled",
      index: true,
    },
    trackingNumber: {
      type: String,
      trim: true,
      default: null,
    },
    trackingCompany: {
      type: String,
      trim: true,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    history: [
      {
        status: { type: String, required: true },
        note: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for fast customer & admin lookups
orderSchema.index({ "customer.email": 1, createdAt: -1 });
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

export const OrderModel = model<IOrderDocument>("Order", orderSchema);
