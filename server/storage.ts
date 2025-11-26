// Database storage implementation
import {
  users,
  products,
  orders,
  orderItems,
  cartItems,
  affiliates,
  affiliateClicks,
  affiliateSales,
  blogPosts,
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type CartItem,
  type InsertCartItem,
  type Affiliate,
  type InsertAffiliate,
  type AffiliateClick,
  type InsertAffiliateClick,
  type AffiliateSale,
  type InsertAffiliateSale,
  type BlogPost,
  type InsertBlogPost,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { randomBytes } from "crypto";

export interface IStorage {
  // User operations - Required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<void>;

  // Order operations
  getAllOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Order Items operations
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;

  // Cart operations
  getUserCartItems(userId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<void>;
  clearUserCart(userId: string): Promise<void>;

  // Affiliate operations
  getAffiliate(id: string): Promise<Affiliate | undefined>;
  getAffiliateByUserId(userId: string): Promise<Affiliate | undefined>;
  getAffiliateByCode(code: string): Promise<Affiliate | undefined>;
  getAllAffiliates(): Promise<Affiliate[]>;
  createAffiliate(userId: string): Promise<Affiliate>;
  updateAffiliateStats(id: string, stats: { totalClicks?: number; totalSales?: number; totalCommission?: string }): Promise<Affiliate | undefined>;

  // Affiliate Clicks operations
  createAffiliateClick(click: InsertAffiliateClick): Promise<AffiliateClick>;

  // Affiliate Sales operations
  getAllAffiliateSales(): Promise<AffiliateSale[]>;
  getAffiliateSales(affiliateId: string): Promise<AffiliateSale[]>;
  createAffiliateSale(sale: InsertAffiliateSale): Promise<AffiliateSale>;

  // Blog operations
  getAllBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
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
    return user;
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(products.createdAt);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product;
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(productData).returning();
    return product;
  }

  async updateProduct(id: string, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set({ ...productData, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Order operations
  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(orderData).returning();
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  // Order Items operations
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(itemData: InsertOrderItem): Promise<OrderItem> {
    const [item] = await db.insert(orderItems).values(itemData).returning();
    return item;
  }

  // Cart operations
  async getUserCartItems(userId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }

  async addToCart(itemData: InsertCartItem): Promise<CartItem> {
    const [item] = await db.insert(cartItems).values(itemData).returning();
    return item;
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined> {
    const [item] = await db
      .update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, id))
      .returning();
    return item;
  }

  async removeFromCart(id: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearUserCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Affiliate operations
  async getAffiliate(id: string): Promise<Affiliate | undefined> {
    const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.id, id));
    return affiliate;
  }

  async getAffiliateByUserId(userId: string): Promise<Affiliate | undefined> {
    const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.userId, userId));
    return affiliate;
  }

  async getAffiliateByCode(code: string): Promise<Affiliate | undefined> {
    const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.affiliateCode, code));
    return affiliate;
  }

  async getAllAffiliates(): Promise<Affiliate[]> {
    return await db.select().from(affiliates).orderBy(desc(affiliates.createdAt));
  }

  async createAffiliate(userId: string): Promise<Affiliate> {
    // Generate unique affiliate code
    const code = randomBytes(6).toString('hex').toUpperCase();
    const [affiliate] = await db
      .insert(affiliates)
      .values({
        userId,
        affiliateCode: code,
      })
      .returning();
    return affiliate;
  }

  async updateAffiliateStats(
    id: string,
    stats: { totalClicks?: number; totalSales?: number; totalCommission?: string }
  ): Promise<Affiliate | undefined> {
    const [affiliate] = await db
      .update(affiliates)
      .set({ ...stats, updatedAt: new Date() })
      .where(eq(affiliates.id, id))
      .returning();
    return affiliate;
  }

  // Affiliate Clicks operations
  async createAffiliateClick(clickData: InsertAffiliateClick): Promise<AffiliateClick> {
    const [click] = await db.insert(affiliateClicks).values(clickData).returning();
    return click;
  }

  // Affiliate Sales operations
  async getAllAffiliateSales(): Promise<AffiliateSale[]> {
    return await db.select().from(affiliateSales).orderBy(desc(affiliateSales.createdAt));
  }

  async getAffiliateSales(affiliateId: string): Promise<AffiliateSale[]> {
    return await db
      .select()
      .from(affiliateSales)
      .where(eq(affiliateSales.affiliateId, affiliateId))
      .orderBy(desc(affiliateSales.createdAt));
  }

  async createAffiliateSale(saleData: InsertAffiliateSale): Promise<AffiliateSale> {
    const [sale] = await db.insert(affiliateSales).values(saleData).returning();
    return sale;
  }

  // Blog operations
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(postData: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(postData).returning();
    return post;
  }

  async updateBlogPost(id: string, postData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [post] = await db
      .update(blogPosts)
      .set({ ...postData, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return post;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }
}

export const storage = new DatabaseStorage();
