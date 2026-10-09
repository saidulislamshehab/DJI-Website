import { Schema, model, Document } from "mongoose";

export interface IAddress {
  _id?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  zip?: string;
  country?: string;
  phone?: string;
  isDefault?: boolean;
}

export interface IUserDocument extends Document {
  email: string;
  name?: string;
  role: "customer" | "admin";
  isVerified: boolean;
  marketingConsent: boolean;
  addresses: IAddress[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    company: { type: String, trim: true },
    address1: { type: String, trim: true },
    address2: { type: String, trim: true },
    city: { type: String, trim: true },
    province: { type: String, trim: true },
    zip: { type: String, trim: true },
    country: { type: String, trim: true, default: "Australia" },
    phone: { type: String, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    marketingConsent: {
      type: Boolean,
      default: true,
    },
    addresses: [addressSchema],
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "users",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const UserModel = model<IUserDocument>("User", userSchema, "users");
