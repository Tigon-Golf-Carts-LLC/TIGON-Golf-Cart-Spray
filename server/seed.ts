import { storage } from "./storage";
import type { InsertProduct, InsertBlogPost } from "@shared/schema";

async function seed() {
  console.log("🌱 Starting database seed...");

  // Create TIGON Spray Products - 3 Single Cans + 1 Bundle
  const products: InsertProduct[] = [
    {
      name: "Lemon Scent Golf Cart Seat Cleaner",
      slug: "lemon-scent-seat-cleaner",
      description: "Professional-grade seat cleaner with a refreshing lemon scent. Specially formulated for golf cart seats, this powerful cleaner removes dirt, stains, and grime while leaving a pleasant citrus aroma. Safe for all seat materials including vinyl and leather.",
      price: "10.00",
      imageUrl: "/attached_assets/LEMON SCENT GOLF CART SEAT CLEANER_1764608944764.jpg",
      features: [
        "Refreshing lemon scent",
        "Deep cleaning formula for golf cart seats",
        "Safe for vinyl and leather",
        "Removes tough stains and grime",
        "18 oz professional-grade can",
        "Nationwide shipping - $25.00 flat rate"
      ],
      specifications: "Size: 18 oz (1 LB 2 OZ / 510g) | Aerosol Spray | Made in USA | Flammable - Keep away from heat",
      inStock: true,
      amazonUrl: null,
    },
    {
      name: "Grape Scent Golf Cart Body & Windshield Cleaner",
      slug: "grape-scent-body-windshield-cleaner",
      description: "Complete body and windshield cleaning solution with a delightful grape scent. Cuts through dirt, bugs, tree sap, and road grime on your golf cart's exterior surfaces. Crystal-clear streak-free finish on windshields.",
      price: "10.00",
      imageUrl: "/attached_assets/GRAPE SCENT GOLF CART BODY AND WINDSHIELD CLEANER_1764608944764.jpg",
      features: [
        "Grape scented formula",
        "Body and windshield cleaner",
        "Streak-free windshield finish",
        "Removes bugs, sap, and road grime",
        "13.75 oz professional can",
        "Nationwide shipping - $25.00 flat rate"
      ],
      specifications: "Size: 13.75 oz (390g) | Aerosol Spray | Made in USA | Flammable - Keep away from heat",
      inStock: true,
      amazonUrl: null,
    },
    {
      name: "Watermelon Scent Golf Cart Vinyl & Plastic Coating",
      slug: "watermelon-scent-vinyl-plastic-coating",
      description: "Premium vinyl and plastic coating with a sweet watermelon scent. Protects and restores the shine on all vinyl and plastic surfaces of your golf cart. Provides UV protection to prevent fading and cracking.",
      price: "10.00",
      imageUrl: "/attached_assets/WATERMELON SCENT GOLF CART VINYL & PLASTIC COATING_1764608944764.jpg",
      features: [
        "Sweet watermelon scent",
        "Vinyl and plastic protective coating",
        "Restores original shine",
        "UV protection prevents fading",
        "12 oz professional can",
        "Nationwide shipping - $25.00 flat rate"
      ],
      specifications: "Size: 12 oz (340g) | Aerosol Spray | Made in USA | Flammable - Keep away from heat",
      inStock: true,
      amazonUrl: null,
    },
    {
      name: "9 Pack Bundle - Complete Golf Cart Cleaning Kit",
      slug: "9-pack-bundle-complete-kit",
      description: "The ultimate golf cart cleaning bundle! Get all three TIGON cleaners - 3 Lemon Scent Seat Cleaners, 3 Grape Scent Body & Windshield Cleaners, and 3 Watermelon Scent Vinyl & Plastic Coatings. Everything you need to keep your golf cart looking showroom new.",
      price: "99.00",
      imageUrl: "/attached_assets/12 PACK BUNDLE OF GOLF CART CLEANERS_1764608944764.jpg",
      features: [
        "9 cans total - 3 of each cleaner",
        "3x Lemon Scent Seat Cleaner",
        "3x Grape Scent Body & Windshield Cleaner",
        "3x Watermelon Scent Vinyl & Plastic Coating",
        "Complete cleaning solution for your golf cart",
        "Best value - Save over 30%",
        "Nationwide shipping - $25.00 flat rate"
      ],
      specifications: "Bundle includes: 3x 18 oz Seat Cleaner + 3x 13.75 oz Body Cleaner + 3x 12 oz Vinyl Coating | Made in USA",
      inStock: true,
      amazonUrl: null,
    },
  ];

  console.log("📦 Creating products...");
  for (const product of products) {
    await storage.createProduct(product);
    console.log(`  ✓ Created product: ${product.name}`);
  }

  // Create blog posts
  const blogPosts: InsertBlogPost[] = [
    {
      title: "Complete Golf Cart Maintenance Guide for 2025",
      slug: "complete-golf-cart-maintenance-guide-2025",
      excerpt: "Keep your golf cart running smoothly with this comprehensive maintenance guide. Learn essential tips for cleaning, protecting, and extending the life of your cart.",
      content: `Maintaining your golf cart doesn't have to be complicated. With the right products and regular care, you can keep your cart looking and performing like new for years to come.

## Essential Cleaning Steps

Regular cleaning is the foundation of good golf cart maintenance. Start by removing loose dirt and debris with a soft brush or compressed air. Pay special attention to wheel wells, undercarriage, and hard-to-reach areas where grime accumulates.

## Protection is Key

After cleaning, apply a quality protective spray like TIGON Spray to create a barrier against UV rays, moisture, and environmental contaminants. This step is crucial for preventing oxidation and fading, especially if your cart is stored outdoors.

## Battery Care

Don't forget about your batteries! Check water levels monthly (for flooded batteries) and keep terminals clean and corrosion-free. A well-maintained battery system extends the life of your entire cart.

## Tire Maintenance

Proper tire pressure ensures optimal performance and prevents premature wear. Check pressure monthly and inspect for signs of damage or uneven wear patterns.

## Professional Servicing

While regular DIY maintenance handles most needs, schedule professional service annually for comprehensive inspection of brakes, steering, and electrical systems.`,
      heroImage: "/attached_assets/generated_images/blog-maintenance-guide.png",
      category: "Maintenance",
      published: true,
      publishedAt: new Date("2025-01-15"),
    },
    {
      title: "How to Protect Your Golf Cart from UV Damage",
      slug: "protect-golf-cart-uv-damage",
      excerpt: "UV rays can cause significant damage to your golf cart's finish. Learn how to protect your investment with proper care and the right protective products.",
      content: `The sun is one of your golf cart's biggest enemies. UV radiation breaks down plastics, fades colors, and deteriorates seals and trim. Here's how to fight back.

## Understanding UV Damage

Ultraviolet radiation doesn't just affect paint – it damages every exposed surface on your cart. Plastics become brittle, vinyl cracks, and clear coats oxidize and chalk.

## Prevention Strategies

The best defense against UV damage is prevention. Store your cart in a covered area when not in use. For carts that must stay outdoors, invest in a quality cover that blocks UV rays.

## Protective Coatings

Regular application of UV-protective sprays creates a barrier that reflects harmful rays. Products like TIGON Spray Vinyl & Plastic Coating contain UV inhibitors that actively protect your cart's surfaces.

## Restoration Techniques

If UV damage has already occurred, don't despair. Many surfaces can be restored with proper cleaning and treatment. Start with a deep clean using TIGON Body & Windshield Cleaner, then protect with our vinyl coating.

## Ongoing Maintenance

UV protection isn't a one-time task. Reapply protective products every 2-3 months, or more frequently for carts with heavy sun exposure. Consistency is key to preventing long-term damage.`,
      heroImage: "/attached_assets/generated_images/blog-uv-protection.png",
      category: "Care Tips",
      published: true,
      publishedAt: new Date("2025-01-20"),
    },
    {
      title: "Best Golf Cart Cleaning Products: A Buyer's Guide",
      slug: "best-golf-cart-cleaning-products-guide",
      excerpt: "Not all cleaning products are created equal. Discover what to look for in golf cart cleaners and how to choose the right formula for your needs.",
      content: `Choosing the right cleaning products for your golf cart can be overwhelming. This guide helps you understand what makes a quality cleaner and how to select the best option for your specific needs.

## What to Look For

Quality golf cart cleaners should be pH-balanced to protect surfaces, powerful enough to remove dirt and grime, yet gentle enough not to damage plastics, vinyl, or painted surfaces.

## Formula Types

Aerosol formulas offer convenience and precise application. They're ideal for regular maintenance and spot cleaning. Our TIGON product line includes specialized cleaners for different surfaces - seats, body, windshield, and vinyl/plastic.

## Safety Considerations

Always choose products that are safe for all golf cart surfaces. Harsh chemicals can damage seats, dashboards, and painted surfaces. Look for formulas that are designed specifically for golf cart materials.

## Application Methods

Different cleaning tasks require different products. For seats, use our Lemon Scent Seat Cleaner. For body and windshields, the Grape Scent Body & Windshield Cleaner works perfectly. For vinyl and plastic surfaces, our Watermelon Scent Vinyl & Plastic Coating provides cleaning and protection.

## Best Value

For the best value, consider our 9 Pack Bundle which includes 3 of each cleaner - giving you a complete cleaning solution at over 30% savings compared to buying individually.`,
      heroImage: "/attached_assets/generated_images/blog-buyers-guide.png",
      category: "Product Reviews",
      published: true,
      publishedAt: new Date("2025-01-25"),
    },
  ];

  console.log("📝 Creating blog posts...");
  for (const post of blogPosts) {
    await storage.createBlogPost(post);
    console.log(`  ✓ Created blog post: ${post.title}`);
  }

  console.log("✅ Database seeding completed!");
}

seed()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
