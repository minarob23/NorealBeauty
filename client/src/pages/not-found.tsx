import { motion } from "framer-motion";
import { Link } from "wouter";
import { Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <span className="font-serif text-8xl font-light text-primary/20">404</span>
      </motion.div>
      
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4 font-serif text-3xl font-light md:text-4xl"
      >
        Page Not Found
      </motion.h1>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8 max-w-md text-muted-foreground"
      >
        The page you're looking for doesn't exist or has been moved. 
        Let's get you back on track.
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <Link href="/">
          <Button variant="outline" data-testid="link-home">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </Link>
        <Link href="/shop">
          <Button data-testid="link-shop">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Browse Products
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
