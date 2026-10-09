import { z } from "zod";

/**
 * Authentication & Verification schemas
 */
export const emailLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
});

export type EmailLoginFormValues = z.infer<typeof emailLoginSchema>;

export const otpVerificationSchema = z.object({
  email: z.string().email(),
  code: z
    .string()
    .length(6, { message: "Verification code must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "Verification code must contain digits only" }),
});

export type OtpVerificationFormValues = z.infer<typeof otpVerificationSchema>;

/**
 * Customer Profile & Address schemas
 */
export const addressSchema = z.object({
  fullName: z.string().trim().min(2, { message: "Full name is required" }),
  phone: z
    .string()
    .trim()
    .min(8, { message: "Valid phone number is required" })
    .regex(/^[\d\s+()-]+$/, { message: "Please enter a valid phone number" }),
  street: z.string().trim().min(5, { message: "Street address is required" }),
  city: z.string().trim().min(2, { message: "City/Suburb is required" }),
  state: z.string().trim().min(2, { message: "State/Territory is required" }),
  postalCode: z
    .string()
    .trim()
    .min(4, { message: "Valid postal code is required" })
    .max(10, { message: "Postal code is too long" }),
  country: z.string().trim(),
  isDefault: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

export const userProfileSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email(),
  phone: z.string().optional(),
  marketingConsent: z.boolean().default(false),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;

/**
 * Checkout validation schemas
 */
export const checkoutSchema = z.object({
  email: z.string().trim().email({ message: "Valid email is required" }),
  shippingAddress: addressSchema,
  billingSameAsShipping: z.boolean().default(true),
  billingAddress: addressSchema.optional(),
  paymentMethod: z.enum(["card", "paypal", "afterpay", "zip"], {
    message: "Please select a valid payment method",
  }),
  notes: z.string().max(500).optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

/**
 * Discount / Coupon validation schemas
 */
export const discountCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, { message: "Coupon code must be at least 3 characters" })
    .max(20, { message: "Coupon code cannot exceed 20 characters" })
    .toUpperCase(),
});

export type DiscountCodeFormValues = z.infer<typeof discountCodeSchema>;

/**
 * Product search & filter schema
 */
export const searchFilterSchema = z.object({
  query: z.string().trim().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sortBy: z.enum(["featured", "price-asc", "price-desc", "newest", "rating"]).default("featured"),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(24),
});

export type SearchFilterValues = z.infer<typeof searchFilterSchema>;
