import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import type { Product } from "@shared/schema";

interface BestSellersProps {
  products: Product[];
  isLoading?: boolean;
}

export function BestSellers({ products, isLoading }: BestSellersProps) {
  const { language } = useAppStore();
  const t = getTranslations(language);

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/5] w-full rounded-md" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (bestSellers.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <h2 className="font-serif text-3xl font-light md:text-4xl">
              Best Sellers
            </h2>
            <p className="mt-2 text-muted-foreground">
              Our most-loved products, chosen by you
            </p>
          </div>
          <Link href="/shop">
            <Button variant="outline" className="group">
              Shop All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
