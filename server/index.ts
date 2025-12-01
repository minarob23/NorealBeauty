import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { storage } from "./storage";
import { randomUUID } from "crypto";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

// Health check endpoint for Railway
app.get("/_health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Auto-seed blog posts if none exist
async function ensureBlogPosts() {
  try {
    const existingPosts = await storage.getAllBlogPosts();
    if (existingPosts.length === 0) {
      log("No blog posts found. Auto-seeding sample posts...");
      
      const samplePosts = [
        {
          title: "The Ultimate Guide to Building a Skincare Routine",
          slug: "ultimate-guide-skincare-routine",
          excerpt: "Discover the essential steps to create a personalized skincare routine that works for your unique skin type and concerns.",
          content: `Building an effective skincare routine doesn't have to be complicated. The key is understanding your skin type and choosing products that address your specific concerns.

**Step 1: Cleanse**
Start with a gentle cleanser that removes dirt and makeup without stripping your skin's natural oils.

**Step 2: Tone**
Toners help balance your skin's pH and prepare it for the next steps.

**Step 3: Treat**
Apply serums targeting your specific concerns like fine lines, dark spots, or hydration.

**Step 4: Moisturize**
Lock in all that goodness with a moisturizer suited to your skin type.

**Step 5: Protect**
Never skip sunscreen during the day. UV protection is the most effective anti-aging step you can take.`,
          authorId: "system",
          authorName: "NoReal Beauty Team",
          published: true,
          publishedAt: new Date(),
          tags: ["skincare-basics", "tutorials", "beginner-friendly"],
        },
        {
          title: "Understanding Hyaluronic Acid: The Hydration Hero",
          slug: "understanding-hyaluronic-acid",
          excerpt: "Everything you need to know about this moisture-binding superstar ingredient.",
          content: `Hyaluronic acid is one of the most popular ingredients in skincare, and for good reason. This powerful humectant can hold up to 1000 times its weight in water, making it the ultimate hydration hero.

**What is Hyaluronic Acid?**
Despite the name, it's not an exfoliating acid. It's a sugar molecule that occurs naturally in our skin and helps retain moisture.

**Benefits:**
- Intense hydration
- Plumps fine lines
- Improves skin texture
- Works for all skin types

**How to Use:**
Apply to damp skin for best absorption, then seal with a moisturizer.`,
          authorId: "system",
          authorName: "NoReal Beauty Team",
          published: true,
          publishedAt: new Date(),
          tags: ["ingredients", "hydration", "featured"],
        },
        {
          title: "5 Skincare Mistakes You're Probably Making",
          slug: "common-skincare-mistakes",
          excerpt: "Avoid these common pitfalls to get the most out of your skincare routine.",
          content: `Even the most dedicated skincare enthusiasts can fall into these common traps. Here's what to avoid:

**1. Not Wearing Sunscreen Daily**
UV damage is cumulative and happens even on cloudy days.

**2. Over-Exfoliating**
More isn't always better. Stick to 2-3 times per week.

**3. Skipping Moisturizer on Oily Skin**
Oily skin needs hydration too! Choose lightweight, oil-free formulas.

**4. Using Too Many Active Ingredients at Once**
Layer your actives properly and introduce new products slowly.

**5. Not Patch Testing New Products**
Always test new products on a small area first to check for reactions.`,
          authorId: "system",
          authorName: "NoReal Beauty Team",
          published: true,
          publishedAt: new Date(),
          tags: ["tips", "skincare-basics", "common-mistakes"],
        },
      ];

      for (const post of samplePosts) {
        await storage.createBlogPost(post);
      }
      
      log(`✓ Auto-seeded ${samplePosts.length} blog posts`);
    }
  } catch (error) {
    log(`Warning: Could not auto-seed blog posts: ${error}`);
  }
}

(async () => {
  await registerRoutes(httpServer, app);
  
  // Seed blog posts if needed
  await ensureBlogPosts();

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
