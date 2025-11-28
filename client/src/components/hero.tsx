import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import heroImage from "@assets/stock_images/beautiful_woman_appl_2fded0df.jpg";

export function Hero() {
  const { language } = useAppStore();
  const t = getTranslations(language);

  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury skincare"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-[80vh] items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.h1
              className="font-serif text-5xl font-light leading-tight text-white md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              data-testid="text-hero-title"
            >
              {t.hero.title}
            </motion.h1>

            <motion.p
              className="mt-6 text-lg font-light leading-relaxed text-white/90 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              data-testid="text-hero-subtitle"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/shop">
                <Button
                  size="lg"
                  className="bg-white/90 text-sm font-medium uppercase tracking-wider text-gray-900 backdrop-blur-md hover:bg-white hover:text-gray-900"
                  data-testid="button-shop-now"
                >
                  {t.hero.shopNow}
                </Button>
              </Link>
              <Link href="/shop">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-sm font-medium uppercase tracking-wider text-white backdrop-blur-md hover:bg-white/20"
                  data-testid="button-explore"
                >
                  {t.hero.exploreCollection}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="h-10 w-6 rounded-full border-2 border-white/40">
          <div className="mx-auto mt-2 h-2 w-1 rounded-full bg-white/60" />
        </div>
      </motion.div>
    </section>
  );
}
