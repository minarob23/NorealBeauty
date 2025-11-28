import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ChevronRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyEmail() {
  const [location] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  // Extract token from URL path
  const token = location.split("/verify-email/")[1];

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(`/api/verify-email/${token}`);
      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
      } else {
        setStatus("error");
        setMessage(data.message || "Verification failed");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred during verification");
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
          <span className="text-foreground">Email Verification</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 font-serif text-4xl font-light tracking-wide text-center"
        >
          Email Verification
        </motion.h1>

        <div className="max-w-md mx-auto mt-12">
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-4">
                {status === "loading" && (
                  <>
                    <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    </div>
                    <h3 className="font-semibold text-xl">Verifying Email...</h3>
                    <p className="text-sm text-muted-foreground">
                      Please wait while we verify your email address
                    </p>
                  </>
                )}

                {status === "success" && (
                  <>
                    <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-xl">Email Verified!</h3>
                    <p className="text-sm text-muted-foreground">
                      {message}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You can now log in to your account with full access.
                    </p>
                    <Link href="/login">
                      <Button className="w-full mt-4">
                        Continue to Login
                      </Button>
                    </Link>
                  </>
                )}

                {status === "error" && (
                  <>
                    <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-xl">Verification Failed</h3>
                    <p className="text-sm text-muted-foreground">
                      {message}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      The verification link may have expired or is invalid.
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Link href="/login" className="flex-1">
                        <Button variant="outline" className="w-full">
                          Back to Login
                        </Button>
                      </Link>
                      <Link href="/" className="flex-1">
                        <Button className="w-full">
                          Go Home
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
