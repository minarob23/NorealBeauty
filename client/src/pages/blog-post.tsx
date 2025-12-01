import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { ChevronRight, Clock, User, Tag, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/footer";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";

import heroImage from "@assets/stock_images/beautiful_woman_appl_2fded0df.jpg";
import productImage1 from "@assets/stock_images/luxury_skincare_prod_e5577988.jpg";
import productImage2 from "@assets/stock_images/luxury_skincare_prod_2130c720.jpg";
import productImage3 from "@assets/stock_images/luxury_skincare_prod_3ee0d53d.jpg";

const blogImages = [heroImage, productImage1, productImage2, productImage3];

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

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const { language } = useAppStore();
  const t = getTranslations(language);

  // Fetch blog posts from API
  const { data: allPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blogs"],
  });

  // Filter only published posts
  const posts = allPosts.filter(post => post.published);
  const post = posts.find((p) => p.id === id);
  const relatedPosts = posts.filter((p) => p.id !== id).slice(0, 3);

  const labels = {
    en: {
      title: "Beauty Blog",
      backToBlog: "Back to Blog",
      shareArticle: "Share Article",
      relatedArticles: "Related Articles",
      readMore: "Read More",
    },
    fr: {
      title: "Blog Beauté",
      backToBlog: "Retour au Blog",
      shareArticle: "Partager l'Article",
      relatedArticles: "Articles Similaires",
      readMore: "Lire Plus",
    },
    es: {
      title: "Blog de Belleza",
      backToBlog: "Volver al Blog",
      shareArticle: "Compartir Artículo",
      relatedArticles: "Artículos Relacionados",
      readMore: "Leer Más",
    },
  };

  const label = labels[language];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-purple-200 dark:border-purple-800"></div>
            <div className="absolute top-0 h-20 w-20 animate-spin rounded-full border-4 border-transparent border-t-purple-600 dark:border-t-purple-400"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-purple-600 dark:text-purple-400 animate-pulse">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
          <h1 className="mb-4 font-serif text-3xl font-light">Article not found</h1>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {label.backToBlog}
            </Button>
          </Link>
        </div>
        <Footer />
      </motion.div>
    );
  }

  const postIndex = posts.findIndex((p) => p.id === id);

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
          <Link href="/blog">
            <span className="hover:text-foreground transition-colors">{label.title}</span>
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
        </div>

        <Link href="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {label.backToBlog}
          </Button>
        </Link>

        <article className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4">{post.tags && post.tags[0]}</Badge>
            <h1 className="mb-6 font-serif text-3xl font-light tracking-wide md:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.authorName}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  {post.tags[0]}
                </div>
              )}
              <span className="hidden sm:inline">•</span>
              <span>{new Date(post.createdAt).toLocaleDateString(language === "en" ? "en-US" : language === "fr" ? "fr-FR" : "es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 aspect-video overflow-hidden rounded-lg"
          >
            <img
              src={blogImages[postIndex % blogImages.length]}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <p className="lead text-xl text-muted-foreground mb-8">{post.excerpt}</p>

            {post.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <h3 key={index} className="font-serif text-xl font-medium mt-8 mb-4">
                    {paragraph.replace(/\*\*/g, '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('**')) {
                const title = paragraph.match(/\*\*(.*?)\*\*/)?.[1];
                const content = paragraph.replace(/\*\*.*?\*\*/, '').trim();
                return (
                  <div key={index}>
                    <h3 className="font-serif text-xl font-medium mt-8 mb-4">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{content}</p>
                  </div>
                );
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                return (
                  <ul key={index} className="my-4 space-y-2">
                    {items.map((item, i) => (
                      <li key={i} className="text-muted-foreground">{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                  {paragraph}
                </p>
              );
            })}
          </motion.div>

          <Separator className="my-12" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">{post.authorName}</p>
                <p className="text-sm text-muted-foreground">Skincare Expert</p>
              </div>
            </div>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              {label.shareArticle}
            </Button>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="mb-8 font-serif text-2xl font-light">{label.relatedArticles}</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost, index) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                  <Card className="group h-full overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={blogImages[(index + 1) % blogImages.length]}
                        alt={relatedPost.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6">
                      <Badge variant="secondary" className="mb-3">
                        {relatedPost.tags && relatedPost.tags[0]}
                      </Badge>
                      <h3 className="mb-2 font-serif text-lg font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{new Date(relatedPost.createdAt).toLocaleDateString()}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </motion.div>
  );
}
