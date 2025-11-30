import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight, X, Star, Check, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import { getProductImage } from "@/components/product-card";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function Compare() {
  const { compareItems, removeFromCompare, clearCompare, language, addToCart } =
    useAppStore();
  const t = getTranslations(language);
  const { toast } = useToast();

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const compareProducts = compareItems
    .map((item) => allProducts.find((p) => p.id === item.productId))
    .filter((p): p is Product => p !== undefined);

  const labels = {
    en: {
      title: "Compare Products",
      empty: "No products to compare",
      addProducts: "Add products to compare",
      browseProducts: "Browse Products",
      price: "Price",
      rating: "Rating",
      reviews: "Reviews",
      category: "Category",
      skinType: "Skin Type",
      ingredients: "Key Ingredients",
      inStock: "Availability",
      available: "In Stock",
      outOfStock: "Out of Stock",
      clear: "Clear All",
    },
    fr: {
      title: "Comparer les Produits",
      empty: "Aucun produit à comparer",
      addProducts: "Ajoutez des produits pour comparer",
      browseProducts: "Parcourir les Produits",
      price: "Prix",
      rating: "Note",
      reviews: "Avis",
      category: "Catégorie",
      skinType: "Type de Peau",
      ingredients: "Ingrédients Clés",
      inStock: "Disponibilité",
      available: "En Stock",
      outOfStock: "Rupture",
      clear: "Tout Effacer",
    },
    es: {
      title: "Comparar Productos",
      empty: "No hay productos para comparar",
      addProducts: "Añade productos para comparar",
      browseProducts: "Ver Productos",
      price: "Precio",
      rating: "Calificación",
      reviews: "Reseñas",
      category: "Categoría",
      skinType: "Tipo de Piel",
      ingredients: "Ingredientes Clave",
      inStock: "Disponibilidad",
      available: "Disponible",
      outOfStock: "Agotado",
      clear: "Borrar Todo",
    },
  };

  const label = labels[language];

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      quantity: 1,
      isSubscription: false,
    });
    toast({
      title: language === "en" ? "Added to cart" : language === "fr" ? "Ajouté au panier" : "Añadido al carrito",
      description: `${product.name}`,
    });
  };

  if (compareProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
          <h1 className="mb-4 font-serif text-3xl font-light">{label.empty}</h1>
          <p className="mb-8 text-muted-foreground">{label.addProducts}</p>
          <Link href="/shop">
            <Button>{label.browseProducts}</Button>
          </Link>
        </div>
        <Footer />
      </motion.div>
    );
  }

  const comparisonRows = [
    {
      label: label.price,
      render: (product: Product) => (
        <span className="text-lg font-medium">${product.price.toFixed(2)}</span>
      ),
    },
    {
      label: label.rating,
      render: (product: Product) => (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= Math.round(product.rating)
                  ? "fill-gold text-gold"
                  : "fill-muted text-muted"
              }`}
            />
          ))}
          <span className="ml-1 text-sm text-muted-foreground">
            {product.rating.toFixed(1)}
          </span>
        </div>
      ),
    },
    {
      label: label.reviews,
      render: (product: Product) => (
        <span>{product.reviewCount} {t.product.reviews.toLowerCase()}</span>
      ),
    },
    {
      label: label.category,
      render: (product: Product) => (
        <Badge variant="secondary">
          {t.categories[product.category as keyof typeof t.categories]}
        </Badge>
      ),
    },
    {
      label: label.skinType,
      render: (product: Product) => (
        <span className="capitalize">
          {t.filters[product.skinType as keyof typeof t.filters] || product.skinType}
        </span>
      ),
    },
    {
      label: label.ingredients,
      render: (product: Product) => (
        <div className="flex flex-wrap gap-1">
          {product.ingredients.slice(0, 3).map((ing) => (
            <Badge key={ing} variant="outline" className="text-xs">
              {ing}
            </Badge>
          ))}
          {product.ingredients.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{product.ingredients.length - 3}
            </Badge>
          )}
        </div>
      ),
    },
    {
      label: label.inStock,
      render: (product: Product) =>
        product.inStock ? (
          <div className="flex items-center gap-1 text-green-600">
            <Check className="h-4 w-4" />
            {label.available}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-red-500">
            <Minus className="h-4 w-4" />
            {label.outOfStock}
          </div>
        ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/">
            <span className="hover:text-foreground transition-colors">{t.nav.home}</span>
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{label.title}</span>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl font-light tracking-wide"
          >
            {label.title}
          </motion.h1>
          <Button variant="outline" onClick={clearCompare}>
            {label.clear}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr>
                <th className="w-48 p-4 text-left"></th>
                {compareProducts.map((product) => {
                  const productIndex = allProducts.findIndex((p) => p.id === product.id);
                  return (
                    <th key={product.id} className="min-w-[200px] p-4 text-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative"
                      >
                        <button
                          onClick={() => removeFromCompare(product.id)}
                          className="absolute -right-2 -top-2 rounded-full bg-muted p-1 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <Link href={`/product/${product.id}`}>
                          <div className="group cursor-pointer">
                            <div className="mx-auto mb-4 aspect-square w-40 overflow-hidden rounded-lg bg-muted">
                              <img
                                src={getProductImage(productIndex)}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              />
                            </div>
                            <h3 className="font-serif text-lg font-medium group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                          </div>
                        </Link>
                        <Button
                          className="mt-4 w-full"
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          {t.product.addToCart}
                        </Button>
                      </motion.div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, index) => (
                <motion.tr
                  key={row.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t"
                >
                  <td className="p-4 font-medium text-muted-foreground">
                    {row.label}
                  </td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      {row.render(product)}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
