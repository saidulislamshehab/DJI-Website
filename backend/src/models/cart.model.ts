import { Schema, model, Document } from "mongoose";

export interface ICartItem {
  productId: string;
  name: string;
  slug: string;
  variantId?: string;
  variantName?: string;
  sku?: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

export interface ICartDocument extends Document {
  userId?: Schema.Types.ObjectId | string;
  sessionId?: string;
  items: ICartItem[];
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
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

const cartSchema = new Schema<ICartDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      sparse: true,
      index: true,
    },
    sessionId: {
      type: String,
      sparse: true,
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    couponCode: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const CartModel = model<ICartDocument>("Cart", cartSchema);
