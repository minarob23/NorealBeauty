import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Footer } from "@/components/footer";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { language } = useAppStore();
  const t = getTranslations(language);
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  // Check for verification message from Google OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');
    const email = params.get('email');
    
    if (message === 'verify' && email) {
      setTimeout(() => {
        toast({
          title: "Google Account Created!",
          description: `A verification email has been sent to ${email}. Please check your inbox and spam folder.`,
          duration: 8000,
        });
      }, 500);
      
      // Clean URL
      window.history.replaceState({}, '', '/login');
    }
  }, [toast]);

  const labels = {
    en: {
      title: "Sign In",
      signUpTitle: "Create Account",
      subtitle: "Sign in to your account",
      signUpSubtitle: "Sign up to start shopping",
      googleSignIn: "Continue with Google",
      adminSignIn: "Admin Sign In",
      adminDescription: "For administrators only",
      backToHome: "Back to Home",
      email: "Email",
      password: "Password",
      firstName: "First Name",
      lastName: "Last Name",
      signInButton: "Sign In",
      signUpButton: "Create Account",
      orDivider: "OR",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      signInLink: "Sign In",
      signUpLink: "Sign Up",
      emailPlaceholder: "your@email.com",
      passwordPlaceholder: "••••••••",
      passwordHint: "Must be at least 8 characters",
    },
    fr: {
      title: "Se Connecter",
      signUpTitle: "Créer un Compte",
      subtitle: "Connectez-vous à votre compte",
      signUpSubtitle: "Inscrivez-vous pour commencer vos achats",
      googleSignIn: "Continuer avec Google",
      adminSignIn: "Connexion Administrateur",
      adminDescription: "Pour les administrateurs uniquement",
      backToHome: "Retour à l'accueil",
      email: "Email",
      password: "Mot de passe",
      firstName: "Prénom",
      lastName: "Nom",
      signInButton: "Se connecter",
      signUpButton: "Créer un compte",
      orDivider: "OU",
      alreadyHaveAccount: "Vous avez déjà un compte?",
      dontHaveAccount: "Vous n'avez pas de compte?",
      signInLink: "Se connecter",
      signUpLink: "S'inscrire",
      emailPlaceholder: "votre@email.com",
      passwordPlaceholder: "••••••••",
      passwordHint: "Au moins 8 caractères",
    },
    es: {
      title: "Iniciar Sesión",
      signUpTitle: "Crear Cuenta",
      subtitle: "Inicia sesión en tu cuenta",
      signUpSubtitle: "Regístrate para comenzar a comprar",
      googleSignIn: "Continuar con Google",
      adminSignIn: "Inicio de Sesión de Administrador",
      adminDescription: "Solo para administradores",
      backToHome: "Volver al Inicio",
      email: "Email",
      password: "Contraseña",
      firstName: "Nombre",
      lastName: "Apellido",
      signInButton: "Iniciar Sesión",
      signUpButton: "Crear Cuenta",
      orDivider: "O",
      alreadyHaveAccount: "¿Ya tienes una cuenta?",
      dontHaveAccount: "¿No tienes una cuenta?",
      signInLink: "Iniciar Sesión",
      signUpLink: "Registrarse",
      emailPlaceholder: "tu@email.com",
      passwordPlaceholder: "••••••••",
      passwordHint: "Mínimo 8 caracteres",
    },
  };

  const label = labels[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isSignUp ? "/api/register" : "/api/login/local";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.message || "Authentication failed",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (isSignUp) {
        // Show email sent notification
        toast({
          title: "Account Created!",
          description: `A verification email has been sent to ${formData.email}. Please check your inbox and spam folder.`,
          duration: 8000,
        });
        
        // Don't redirect, let user verify email first
        setIsLoading(false);
        setIsSignUp(false); // Switch to login mode
        setFormData({ email: formData.email, password: "", firstName: "", lastName: "" });
      } else {
        toast({
          title: "Success",
          description: "Welcome back!",
        });
        
        // Redirect to home page after login
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
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
          <span className="text-foreground">{isSignUp ? label.signUpTitle : label.title}</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 font-serif text-4xl font-light tracking-wide text-center"
        >
          {isSignUp ? label.signUpTitle : label.title}
        </motion.h1>
        
        <p className="text-center text-muted-foreground mb-12">
          {isSignUp ? label.signUpSubtitle : label.subtitle}
        </p>

        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{label.firstName}</Label>
                      <Input
                        id="firstName"
                        type="text"
                        required
                        disabled={isLoading}
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{label.lastName}</Label>
                      <Input
                        id="lastName"
                        type="text"
                        disabled={isLoading}
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">{label.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={label.emailPlaceholder}
                      className="pl-10"
                      required
                      disabled={isLoading}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">{label.password}</Label>
                    {!isSignUp && (
                      <Link href="/forgot-password">
                        <a className="text-xs text-primary hover:underline">
                          Forgot password?
                        </a>
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder={label.passwordPlaceholder}
                      className="pl-10"
                      required
                      disabled={isLoading}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                  {isSignUp && (
                    <p className="text-xs text-muted-foreground">
                      {label.passwordHint}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? "Loading..." : (isSignUp ? label.signUpButton : label.signInButton)}
                </Button>
              </form>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-950 px-2 text-xs text-muted-foreground">
                  {label.orDivider}
                </span>
              </div>

              {/* Google OAuth */}
              <a href="/api/login/google" className="block">
                <Button variant="outline" className="w-full h-11" disabled={isLoading}>
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {label.googleSignIn}
                </Button>
              </a>

              {/* Toggle Sign Up/Sign In */}
              <div className="text-center text-sm">
                {isSignUp ? (
                  <>
                    {label.alreadyHaveAccount}{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(false);
                        setFormData({ email: "", password: "", firstName: "", lastName: "" });
                      }}
                      className="text-primary hover:underline font-medium"
                      disabled={isLoading}
                    >
                      {label.signInLink}
                    </button>
                  </>
                ) : (
                  <>
                    {label.dontHaveAccount}{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(true);
                        setFormData({ email: "", password: "", firstName: "", lastName: "" });
                      }}
                      className="text-primary hover:underline font-medium"
                      disabled={isLoading}
                    >
                      {label.signUpLink}
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Admin Login Link */}
          <Card className="mt-6 border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{label.adminSignIn}</CardTitle>
              <CardDescription>{label.adminDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin-login">
                <Button variant="default" className="w-full">
                  {label.adminSignIn}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Link href="/">
              <Button variant="ghost">
                {label.backToHome}
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
