import { Schema, model, Document } from "mongoose";

export interface IVerificationCodeDocument extends Document {
  email: string;
  code: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

const verificationCodeSchema = new Schema<IVerificationCodeDocument>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Document will expire exactly at expiresAt
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "verification_codes",
  }
);

export const VerificationCodeModel = model<IVerificationCodeDocument>(
  "VerificationCode",
  verificationCodeSchema,
  "verification_codes"
);
