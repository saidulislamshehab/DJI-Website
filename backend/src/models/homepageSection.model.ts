import { Schema, model, Document } from "mongoose";
import { IHomepageSection } from "../types";

export interface IHomepageSectionDocument extends Omit<IHomepageSection, "_id">, Document {}

const homepageSectionSchema = new Schema<IHomepageSectionDocument>(
  {
    sectionKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: "",
      trim: true,
    },
    productIds: [{
      type: String,
      trim: true,
    }],
    isEnabled: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const HomepageSectionModel = model<IHomepageSectionDocument>(
  "HomepageSection",
  homepageSectionSchema
);
