import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import type { Product, Category, SkinType } from "@shared/schema";
import { categories, skinTypes } from "@shared/schema";

type SortOption = "featured" | "price-low" | "price-high" | "rating" | "newest";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  initialCategory?: Category | "all";
}

export function ProductGrid({
  products,
  isLoading = false,
  initialCategory = "all",
}: ProductGridProps) {
  const { language } = useAppStore();
  const t = getTranslations(language);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    initialCategory
  );
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.ingredients.some((i) => i.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedSkinType !== "all") {
      result = result.filter(
        (p) => p.skinType === selectedSkinType || p.skinType === "all"
      );
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "featured":
      default:
        result.sort(
          (a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)
        );
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedSkinType, sortBy]);

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedSkinType !== "all" ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedSkinType("all");
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[4/5] w-full rounded-md" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t.nav.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-product-search"
            />
          </div>

          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="relative lg:hidden"
                data-testid="button-filters"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2">{activeFiltersCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t.filters.skinType}
                  </label>
                  <Select
                    value={selectedSkinType}
                    onValueChange={(v) => setSelectedSkinType(v as SkinType | "all")}
                  >
                    <SelectTrigger data-testid="select-skin-type-mobile">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.filters.all}</SelectItem>
                      {skinTypes.filter(st => st !== "all").map((type) => (
                        <SelectItem key={type} value={type}>
                          {t.filters[type as keyof typeof t.filters]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                  data-testid="button-clear-filters-mobile"
                >
                  Clear Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <Select
            value={selectedSkinType}
            onValueChange={(v) => setSelectedSkinType(v as SkinType | "all")}
          >
            <SelectTrigger className="w-40" data-testid="select-skin-type">
              <SelectValue placeholder={t.filters.skinType} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.filters.all}</SelectItem>
              {skinTypes.filter(st => st !== "all").map((type) => (
                <SelectItem key={type} value={type}>
                  {t.filters[type as keyof typeof t.filters]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-48" data-testid="select-sort">
              <SelectValue placeholder={t.filters.sortBy} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">{t.filters.featured}</SelectItem>
              <SelectItem value="price-low">{t.filters.priceLowHigh}</SelectItem>
              <SelectItem value="price-high">{t.filters.priceHighLow}</SelectItem>
              <SelectItem value="rating">{t.filters.rating}</SelectItem>
              <SelectItem value="newest">{t.filters.newest}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setSelectedCategory(selectedCategory === cat ? "all" : cat)
            }
            className="text-xs font-medium uppercase tracking-wider"
            data-testid={`button-category-${cat}`}
          >
            {t.categories[cat as keyof typeof t.categories]}
          </Button>
        ))}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-muted-foreground"
            data-testid="button-clear-all"
          >
            <X className="mr-1 h-3 w-3" />
            Clear All
          </Button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-4"
              data-testid="button-clear-empty"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center text-sm text-muted-foreground">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
}
