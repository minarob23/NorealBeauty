import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Mail, Send } from "lucide-react";
import { SiInstagram, SiPinterest, SiFacebook, SiX, SiTiktok } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { getTranslations, type Language } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

const languages: { code: Language; name: string }[] = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
];

export function Footer() {
  const { language, setLanguage } = useAppStore();
  const t = getTranslations(language);
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [, setLocation] = useLocation();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Subscribed!",
        description: "Thank you for joining our newsletter.",
      });
      setEmail("");
    }
  };

  const footerLinks = {
    shop: [
      { label: t.categories.moisturizers, href: "/shop?category=moisturizers" },
      { label: t.categories.serums, href: "/shop?category=serums" },
      { label: t.categories.cleansers, href: "/shop?category=cleansers" },
      { label: t.categories.masks, href: "/shop?category=masks" },
    ],
    support: [
      { label: t.footer.faq, href: "/support?tab=faq" },
      { label: t.footer.shipping, href: "/support?tab=shipping" },
      { label: t.footer.returns, href: "/support?tab=returns" },
    ],
  };

  const socialLinks = [
    { icon: SiInstagram, href: "https://www.instagram.com/noreen.nageh/", label: "Instagram" },
    { icon: SiTiktok, href: "https://www.tiktok.com/@noreal51", label: "TikTok" },
    { icon: SiPinterest, href: "#", label: "Pinterest" },
    { icon: SiFacebook, href: "https://www.facebook.com/profile.php?id=100072971241062", label: "Facebook" },
    { icon: SiX, href: "#", label: "X" },
  ];

  return (
    <footer className="border-t bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/">
              <span className="font-serif text-2xl font-light tracking-widest">
                NORÉAL
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t.footer.aboutText}
            </p>
            <div className="mt-6 flex gap-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider">
              {t.footer.shop}
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => {
                const href = link.href;
                return (
                  <li key={link.label}>
                    <span 
                      onClick={() => setLocation(href)}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                    >
                      {link.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider">
              {t.footer.support}
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => {
                const href = link.href;
                return (
                  <li key={link.label}>
                    <span 
                      onClick={() => setLocation(href)}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                    >
                      {link.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider">
              {t.footer.newsletter}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {t.footer.newsletterText}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.footer.emailPlaceholder}
                  className="pl-10"
                  required
                  data-testid="input-newsletter-email"
                />
              </div>
              <Button type="submit" size="icon" data-testid="button-newsletter-subscribe">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            {t.footer.copyright}
          </p>

          <div className="flex items-center gap-4">
            <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
              <SelectTrigger
                className="w-32"
                data-testid="select-footer-language"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </footer>
  );
}
