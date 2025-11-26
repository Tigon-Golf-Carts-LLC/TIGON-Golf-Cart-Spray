import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table - Required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Products table
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar("image_url").notNull(),
  features: text("features").array().notNull().default(sql`ARRAY[]::text[]`),
  specifications: text("specifications").notNull(),
  inStock: boolean("in_stock").default(true).notNull(),
  amazonUrl: varchar("amazon_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Orders table
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  email: varchar("email").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default('pending'),
  shippingName: varchar("shipping_name").notNull(),
  shippingAddress: varchar("shipping_address").notNull(),
  shippingCity: varchar("shipping_city").notNull(),
  shippingState: varchar("shipping_state").notNull(),
  shippingZip: varchar("shipping_zip").notNull(),
  stripePaymentId: varchar("stripe_payment_id"),
  affiliateId: varchar("affiliate_id").references(() => affiliates.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Order Items table
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// Cart Items table (for logged-in users)
export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

// Affiliates table
export const affiliates = pgTable("affiliates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  affiliateCode: varchar("affiliate_code", { length: 20 }).notNull().unique(),
  totalClicks: integer("total_clicks").notNull().default(0),
  totalSales: integer("total_sales").notNull().default(0),
  totalCommission: decimal("total_commission", { precision: 10, scale: 2 }).notNull().default('0'),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull().default('10'),
  status: varchar("status", { length: 50 }).notNull().default('active'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAffiliateSchema = createInsertSchema(affiliates).omit({
  id: true,
  totalClicks: true,
  totalSales: true,
  totalCommission: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAffiliate = z.infer<typeof insertAffiliateSchema>;
export type Affiliate = typeof affiliates.$inferSelect;

// Affiliate Clicks table
export const affiliateClicks = pgTable("affiliate_clicks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  affiliateId: varchar("affiliate_id").references(() => affiliates.id).notNull(),
  productId: varchar("product_id").references(() => products.id),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAffiliateClickSchema = createInsertSchema(affiliateClicks).omit({
  id: true,
  createdAt: true,
});

export type InsertAffiliateClick = z.infer<typeof insertAffiliateClickSchema>;
export type AffiliateClick = typeof affiliateClicks.$inferSelect;

// Affiliate Sales table
export const affiliateSales = pgTable("affiliate_sales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  affiliateId: varchar("affiliate_id").references(() => affiliates.id).notNull(),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  commission: decimal("commission", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAffiliateSaleSchema = createInsertSchema(affiliateSales).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAffiliateSale = z.infer<typeof insertAffiliateSaleSchema>;
export type AffiliateSale = typeof affiliateSales.$inferSelect;

// Blog Posts table
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  heroImage: varchar("hero_image").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  metaTitle: varchar("meta_title", { length: 60 }),
  metaDescription: varchar("meta_description", { length: 160 }),
  published: boolean("published").default(true).notNull(),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  orders: many(orders),
  cartItems: many(cartItems),
  affiliate: one(affiliates, {
    fields: [users.id],
    references: [affiliates.userId],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  cartItems: many(cartItems),
  affiliateClicks: many(affiliateClicks),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
  affiliate: one(affiliates, {
    fields: [orders.affiliateId],
    references: [affiliates.id],
  }),
  affiliateSale: one(affiliateSales),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const affiliatesRelations = relations(affiliates, ({ one, many }) => ({
  user: one(users, {
    fields: [affiliates.userId],
    references: [users.id],
  }),
  clicks: many(affiliateClicks),
  sales: many(affiliateSales),
  orders: many(orders),
}));

export const affiliateClicksRelations = relations(affiliateClicks, ({ one }) => ({
  affiliate: one(affiliates, {
    fields: [affiliateClicks.affiliateId],
    references: [affiliates.id],
  }),
  product: one(products, {
    fields: [affiliateClicks.productId],
    references: [products.id],
  }),
}));

export const affiliateSalesRelations = relations(affiliateSales, ({ one }) => ({
  affiliate: one(affiliates, {
    fields: [affiliateSales.affiliateId],
    references: [affiliates.id],
  }),
  order: one(orders, {
    fields: [affiliateSales.orderId],
    references: [orders.id],
  }),
}));
