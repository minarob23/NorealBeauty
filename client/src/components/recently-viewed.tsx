import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Clock, X } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import type { Product } from "@shared/schema";

export function RecentlyViewed() {
  const { language, recentlyViewed, clearRecentlyViewed } = useAppStore();
  const t = getTranslations(language);

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const recentProducts = recentlyViewed
    .map((item) => allProducts.find((p) => p.id === item.productId))
    .filter((p): p is Product => p !== undefined);

  if (recentProducts.length === 0) {
    return null;
  }

  const labels = {
    en: {
      title: "Recently Viewed",
      clear: "Clear All",
    },
    fr: {
      title: "Récemment Consultés",
      clear: "Tout Effacer",
    },
    es: {
      title: "Vistos Recientemente",
      clear: "Borrar Todo",
    },
  };

  const label = labels[language];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-muted-foreground" />
            <h2 className="font-serif text-2xl font-light md:text-3xl">
              {label.title}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearRecentlyViewed}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 h-4 w-4" />
            {label.clear}
          </Button>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {recentProducts.slice(0, 5).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
