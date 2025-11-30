import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, WishlistItem } from "@shared/schema";
import type { Language } from "@/lib/i18n";

interface RecentlyViewedItem {
  productId: string;
  viewedAt: number;
}

interface CompareItem {
  productId: string;
}

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  wishlistItems: WishlistItem[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  recentlyViewed: RecentlyViewedItem[];
  addToRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
  compareItems: CompareItem[];
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: "en" as Language,
      setLanguage: (lang) => set({ language: lang }),
      
      cartItems: [],
      addToCart: (item) => {
        const existingItem = get().cartItems.find(
          (i) => i.productId === item.productId && 
                 i.isSubscription === item.isSubscription &&
                 i.subscriptionFrequency === item.subscriptionFrequency
        );
        if (existingItem) {
          set({
            cartItems: get().cartItems.map((i) =>
              i.id === existingItem.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({
            cartItems: [
              ...get().cartItems,
              { ...item, id: crypto.randomUUID() },
            ],
          });
        }
      },
      removeFromCart: (id) =>
        set({ cartItems: get().cartItems.filter((i) => i.id !== id) }),
      updateCartQuantity: (id, quantity) =>
        set({
          cartItems: get().cartItems.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        }),
      clearCart: () => set({ cartItems: [] }),
      
      wishlistItems: [],
      addToWishlist: (productId) => {
        if (!get().wishlistItems.find((i) => i.productId === productId)) {
          set({
            wishlistItems: [
              ...get().wishlistItems,
              { id: crypto.randomUUID(), productId },
            ],
          });
        }
      },
      removeFromWishlist: (productId) =>
        set({
          wishlistItems: get().wishlistItems.filter(
            (i) => i.productId !== productId
          ),
        }),
      isInWishlist: (productId) =>
        get().wishlistItems.some((i) => i.productId === productId),
      
      cartOpen: false,
      setCartOpen: (open) => set({ cartOpen: open }),
      
      recentlyViewed: [],
      addToRecentlyViewed: (productId) => {
        const MAX_RECENTLY_VIEWED = 10;
        const existing = get().recentlyViewed.filter(
          (item) => item.productId !== productId
        );
        set({
          recentlyViewed: [
            { productId, viewedAt: Date.now() },
            ...existing,
          ].slice(0, MAX_RECENTLY_VIEWED),
        });
      },
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),
      
      compareItems: [],
      addToCompare: (productId) => {
        const MAX_COMPARE_ITEMS = 4;
        if (get().compareItems.length >= MAX_COMPARE_ITEMS) {
          return;
        }
        if (!get().compareItems.find((item) => item.productId === productId)) {
          set({
            compareItems: [...get().compareItems, { productId }],
          });
        }
      },
      removeFromCompare: (productId) =>
        set({
          compareItems: get().compareItems.filter(
            (item) => item.productId !== productId
          ),
        }),
      isInCompare: (productId) =>
        get().compareItems.some((item) => item.productId === productId),
      clearCompare: () => set({ compareItems: [] }),
    }),
    {
      name: "noreal-store",
      partialize: (state) => ({
        language: state.language,
        cartItems: state.cartItems,
        wishlistItems: state.wishlistItems,
        recentlyViewed: state.recentlyViewed,
        compareItems: state.compareItems,
      }),
    }
  )
);
