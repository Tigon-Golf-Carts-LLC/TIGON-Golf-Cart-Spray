import type { Product } from "@shared/schema";

export const products: Omit<Product, "createdAt" | "updatedAt">[] = [
  {
    id: "1",
    name: "Lemon Scent Golf Cart Seat Cleaner",
    slug: "lemon-scent-golf-cart-seat-cleaner",
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
    isUpcoming: false,
    amazonUrl: null,
  },
  {
    id: "2",
    name: "Grape Scent Golf Cart Body & Windshield Cleaner",
    slug: "grape-scent-golf-cart-body-windshield-cleaner",
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
    isUpcoming: false,
    amazonUrl: null,
  },
  {
    id: "3",
    name: "Watermelon Scent Golf Cart Vinyl & Plastic Coating",
    slug: "watermelon-scent-golf-cart-vinyl-plastic-coating",
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
    isUpcoming: false,
    amazonUrl: null,
  },
  {
    id: "4",
    name: "12 Pack Bundle - Complete Golf Cart Cleaning Kit",
    slug: "12-pack-golf-cart-cleaner-protection-bundle",
    description: "The ultimate golf cart cleaning bundle! Get all three TIGON cleaners - 4 Lemon Scent Seat Cleaners, 4 Grape Scent Body & Windshield Cleaners, and 4 Watermelon Scent Vinyl & Plastic Coatings. Everything you need to keep your golf cart looking showroom new.",
    price: "99.00",
    imageUrl: "/attached_assets/12 PACK BUNDLE OF GOLF CART CLEANERS_1764608944764.jpg",
    features: [
      "12 cans total - 4 of each cleaner",
      "4x Lemon Scent Seat Cleaner",
      "4x Grape Scent Body & Windshield Cleaner",
      "4x Watermelon Scent Vinyl & Plastic Coating",
      "Complete cleaning solution for your golf cart",
      "Best value - Save over 15%",
      "Nationwide shipping - $25.00 flat rate"
    ],
    specifications: "Bundle includes: 4x 18 oz Seat Cleaner + 4x 13.75 oz Body Cleaner + 4x 12 oz Vinyl Coating | Made in USA",
    inStock: true,
    isUpcoming: false,
    amazonUrl: null,
  },
];

export const upcomingProducts: Omit<Product, "createdAt" | "updatedAt">[] = [];

export function getProductBySlug(slug: string): Omit<Product, "createdAt" | "updatedAt"> | undefined {
  return products.find(p => p.slug === slug);
}

export function getProductById(id: string): Omit<Product, "createdAt" | "updatedAt"> | undefined {
  return products.find(p => p.id === id);
}
