import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Heart, ShoppingBag, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Footer } from "@/components/footer";
import { SocialShare } from "@/components/social-share";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";
import { getProductImage } from "@/components/product-card";

export default function Wishlist() {
  const {
    language,
    wishlistItems,
    removeFromWishlist,
    addToCart,
  } = useAppStore();
  const t = getTranslations(language);
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const wishlistProducts = wishlistItems
    .map((item, idx) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...product, wishlistId: item.id, imageIndex: idx } : null;
    })
    .filter(Boolean) as (Product & { wishlistId: string; imageIndex: number })[];

  const handleMoveToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      quantity: 1,
      isSubscription: false,
    });
    removeFromWishlist(product.id);
    toast({
      title: "Added to cart",
      description: `${product.name} has been moved to your cart.`,
    });
  };

  const handleRemove = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    toast({
      description: `${productName} removed from wishlist`,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="mb-8 h-12 w-48" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[4/5] w-full rounded-md" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto min-h-[60vh] px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <h1 className="font-serif text-4xl font-light">{t.wishlist.title}</h1>
            <p className="mt-2 text-muted-foreground">
              {wishlistProducts.length} item{wishlistProducts.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          {wishlistProducts.length > 0 && (
            <SocialShare
              title="Check out my NORÉAL wishlist!"
              description="My favorite skincare products from NORÉAL"
            />
          )}
        </motion.div>

        <AnimatePresence mode="popLayout">
          {wishlistProducts.length > 0 ? (
            <motion.div
              layout
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {wishlistProducts.map((product, index) => (
                <motion.div
                  key={product.wishlistId}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group overflow-hidden">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Link href={`/product/${product.id}`}>
                        <img
                          src={product.images[0] || getProductImage(product.imageIndex)}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 bg-white/90 text-red-500 backdrop-blur-sm hover:bg-white"
                        onClick={() => handleRemove(product.id, product.name)}
                        data-testid={`button-remove-wishlist-${product.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-medium transition-colors hover:text-primary">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="mt-1 text-lg font-medium">
                        ${product.price.toFixed(2)}
                      </p>
                      <Button
                        className="mt-4 w-full"
                        onClick={() => handleMoveToCart(product)}
                        disabled={!product.inStock}
                        data-testid={`button-move-to-cart-${product.id}`}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        {product.inStock
                          ? t.wishlist.moveToCart
                          : t.product.outOfStock}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <Heart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-medium">{t.wishlist.empty}</h2>
              <p className="mt-2 text-muted-foreground">
                Start adding products you love to your wishlist
              </p>
              <Link href="/shop">
                <Button className="mt-6" data-testid="button-start-shopping">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Start Shopping
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </motion.div>
  );
}
