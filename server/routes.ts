import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { insertProductSchema, insertOrderSchema, insertBlogPostSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { getCloverPublicConfig, isCloverConfigured, createCharge } from "./clover";
import { sendOrderConfirmation, sendStoreNotification, isEmailConfigured } from "./email";

const SITE_URL = 'https://tigonspray.com';

// XML escape utility for sitemap generation
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Dynamic Sitemap Generation
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      const blogPosts = await storage.getPublishedBlogPosts();
      const today = new Date().toISOString().split('T')[0];

      // Static pages with priorities
      const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/products', priority: '0.9', changefreq: 'daily' },
        { url: '/blog', priority: '0.8', changefreq: 'daily' },
        { url: '/contact', priority: '0.6', changefreq: 'monthly' },
        { url: '/about', priority: '0.6', changefreq: 'monthly' },
        { url: '/affiliate', priority: '0.7', changefreq: 'monthly' },
      ];

      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

      // Add static pages
      for (const page of staticPages) {
        sitemap += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
      }

      // Add product pages with images
      for (const product of products) {
        const productUrl = `${SITE_URL}/products/${escapeXml(product.slug)}`;
        sitemap += `  <url>
    <loc>${productUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`;
        
        if (product.imageUrl) {
          const imageUrl = product.imageUrl.startsWith('http') 
            ? escapeXml(product.imageUrl) 
            : escapeXml(SITE_URL + product.imageUrl);
          sitemap += `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${escapeXml(product.name)} - Golf Cart Spray Cleaner</image:title>
      <image:caption>${escapeXml(product.description || product.name)}</image:caption>
    </image:image>`;
        }
        
        sitemap += `
  </url>
`;
      }

      // Add blog posts with images
      for (const post of blogPosts) {
        const postUrl = `${SITE_URL}/blog/${escapeXml(post.slug)}`;
        sitemap += `  <url>
    <loc>${postUrl}</loc>
    <lastmod>${post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>`;
        
        if (post.heroImage) {
          const heroImageUrl = post.heroImage.startsWith('http')
            ? escapeXml(post.heroImage)
            : escapeXml(SITE_URL + post.heroImage);
          sitemap += `
    <image:image>
      <image:loc>${heroImageUrl}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
    </image:image>`;
        }
        
        sitemap += `
  </url>
`;
      }

      sitemap += `</urlset>`;

      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // Payment Configuration
  app.get('/api/config/payment', (req, res) => {
    res.json(getCloverPublicConfig());
  });

  // Email Configuration Status
  app.get('/api/config/email', (req, res) => {
    res.json({ configured: isEmailConfigured() });
  });

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
      const { items, paymentToken, ...orderData } = req.body;

      // Check for affiliate code in cookies (set when visiting affiliate links)
      const affiliateCode = req.cookies?.affiliateRef || (req.session as any)?.affiliateRef;
      let affiliateId = null;
      let affiliateCodeUsed = null;

      if (affiliateCode) {
        const affiliate = await storage.getAffiliateByCode(affiliateCode);
        if (affiliate) {
          affiliateId = affiliate.id;
          affiliateCodeUsed = affiliateCode;
        }
      }

      // Process payment if Clover is configured and token is provided
      let paymentResult = null;
      if (isCloverConfigured() && paymentToken) {
        const totalCents = Math.round(parseFloat(orderData.total) * 100);
        paymentResult = await createCharge({
          source: paymentToken,
          amount: totalCents,
          description: `TIGON Spray Order`,
          customerEmail: orderData.email,
        });

        if (!paymentResult.success) {
          return res.status(400).json({ 
            message: 'Payment failed', 
            error: paymentResult.error 
          });
        }
      }

      // Create order with payment info
      const order = await storage.createOrder({
        ...orderData,
        affiliateId,
        status: paymentResult?.success ? 'paid' : 'pending',
        paymentId: paymentResult?.chargeId || null,
        paymentProvider: paymentResult ? 'clover' : null,
      });

      // Create order items and collect product names for email
      const orderItemsForEmail = [];
      for (const item of items) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
        
        // Get product name for email
        const product = await storage.getProduct(item.productId);
        if (product) {
          orderItemsForEmail.push({
            name: product.name,
            quantity: item.quantity,
            price: item.price,
          });
        }
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
            status: paymentResult?.success ? 'confirmed' : 'pending',
          });

          // Update affiliate stats
          await storage.updateAffiliateStats(affiliateId, {
            totalSales: affiliate.totalSales + 1,
            totalCommission: (parseFloat(affiliate.totalCommission) + commission).toFixed(2),
          });
        }
      }

      // Send order confirmation emails (async, don't block response)
      const emailData = {
        orderId: order.id,
        customerEmail: orderData.email,
        customerName: orderData.shippingName,
        items: orderItemsForEmail,
        total: orderData.total,
        shippingAddress: {
          name: orderData.shippingName,
          address: orderData.shippingAddress,
          city: orderData.shippingCity,
          state: orderData.shippingState,
          zip: orderData.shippingZip,
        },
        affiliateCode: affiliateCodeUsed,
      };

      // Send emails in background
      sendOrderConfirmation(emailData).catch(err => 
        console.error('Failed to send order confirmation:', err)
      );
      
      sendStoreNotification({
        orderId: order.id,
        customerEmail: orderData.email,
        customerName: orderData.shippingName,
        total: orderData.total,
        itemCount: items.length,
        hasAffiliate: !!affiliateId,
        affiliateCode: affiliateCodeUsed || undefined,
      }).catch(err => 
        console.error('Failed to send store notification:', err)
      );

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
