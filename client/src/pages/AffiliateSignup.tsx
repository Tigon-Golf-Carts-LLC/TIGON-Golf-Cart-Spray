import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, DollarSign, Users, TrendingUp, Check } from "lucide-react";
import { SEO, seoPresets } from "@/components/SEO";
import type { Affiliate } from "@shared/schema";

export default function AffiliateSignup() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();

  // Check if user already has an affiliate account
  const { data: existingAffiliate } = useQuery<Affiliate>({
    queryKey: ["/api/affiliate/me"],
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (existingAffiliate) {
      navigate("/affiliate");
    }
  }, [existingAffiliate, navigate]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to become an affiliate.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isLoading, isAuthenticated, toast]);

  const createAffiliateMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/affiliate");
    },
    onSuccess: () => {
      toast({
        title: "Welcome to the affiliate program!",
        description: "Your affiliate account has been created successfully.",
      });
      navigate("/affiliate");
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating affiliate account",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSignup = () => {
    createAffiliateMutation.mutate();
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SEO {...seoPresets.affiliateSignup} />
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-page-title">
                Join Our Affiliate Program
              </h1>
              <p className="text-xl text-muted-foreground">
                Earn commission by promoting TIGON Spray products
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardContent className="p-6 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">10% Commission</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn 10% on every sale you refer
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Easy Sharing</h3>
                  <p className="text-sm text-muted-foreground">
                    Get unique links for all products
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Real-Time Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor your clicks and sales
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* How It Works */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  Start earning in three simple steps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary-foreground">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Sign Up</h4>
                    <p className="text-sm text-muted-foreground">
                      Create your free affiliate account and get your unique affiliate code
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary-foreground">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Share Your Links</h4>
                    <p className="text-sm text-muted-foreground">
                      Promote TIGON Spray products using your personalized affiliate links
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary-foreground">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Earn Commission</h4>
                    <p className="text-sm text-muted-foreground">
                      Earn 10% commission on every sale made through your affiliate links
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sign Up CTA */}
            <Card>
              <CardHeader>
                <CardTitle>Ready to Get Started?</CardTitle>
                <CardDescription>
                  Create your affiliate account now and start earning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleSignup}
                  disabled={createAffiliateMutation.isPending}
                  data-testid="button-create-affiliate"
                >
                  {createAffiliateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Create Affiliate Account
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
