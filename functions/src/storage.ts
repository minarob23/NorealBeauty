import {
  type Product,
  type InsertProduct,
  type Review,
  type InsertReview,
  type Category,
  type SkinType,
  type User,
  type UpsertUser,
  type Address,
  type InsertAddress,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type AdminActivityLog,
  type InsertAdminActivityLog,
  type BlogPost,
  type InsertBlogPost,
  type Notification,
  type InsertNotification,
  users,
  addresses,
  orders,
  orderItems,
  adminActivityLogs,
  blogPosts,
  products,
  notifications,
} from "./schema";
import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  getProductReviews(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReviewHelpful(reviewId: string): Promise<Review | undefined>;
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, updates: Partial<UpsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  updateLoginStats(userId: string): Promise<void>;
  getUserStats(): Promise<{
    total: number;
    verified: number;
    admins: number;
    byProvider: Record<string, number>;
    recentSignups: number;
  }>;
  // Admin activity operations
  logAdminActivity(log: InsertAdminActivityLog): Promise<AdminActivityLog>;
  getAdminActivities(limit?: number): Promise<AdminActivityLog[]>;
  getAdminActivitiesByAdmin(adminId: string, limit?: number): Promise<AdminActivityLog[]>;
  updateAdminAction(adminId: string): Promise<void>;
  // Address operations
  getUserAddresses(userId: string): Promise<Address[]>;
  createAddress(address: InsertAddress): Promise<Address>;
  updateAddress(id: string, address: Partial<InsertAddress>): Promise<Address | undefined>;
  deleteAddress(id: string): Promise<boolean>;
  // Order operations
  getUserOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  // Blog operations
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: Omit<InsertBlogPost, "id">): Promise<BlogPost>;
  updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
  // Notification operations
  getUserNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string, userId: string): Promise<void>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
  deleteNotification(id: string, userId: string): Promise<void>;
  getUnreadNotificationCount(userId: string): Promise<number>;
}

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Hydra-Glow Serum",
    description: "Our bestselling hydrating serum combines hyaluronic acid with vitamin C to deliver intense moisture and a radiant glow. This lightweight formula absorbs quickly, leaving skin plump and luminous. Perfect for all skin types, it works to reduce fine lines while protecting against environmental stressors.",
    shortDescription: "Intense hydration meets radiant glow with hyaluronic acid and vitamin C.",
    price: 68.00,
    category: "serums",
    skinType: "all",
    ingredients: ["Hyaluronic Acid", "Vitamin C", "Niacinamide", "Aloe Vera", "Green Tea Extract"],
    images: [],
    rating: 4.8,
    reviewCount: 127,
    inStock: true,
    isBestSeller: true,
    isNew: false,
  },
  {
    id: "2",
    name: "Velvet Night Cream",
    description: "Luxurious overnight treatment that works while you sleep to repair and rejuvenate. Enriched with retinol and peptides, this rich cream helps reduce the appearance of wrinkles and improves skin elasticity. Wake up to smoother, more youthful-looking skin.",
    shortDescription: "Overnight repair with retinol and peptides for youthful radiance.",
    price: 85.00,
    category: "moisturizers",
    skinType: "dry",
    ingredients: ["Retinol", "Peptides", "Shea Butter", "Jojoba Oil", "Vitamin E"],
    images: [],
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    isBestSeller: true,
    isNew: false,
  },
  {
    id: "3",
    name: "Pure Clarity Cleanser",
    description: "A gentle yet effective gel cleanser that removes impurities without stripping the skin's natural moisture. Infused with tea tree and salicylic acid, it helps prevent breakouts while maintaining a balanced complexion. Suitable for daily use.",
    shortDescription: "Gentle gel cleanser with tea tree for clear, balanced skin.",
    price: 42.00,
    category: "cleansers",
    skinType: "oily",
    ingredients: ["Salicylic Acid", "Tea Tree Oil", "Glycerin", "Chamomile", "Witch Hazel"],
    images: [],
    rating: 4.5,
    reviewCount: 156,
    inStock: true,
    isBestSeller: false,
    isNew: false,
  },
  {
    id: "4",
    name: "Rose Petal Toner",
    description: "Alcohol-free toner infused with rose water and rose hip extract. Gently balances pH levels while providing antioxidant protection. Leaves skin feeling refreshed, soft, and prepped for the rest of your skincare routine.",
    shortDescription: "Rose-infused toner for balanced, refreshed skin.",
    price: 38.00,
    category: "toners",
    skinType: "all",
    ingredients: ["Rose Water", "Rose Hip Extract", "Witch Hazel", "Aloe Vera", "Glycerin"],
    images: [],
    rating: 4.7,
    reviewCount: 203,
    inStock: true,
    isBestSeller: true,
    isNew: false,
  },
  {
    id: "5",
    name: "Luminous Eye Elixir",
    description: "Targeted treatment for the delicate eye area. This lightweight serum helps reduce dark circles, puffiness, and fine lines with caffeine and peptide technology. The cooling applicator enhances product absorption and provides instant de-puffing.",
    shortDescription: "De-puff and brighten with caffeine and peptides.",
    price: 55.00,
    category: "eye-care",
    skinType: "all",
    ingredients: ["Caffeine", "Peptides", "Vitamin K", "Cucumber Extract", "Hyaluronic Acid"],
    images: [],
    rating: 4.4,
    reviewCount: 78,
    inStock: true,
    isBestSeller: false,
    isNew: true,
  },
  {
    id: "6",
    name: "Detox Clay Mask",
    description: "Deep-cleansing mask that draws out impurities and excess oil. Formulated with kaolin clay and activated charcoal, it purifies pores while green tea provides antioxidant benefits. Use weekly for a clearer, more refined complexion.",
    shortDescription: "Purifying clay mask with charcoal for deep cleansing.",
    price: 48.00,
    category: "masks",
    skinType: "oily",
    ingredients: ["Kaolin Clay", "Activated Charcoal", "Green Tea", "Bentonite", "Eucalyptus"],
    images: [],
    rating: 4.5,
    reviewCount: 92,
    inStock: true,
    isBestSeller: false,
    isNew: false,
  },
  {
    id: "7",
    name: "Sunshield SPF 50",
    description: "Lightweight, non-greasy sunscreen that provides broad-spectrum protection. This invisible formula blends seamlessly and works well under makeup. Enriched with antioxidants to protect against environmental damage and premature aging.",
    shortDescription: "Invisible broad-spectrum protection for daily wear.",
    price: 45.00,
    category: "suncare",
    skinType: "all",
    ingredients: ["Zinc Oxide", "Titanium Dioxide", "Vitamin E", "Green Tea", "Niacinamide"],
    images: [],
    rating: 4.8,
    reviewCount: 234,
    inStock: true,
    isBestSeller: true,
    isNew: false,
  },
  {
    id: "8",
    name: "Radiance Vitamin Boost",
    description: "Concentrated treatment serum packed with vitamins A, C, and E. This powerful antioxidant blend helps brighten dull skin, even out skin tone, and protect against free radical damage. Perfect for achieving that healthy, lit-from-within glow.",
    shortDescription: "Triple vitamin complex for radiant, even-toned skin.",
    price: 72.00,
    category: "serums",
    skinType: "combination",
    ingredients: ["Vitamin A", "Vitamin C", "Vitamin E", "Ferulic Acid", "Squalane"],
    images: [],
    rating: 4.6,
    reviewCount: 145,
    inStock: true,
    isBestSeller: false,
    isNew: true,
  },
  {
    id: "9",
    name: "Gentle Milk Cleanser",
    description: "Ultra-gentle milk cleanser ideal for sensitive and dry skin types. This creamy formula dissolves makeup and impurities without causing irritation. Infused with oat extract and ceramides to maintain the skin's protective barrier.",
    shortDescription: "Creamy cleanser with oat for sensitive skin comfort.",
    price: 36.00,
    category: "cleansers",
    skinType: "sensitive",
    ingredients: ["Oat Extract", "Ceramides", "Milk Proteins", "Chamomile", "Allantoin"],
    images: [],
    rating: 4.7,
    reviewCount: 167,
    inStock: true,
    isBestSeller: false,
    isNew: false,
  },
  {
    id: "10",
    name: "Hydrating Sheet Mask",
    description: "Bio-cellulose sheet mask drenched in hydrating essence. This 15-minute treatment delivers an instant moisture boost, leaving skin plump, dewy, and refreshed. Perfect for travel or a quick skin pick-me-up before special occasions.",
    shortDescription: "Instant hydration boost in 15 minutes.",
    price: 12.00,
    category: "masks",
    skinType: "dry",
    ingredients: ["Hyaluronic Acid", "Aloe Vera", "Centella Asiatica", "Panthenol", "Glycerin"],
    images: [],
    rating: 4.3,
    reviewCount: 312,
    inStock: true,
    isBestSeller: false,
    isNew: false,
  },
  {
    id: "11",
    name: "Acne Control Treatment",
    description: "Targeted spot treatment that clears blemishes fast. This potent formula combines benzoyl peroxide with soothing tea tree oil to fight acne-causing bacteria while reducing redness. Dries clear so it can be worn day or night.",
    shortDescription: "Fast-acting spot treatment for clear skin.",
    price: 28.00,
    category: "treatments",
    skinType: "oily",
    ingredients: ["Benzoyl Peroxide", "Tea Tree Oil", "Niacinamide", "Zinc", "Salicylic Acid"],
    images: [],
    rating: 4.4,
    reviewCount: 189,
    inStock: true,
    isBestSeller: false,
    isNew: false,
  },
  {
    id: "12",
    name: "Barrier Repair Moisturizer",
    description: "Intensive moisturizer designed to restore compromised skin barriers. Rich in ceramides and fatty acids, this nourishing cream rebuilds skin's natural defenses while providing lasting comfort. Ideal for those experiencing dryness, irritation, or sensitivity.",
    shortDescription: "Ceramide-rich cream to restore and protect.",
    price: 58.00,
    category: "moisturizers",
    skinType: "sensitive",
    ingredients: ["Ceramides", "Fatty Acids", "Cholesterol", "Shea Butter", "Squalane"],
    images: [],
    rating: 4.9,
    reviewCount: 98,
    inStock: true,
    isBestSeller: false,
    isNew: true,
  },
];

const sampleReviews: Review[] = [
  {
    id: "r1",
    productId: "1",
    userName: "Sarah M.",
    rating: 5,
    title: "Holy grail serum!",
    content: "I've been using this serum for 3 months and my skin has never looked better. The hydration is incredible and I've noticed a significant improvement in my skin's texture and glow. Definitely worth the price!",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 24,
  },
  {
    id: "r2",
    productId: "1",
    userName: "Jennifer L.",
    rating: 4,
    title: "Great for dry skin",
    content: "This serum provides excellent hydration. I use it morning and night and my skin feels so much plumper. The only reason for 4 stars is the price, but the quality is undeniable.",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 12,
  },
  {
    id: "r3",
    productId: "2",
    userName: "Amanda K.",
    rating: 5,
    title: "Woke up with baby soft skin",
    content: "The retinol is gentle enough for nightly use but still effective. After a month of use, my fine lines around my eyes are visibly reduced. This cream is magic in a jar.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 18,
  },
  {
    id: "r4",
    productId: "3",
    userName: "Michelle T.",
    rating: 5,
    title: "Finally clear skin!",
    content: "As someone with oily, acne-prone skin, finding the right cleanser was a struggle. This one removes all the oil without drying me out. My breakouts have significantly decreased!",
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 31,
  },
  {
    id: "r5",
    productId: "4",
    userName: "Emily R.",
    rating: 5,
    title: "Smells divine, works beautifully",
    content: "The rose scent is subtle and luxurious. My skin feels so balanced after using this toner. It's become an essential step in my routine that I look forward to every day.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 8,
  },
  {
    id: "r6",
    productId: "7",
    userName: "Lisa W.",
    rating: 5,
    title: "Best sunscreen ever",
    content: "No white cast, no greasy feeling, and it sits perfectly under makeup. I've tried dozens of sunscreens and this is the only one I'll repurchase. Worth every penny!",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 45,
  },
];

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private reviews: Map<string, Review>;

  constructor() {
    this.products = new Map();
    this.reviews = new Map();

    sampleProducts.forEach((product) => {
      this.products.set(product.id, product);
    });

    sampleReviews.forEach((review) => {
      this.reviews.set(review.id, review);
    });
  }

  async getProducts(): Promise<Product[]> {
    const dbProducts = await db.select().from(products);
    return dbProducts.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      shortDescription: p.shortDescription,
      price: parseFloat(p.price),
      category: p.category as any,
      skinType: p.skinType as any,
      ingredients: p.ingredients,
      images: p.images,
      rating: parseFloat(p.rating),
      reviewCount: p.reviewCount,
      inStock: p.inStock,
      isBestSeller: p.isBestSeller || false,
      isNew: p.isNew || false,
    }));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    if (!product) return undefined;
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      price: parseFloat(product.price),
      category: product.category as any,
      skinType: product.skinType as any,
      ingredients: product.ingredients,
      images: product.images,
      rating: parseFloat(product.rating),
      reviewCount: product.reviewCount,
      inStock: product.inStock,
      isBestSeller: product.isBestSeller || false,
      isNew: product.isNew || false,
    };
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values({
      name: insertProduct.name,
      description: insertProduct.description,
      shortDescription: insertProduct.shortDescription,
      price: insertProduct.price.toString(),
      category: insertProduct.category,
      skinType: insertProduct.skinType,
      ingredients: insertProduct.ingredients,
      images: insertProduct.images,
      inStock: insertProduct.inStock,
      isBestSeller: insertProduct.isBestSeller || false,
      isNew: insertProduct.isNew || false,
      rating: "0",
      reviewCount: 0,
    }).returning();

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      price: parseFloat(product.price),
      category: product.category as any,
      skinType: product.skinType as any,
      ingredients: product.ingredients,
      images: product.images,
      rating: parseFloat(product.rating),
      reviewCount: product.reviewCount,
      inStock: product.inStock,
      isBestSeller: product.isBestSeller || false,
      isNew: product.isNew || false,
    };
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.shortDescription !== undefined) updateData.shortDescription = updates.shortDescription;
    if (updates.price !== undefined) updateData.price = updates.price.toString();
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.skinType !== undefined) updateData.skinType = updates.skinType;
    if (updates.ingredients !== undefined) updateData.ingredients = updates.ingredients;
    if (updates.images !== undefined) updateData.images = updates.images;
    if (updates.inStock !== undefined) updateData.inStock = updates.inStock;
    if (updates.isBestSeller !== undefined) updateData.isBestSeller = updates.isBestSeller;
    if (updates.isNew !== undefined) updateData.isNew = updates.isNew;
    updateData.updatedAt = new Date();

    const [product] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();

    if (!product) return undefined;

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      price: parseFloat(product.price),
      category: product.category as any,
      skinType: product.skinType as any,
      ingredients: product.ingredients,
      images: product.images,
      rating: parseFloat(product.rating),
      reviewCount: product.reviewCount,
      inStock: product.inStock,
      isBestSeller: product.isBestSeller || false,
      isNew: product.isNew || false,
    };
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.productId === productId
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      ...insertReview,
      id,
      createdAt: new Date().toISOString(),
      helpful: 0,
    };
    this.reviews.set(id, review);

    const product = this.products.get(insertReview.productId);
    if (product) {
      const reviews = await this.getProductReviews(insertReview.productId);
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / reviews.length;

      this.products.set(product.id, {
        ...product,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      });
    }

    return review;
  }

  async updateReviewHelpful(reviewId: string): Promise<Review | undefined> {
    const review = this.reviews.get(reviewId);
    if (!review) return undefined;

    const updated: Review = { ...review, helpful: review.helpful + 1 };
    this.reviews.set(reviewId, updated);
    return updated;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      console.log("[Storage] Fetching user by id:", id);
      const [user] = await db.select().from(users).where(eq(users.id, id));
      console.log("[Storage] User found:", user?.id || "not found");
      return user;
    } catch (error) {
      console.error("[Storage] Failed to get user:", error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      console.log("[Storage] Fetching user by email:", email);
      const [user] = await db.select().from(users).where(eq(users.email, email));
      console.log("[Storage] User found by email:", user?.id || "not found");
      return user;
    } catch (error) {
      console.error("[Storage] Failed to get user by email:", error);
      throw error;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      console.log("[Storage] Upserting user with data:", {
        id: userData.id,
        email: userData.email,
        profileImageUrl: userData.profileImageUrl || "not provided"
      });
      
      const [user] = await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: new Date(),
          },
        })
        .returning();

      console.log("[Storage] User upserted, profileImageUrl in DB:", user.profileImageUrl || "not set");
      return user;
    } catch (error) {
      console.error("[Storage] Failed to upsert user:", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.createdAt);
  }

  async updateUser(id: string, updates: Partial<UpsertUser>): Promise<User | undefined> {
    try {
      console.log("[Storage] Updating user:", id, "with", Object.keys(updates));
      const [user] = await db
        .update(users)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();
      console.log("[Storage] User updated successfully");
      return user;
    } catch (error) {
      console.error("[Storage] Failed to update user:", error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return true;
  }

  async updateLoginStats(userId: string): Promise<void> {
    try {
      console.log("[Storage] Updating login stats for user:", userId);
      await db
        .update(users)
        .set({
          lastLoginAt: new Date(),
          loginCount: sql`${users.loginCount} + 1`,
        })
        .where(eq(users.id, userId));
      console.log("[Storage] Login stats updated successfully");
    } catch (error) {
      console.error("[Storage] Failed to update login stats:", error);
      throw error;
    }
  }

  async getUserStats(): Promise<{
    total: number;
    verified: number;
    admins: number;
    byProvider: Record<string, number>;
    recentSignups: number;
  }> {
    const allUsers = await db.select().from(users);
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const stats = {
      total: allUsers.length,
      verified: allUsers.filter(u => u.emailVerified).length,
      admins: allUsers.filter(u => u.isAdmin).length,
      byProvider: {} as Record<string, number>,
      recentSignups: allUsers.filter(u => u.createdAt && new Date(u.createdAt) > sevenDaysAgo).length,
    };

    allUsers.forEach(u => {
      const provider = u.authProvider || 'unknown';
      stats.byProvider[provider] = (stats.byProvider[provider] || 0) + 1;
    });

    return stats;
  }

  // Admin activity operations
  async logAdminActivity(log: InsertAdminActivityLog): Promise<AdminActivityLog> {
    const [activity] = await db.insert(adminActivityLogs).values(log).returning();
    return activity;
  }

  async getAdminActivities(limit: number = 50): Promise<AdminActivityLog[]> {
    return await db
      .select()
      .from(adminActivityLogs)
      .orderBy(sql`${adminActivityLogs.createdAt} DESC`)
      .limit(limit);
  }

  async getAdminActivitiesByAdmin(adminId: string, limit: number = 50): Promise<AdminActivityLog[]> {
    return await db
      .select()
      .from(adminActivityLogs)
      .where(eq(adminActivityLogs.adminId, adminId))
      .orderBy(sql`${adminActivityLogs.createdAt} DESC`)
      .limit(limit);
  }

  async updateAdminAction(adminId: string): Promise<void> {
    await db
      .update(users)
      .set({ lastAdminAction: new Date() })
      .where(eq(users.id, adminId));
  }

  // Address operations
  async getUserAddresses(userId: string): Promise<Address[]> {
    return await db.select().from(addresses).where(eq(addresses.userId, userId));
  }

  async createAddress(address: InsertAddress): Promise<Address> {
    const [created] = await db.insert(addresses).values(address).returning();
    return created;
  }

  async updateAddress(id: string, updates: Partial<InsertAddress>): Promise<Address | undefined> {
    const [updated] = await db
      .update(addresses)
      .set(updates)
      .where(eq(addresses.id, id))
      .returning();
    return updated;
  }

  async deleteAddress(id: string): Promise<boolean> {
    const result = await db.delete(addresses).where(eq(addresses.id, id));
    return true;
  }

  // Order operations
  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [created] = await db.insert(orders).values(order).returning();
    return created;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [updated] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updated;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [created] = await db.insert(orderItems).values(item).returning();
    return created;
  }

  // Blog operations
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(sql`${blogPosts.createdAt} DESC`);
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(post: Omit<InsertBlogPost, "id">): Promise<BlogPost> {
    const [created] = await db.insert(blogPosts).values(post).returning();
    return created;
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db
      .update(blogPosts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return true;
  }

  // Notification operations
  async getUserNotifications(userId: string): Promise<Notification[]> {
    const result = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(sql`${notifications.createdAt} DESC`)
      .limit(50);
    return result;
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [created] = await db.insert(notifications).values(notification).returning();
    return created;
  }

  async markNotificationAsRead(id: string, userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(sql`${notifications.id} = ${id} AND ${notifications.userId} = ${userId}`);
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, userId));
  }

  async deleteNotification(id: string, userId: string): Promise<void> {
    await db
      .delete(notifications)
      .where(sql`${notifications.id} = ${id} AND ${notifications.userId} = ${userId}`);
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(sql`${notifications.userId} = ${userId} AND ${notifications.read} = false`);
    return result[0]?.count || 0;
  }
}

export const storage = new MemStorage();
