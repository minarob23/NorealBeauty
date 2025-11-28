import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/hero";
import { FeaturedCategories } from "@/components/featured-categories";
import { BestSellers } from "@/components/best-sellers";
import { WhyNoreal } from "@/components/why-noreal";
import { RecentlyViewed } from "@/components/recently-viewed";
import { Footer } from "@/components/footer";
import type { Product } from "@shared/schema";

export default function Home() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />
      <FeaturedCategories />
      <BestSellers products={products} isLoading={isLoading} />
      <RecentlyViewed />
      <WhyNoreal />
      <Footer />
    </motion.div>
  );
}
