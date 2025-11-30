import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { getProductImage } from "@/components/product-card";

export function CartDrawer() {
  const {
    language,
    cartItems,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateCartQuantity,
  } = useAppStore();
  const t = getTranslations(language);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const cartProducts = cartItems.map((item, idx) => {
    const product = products.find((p) => p.id === item.productId);
    return { ...item, product, imageIndex: idx };
  });

  const subtotal = cartProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    const price = item.isSubscription
      ? item.product.price * 0.85
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="space-y-0">
          <SheetTitle className="flex items-center gap-2 font-serif text-xl">
            <ShoppingBag className="h-5 w-5" />
            {t.cart.title}
          </SheetTitle>
        </SheetHeader>

        {cartProducts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted"
            >
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </motion.div>
            <p className="mb-6 text-muted-foreground">{t.cart.empty}</p>
            <Button onClick={() => setCartOpen(false)} asChild>
              <Link href="/shop" data-testid="link-continue-shopping">
                {t.cart.continueShopping}
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <AnimatePresence mode="popLayout">
                {cartProducts.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="mb-4"
                  >
                    {item.product && (
                      <div className="flex gap-4">
                        <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          <img
                            src={
                              item.product.images[0] ||
                              getProductImage(item.imageIndex)
                            }
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-sm font-medium">
                                {item.product.name}
                              </h4>
                              {item.isSubscription && (
                                <Badge
                                  variant="secondary"
                                  className="mt-1 text-xs"
                                >
                                  {t.subscription[item.subscriptionFrequency || "monthly"]}
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeFromCart(item.id)}
                              data-testid={`button-remove-${item.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  updateCartQuantity(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                                data-testid={`button-decrease-${item.id}`}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span
                                className="w-8 text-center text-sm"
                                data-testid={`text-quantity-${item.id}`}
                              >
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  updateCartQuantity(item.id, item.quantity + 1)
                                }
                                data-testid={`button-increase-${item.id}`}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="font-medium">
                              $
                              {(
                                (item.isSubscription
                                  ? item.product.price * 0.85
                                  : item.product.price) * item.quantity
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    {index < cartProducts.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t pt-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-muted-foreground">{t.cart.subtotal}</span>
                <span className="text-xl font-medium" data-testid="text-subtotal">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="grid gap-2">
                <Button
                  className="w-full text-sm font-medium uppercase tracking-wider"
                  data-testid="button-checkout"
                  asChild
                >
                  <Link href="/checkout">
                    {t.cart.checkout}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-sm"
                  onClick={() => setCartOpen(false)}
                  asChild
                >
                  <Link href="/shop" data-testid="link-continue-shopping-bottom">
                    {t.cart.continueShopping}
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
