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

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-4 max-w-2xl mx-auto lg:mx-0">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-xl border-2 border-gray-200 dark:border-gray-700"
            >
              <img
                src={mainImage}
                alt={product.name}
                className="h-full w-full object-cover"
                data-testid="img-product-main"
              />
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {product.isBestSeller && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg px-3 py-1">
                    ⭐ {t.product.bestSeller}
                  </Badge>
                )}
                {product.isNew && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg px-3 py-1">
                    ✨ {t.product.new}
                  </Badge>
                )}
              </div>
            </motion.div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {[0, 1, 2, 3].map((index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    selectedImage === index
                      ? "ring-4 ring-purple-500 ring-offset-2 border-purple-500 shadow-lg"
                      : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
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
            <div className="space-y-4">
              <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700 px-3 py-1">
                {t.categories[product.category as keyof typeof t.categories]}
              </Badge>
              <h1
                className="font-serif text-4xl font-semibold md:text-5xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
                data-testid="text-product-name"
              >
                {product.name}
              </h1>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 ${
                        star <= Math.round(product.rating)
                          ? "fill-amber-500 text-amber-500"
                          : "fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-amber-900 dark:text-amber-100">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-amber-700 dark:text-amber-300">
                  ({product.reviewCount} {t.product.reviews.toLowerCase()})
                </span>
              </div>
            </div>

            <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
              <CardContent className="p-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span
                    className="text-4xl font-bold text-purple-600 dark:text-purple-400"
                    data-testid="text-product-price"
                  >
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                  💰 Save 15%: ${(product.price * 0.85).toFixed(2)} with subscription
                </p>
              </CardContent>
            </Card>

            <p className="text-base leading-relaxed text-foreground/80">{product.shortDescription}</p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <span className="text-sm font-semibold text-muted-foreground">Quantity:</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-lg"
                    data-testid="button-decrease-quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span
                    className="w-16 text-center text-xl font-bold"
                    data-testid="text-quantity"
                  >
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 rounded-lg"
                    data-testid="button-increase-quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                data-testid="button-add-to-cart"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {product.inStock ? t.product.addToCart : t.product.outOfStock}
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handleWishlistToggle}
                className={`h-12 w-12 rounded-xl border-2 ${inWishlist ? "text-red-500 border-red-500 bg-red-50 dark:bg-red-950/20" : "border-gray-300 dark:border-gray-700"}`}
                data-testid="button-wishlist-toggle"
              >
                <Heart
                  className="h-5 w-5"
                  fill={inWishlist ? "currentColor" : "none"}
                />
              </Button>
              <SocialShare
                title={product.name}
                description={product.shortDescription}
              />
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-green-900 dark:text-green-100">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Cruelty-free & vegan</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b-2 bg-transparent h-auto p-0 gap-8">
              <TabsTrigger
                value="description"
                className="text-lg font-semibold pb-4 px-2 rounded-none border-b-4 border-transparent data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-transparent hover:text-purple-500 transition-all"
              >
                📝 {t.product.description}
              </TabsTrigger>
              <TabsTrigger
                value="ingredients"
                className="text-lg font-semibold pb-4 px-2 rounded-none border-b-4 border-transparent data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-transparent hover:text-purple-500 transition-all"
              >
                🧪 {t.product.ingredients}
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="text-lg font-semibold pb-4 px-2 rounded-none border-b-4 border-transparent data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-transparent hover:text-purple-500 transition-all"
              >
                ⭐ {t.product.reviews} ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-8">
              <Card className="border-2 border-purple-100 dark:border-purple-900/30">
                <CardContent className="p-10">
                  <div className="prose prose-xl max-w-none dark:prose-invert">
                    <p className="text-xl leading-relaxed text-foreground/90 mb-8">{product.description}</p>
                    <h3 className="text-3xl font-bold mt-10 mb-6 text-purple-600 dark:text-purple-400">{t.product.howToUse}</h3>
                    <ol className="space-y-4">
                      <li className="text-lg leading-relaxed pl-2">Cleanse your face thoroughly and pat dry.</li>
                      <li className="text-lg leading-relaxed pl-2">Apply a small amount to your fingertips.</li>
                      <li className="text-lg leading-relaxed pl-2">Gently massage onto face and neck in upward motions.</li>
                      <li className="text-lg leading-relaxed pl-2">Use morning and evening for best results.</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-8">
              <Card className="border-2 border-purple-100 dark:border-purple-900/30">
                <CardContent className="p-10">
                  <h3 className="text-3xl font-bold mb-8 text-purple-600 dark:text-purple-400">Active Ingredients</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {product.ingredients.map((ingredient, index) => (
                      <div
                        key={ingredient}
                        className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow"
                      >
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="font-bold text-lg text-foreground">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
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
