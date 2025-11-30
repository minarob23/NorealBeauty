import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { X, Scale, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { getProductImage } from "@/components/product-card";
import type { Product } from "@shared/schema";

export function CompareBar() {
  const { compareItems, removeFromCompare, clearCompare, language } = useAppStore();

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const compareProducts = compareItems
    .map((item) => allProducts.find((p) => p.id === item.productId))
    .filter((p): p is Product => p !== undefined);

  const labels = {
    en: {
      compare: "Compare",
      clearAll: "Clear All",
      selectMore: `Select ${4 - compareItems.length} more to compare`,
    },
    fr: {
      compare: "Comparer",
      clearAll: "Tout Effacer",
      selectMore: `Sélectionnez ${4 - compareItems.length} de plus pour comparer`,
    },
    es: {
      compare: "Comparar",
      clearAll: "Borrar Todo",
      selectMore: `Selecciona ${4 - compareItems.length} más para comparar`,
    },
  };

  const label = labels[language];

  if (compareItems.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  {compareItems.length}/4
                </span>
              </div>

              <div className="flex gap-2">
                {compareProducts.map((product, index) => {
                  const productIndex = allProducts.findIndex((p) => p.id === product.id);
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="relative"
                    >
                      <div className="h-12 w-12 overflow-hidden rounded-md border bg-muted">
                        <img
                          src={getProductImage(productIndex)}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground hover:bg-destructive/90"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.div>
                  );
                })}

                {Array.from({ length: 4 - compareItems.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/30"
                  >
                    <span className="text-xs text-muted-foreground">+</span>
                  </div>
                ))}
              </div>

              {compareItems.length < 2 && (
                <span className="text-sm text-muted-foreground">
                  {label.selectMore}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearCompare}>
                {label.clearAll}
              </Button>
              <Link href="/compare">
                <Button disabled={compareItems.length < 2}>
                  {label.compare}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
