"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { applyCouponApi, fetchCartApi, syncCartApi } from "@/lib/api";

export interface CartItem {
  id: string | number;
  productId?: string;
  slug?: string;
  title: string;
  price: number;
  originalPrice?: number;
  img: string;
  quantity: number;
  subtitle?: string;
  variantId?: string;
  variantTitle?: string;
  sku?: string;
  maxStock?: number;
}

export interface AppliedCoupon {
  code: string;
  discountAmount: number;
  message: string;
  freeShipping?: boolean;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  discountAmount: number;
  couponCode: string | null;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  amountLeftForFreeShipping: number;
  isSyncing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartReady, setCartReady] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  // Initialize cart from localStorage, and if logged in, sync with server
  useEffect(() => {
    let initialCart: CartItem[] = [];
    try {
      const saved = localStorage.getItem("d1_cart");
      if (saved) {
        initialCart = JSON.parse(saved);
        setCart(initialCart);
      }
      const savedCoupon = localStorage.getItem("d1_coupon");
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.warn("Could not load cart from localStorage", e);
    } finally {
      setCartReady(true);
    }

    // Sync with server if user token exists
    const token = typeof window !== "undefined" ? localStorage.getItem("d1_token") : null;
    if (token) {
      setIsSyncing(true);
      fetchCartApi()
        .then((serverCart) => {
          if (serverCart && serverCart.items && serverCart.items.length > 0) {
            // Map server cart items to CartItem format
            const mapped: CartItem[] = serverCart.items.map((it: any) => ({
              id: it.variantId ? `${it.productId}_${it.variantId}` : it.productId,
              productId: it.productId,
              slug: it.slug,
              title: it.name,
              price: it.price,
              img: it.image,
              quantity: it.quantity,
              variantId: it.variantId,
              variantTitle: it.variantName,
              sku: it.sku,
            }));

            // Merge local and server items
            setCart((localPrev) => {
              const mergedMap = new Map<string, CartItem>();
              for (const it of localPrev) {
                mergedMap.set(String(it.id), { ...it });
              }
              for (const it of mapped) {
                const key = String(it.id);
                if (mergedMap.has(key)) {
                  const ex = mergedMap.get(key)!;
                  ex.quantity = Math.max(ex.quantity, it.quantity);
                } else {
                  mergedMap.set(key, it);
                }
              }
              const finalItems = Array.from(mergedMap.values());
              return finalItems;
            });
          }
        })
        .catch((e) => console.warn("Failed to fetch server cart:", e))
        .finally(() => setIsSyncing(false));
    }
  }, []);

  // Save cart changes to localStorage & trigger debounced server sync if logged in
  useEffect(() => {
    if (!cartReady) return;
    try {
      localStorage.setItem("d1_cart", JSON.stringify(cart));
    } catch (e) {}

    const token = typeof window !== "undefined" ? localStorage.getItem("d1_token") : null;
    if (token && cart.length > 0) {
      const timer = setTimeout(() => {
        const payload = cart.map((i) => ({
          productId: i.productId || String(i.id),
          name: i.title,
          slug: i.slug || String(i.id),
          variantId: i.variantId,
          variantName: i.variantTitle,
          image: i.img,
          price: i.price,
          quantity: i.quantity,
          sku: i.sku,
        }));
        syncCartApi(payload).catch(() => {});
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cart, cartReady]);

  // Recalculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Recalculate coupon discount whenever subtotal or coupon changes
  useEffect(() => {
    if (appliedCoupon && subtotal > 0) {
      // Re-validate coupon in background to adjust discount
      applyCouponApi(appliedCoupon.code, subtotal)
        .then((res) => {
          if (res.valid) {
            setAppliedCoupon({
              code: res.code,
              discountAmount: res.discountAmount,
              message: res.message,
              freeShipping: res.freeShipping,
            });
            localStorage.setItem("d1_coupon", JSON.stringify({
              code: res.code,
              discountAmount: res.discountAmount,
              message: res.message,
              freeShipping: res.freeShipping,
            }));
          }
        })
        .catch(() => {
          // If subtotal is too low for coupon minimum requirement
          setAppliedCoupon(null);
          localStorage.removeItem("d1_coupon");
        });
    } else if (subtotal === 0) {
      setAppliedCoupon(null);
      localStorage.removeItem("d1_coupon");
    }
  }, [subtotal, appliedCoupon?.code]);

  const addToCart = useCallback((item: Omit<CartItem, "quantity">, qty: number = 1) => {
    const validQty = Math.max(1, Math.min(qty || 1, item.maxStock || 99));

    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + validQty, item.maxStock || 99);
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, { ...item, quantity: validQty }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string | number) => {
    setCart((prev) => prev.filter((i) => String(i.id) !== String(id)));
  }, []);

  const updateQuantity = useCallback((id: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prev) =>
      prev.map((i) => {
        if (String(i.id) === String(id)) {
          const clamped = Math.max(1, Math.min(quantity, i.maxStock || 99));
          return { ...i, quantity: clamped };
        }
        return i;
      })
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedCoupon(null);
    try {
      localStorage.removeItem("d1_cart");
      localStorage.removeItem("d1_coupon");
    } catch (e) {}
  }, []);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      return { success: false, message: "Please enter a promotional discount code." };
    }

    if (subtotal <= 0) {
      return { success: false, message: "Add items to your cart before applying a coupon." };
    }

    try {
      const res = await applyCouponApi(trimmed, subtotal);
      if (res.valid) {
        const couponObj: AppliedCoupon = {
          code: res.code,
          discountAmount: res.discountAmount,
          message: res.message,
          freeShipping: res.freeShipping,
        };
        setAppliedCoupon(couponObj);
        localStorage.setItem("d1_coupon", JSON.stringify(couponObj));
        return { success: true, message: res.message };
      } else {
        return { success: false, message: res.message || "Invalid coupon code." };
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Invalid discount coupon";
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    try {
      localStorage.removeItem("d1_coupon");
    } catch (e) {}
  };

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingThreshold = 99; // Standard Courier Free delivery for $99 AUD and above
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountLeftForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        discountAmount,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        freeShippingThreshold,
        freeShippingProgress,
        amountLeftForFreeShipping,
        isSyncing,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
