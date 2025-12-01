import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertReviewSchema, orders, users } from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated, isAdmin } from "./auth";
import { logAdminActivity, requireOwner } from "./adminMiddleware";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Authentication
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      console.log("[Auth] Fetching user data for:", userId);
      console.log("[Auth] User profileImageUrl:", user?.profileImageUrl || "not set");
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Upload profile image
  app.post('/api/upload-profile-image', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      // For simplicity, we'll use a base64 data URL approach
      // In production, you'd want to use a proper file upload service like S3
      const chunks: Buffer[] = [];

      req.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      req.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);

          // Extract the image from multipart form data
          const contentType = req.headers['content-type'];
          if (!contentType || !contentType.includes('multipart/form-data')) {
            return res.status(400).json({ message: "Invalid request" });
          }

          const boundary = contentType.split('boundary=')[1];
          if (!boundary) {
            return res.status(400).json({ message: "Invalid request" });
          }

          // Split buffer by boundary (keeping as buffer for binary data)
          const boundaryBuffer = Buffer.from(`--${boundary}`);
          const parts = [];
          let lastIndex = 0;

          // Find all boundary occurrences in the buffer
          for (let i = 0; i <= buffer.length - boundaryBuffer.length; i++) {
            if (buffer.subarray(i, i + boundaryBuffer.length).equals(boundaryBuffer)) {
              if (lastIndex > 0) {
                parts.push(buffer.subarray(lastIndex, i));
              }
              lastIndex = i + boundaryBuffer.length;
            }
          }

          let imageData: Buffer | null = null;
          let imageMimeType = 'image/jpeg';

          // Parse each part to find the image
          for (const part of parts) {
            const partStr = part.toString('utf-8', 0, Math.min(500, part.length)); // First 500 bytes to check headers
            if (partStr.includes('Content-Type: image/')) {
              // Extract the MIME type
              const mimeMatch = partStr.match(/Content-Type: (image\/\w+)/);
              if (mimeMatch) {
                imageMimeType = mimeMatch[1];
              }

              // Find the end of headers (double CRLF)
              const headerEndIndex = part.indexOf('\r\n\r\n');
              if (headerEndIndex !== -1) {
                // Image data starts after the double CRLF
                const imageStartIndex = headerEndIndex + 4;
                // Image data ends at the last CRLF (or CRLFCRLF)
                let imageEndIndex = part.length - 2; // account for trailing CRLF
                
                // Look for trailing CRLF
                if (part[part.length - 2] === 13 && part[part.length - 1] === 10) {
                  imageEndIndex = part.length - 2;
                } else if (part[part.length - 4] === 13 && part[part.length - 3] === 10) {
                  imageEndIndex = part.length - 4;
                }

                imageData = part.subarray(imageStartIndex, imageEndIndex);
                break;
              }
            }
          }

          if (!imageData || imageData.length === 0) {
            return res.status(400).json({ message: "No image data found" });
          }

          // Convert to base64 data URL
          const base64Data = imageData.toString('base64');
          const dataUrl = `data:${imageMimeType};base64,${base64Data}`;

          // Update user profile image
          await storage.updateUser(userId, {
            profileImageUrl: dataUrl,
          });

          console.log("[Upload] Profile image updated for user:", userId);
          console.log("[Upload] Image MIME type:", imageMimeType);
          console.log("[Upload] Image size:", imageData.length, "bytes (binary)");
          console.log("[Upload] Base64 size:", base64Data.length, "bytes");

          res.json({ success: true, imageUrl: dataUrl });
        } catch (error) {
          console.error("Error processing image:", error);
          res.status(500).json({ message: "Failed to process image" });
        }
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Admin: Get all users
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        isAdmin: u.isAdmin,
        emailVerified: u.emailVerified,
        authProvider: u.authProvider,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
        loginCount: u.loginCount,
      })));
    } catch (error) {
      console.error("Failed to fetch users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Admin: Get user analytics
  app.get("/api/admin/analytics", isAdmin, async (req, res) => {
    try {
      const stats = await storage.getUserStats();
      res.json(stats);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Admin: Update user
  app.patch("/api/admin/users/:id", isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Validate allowed fields
      const allowedFields = ['firstName', 'lastName', 'isAdmin', 'emailVerified'];
      const filteredUpdates: any = {};

      for (const key of allowedFields) {
        if (key in updates) {
          filteredUpdates[key] = updates[key];
        }
      }

      const updatedUser = await storage.updateUser(id, filteredUpdates);

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Log admin activity
      const admin = req.user.claims;
      await logAdminActivity(
        admin.sub,
        admin.email,
        admin.adminName || `${admin.first_name} ${admin.last_name}`,
        "user_update",
        "user",
        id,
        { updates: filteredUpdates, targetEmail: updatedUser.email },
        req
      );

      res.json({ success: true, user: updatedUser });
    } catch (error) {
      console.error("Failed to update user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Admin: Delete user
  app.delete("/api/admin/users/:id", isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;

      // Prevent deleting yourself
      const currentUser = req.user;
      if (currentUser.claims.sub === id) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }

      // Get user details before deleting
      const userToDelete = await storage.getUser(id);

      await storage.deleteUser(id);

      // Log admin activity
      const admin = currentUser.claims;
      await logAdminActivity(
        admin.sub,
        admin.email,
        admin.adminName || `${admin.first_name} ${admin.last_name}`,
        "user_delete",
        "user",
        id,
        { deletedEmail: userToDelete?.email },
        req
      );

      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Failed to delete user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Admin: Get activity logs
  app.get("/api/admin/activity-logs", isAdmin, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const activities = await storage.getAdminActivities(limit);
      res.json(activities);
    } catch (error) {
      console.error("Failed to fetch activity logs:", error);
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  // Owner: Get all admins
  app.get("/api/owner/admins", requireOwner, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const admins = users.filter(u => u.isAdmin).map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        adminRole: u.adminRole,
        adminName: u.adminName,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
        loginCount: u.loginCount,
      }));
      res.json(admins);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
      res.status(500).json({ message: "Failed to fetch admins" });
    }
  });

  // Owner: Create admin account
  app.post("/api/owner/create-admin", requireOwner, async (req: any, res) => {
    try {
      const { email, password, firstName, lastName, adminRole, adminName } = req.body;

      // Validate input
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Validate password strength
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      // Validate admin role
      const validRoles = ["super-admin", "admin", "moderator"];
      if (!validRoles.includes(adminRole)) {
        return res.status(400).json({ message: "Invalid admin role" });
      }

      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create admin user
      const userId = randomUUID();
      const displayName = adminName || `${firstName} ${lastName}`;

      await storage.upsertUser({
        id: userId,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        authProvider: "local",
        isAdmin: true,
        adminRole,
        adminName: displayName,
        emailVerified: true, // Auto-verify admins
      });

      // Log owner activity
      const owner = req.user.claims;
      await logAdminActivity(
        owner.sub,
        owner.email,
        owner.ownerName || `${owner.first_name} ${owner.last_name}`,
        "admin_create",
        "admin",
        userId,
        {
          adminEmail: email,
          adminRole,
          adminName: displayName
        },
        req
      );

      res.json({
        success: true,
        message: `Admin account created successfully for ${email}`,
        admin: {
          id: userId,
          email,
          firstName,
          lastName,
          adminRole,
          adminName: displayName
        }
      });
    } catch (error) {
      console.error("Failed to create admin:", error);
      res.status(500).json({ message: "Failed to create admin account" });
    }
  });

  // Owner: Delete admin account
  app.delete("/api/owner/admins/:id", requireOwner, async (req: any, res) => {
    try {
      const { id } = req.params;

      // Get admin details before deleting
      const adminToDelete = await storage.getUser(id);

      if (!adminToDelete) {
        return res.status(404).json({ message: "Admin not found" });
      }

      if (!adminToDelete.isAdmin) {
        return res.status(400).json({ message: "User is not an admin" });
      }

      await storage.deleteUser(id);

      // Log owner activity
      const owner = req.user.claims;
      await logAdminActivity(
        owner.sub,
        owner.email,
        owner.ownerName || `${owner.first_name} ${owner.last_name}`,
        "admin_delete",
        "admin",
        id,
        {
          deletedEmail: adminToDelete.email,
          deletedRole: adminToDelete.adminRole
        },
        req
      );

      res.json({ success: true, message: "Admin deleted successfully" });
    } catch (error) {
      console.error("Failed to delete admin:", error);
      res.status(500).json({ message: "Failed to delete admin" });
    }
  });

  // Address routes
  app.get('/api/addresses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const addresses = await storage.getUserAddresses(userId);
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch addresses" });
    }
  });

  app.post('/api/addresses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const address = await storage.createAddress({ ...req.body, userId });
      res.status(201).json(address);
    } catch (error) {
      res.status(500).json({ error: "Failed to create address" });
    }
  });

  app.patch('/api/addresses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const address = await storage.updateAddress(req.params.id, req.body);
      if (!address) {
        return res.status(404).json({ error: "Address not found" });
      }
      res.json(address);
    } catch (error) {
      res.status(500).json({ error: "Failed to update address" });
    }
  });

  app.delete('/api/addresses/:id', isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteAddress(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete address" });
    }
  });

  // Order routes
  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { items, customerInfo, subtotal, shipping, total } = req.body;

      // Create the order
      const order = await storage.createOrder({
        userId,
        status: 'pending',
        subtotal: subtotal.toString(),
        shipping: shipping.toString(),
        tax: '0',
        total: total.toString(),
        shippingAddressId: null,
      });

      // Create order items
      for (const item of items) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price.toString(),
          isSubscription: item.isSubscription || false,
          subscriptionFrequency: item.subscriptionFrequency || null,
        });
      }

      // Create notification for new order
      await storage.createNotification({
        userId,
        type: 'order',
        title: 'Order Confirmed! 🎉',
        message: `Your order #${order.id.slice(0, 8)} has been confirmed. Total: $${total.toFixed(2)}`,
        link: '/account',
      });

      // Get complete order with items
      const orderItems = await storage.getOrderItems(order.id);

      res.status(201).json({ ...order, items: orderItems, customerInfo });
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Admin: Get all orders
  app.get('/api/admin/orders', isAdmin, async (req, res) => {
    try {
      const allOrders = await db.select({
        id: orders.id,
        userId: orders.userId,
        status: orders.status,
        subtotal: orders.subtotal,
        shipping: orders.shipping,
        tax: orders.tax,
        total: orders.total,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        userEmail: users.email,
        userFirstName: users.firstName,
        userLastName: users.lastName,
      })
        .from(orders)
        .leftJoin(users, eq(orders.userId, users.id))
        .orderBy(sql`${orders.createdAt} DESC`);

      res.json(allOrders);
    } catch (error) {
      console.error("Failed to fetch admin orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get('/api/orders/:id', isAuthenticated, async (req: any, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      const items = await storage.getOrderItems(order.id);
      res.json({ ...order, items });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Admin: Update order status with tracking info
  app.patch('/api/admin/orders/:id', isAdmin, async (req: any, res) => {
    try {
      const { status, trackingNumber, shippedAt, deliveredAt } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      
      // Update tracking info if provided
      if (trackingNumber || shippedAt || deliveredAt) {
        await db.update(orders).set({
          trackingNumber: trackingNumber || undefined,
          shippedAt: shippedAt ? new Date(shippedAt) : undefined,
          deliveredAt: deliveredAt ? new Date(deliveredAt) : undefined,
          updatedAt: new Date(),
        }).where(eq(orders.id, req.params.id));
      }
      
      // Create notification for order status update
      if (order && status) {
        const statusMessages = {
          pending: { title: 'Order Pending', message: 'Your order is being processed.' },
          shipped: { title: 'Order Shipped! 📦', message: `Your order #${order.id.slice(0, 8)} has been shipped${trackingNumber ? ` (Tracking: ${trackingNumber})` : ''}.` },
          delivered: { title: 'Order Delivered! ✅', message: `Your order #${order.id.slice(0, 8)} has been delivered. Enjoy your products!` },
          cancelled: { title: 'Order Cancelled', message: `Your order #${order.id.slice(0, 8)} has been cancelled.` },
        };
        
        const notification = statusMessages[status as keyof typeof statusMessages];
        if (notification) {
          await storage.createNotification({
            userId: order.userId,
            type: 'order',
            title: notification.title,
            message: notification.message,
            link: '/account',
          });
        }
      }
      
      const updatedOrder = await storage.getOrder(req.params.id);
      const items = await storage.getOrderItems(req.params.id);
      res.json({ ...updatedOrder, items });
    } catch (error) {
      console.error("Failed to update order:", error);
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validated = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validated);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const validated = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, validated);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getProductReviews(req.params.id);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.post("/api/products/:id/reviews", async (req, res) => {
    try {
      const validated = insertReviewSchema.parse({
        ...req.body,
        productId: req.params.id,
      });
      const review = await storage.createReview(validated);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  app.post("/api/reviews/:id/helpful", async (req, res) => {
    try {
      const review = await storage.updateReviewHelpful(req.params.id);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: "Failed to update review" });
    }
  });

  // Blog routes
  // Public: Get published blog posts
  app.get("/api/blogs", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      // Filter to only published posts for public access
      const publishedPosts = posts.filter(post => post.published);
      res.json(publishedPosts);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Admin: Get all blog posts
  app.get("/api/admin/blogs", isAdmin, async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Admin: Create blog post
  app.post("/api/admin/blogs", isAdmin, async (req: any, res) => {
    try {
      const { title, slug, content, excerpt, coverImage, published, tags } = req.body;

      if (!title || !slug || !content) {
        return res.status(400).json({ message: "Title, slug, and content are required" });
      }

      const admin = req.user.claims;
      const authorId = admin.sub;
      const authorName = admin.adminName || admin.ownerName || `${admin.first_name} ${admin.last_name}`;

      let publishedAt: Date | null | undefined = null;
      if (published) {
        if (req.body.publishedAt) {
          publishedAt = typeof req.body.publishedAt === "string" ? new Date(req.body.publishedAt) : req.body.publishedAt;
        } else {
          publishedAt = new Date();
        }
      }
      const post = await storage.createBlogPost({
        title,
        slug,
        content,
        excerpt,
        coverImage,
        authorId,
        authorName,
        published: published || false,
        publishedAt,
        tags: tags || [],
      });

      // Log admin activity
      await logAdminActivity(
        authorId,
        admin.email,
        authorName,
        "blog_create",
        "blog",
        post.id,
        { title, published },
        req
      );

      res.json(post);
    } catch (error) {
      console.error("Failed to create blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  // Admin: Update blog post
  app.patch("/api/admin/blogs/:id", isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // If publishing, set publishedAt
      if (updates.published && !updates.publishedAt) {
        updates.publishedAt = new Date();
      }
      // If publishedAt is a string, convert to Date
      if (typeof updates.publishedAt === "string") {
        updates.publishedAt = new Date(updates.publishedAt);
      }

      const post = await storage.updateBlogPost(id, updates);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // Log admin activity
      const admin = req.user.claims;
      await logAdminActivity(
        admin.sub,
        admin.email,
        admin.adminName || admin.ownerName || `${admin.first_name} ${admin.last_name}`,
        "blog_update",
        "blog",
        id,
        { title: post.title, updates },
        req
      );

      res.json(post);
    } catch (error) {
      console.error("Failed to update blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  // Admin: Delete blog post
  app.delete("/api/admin/blogs/:id", isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;

      const post = await storage.getBlogPost(id);
      await storage.deleteBlogPost(id);

      // Log admin activity
      const admin = req.user.claims;
      await logAdminActivity(
        admin.sub,
        admin.email,
        admin.adminName || admin.ownerName || `${admin.first_name} ${admin.last_name}`,
        "blog_delete",
        "blog",
        id,
        { title: post?.title },
        req
      );

      res.json({ success: true, message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Failed to delete blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Notification routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const result = await storage.getUserNotifications(userId);
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      await storage.markNotificationAsRead(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.patch('/api/notifications/mark-all-read', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.markAllNotificationsAsRead(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  app.delete('/api/notifications/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      await storage.deleteNotification(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete notification:", error);
      res.status(500).json({ message: "Failed to delete notification" });
    }
  });

  return httpServer;
}
