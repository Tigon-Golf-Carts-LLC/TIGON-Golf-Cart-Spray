import { storage } from "./storage";
import type { InsertProduct, InsertBlogPost } from "@shared/schema";

async function seed() {
  console.log("🌱 Starting database seed...");

  // Create 4 TIGON Spray Products
  const products: InsertProduct[] = [
    {
      name: "TIGON Spray Original Formula",
      slug: "tigon-spray-original-formula",
      description: "The original TIGON Spray formula provides superior protection and cleaning for your golf cart. Our proven blend removes dirt, grime, and buildup while creating a protective barrier against the elements.",
      price: "24.99",
      imageUrl: "/attached_assets/generated_images/tigon_original_formula_bottle.png",
      features: [
        "Fast-acting spray formula",
        "Safe for all golf cart surfaces",
        "UV protection coating",
        "Easy application, no rinsing required",
        "16 oz professional-grade bottle"
      ],
      specifications: "Size: 16 oz | pH Balanced | Biodegradable Formula | Made in USA",
      inStock: true,
      amazonUrl: "https://amazon.com/tigon-spray-original",
    },
    {
      name: "TIGON Spray Pro Shield",
      slug: "tigon-spray-pro-shield",
      description: "Advanced professional-grade protection for demanding golf course conditions. Pro Shield offers enhanced durability and extended protection for golf carts exposed to harsh weather and frequent use.",
      price: "34.99",
      imageUrl: "/attached_assets/generated_images/tigon_pro_shield_bottle.png",
      features: [
        "Professional-grade formula",
        "Extended UV protection",
        "Water-resistant coating",
        "Prevents oxidation and fading",
        "20 oz commercial-strength bottle"
      ],
      specifications: "Size: 20 oz | Commercial Grade | All-Weather Formula | Made in USA",
      inStock: true,
      amazonUrl: "https://amazon.com/tigon-spray-pro-shield",
    },
    {
      name: "TIGON Spray Ultra Clean",
      slug: "tigon-spray-ultra-clean",
      description: "Maximum cleaning power for the toughest jobs. Ultra Clean's enhanced formula tackles stubborn stains, tree sap, bird droppings, and heavy oxidation while maintaining surface integrity.",
      price: "29.99",
      imageUrl: "/attached_assets/generated_images/tigon_ultra_clean_bottle.png",
      features: [
        "Maximum cleaning strength",
        "Removes tough stains and oxidation",
        "Deep cleaning action",
        "Safe for plastics and vinyl",
        "18 oz heavy-duty formula"
      ],
      specifications: "Size: 18 oz | Heavy-Duty Cleaner | Safe for All Surfaces | Made in USA",
      inStock: true,
      amazonUrl: "https://amazon.com/tigon-spray-ultra-clean",
    },
    {
      name: "TIGON Spray Elite Protection",
      slug: "tigon-spray-elite-protection",
      description: "Our premium flagship formula combining cleaning and protection in one superior product. Elite Protection delivers showroom-quality results with long-lasting shine and unmatched durability.",
      price: "44.99",
      imageUrl: "/attached_assets/generated_images/tigon_elite_protection_bottle.png",
      features: [
        "Premium 2-in-1 formula",
        "Showroom-quality shine",
        "Maximum UV protection",
        "Hydrophobic water-repelling coat",
        "24 oz professional formula"
      ],
      specifications: "Size: 24 oz | Premium Formula | Extended Protection | Made in USA",
      inStock: true,
      amazonUrl: "https://amazon.com/tigon-spray-elite-protection",
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

Regular application of UV-protective sprays creates a barrier that reflects harmful rays. Products like TIGON Spray Pro Shield contain UV inhibitors that actively protect your cart's surfaces.

## Restoration Techniques

If UV damage has already occurred, don't despair. Many surfaces can be restored with proper cleaning and treatment. Start with a deep clean using TIGON Spray Ultra Clean, then protect with a premium formula.

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

Spray formulas offer convenience and precise application. They're ideal for regular maintenance and spot cleaning. Concentrate formulas provide economy for large fleets or frequent use.

## Safety Considerations

Always choose products that are safe for all golf cart surfaces. Harsh chemicals can damage seats, dashboards, and painted surfaces. Look for biodegradable formulas that are environmentally responsible.

## Application Methods

Different cleaning tasks require different approaches. For general maintenance, spray-and-wipe products like TIGON Spray Original Formula work perfectly. For heavy-duty jobs, choose a more aggressive formula like Ultra Clean.

## Storage and Shelf Life

Store cleaning products in a cool, dry place away from direct sunlight. Most quality formulas have a shelf life of 2-3 years when properly stored.`,
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
