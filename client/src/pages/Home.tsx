import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight, Shield, Leaf, Truck, Award } from "lucide-react";
import { products } from "@/data/products";
import { blogPosts } from "@/data/blogs";

export default function Home() {
  const latestPosts = blogPosts.filter(p => p.published).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="container relative z-10 mx-auto px-4 md:px-6 py-24 md:py-32">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight" data-testid="text-hero-title">
                Premium Golf Cart <br />
                <span className="text-primary">Clear Spray Protection</span>
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

        {/* Featured Products */}
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Products</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose from our premium line of golf cart spray cleaners
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 border-y">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On all orders, no minimum</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">30-Day Guarantee</h3>
                <p className="text-sm text-muted-foreground">Money-back if not satisfied</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Eco-Friendly</h3>
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

        {/* Blog Preview */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">From Our Blog</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tips and insights for golf cart maintenance
              </p>
            </div>

            {latestPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestPosts.map((post, index) => (
                  <Link key={index} href={`/blog/${post.slug}`}>
                    <div className="group hover-elevate rounded-lg overflow-hidden transition-all duration-200">
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img
                          src={post.heroImage}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6 bg-card">
                        <span className="text-xs font-semibold text-primary uppercase">{post.category}</span>
                        <h3 className="text-xl font-semibold mt-2 mb-3 line-clamp-2">{post.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
                        <Button variant="link" className="mt-4 p-0">
                          Read More <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg" data-testid="button-view-all-posts">
                <Link href="/blog">
                  View All Posts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
