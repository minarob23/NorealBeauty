import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Clock, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import heroImage from "@assets/stock_images/beautiful_woman_appl_2fded0df.jpg";
import productImage1 from "@assets/stock_images/luxury_skincare_prod_e5577988.jpg";
import productImage2 from "@assets/stock_images/luxury_skincare_prod_2130c720.jpg";
import productImage3 from "@assets/stock_images/luxury_skincare_prod_3ee0d53d.jpg";
import productImage4 from "@assets/stock_images/luxury_skincare_prod_293e5415.jpg";
import productImage5 from "@assets/stock_images/luxury_skincare_prod_0d009f2b.jpg";
import productImage6 from "@assets/stock_images/luxury_skincare_prod_73c26408.jpg";

const blogImages = [heroImage, productImage1, productImage2, productImage3, productImage4, productImage5, productImage6];

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  authorId: string;
  authorName: string;
  published: boolean;
  publishedAt?: string;
  tags?: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

const categories = {
  en: ["All", "Tutorials", "Ingredients", "Tips"],
  fr: ["Tous", "Tutoriels", "Ingrédients", "Conseils"],
  es: ["Todos", "Tutoriales", "Ingredientes", "Consejos"],
};

export default function Blog() {
  const { language } = useAppStore();
  const t = getTranslations(language);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch blog posts from API
  const { data: allPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blogs"],
  });

  // Filter only published posts
  const posts = allPosts.filter(post => post.published);

  const cats = categories[language];
  const featuredPost = posts.find((p) => p.tags?.includes("featured") || posts[0]);

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="absolute top-0 left-0 h-20 w-20 rounded-full border-4 border-t-purple-600 border-r-pink-600 border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-purple-600 dark:text-purple-400 animate-pulse">Loading blog posts...</p>
        </div>
      </div>
    );
  }

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
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
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
                        {featuredPost.authorName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(featuredPost.createdAt).toLocaleDateString()}
                      </div>
                      {featuredPost.tags && featuredPost.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          {featuredPost.tags[0]}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </motion.div>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.filter((p) => !p.tags?.includes("featured")).map((post, index) => (
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
                    {post.tags && post.tags.length > 0 && (
                      <Badge variant="secondary" className="mb-3">
                        {post.tags[0]}
                      </Badge>
                    )}
                    <h3 className="mb-2 font-serif text-xl font-medium group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt || post.content.substring(0, 150) + "..."}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{post.authorName}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
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
