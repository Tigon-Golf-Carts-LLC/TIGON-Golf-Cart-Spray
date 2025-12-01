import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp, MousePointer, ShoppingBag, Copy, Check } from "lucide-react";
import { SEO, seoPresets } from "@/components/SEO";
import type { Affiliate, Product, AffiliateSale } from "@shared/schema";

export default function AffiliateDashboard() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const { data: affiliate, isLoading: affiliateLoading } = useQuery<Affiliate>({
    queryKey: ["/api/affiliate/me"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: !!affiliate,
  });

  const { data: sales } = useQuery<AffiliateSale[]>({
    queryKey: ["/api/affiliate/sales"],
    enabled: !!affiliate,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  useEffect(() => {
    if (!affiliateLoading && !affiliate && isAuthenticated) {
      navigate("/affiliate-signup");
    }
  }, [affiliate, affiliateLoading, isAuthenticated, navigate]);

  const SITE_URL = 'https://tigonspray.com';
  
  const getAffiliateLink = (productSlug: string) => {
    if (!affiliate) return "";
    return `${SITE_URL}/products/${productSlug}?ref=${affiliate.affiliateCode}`;
  };

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    toast({
      title: "Link copied!",
      description: "Affiliate link has been copied to clipboard.",
    });
    setTimeout(() => setCopiedLink(null), 2000);
  };

  if (authLoading || affiliateLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 md:px-6">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!affiliate) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SEO {...seoPresets.affiliateDashboard} />
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">
              Affiliate Dashboard
            </h1>
            <p className="text-muted-foreground">
              Your affiliate code: <span className="font-mono font-semibold">{affiliate.affiliateCode}</span>
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-clicks">
                  {affiliate.totalClicks}
                </div>
                <p className="text-xs text-muted-foreground">Link clicks tracked</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-sales">
                  {affiliate.totalSales}
                </div>
                <p className="text-xs text-muted-foreground">Successful referrals</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-commission">
                  ${parseFloat(affiliate.totalCommission).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Total earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-conversion-rate">
                  {affiliate.totalClicks > 0
                    ? ((affiliate.totalSales / affiliate.totalClicks) * 100).toFixed(1)
                    : "0"}%
                </div>
                <p className="text-xs text-muted-foreground">Clicks to sales</p>
              </CardContent>
            </Card>
          </div>

          {/* Affiliate Links */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Your Affiliate Links</CardTitle>
              <CardDescription>
                Share these links to earn commission on sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              {products && products.length > 0 ? (
                <div className="space-y-4">
                  {products.map((product) => {
                    const link = getAffiliateLink(product.slug);
                    return (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-4 bg-card border rounded-lg"
                      >
                        <div className="w-16 h-16 rounded bg-muted overflow-hidden flex-shrink-0">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold mb-1">{product.name}</h4>
                          <p className="text-sm text-muted-foreground font-mono truncate">
                            {link}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(link)}
                          data-testid={`button-copy-link-${product.id}`}
                        >
                          {copiedLink === link ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No products available.</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>
                Your most recent affiliate sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sales && sales.length > 0 ? (
                <div className="space-y-4">
                  {sales.slice(0, 10).map((sale) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between p-4 bg-card border rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">Order #{sale.orderId.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(sale.createdAt!).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          +${parseFloat(sale.commission).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {sale.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No sales yet. Start sharing your links!</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
