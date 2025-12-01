import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Check, ExternalLink, Star, Clock, Bell, Loader2, X } from "lucide-react";
import { SiAmazon } from "react-icons/si";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SEO } from "@/components/SEO";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:slug");
  const { toast } = useToast();
  const { addItem } = useCart();
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${params?.slug}`],
    enabled: !!params?.slug,
  });

  const backorderMutation = useMutation({
    mutationFn: async (data: { productId: string; email: string }) => {
      const response = await apiRequest("POST", "/api/backorder-signup", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "You're on the list!",
        description: "We'll notify you when this product becomes available.",
      });
      setEmail("");
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Oops!",
        description: error.message || "Failed to join the waitlist. Please try again.",
        variant: "destructive",
      });
    },
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

  const handleWaitlistSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (product && email) {
      backorderMutation.mutate({ productId: product.id, email });
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

  // Generate Amazon URL if not set
  const amazonSearchUrl = product.amazonUrl || 
    `https://www.amazon.com/s?k=${encodeURIComponent(product.name + ' golf cart spray cleaner')}&tag=tigonspray-20`;

  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title={product.name}
        description={product.description}
        canonical={`/products/${product.slug}`}
        type="product"
        image={product.imageUrl}
        keywords={[
          product.name.toLowerCase(),
          'golf cart cleaner',
          'golf cart spray',
          'golf cart protectant',
        ]}
        product={{
          name: product.name,
          price: product.price,
          currency: 'USD',
          availability: product.inStock ? 'InStock' : 'OutOfStock',
          sku: product.slug,
          brand: 'TIGON Spray',
          category: 'Golf Cart Cleaning Supplies',
          image: product.imageUrl,
          description: product.description,
          reviewCount: 47,
          ratingValue: 4.8,
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: product.name, url: `/products/${product.slug}` },
        ]}
      />
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground" data-testid="link-breadcrumb-home">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-foreground" data-testid="link-breadcrumb-products">Products</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

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
                {product.isUpcoming ? (
                  <Badge variant="secondary" className="mb-4 bg-primary text-primary-foreground" data-testid="badge-coming-soon">
                    <Clock className="mr-1 h-3 w-3" />
                    Coming Soon
                  </Badge>
                ) : product.inStock ? (
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
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-primary" data-testid="text-product-price">
                    ${parseFloat(product.price).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      + $25.00 Flat Rate Shipping (per order)
                    </Badge>
                    <Badge variant="outline" className="text-xs">Nationwide</Badge>
                  </div>
                </div>
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

              {/* Rating Display */}
              <div className="flex items-center gap-2 py-2">
                <div className="flex items-center" data-testid="product-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400 fill-yellow-100'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(47 reviews)</span>
              </div>

              <div className="space-y-3 pt-4">
                {product.isUpcoming ? (
                  <div className="space-y-4">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="lg"
                          className="w-full text-lg"
                          data-testid="button-get-notified"
                        >
                          <Bell className="mr-2 h-5 w-5" />
                          Get Notified When Available
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            Join the Waitlist
                          </DialogTitle>
                          <DialogDescription>
                            Be the first to know when <span className="font-semibold">{product.name}</span> becomes available for purchase!
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleWaitlistSignup} className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Input
                              type="email"
                              placeholder="Enter your email address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="w-full"
                              data-testid="input-waitlist-email"
                            />
                            <p className="text-xs text-muted-foreground">
                              We'll only email you when this product is available. No spam, ever.
                            </p>
                          </div>
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={backorderMutation.isPending}
                            data-testid="button-join-waitlist"
                          >
                            {backorderMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Bell className="mr-2 h-4 w-4" />
                            )}
                            {backorderMutation.isPending ? "Signing up..." : "Notify Me"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <p className="text-sm text-center text-muted-foreground">
                      This scent is coming soon! Sign up to be notified when it's available.
                    </p>
                  </div>
                ) : (
                  <>
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

                    {/* Amazon Buy Button - Always Visible */}
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full text-lg bg-[#FF9900] hover:bg-[#FF9900]/90 text-black border-[#FF9900]"
                      asChild
                      data-testid="button-buy-amazon"
                    >
                      <a href={amazonSearchUrl} target="_blank" rel="noopener noreferrer">
                        <SiAmazon className="mr-2 h-5 w-5" />
                        Also Available on Amazon
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Flat rate $25 shipping - Ships anywhere in the USA
                    </p>
                  </>
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
                <AccordionItem value="compositional">
                  <AccordionTrigger>Compositional Statement</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-sm text-muted-foreground">
                      <div>
                        <p className="font-semibold text-foreground mb-1">Contains:</p>
                        <p>Propane, Butane, Butoxyethanol, Citrus Aurantium Dulcis Peel Extract, Ammonium Hydroxide, Citral, Sodium Hydroxide.</p>
                        <p className="mt-1">For more ingredient information, visit <a href="https://www.zenexint.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.zenexint.com</a></p>
                      </div>
                      
                      <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                        <p className="font-semibold text-destructive mb-1">DANGER:</p>
                        <p>Extremely flammable aerosol. Contains gas under pressure; may explode if heated. May cause an allergic skin reaction. May cause damage to organs through prolonged or repeated exposure.</p>
                      </div>
                      
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-3">
                        <p className="font-semibold text-yellow-600 dark:text-yellow-400 mb-1">PRECAUTIONARY STATEMENT:</p>
                        <p>WARNING: Cancer and Reproduction Harm – <a href="https://www.p65warnings.ca.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.p65warnings.ca.gov</a></p>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-foreground mb-1">SHAKE WELL BEFORE USING</p>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-foreground mb-1">FEATURES:</p>
                        <p>A concentrated, high-foaming shampoo treatment that cleans all vinyl, upholstery, and floor carpet. Contains high-potency detergents that remove common stains and soil from seats, door panels, and headliners, leaving a pleasant lemon aroma when dry.</p>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-foreground mb-1">DIRECTIONS FOR USE:</p>
                        <p className="mb-2">For best results, use when can is between 70°F and 90°F.</p>
                        <p className="mb-2">Invert can and point opening of spray button toward object, holding can 12 to 16 inches from surface. Press spray button firmly to apply product to the area to be cleaned.</p>
                        <p className="mb-2"><span className="font-medium">INTERIOR SHAMPOOING:</span> Apply the high-foaming action with a natural sponge or scrub brush. Use a circular scrubbing motion for best results. Rinse with clean water using a sponge or toweling — leaves a "new car sheen."</p>
                        <p><span className="font-medium">VINYL AND HARD SURFACE CLEANING:</span> Spray on liberally and wipe off with a damp sponge or toweling.</p>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-foreground mb-1">COMPOSITIONAL INFORMATION:</p>
                        <p className="mb-2">If medical advice is needed, have product container or label at hand. Keep out of reach of children. Read label before use. Keep away from heat, hot surfaces, sparks, open flames, and other ignition sources. No smoking. Do not spray on an open flame or other ignition source. Do not pierce or burn, even after use. Do not breathe mist, vapors, or spray. Wear protective gloves and protective clothing. Contaminated work clothing should not be allowed out of the workplace.</p>
                        <p className="mb-2"><span className="font-medium">IF ON SKIN:</span> Wash with plenty of soap and water. Wash contaminated clothing before reuse. If skin irritation or a rash occurs: Get medical attention.</p>
                        <p className="mb-2">Store in a well-ventilated place. Protect from sunlight. Do not expose to temperatures exceeding 50°C / 122°F. Dispose of contents and container in accordance with local, regional, national, and international regulations.</p>
                        <p className="mb-2">Please refer to the SDS for additional information. Keep upright in a cool, dry place. Do not discard empty can in trash compactor.</p>
                        <p>Percentage of the mixture consisting of ingredient(s) of unknown toxicity: Oral 1.5%, Dermal 1.5%, Inhalation 1.5%.</p>
                      </div>
                      
                      <div className="border-t pt-3 mt-3">
                        <p className="font-semibold text-foreground">Read Safety Data Sheet before using.</p>
                        <p className="font-bold text-destructive">KEEP OUT OF REACH OF CHILDREN.</p>
                        <p className="mt-2">Made in U.S.A. with globally sourced materials</p>
                        <p>VOC Content: 5.0%</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                  <AccordionTrigger>Shipping Information</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground">Flat Rate Shipping: $25.00</p>
                      <p>We ship nationwide to all 50 US states. Orders are typically processed within 1-2 business days.</p>
                      <p>Delivery times vary by location, typically 3-5 business days.</p>
                      <p>All orders are carefully packaged to ensure your products arrive in perfect condition.</p>
                    </div>
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
