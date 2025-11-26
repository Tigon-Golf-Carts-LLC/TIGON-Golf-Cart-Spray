import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { insertProductSchema, insertOrderSchema, insertBlogPostSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:slug', async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Track affiliate click if ref parameter is present
      const affiliateCode = req.query.ref as string;
      if (affiliateCode) {
        const affiliate = await storage.getAffiliateByCode(affiliateCode);
        if (affiliate) {
          await storage.createAffiliateClick({
            affiliateId: affiliate.id,
            productId: product.id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
          });

          // Update affiliate click count
          await storage.updateAffiliateStats(affiliate.id, {
            totalClicks: affiliate.totalClicks + 1,
          });
        }
      }

      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Admin-only product management
  app.post('/api/admin/products', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const parsed = insertProductSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: fromZodError(parsed.error).toString() });
      }

      const product = await storage.createProduct(parsed.data);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Order routes
  app.post('/api/orders', async (req, res) => {
    try {
      const { items, ...orderData } = req.body;

      // Check for affiliate code in session or cookie
      const affiliateCode = req.cookies?.affiliateRef || req.session?.affiliateRef;
      let affiliateId = null;

      if (affiliateCode) {
        const affiliate = await storage.getAffiliateByCode(affiliateCode);
        if (affiliate) {
          affiliateId = affiliate.id;
        }
      }

      // Create order
      const order = await storage.createOrder({
        ...orderData,
        affiliateId,
      });

      // Create order items
      for (const item of items) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
      }

      // If affiliate, create affiliate sale
      if (affiliateId) {
        const affiliate = await storage.getAffiliate(affiliateId);
        if (affiliate) {
          const commission = (parseFloat(order.total) * parseFloat(affiliate.commissionRate)) / 100;

          await storage.createAffiliateSale({
            affiliateId,
            orderId: order.id,
            commission: commission.toFixed(2),
            status: 'pending',
          });

          // Update affiliate stats
          await storage.updateAffiliateStats(affiliateId, {
            totalSales: affiliate.totalSales + 1,
            totalCommission: (parseFloat(affiliate.totalCommission) + commission).toFixed(2),
          });
        }
      }

      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get('/api/admin/orders', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Affiliate routes
  app.get('/api/affiliate/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const affiliate = await storage.getAffiliateByUserId(userId);

      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate account not found" });
      }

      res.json(affiliate);
    } catch (error) {
      console.error("Error fetching affiliate:", error);
      res.status(500).json({ message: "Failed to fetch affiliate" });
    }
  });

  app.post('/api/affiliate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      // Check if user already has an affiliate account
      const existing = await storage.getAffiliateByUserId(userId);
      if (existing) {
        return res.status(400).json({ message: "Affiliate account already exists" });
      }

      const affiliate = await storage.createAffiliate(userId);
      res.status(201).json(affiliate);
    } catch (error) {
      console.error("Error creating affiliate:", error);
      res.status(500).json({ message: "Failed to create affiliate" });
    }
  });

  app.get('/api/affiliate/sales', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const affiliate = await storage.getAffiliateByUserId(userId);

      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate account not found" });
      }

      const sales = await storage.getAffiliateSales(affiliate.id);
      res.json(sales);
    } catch (error) {
      console.error("Error fetching affiliate sales:", error);
      res.status(500).json({ message: "Failed to fetch affiliate sales" });
    }
  });

  app.get('/api/admin/affiliates', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const affiliates = await storage.getAllAffiliates();
      res.json(affiliates);
    } catch (error) {
      console.error("Error fetching affiliates:", error);
      res.status(500).json({ message: "Failed to fetch affiliates" });
    }
  });

  app.get('/api/admin/affiliate-sales', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const sales = await storage.getAllAffiliateSales();
      res.json(sales);
    } catch (error) {
      console.error("Error fetching affiliate sales:", error);
      res.status(500).json({ message: "Failed to fetch affiliate sales" });
    }
  });

  // Blog routes
  app.get('/api/blog', async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get('/api/blog/:slug', async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.get('/api/admin/blog', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post('/api/admin/blog', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const parsed = insertBlogPostSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: fromZodError(parsed.error).toString() });
      }

      const post = await storage.createBlogPost(parsed.data);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  return httpServer;
}
