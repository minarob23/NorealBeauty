import { motion } from "framer-motion";
import { Link } from "wouter";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";

import productImage1 from "@assets/stock_images/luxury_skincare_prod_e5577988.jpg";
import productImage2 from "@assets/stock_images/luxury_skincare_prod_2130c720.jpg";
import productImage3 from "@assets/stock_images/luxury_skincare_prod_3ee0d53d.jpg";

const featuredCategories = [
  {
    id: "serums",
    image: productImage1,
  },
  {
    id: "moisturizers",
    image: productImage2,
  },
  {
    id: "cleansers",
    image: productImage3,
  },
];

export function FeaturedCategories() {
  const { language } = useAppStore();
  const t = getTranslations(language);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-serif text-3xl font-light md:text-4xl">
            Shop by Category
          </h2>
          <p className="mt-4 text-muted-foreground">
            Discover our curated collection of skincare essentials
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featuredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/shop?category=${category.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group relative aspect-[4/5] overflow-hidden rounded-md"
                >
                  <img
                    src={category.image}
                    alt={t.categories[category.id as keyof typeof t.categories]}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-serif text-2xl font-light text-white">
                      {t.categories[category.id as keyof typeof t.categories]}
                    </h3>
                    <span className="mt-2 inline-block border-b border-white/50 text-sm uppercase tracking-wider text-white/90 transition-colors group-hover:border-white group-hover:text-white">
                      Shop Now
                    </span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
