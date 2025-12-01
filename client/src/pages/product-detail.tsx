import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard, getProductImage } from "@/components/product-card";
import { ReviewsSection } from "@/components/reviews-section";
import { SocialShare } from "@/components/social-share";
import { Footer } from "@/components/footer";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product, Review, InsertReview } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { language, addToCart, addToWishlist, removeFromWishlist, isInWishlist, addToRecentlyViewed } =
    useAppStore();
  
  useEffect(() => {
    if (id) {
      addToRecentlyViewed(id);
    }
  }, [id, addToRecentlyViewed]);
  const t = getTranslations(language);
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/products", id, "reviews"],
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const reviewMutation = useMutation({
    mutationFn: async (data: Omit<InsertReview, "productId">) =>
      apiRequest("POST", `/api/products/${id}/reviews`, { ...data, productId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products", id, "reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products", id] });
    },
  });

  const inWishlist = product ? isInWishlist(product.id) : false;

  const relatedProducts = allProducts
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        productId: product.id,
        quantity,
        isSubscription: false,
      });
      toast({
        title: "Added to cart",
        description: `${quantity}x ${product.name} added to your cart.`,
      });
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      if (inWishlist) {
        removeFromWishlist(product.id);
        toast({ description: "Removed from wishlist" });
      } else {
        addToWishlist(product.id);
        toast({ description: "Added to wishlist" });
      }
    }
  };

  if (productLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-md" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-md" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-12">
        <h1 className="text-2xl font-medium">Product not found</h1>
        <Link href="/shop">
          <Button className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const productIndex = allProducts.findIndex((p) => p.id === product.id);
  const mainImage = product.images[selectedImage] || getProductImage(productIndex);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-8">
        <Link href="/shop">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1fr,400px]">
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square overflow-hidden rounded-md bg-muted"
            >
              <img
                src={mainImage}
                alt={product.name}
                className="h-full w-full object-cover"
                data-testid="img-product-main"
              />
              {product.isBestSeller && (
                <Badge className="absolute left-4 top-4 bg-gold text-white">
                  {t.product.bestSeller}
                </Badge>
              )}
              {product.isNew && (
                <Badge variant="secondary" className="absolute left-4 top-12">
                  {t.product.new}
                </Badge>
              )}
            </motion.div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {[0, 1, 2, 3].map((index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md ${
                    selectedImage === index
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                  }`}
                >
                  <img
                    src={getProductImage(productIndex + index)}
                    alt={`${product.name} view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {t.categories[product.category as keyof typeof t.categories]}
              </p>
              <h1
                className="mt-2 font-serif text-3xl font-light md:text-4xl"
                data-testid="text-product-name"
              >
                {product.name}
              </h1>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(product.rating)
                          ? "fill-gold text-gold"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {product.rating.toFixed(1)} ({product.reviewCount}{" "}
                  {t.product.reviews.toLowerCase()})
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span
                className="text-3xl font-medium"
                data-testid="text-product-price"
              >
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">
                or ${(product.price * 0.85).toFixed(2)} with subscription
              </span>
            </div>

            <p className="text-muted-foreground">{product.shortDescription}</p>

            <Card className="bg-muted/30">
              <CardContent className="flex items-center gap-3 p-4">
                <Repeat className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{t.product.subscribe}</p>
                  <p className="text-sm text-muted-foreground">
                    {t.product.subscribeDiscount}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  data-testid="button-decrease-quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span
                  className="w-12 text-center text-lg font-medium"
                  data-testid="text-quantity"
                >
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  data-testid="button-increase-quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                data-testid="button-add-to-cart"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {product.inStock ? t.product.addToCart : t.product.outOfStock}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleWishlistToggle}
                className={inWishlist ? "text-red-500" : ""}
                data-testid="button-wishlist-toggle"
              >
                <Heart
                  className="h-4 w-4"
                  fill={inWishlist ? "currentColor" : "none"}
                />
              </Button>
              <SocialShare
                title={product.name}
                description={product.shortDescription}
              />
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Free shipping on orders over $50
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                30-day money-back guarantee
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Cruelty-free & vegan
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b bg-transparent">
              <TabsTrigger
                value="description"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                {t.product.description}
              </TabsTrigger>
              <TabsTrigger
                value="ingredients"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                {t.product.ingredients}
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                {t.product.reviews} ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p>{product.description}</p>
                <h4>{t.product.howToUse}</h4>
                <ol>
                  <li>Cleanse your face thoroughly and pat dry.</li>
                  <li>Apply a small amount to your fingertips.</li>
                  <li>Gently massage onto face and neck in upward motions.</li>
                  <li>Use morning and evening for best results.</li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-6">
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient) => (
                  <Badge key={ingredient} variant="secondary">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ReviewsSection
                productId={product.id}
                reviews={reviews}
                onSubmitReview={(data) =>
                  reviewMutation.mutate({
                    ...data,
                    productId: product.id,
                  })
                }
                isSubmitting={reviewMutation.isPending}
              />
            </TabsContent>
          </Tabs>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 font-serif text-2xl font-light">
              You May Also Like
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </motion.div>
  );
}
