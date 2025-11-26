import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Check, ExternalLink } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:slug");
  const { toast } = useToast();
  const { addItem } = useCart();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${params?.slug}`],
    enabled: !!params?.slug,
  });

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Skeleton className="aspect-square" />
              <div className="space-y-6">
                <Skeleton className="h-12" />
                <Skeleton className="h-24" />
                <Skeleton className="h-32" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The product you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link href="/products">Back to Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-foreground">Products</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  data-testid="img-product"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                {product.inStock ? (
                  <Badge variant="default" className="mb-4" data-testid="badge-in-stock">
                    <Check className="mr-1 h-3 w-3" />
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="mb-4" data-testid="badge-out-of-stock">
                    Out of Stock
                  </Badge>
                )}
                <h1 className="text-4xl font-bold mb-4" data-testid="text-product-name">
                  {product.name}
                </h1>
                <p className="text-3xl font-bold text-primary" data-testid="text-product-price">
                  ${parseFloat(product.price).toFixed(2)}
                </p>
              </div>

              <p className="text-lg text-muted-foreground" data-testid="text-product-description">
                {product.description}
              </p>

              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Key Features:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-3 pt-4">
                <Button
                  size="lg"
                  className="w-full text-lg"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  data-testid="button-buy-now"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>

                {product.amazonUrl && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full text-lg"
                    asChild
                    data-testid="button-buy-amazon"
                  >
                    <a href={product.amazonUrl} target="_blank" rel="noopener noreferrer">
                      Buy on Amazon
                      <ExternalLink className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                )}
              </div>

              {/* Specifications */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="specifications">
                  <AccordionTrigger>Product Specifications</AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p>{product.specifications}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                  <AccordionTrigger>Shipping Information</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Free shipping on all orders. Orders are typically processed within 1-2 business days. 
                      Delivery times vary by location, typically 3-5 business days.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="returns">
                  <AccordionTrigger>Returns & Guarantee</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      30-day money-back guarantee. If you're not completely satisfied with your purchase, 
                      return it within 30 days for a full refund.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
