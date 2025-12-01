import { z } from "zod";
import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
  decimal,
} from "drizzle-orm/pg-core";

export const categories = [
  "moisturizers",
  "serums",
  "cleansers",
  "masks",
  "toners",
  "suncare",
  "eye-care",
  "treatments"
] as const;

export const skinTypes = ["all", "dry", "oily", "combination", "sensitive"] as const;

export const languageCodes = ["en", "fr", "es"] as const;
export type Language = typeof languageCodes[number];

export const languages = [
  { code: "en" as Language, name: "English" },
  { code: "fr" as Language, name: "Français" },
  { code: "es" as Language, name: "Español" }
] as const;

// Session storage table
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  password: varchar("password"), // For admin local authentication
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  authProvider: varchar("auth_provider").default("google"), // 'google' or 'local'
  isAdmin: boolean("is_admin").default(false),
  isOwner: boolean("is_owner").default(false), // Highest privilege level
  adminRole: varchar("admin_role"), // 'super-admin', 'admin', 'moderator' (null for regular users and owners)
  adminName: varchar("admin_name"), // Display name for admin (e.g., "John Doe - Super Admin")
  ownerName: varchar("owner_name"), // Display name for owner (e.g., "Jane Smith - Owner")
  emailVerified: boolean("email_verified").default(false),
  verificationToken: varchar("verification_token"),
  resetPasswordToken: varchar("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  lastLoginAt: timestamp("last_login_at"),
  lastAdminAction: timestamp("last_admin_action"), // Track when admin last performed an action
  loginCount: integer("login_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// User addresses table
export const addresses = pgTable("addresses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  label: varchar("label").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  street: varchar("street").notNull(),
  city: varchar("city").notNull(),
  state: varchar("state"),
  postalCode: varchar("postal_code").notNull(),
  country: varchar("country").notNull(),
  phone: varchar("phone"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Address = typeof addresses.$inferSelect;
export type InsertAddress = typeof addresses.$inferInsert;

// Admin Activity Logs table
export const adminActivityLogs = pgTable("admin_activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").notNull().references(() => users.id),
  adminEmail: varchar("admin_email").notNull(), // Denormalized for easier querying
  adminName: varchar("admin_name"), // Display name of admin who performed action
  action: varchar("action").notNull(), // 'login', 'user_update', 'user_delete', 'admin_create', etc.
  targetType: varchar("target_type"), // 'user', 'product', 'order', etc.
  targetId: varchar("target_id"), // ID of affected entity
  details: text("details"), // JSON string with additional details
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type AdminActivityLog = typeof adminActivityLogs.$inferSelect;
export type InsertAdminActivityLog = typeof adminActivityLogs.$inferInsert;

// Orders table
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: varchar("status").notNull().default("pending"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shipping: decimal("shipping", { precision: 10, scale: 2 }).notNull().default("0"),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  shippingAddressId: varchar("shipping_address_id"),
  trackingNumber: varchar("tracking_number"),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// Order items table
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  productId: varchar("product_id").notNull(),
  productName: varchar("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

// Products table
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  skinType: varchar("skin_type", { length: 50 }).notNull(),
  ingredients: varchar("ingredients").array().notNull(),
  images: varchar("images").array().notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).notNull().default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  inStock: boolean("in_stock").notNull().default(true),
  isBestSeller: boolean("is_best_seller").default(false),
  isNew: boolean("is_new").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  shortDescription: z.string(),
  price: z.number().positive(),
  category: z.enum(categories),
  skinType: z.enum(skinTypes),
  ingredients: z.array(z.string()),
  images: z.array(z.string()),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().min(0),
  inStock: z.boolean(),
  isBestSeller: z.boolean().optional(),
  isNew: z.boolean().optional()
});

export const insertProductSchema = productSchema.omit({ id: true, rating: true, reviewCount: true });

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Category = typeof categories[number];
export type SkinType = typeof skinTypes[number];

export const reviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  userName: z.string().min(1),
  rating: z.number().min(1).max(5),
  title: z.string().min(1),
  content: z.string().min(10),
  createdAt: z.string(),
  helpful: z.number().min(0)
});

export const insertReviewSchema = reviewSchema.omit({ id: true, createdAt: true, helpful: true });

export type Review = z.infer<typeof reviewSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export const cartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number().min(1)
});

export const insertCartItemSchema = cartItemSchema.omit({ id: true });

export type CartItem = z.infer<typeof cartItemSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export const wishlistItemSchema = z.object({
  id: z.string(),
  productId: z.string()
});

export type WishlistItem = z.infer<typeof wishlistItemSchema>;

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImage: varchar("cover_image"),
  authorId: varchar("author_id").notNull().references(() => users.id),
  authorName: varchar("author_name").notNull(),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  tags: varchar("tags").array(),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

export const blogPostSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  authorId: z.string(),
  authorName: z.string(),
  published: z.boolean(),
  publishedAt: z.date().optional().nullable(),
  tags: z.array(z.string()).optional(),
  viewCount: z.number().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const insertBlogPostSchema = blogPostSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  viewCount: true 
});

