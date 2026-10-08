import { Schema, model, Document } from "mongoose";
import { IStoreLocation } from "../types";

export interface IStoreDocument extends Omit<IStoreLocation, "_id">, Document {}

const storeSchema = new Schema<IStoreDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postcode: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    hours: { type: String, required: true },
    isFlagship: { type: Boolean, default: false },
    lat: { type: Number },
    lng: { type: Number },
    image: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const StoreModel = model<IStoreDocument>("Store", storeSchema);
