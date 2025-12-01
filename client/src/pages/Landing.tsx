import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Truck, Award, Check, Droplets, Car, Leaf } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO, seoPresets } from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@shared/schema";

export default function Landing() {
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SEO {...seoPresets.home} />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="container relative z-10 mx-auto px-4 md:px-6 py-24 md:py-32">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight" data-testid="text-hero-title">
                Premium Golf Cart <br />
                <span className="text-primary">Cleaner Spray & Protection</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-hero-subtitle">
                Professional-grade cleaning and protection solutions for golf cart maintenance. 
                Keep your cart looking pristine with TIGON Spray.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-lg px-8" data-testid="button-shop-now">
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8" data-testid="button-learn-more">
                  <Link href="/blog">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-products-title">
                Our Products
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Premium golf cart cleaning and protection solutions for every surface
              </p>
            </div>
            
            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            
            <div className="text-center mt-10">
              <Button size="lg" asChild className="text-lg px-8" data-testid="button-view-all-products">
                <Link href="/products">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 border-b">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">$25 Flat Rate Shipping</h3>
                <p className="text-sm text-muted-foreground">Nationwide delivery</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Best Scents</h3>
                <p className="text-sm text-muted-foreground">Lemon, Grape & Watermelon</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">The Safest Golf Cart Cleaner</h3>
                <p className="text-sm text-muted-foreground">Safe for the environment</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Made in USA</h3>
                <p className="text-sm text-muted-foreground">Quality you can trust</p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Section 1: Lemon Scented Golf Cart Seat Cleaner */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/30" id="lemon-seat-cleaner" data-testid="section-lemon-cleaner">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Droplets className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold" data-testid="heading-lemon-cleaner">
                  Lemon Scented Golf Cart Seat Cleaner
                </h2>
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  <strong>Lemon Scented Golf Cart Seat Cleaner</strong> is a professional-grade cleaning solution specifically formulated to clean, protect, and refresh golf cart seats. This premium aerosol spray combines powerful cleaning agents with a natural lemon fragrance to remove dirt, stains, sweat, sunscreen, and everyday grime from vinyl, leather, and fabric golf cart seats.
                </p>
              </div>

              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">What Does Lemon Scented Golf Cart Seat Cleaner Do?</h3>
                  <p className="text-muted-foreground mb-4">
                    Our lemon scented golf cart seat cleaner penetrates deep into seat materials to lift and dissolve stubborn stains, body oils, and embedded dirt. The refreshing lemon scent eliminates odors and leaves your golf cart interior smelling fresh and clean. Safe for daily use on all seat types including vinyl seats, leather upholstery, and fabric cushions commonly found in Club Car, EZGO, Yamaha, and other golf cart brands.
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Removes tough stains from golf cart seats</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Safe for vinyl, leather, and fabric seats</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Eliminates odors with natural lemon scent</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Professional 18 oz aerosol formula</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Made in USA with quality ingredients</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Works on Club Car, EZGO, Yamaha & more</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">How to Use Lemon Scented Golf Cart Seat Cleaner</h3>
                <p className="text-muted-foreground">
                  Shake well before use. Hold can 6-8 inches from seat surface and spray evenly. Allow the lemon-scented formula to penetrate for 30 seconds, then wipe clean with a microfiber cloth. For heavy stains on golf cart seats, apply a second coat and gently agitate with a soft brush. Your seats will be left clean, protected, and smelling like fresh lemons.
                </p>
              </div>

              <div className="mt-8 text-center">
                <Button size="lg" asChild data-testid="button-shop-lemon">
                  <Link href="/products/lemon-scent-golf-cart-seat-cleaner">
                    Shop Lemon Seat Cleaner - $10.00
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Section 2: Grape Scented Golf Cart Body and Windshield Cleaner */}
        <section className="py-20 bg-muted/30" id="grape-body-cleaner" data-testid="section-grape-cleaner">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Car className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold" data-testid="heading-grape-cleaner">
                  Grape Scented Golf Cart Body and Windshield Cleaner
                </h2>
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  <strong>Grape Scented Golf Cart Body and Windshield Cleaner</strong> is a specialized exterior cleaning solution designed to safely clean and shine all golf cart body panels, windshields, and exterior surfaces. This professional-grade cleaner features a pleasant grape fragrance while delivering streak-free results on plastic, fiberglass, acrylic, and painted surfaces.
                </p>
              </div>

              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">What Does Grape Scented Golf Cart Body and Windshield Cleaner Do?</h3>
                  <p className="text-muted-foreground mb-4">
                    Our grape scented golf cart body and windshield cleaner cuts through bugs, tree sap, bird droppings, dust, pollen, and road grime that accumulate on golf cart exteriors. The advanced formula is specially designed for golf cart materials including acrylic windshields, plastic body panels, fiberglass tops, and painted surfaces. Leaves a crystal-clear, streak-free finish on windshields for improved visibility on the course.
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Streak-free windshield cleaning formula</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Removes bugs, sap, and bird droppings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Safe for acrylic, plastic, and fiberglass</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Pleasant grape scent fragrance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Professional 13.75 oz spray can</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Won't damage paint or clear coats</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <div className="bg-background rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-3">How to Use Grape Scented Golf Cart Body and Windshield Cleaner</h3>
                <p className="text-muted-foreground">
                  For best results, use on a cool surface out of direct sunlight. Spray the grape scented cleaner directly onto the golf cart body panels or windshield. Wipe with a clean microfiber towel in straight, overlapping strokes. For windshields, buff to a streak-free shine. For heavy contamination like tree sap or dried bugs, allow the cleaner to sit for 60 seconds before wiping. Your golf cart will look showroom-clean with a refreshing grape scent.
                </p>
              </div>

              <div className="mt-8 text-center">
                <Button size="lg" asChild data-testid="button-shop-grape">
                  <Link href="/products/grape-scent-golf-cart-body-windshield-cleaner">
                    Shop Grape Body Cleaner - $10.00
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Section 3: Watermelon Scented Golf Cart Vinyl and Plastic Cleaner */}
        <section className="py-20 bg-gradient-to-b from-muted/30 to-background" id="watermelon-vinyl-cleaner" data-testid="section-watermelon-cleaner">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold" data-testid="heading-watermelon-cleaner">
                  Watermelon Scented Golf Cart Vinyl and Plastic Cleaner and Protective Coating
                </h2>
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  <strong>Watermelon Scented Golf Cart Vinyl and Plastic Cleaner and Protective Coating</strong> is a dual-action formula that cleans and protects all vinyl and plastic surfaces on your golf cart. This premium product combines professional cleaning power with UV-protective coating technology to restore shine, prevent fading, and extend the life of your golf cart's interior and exterior plastic components.
                </p>
              </div>

              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">What Does Watermelon Scented Golf Cart Vinyl and Plastic Cleaner Do?</h3>
                  <p className="text-muted-foreground mb-4">
                    Our watermelon scented golf cart vinyl and plastic cleaner provides complete care for dashboards, steering wheels, cup holders, plastic trim, vinyl surfaces, and all interior plastics. The protective coating shields against harmful UV rays that cause fading, cracking, and deterioration. Perfect for maintaining golf cart interiors exposed to constant sun and weather conditions on the course.
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Cleans AND protects in one application</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>UV protection prevents fading and cracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Restores original shine to vinyl and plastic</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Sweet watermelon fragrance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Professional 12 oz protective formula</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Non-greasy, non-slip finish</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">How to Use Watermelon Scented Golf Cart Vinyl and Plastic Cleaner</h3>
                <p className="text-muted-foreground">
                  Spray the watermelon scented vinyl and plastic cleaner directly onto surfaces or onto a microfiber applicator pad. Work the product into the vinyl or plastic surface using circular motions. Allow the protective coating to bond for 1-2 minutes, then buff with a clean, dry cloth for a brilliant, non-greasy shine. The UV-protective barrier will help prevent sun damage while the watermelon scent leaves your golf cart smelling amazing.
                </p>
              </div>

              <div className="mt-8 text-center">
                <Button size="lg" asChild data-testid="button-shop-watermelon">
                  <Link href="/products/watermelon-scent-golf-cart-vinyl-plastic-coating">
                    Shop Watermelon Vinyl Protector - $10.00
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to protect your golf cart?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of satisfied customers who trust TIGON Spray for their golf cart maintenance.
              </p>
              <div className="pt-4">
                <Button size="lg" asChild className="text-lg px-8" data-testid="button-get-started">
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
