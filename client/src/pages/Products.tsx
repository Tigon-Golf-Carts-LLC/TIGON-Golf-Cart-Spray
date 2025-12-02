import { ProductCard } from "@/components/ProductCard";
import { UpcomingProductCard } from "@/components/UpcomingProductCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO, seoPresets } from "@/components/SEO";
import { Clock } from "lucide-react";
import { products, upcomingProducts } from "@/data/products";

export default function Products() {
  return (
    <div className="flex min-h-screen flex-col">
      <SEO {...seoPresets.products} />
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-page-title">
              Golf Cart Cleaner & Protection Products
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional golf cart spray cleaners for superior protection and maintenance
            </p>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products available at the moment.</p>
            </div>
          )}

          {/* Upcoming Scents Section */}
          {(upcomingProducts && upcomingProducts.length > 0) && (
            <div className="mt-20">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                  <h2 className="text-3xl md:text-4xl font-bold" data-testid="text-upcoming-scents-title">
                    Upcoming Scents
                  </h2>
                </div>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Be the first to know when these exciting new scents become available.
                  Sign up to get notified!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {upcomingProducts.map((product) => (
                  <UpcomingProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
