import { motion } from "framer-motion";
import { Link } from "wouter";
import { Heart, ShoppingBag, Star, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

import productImage1 from "@assets/stock_images/luxury_skincare_prod_e5577988.jpg";
import productImage2 from "@assets/stock_images/luxury_skincare_prod_2130c720.jpg";
import productImage3 from "@assets/stock_images/luxury_skincare_prod_3ee0d53d.jpg";
import productImage4 from "@assets/stock_images/luxury_skincare_prod_293e5415.jpg";
import productImage5 from "@assets/stock_images/luxury_skincare_prod_0d009f2b.jpg";
import productImage6 from "@assets/stock_images/luxury_skincare_prod_73c26408.jpg";

const productImages = [
  productImage1,
  productImage2,
  productImage3,
  productImage4,
  productImage5,
  productImage6,
];

export function getProductImage(index: number): string {
  return productImages[index % productImages.length];
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { language, addToCart, addToWishlist, removeFromWishlist, isInWishlist, addToCompare, removeFromCompare, isInCompare, compareItems } =
    useAppStore();
  const t = getTranslations(language);
  const { toast } = useToast();

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const imageUrl = product.images[0] || getProductImage(index);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      quantity: 1,
      isSubscription: false,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      if (compareItems.length >= 4) {
        toast({
          description: language === "en" ? "You can compare up to 4 products" : language === "fr" ? "Vous pouvez comparer jusqu'à 4 produits" : "Puedes comparar hasta 4 productos",
          variant: "destructive",
        });
        return;
      }
      addToCompare(product.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/product/${product.id}`}>
        <Card className="overflow-hidden border-0 bg-transparent shadow-none transition-shadow duration-300 hover:shadow-lg">
          <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              data-testid={`img-product-${product.id}`}
            />

            <div className="absolute right-3 top-3 flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlistToggle}
                className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors ${
                  inWishlist ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                }`}
                data-testid={`button-wishlist-${product.id}`}
              >
                <Heart
                  className="h-4 w-4"
                  fill={inWishlist ? "currentColor" : "none"}
                />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCompareToggle}
                className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors ${
                  inCompare ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"
                }`}
                data-testid={`button-compare-${product.id}`}
              >
                <Scale className="h-4 w-4" />
              </motion.button>
            </div>

            <div className="absolute left-3 top-3 flex flex-col gap-2">
              {product.isBestSeller && (
                <Badge className="bg-gold text-white" data-testid={`badge-bestseller-${product.id}`}>
                  {t.product.bestSeller}
                </Badge>
              )}
              {product.isNew && (
                <Badge variant="secondary" data-testid={`badge-new-${product.id}`}>
                  {t.product.new}
                </Badge>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-white text-sm font-medium uppercase tracking-wider text-foreground hover:bg-white/90"
                data-testid={`button-add-to-cart-${product.id}`}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {product.inStock ? t.product.addToCart : t.product.outOfStock}
              </Button>
            </motion.div>
          </div>

          <CardContent className="px-0 pt-4">
            <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t.categories[product.category as keyof typeof t.categories]}
            </div>
            <h3
              className="font-medium text-foreground"
              data-testid={`text-product-name-${product.id}`}
            >
              {product.name}
            </h3>
            <div className="mt-2 flex items-center justify-between">
              <span
                className="text-lg font-medium text-foreground"
                data-testid={`text-product-price-${product.id}`}
              >
                ${product.price.toFixed(2)}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-gold text-gold" />
                <span className="text-sm text-muted-foreground">
                  {product.rating.toFixed(1)} ({product.reviewCount})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
