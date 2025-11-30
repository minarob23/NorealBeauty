import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ChevronRight, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/footer";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { language } = useAppStore();
  const t = getTranslations(language);
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const labels = {
    en: {
      title: "Admin Sign In",
      subtitle: "Enter your admin credentials",
      email: "Email",
      password: "Password",
      signIn: "Sign In",
      backToLogin: "Back to Login Options",
      emailPlaceholder: "admin@example.com",
      passwordPlaceholder: "Enter your password",
    },
    fr: {
      title: "Connexion Administrateur",
      subtitle: "Entrez vos identifiants administrateur",
      email: "Email",
      password: "Mot de passe",
      signIn: "Se connecter",
      backToLogin: "Retour aux options de connexion",
      emailPlaceholder: "admin@exemple.com",
      passwordPlaceholder: "Entrez votre mot de passe",
    },
    es: {
      title: "Inicio de Sesión de Administrador",
      subtitle: "Ingrese sus credenciales de administrador",
      email: "Email",
      password: "Contraseña",
      signIn: "Iniciar Sesión",
      backToLogin: "Volver a las opciones de inicio de sesión",
      emailPlaceholder: "admin@ejemplo.com",
      passwordPlaceholder: "Ingrese su contraseña",
    },
  };

  const label = labels[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/login/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "You have been signed in successfully.",
        });
        setLocation("/admin");
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.message || "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <Link href="/login">
            <span className="hover:text-foreground transition-colors">Login</span>
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{label.title}</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 font-serif text-4xl font-light tracking-wide text-center"
        >
          {label.title}
        </motion.h1>
        
        <p className="text-center text-muted-foreground mb-12">
          {label.subtitle}
        </p>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-center">{label.title}</CardTitle>
              <CardDescription className="text-center">{label.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{label.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={label.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{label.password}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder={label.passwordPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : label.signIn}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    {label.backToLogin}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
