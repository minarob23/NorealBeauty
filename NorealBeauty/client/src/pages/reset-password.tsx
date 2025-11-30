import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const [location] = useLocation();

  // Extract token from URL path
  const token = location.split("/reset-password/")[1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast({
          title: "Success",
          description: "Password reset successfully",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to reset password",
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
            <span className="hover:text-foreground transition-colors">Home</span>
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Reset Password</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 font-serif text-4xl font-light tracking-wide text-center"
        >
          Set New Password
        </motion.h1>

        <p className="text-center text-muted-foreground mb-12">
          Enter your new password below
        </p>

        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="pt-6">
              {isSuccess ? (
                <div className="text-center space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Password Reset Complete</h3>
                  <p className="text-sm text-muted-foreground">
                    Your password has been successfully reset. Redirecting to login...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum 8 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>

                  <Link href="/login">
                    <Button variant="ghost" className="w-full">
                      Back to Login
                    </Button>
                  </Link>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
