import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

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
  password?: string;
  role: "customer" | "admin";
  isVerified: boolean;
  marketingConsent: boolean;
  addresses: IAddress[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
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
    password: {
      type: String,
      select: false, // Hidden by default from queries
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
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete (ret as any).password;
        delete (ret as any).__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete (ret as any).password;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Hash password before saving if modified
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password instance method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Fast lookups for admin lists
userSchema.index({ role: 1, createdAt: -1 });

export const UserModel = model<IUserDocument>("User", userSchema, "users");
