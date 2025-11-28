import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { ProductGrid } from "@/components/product-grid";
import { Footer } from "@/components/footer";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import type { Product, Category } from "@shared/schema";

export default function Shop() {
  const { language } = useAppStore();
  const t = getTranslations(language);
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialCategory = (searchParams.get("category") as Category) || "all";

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="font-serif text-4xl font-light md:text-5xl">
            {t.nav.shop}
          </h1>
          <p className="mt-4 text-muted-foreground">
            Explore our complete collection of luxury skincare products
          </p>
        </motion.div>

        <ProductGrid
          products={products}
          isLoading={isLoading}
          initialCategory={initialCategory}
        />
      </div>
      <Footer />
    </motion.div>
  );
}
