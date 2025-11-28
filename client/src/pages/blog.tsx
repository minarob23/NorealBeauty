import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Clock, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";

import heroImage from "@assets/stock_images/beautiful_woman_appl_2fded0df.jpg";
import productImage1 from "@assets/stock_images/luxury_skincare_prod_e5577988.jpg";
import productImage2 from "@assets/stock_images/luxury_skincare_prod_2130c720.jpg";
import productImage3 from "@assets/stock_images/luxury_skincare_prod_3ee0d53d.jpg";
import productImage4 from "@assets/stock_images/luxury_skincare_prod_293e5415.jpg";
import productImage5 from "@assets/stock_images/luxury_skincare_prod_0d009f2b.jpg";
import productImage6 from "@assets/stock_images/luxury_skincare_prod_73c26408.jpg";

const blogImages = [heroImage, productImage1, productImage2, productImage3, productImage4, productImage5, productImage6];

export const blogPosts = {
  en: [
    {
      id: "1",
      title: "The Ultimate Guide to Building a Skincare Routine",
      excerpt: "Discover the essential steps to create a personalized skincare routine that works for your unique skin type and concerns.",
      content: `Building an effective skincare routine doesn't have to be complicated. The key is understanding your skin type and choosing products that address your specific concerns.

**Step 1: Cleanse**
Start with a gentle cleanser that removes dirt and makeup without stripping your skin's natural oils. For oily skin, consider a gel-based cleanser. For dry skin, opt for a creamy or milk cleanser.

**Step 2: Tone**
Toners help balance your skin's pH and prepare it for the next steps. Look for alcohol-free formulas with hydrating ingredients like hyaluronic acid or rose water.

**Step 3: Treat**
This is where serums come in. Whether you're targeting fine lines, dark spots, or hydration, there's a serum for every concern. Apply from thinnest to thickest consistency.

**Step 4: Moisturize**
Lock in all that goodness with a moisturizer suited to your skin type. Even oily skin needs hydration!

**Step 5: Protect**
Never skip sunscreen during the day. UV protection is the most effective anti-aging step you can take.`,
      author: "Dr. Sarah Chen",
      date: "2025-01-15",
      category: "Tutorials",
      readTime: "8 min read",
      featured: true,
    },
    {
      id: "2",
      title: "Understanding Hyaluronic Acid: The Hydration Hero",
      excerpt: "Learn why hyaluronic acid is the star ingredient in hydrating skincare and how to incorporate it into your routine.",
      content: `Hyaluronic acid (HA) has become one of the most sought-after ingredients in skincare, and for good reason. This powerful humectant can hold up to 1000 times its weight in water, making it an incredible hydrating agent.

**What is Hyaluronic Acid?**
Despite its name, hyaluronic acid isn't harsh at all. It's a naturally occurring substance in our bodies that helps retain moisture in our skin and joints.

**Benefits for Your Skin**
- Intense hydration without heaviness
- Plumps fine lines and wrinkles
- Suitable for all skin types
- Helps other products absorb better

**How to Use It**
Apply HA serums to damp skin for maximum absorption. Follow with a moisturizer to seal in the hydration.

**Tips for Best Results**
- Look for products with multiple molecular weights
- Apply to slightly damp skin
- Layer under your moisturizer
- Use both morning and night`,
      author: "Emma Rodriguez",
      date: "2025-01-10",
      category: "Ingredients",
      readTime: "5 min read",
      featured: false,
    },
    {
      id: "3",
      title: "Winter Skincare: Protecting Your Skin in Cold Weather",
      excerpt: "Cold weather can wreak havoc on your skin. Here's how to adjust your routine for the winter months.",
      content: `As temperatures drop, your skin faces new challenges. Cold air outside and heated air inside can leave your skin feeling dry, tight, and uncomfortable.

**Switch to Richer Products**
- Replace gel moisturizers with cream formulas
- Add facial oils for extra nourishment
- Use gentle, hydrating cleansers

**Don't Forget Sunscreen**
UV rays are still present in winter. Snow can even reflect UV rays, increasing exposure.

**Humidify Your Space**
Indoor heating strips moisture from the air. A humidifier can help maintain skin hydration.

**Protect Your Lips and Hands**
These areas are often neglected but need extra care in winter. Use nourishing balms and hand creams regularly.`,
      author: "Dr. Sarah Chen",
      date: "2025-01-05",
      category: "Tips",
      readTime: "6 min read",
      featured: true,
    },
    {
      id: "4",
      title: "The Power of Vitamin C in Your Skincare",
      excerpt: "Discover why vitamin C is essential for bright, healthy skin and how to choose the right product.",
      content: `Vitamin C is a powerhouse antioxidant that offers multiple benefits for your skin. From brightening to anti-aging, this ingredient deserves a spot in your routine.

**Benefits of Vitamin C**
- Brightens dull skin
- Fades dark spots and hyperpigmentation
- Boosts collagen production
- Protects against environmental damage

**Types of Vitamin C**
- L-Ascorbic Acid: Most potent but least stable
- Ascorbyl Palmitate: Oil-soluble and stable
- Magnesium Ascorbyl Phosphate: Gentle and stable

**How to Use It**
Apply in the morning before sunscreen for antioxidant protection throughout the day.`,
      author: "Dr. Michael Park",
      date: "2024-12-28",
      category: "Ingredients",
      readTime: "7 min read",
      featured: false,
    },
    {
      id: "5",
      title: "Double Cleansing: Is It Right for You?",
      excerpt: "Everything you need to know about the double cleansing method and whether it's suitable for your skin.",
      content: `Double cleansing has been a cornerstone of Korean skincare for years. But is it right for everyone?

**What is Double Cleansing?**
It involves using two types of cleansers: an oil-based cleanser first to break down makeup and sunscreen, followed by a water-based cleanser to remove remaining impurities.

**Who Should Double Cleanse?**
- Those who wear makeup
- Anyone using sunscreen (which should be everyone!)
- People with oily skin
- Those exposed to pollution

**Who Might Want to Skip It?**
- If you have very dry or sensitive skin
- If you don't wear makeup or sunscreen
- If your skin feels stripped after cleansing`,
      author: "Emma Rodriguez",
      date: "2024-12-20",
      category: "Tutorials",
      readTime: "5 min read",
      featured: false,
    },
    {
      id: "6",
      title: "Retinol 101: A Beginner's Guide",
      excerpt: "New to retinol? Learn how to introduce this powerful anti-aging ingredient into your routine safely.",
      content: `Retinol is one of the most researched and effective anti-aging ingredients available. But with great power comes the need for careful use.

**What is Retinol?**
Retinol is a form of vitamin A that promotes cell turnover and collagen production.

**Benefits**
- Reduces fine lines and wrinkles
- Improves skin texture
- Fades dark spots
- Minimizes pores

**How to Start**
- Begin with a low concentration (0.25-0.5%)
- Use only 2-3 times per week initially
- Always apply at night
- Use sunscreen religiously

**Managing Side Effects**
Some irritation is normal when starting. Keep skin hydrated and reduce frequency if needed.`,
      author: "Dr. Sarah Chen",
      date: "2024-12-15",
      category: "Ingredients",
      readTime: "8 min read",
      featured: false,
    },
  ],
  fr: [
    {
      id: "1",
      title: "Le Guide Ultime pour Construire une Routine de Soins",
      excerpt: "Découvrez les étapes essentielles pour créer une routine de soins personnalisée adaptée à votre type de peau.",
      content: `Construire une routine de soins efficace n'a pas besoin d'être compliqué...`,
      author: "Dr. Sarah Chen",
      date: "2025-01-15",
      category: "Tutoriels",
      readTime: "8 min",
      featured: true,
    },
    {
      id: "2",
      title: "Comprendre l'Acide Hyaluronique: Le Héros de l'Hydratation",
      excerpt: "Apprenez pourquoi l'acide hyaluronique est l'ingrédient star des soins hydratants.",
      content: `L'acide hyaluronique est devenu l'un des ingrédients les plus recherchés...`,
      author: "Emma Rodriguez",
      date: "2025-01-10",
      category: "Ingrédients",
      readTime: "5 min",
      featured: false,
    },
    {
      id: "3",
      title: "Soins d'Hiver: Protéger Votre Peau par Temps Froid",
      excerpt: "Le temps froid peut endommager votre peau. Voici comment adapter votre routine.",
      content: `Quand les températures baissent, votre peau fait face à de nouveaux défis...`,
      author: "Dr. Sarah Chen",
      date: "2025-01-05",
      category: "Conseils",
      readTime: "6 min",
      featured: true,
    },
  ],
  es: [
    {
      id: "1",
      title: "La Guía Definitiva para Crear una Rutina de Cuidado de la Piel",
      excerpt: "Descubre los pasos esenciales para crear una rutina personalizada para tu tipo de piel.",
      content: `Construir una rutina de cuidado efectiva no tiene que ser complicado...`,
      author: "Dr. Sarah Chen",
      date: "2025-01-15",
      category: "Tutoriales",
      readTime: "8 min",
      featured: true,
    },
    {
      id: "2",
      title: "Entendiendo el Ácido Hialurónico: El Héroe de la Hidratación",
      excerpt: "Aprende por qué el ácido hialurónico es el ingrediente estrella del cuidado hidratante.",
      content: `El ácido hialurónico se ha convertido en uno de los ingredientes más buscados...`,
      author: "Emma Rodriguez",
      date: "2025-01-10",
      category: "Ingredientes",
      readTime: "5 min",
      featured: false,
    },
    {
      id: "3",
      title: "Cuidado de Invierno: Protege Tu Piel del Frío",
      excerpt: "El clima frío puede dañar tu piel. Aquí te explicamos cómo adaptar tu rutina.",
      content: `Cuando las temperaturas bajan, tu piel enfrenta nuevos desafíos...`,
      author: "Dr. Sarah Chen",
      date: "2025-01-05",
      category: "Consejos",
      readTime: "6 min",
      featured: true,
    },
  ],
};

const categories = {
  en: ["All", "Tutorials", "Ingredients", "Tips"],
  fr: ["Tous", "Tutoriels", "Ingrédients", "Conseils"],
  es: ["Todos", "Tutoriales", "Ingredientes", "Consejos"],
};

export default function Blog() {
  const { language } = useAppStore();
  const t = getTranslations(language);
  
  const posts = blogPosts[language];
  const cats = categories[language];
  const featuredPost = posts.find((p) => p.featured);

  const labels = {
    en: {
      title: "Beauty Blog",
      subtitle: "Skincare tips, tutorials, and ingredient spotlights",
      readMore: "Read More",
      featured: "Featured",
    },
    fr: {
      title: "Blog Beauté",
      subtitle: "Conseils de soins, tutoriels et ingrédients à découvrir",
      readMore: "Lire Plus",
      featured: "En Vedette",
    },
    es: {
      title: "Blog de Belleza",
      subtitle: "Consejos de cuidado, tutoriales e ingredientes destacados",
      readMore: "Leer Más",
      featured: "Destacado",
    },
  };

  const label = labels[language];

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 font-serif text-4xl font-light tracking-wide md:text-5xl">
            {label.title}
          </h1>
          <p className="text-lg text-muted-foreground">{label.subtitle}</p>
        </motion.div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {cats.map((cat) => (
            <Button key={cat} variant="outline" size="sm">
              {cat}
            </Button>
          ))}
        </div>

        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <Link href={`/blog/${featuredPost.id}`}>
              <Card className="group overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="aspect-video overflow-hidden md:aspect-auto">
                    <img
                      src={blogImages[0]}
                      alt={featuredPost.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="flex flex-col justify-center p-8">
                    <Badge className="mb-4 w-fit">{label.featured}</Badge>
                    <h2 className="mb-4 font-serif text-2xl font-light md:text-3xl group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="mb-6 text-muted-foreground">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {featuredPost.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        {featuredPost.category}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </motion.div>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.filter((p) => !p.featured).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Link href={`/blog/${post.id}`}>
                <Card className="group h-full overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={blogImages[(index + 1) % blogImages.length]}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-3">
                      {post.category}
                    </Badge>
                    <h3 className="mb-2 font-serif text-xl font-medium group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
