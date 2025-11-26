import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Lock, CreditCard, ShieldCheck, AlertCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SEO, seoPresets } from "@/components/SEO";

interface CloverConfig {
  configured: boolean;
  publicToken: string;
  merchantId: string;
  sdkUrl: string;
  environment: string;
}

declare global {
  interface Window {
    Clover: any;
  }
}

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);
  const [cloverReady, setCloverReady] = useState(false);
  const cloverRef = useRef<any>(null);
  const elementsRef = useRef<any>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    shippingName: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
  });

  // Fetch Clover configuration
  const { data: cloverConfig } = useQuery<CloverConfig>({
    queryKey: ['/api/config/payment'],
  });

  // Load Clover SDK when configured
  useEffect(() => {
    if (!cloverConfig?.configured) return;

    const existingScript = document.getElementById('clover-sdk');
    if (existingScript) {
      if (window.Clover) {
        initializeClover();
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'clover-sdk';
    script.src = cloverConfig.sdkUrl;
    script.async = true;
    script.onload = () => {
      initializeClover();
    };
    script.onerror = () => {
      console.error('Failed to load Clover SDK');
      setCardError('Failed to load payment system');
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup - don't remove script as it might be used elsewhere
    };
  }, [cloverConfig]);

  const initializeClover = useCallback(() => {
    if (!cloverConfig?.configured || !window.Clover) return;

    try {
      cloverRef.current = new window.Clover(cloverConfig.publicToken, {
        merchantId: cloverConfig.merchantId,
      });

      const elements = cloverRef.current.elements();
      elementsRef.current = elements;

      // Create card elements
      const cardNumber = elements.create('CARD_NUMBER', {
        placeholder: 'Card number',
        style: {
          base: {
            fontSize: '16px',
            color: 'inherit',
            '::placeholder': {
              color: '#888',
            },
          },
        },
      });
      const cardDate = elements.create('CARD_DATE', {
        placeholder: 'MM/YY',
        style: {
          base: {
            fontSize: '16px',
            color: 'inherit',
          },
        },
      });
      const cardCvv = elements.create('CARD_CVV', {
        placeholder: 'CVV',
        style: {
          base: {
            fontSize: '16px',
            color: 'inherit',
          },
        },
      });
      const cardPostalCode = elements.create('CARD_POSTAL_CODE', {
        placeholder: 'ZIP',
        style: {
          base: {
            fontSize: '16px',
            color: 'inherit',
          },
        },
      });

      // Mount elements
      const cardNumberEl = document.getElementById('clover-card-number');
      const cardDateEl = document.getElementById('clover-card-date');
      const cardCvvEl = document.getElementById('clover-card-cvv');
      const cardPostalEl = document.getElementById('clover-card-postal');

      if (cardNumberEl && cardDateEl && cardCvvEl && cardPostalEl) {
        cardNumber.mount('#clover-card-number');
        cardDate.mount('#clover-card-date');
        cardCvv.mount('#clover-card-cvv');
        cardPostalCode.mount('#clover-card-postal');
        setCloverReady(true);
      }
    } catch (error) {
      console.error('Clover initialization error:', error);
      setCardError('Failed to initialize payment form');
    }
  }, [cloverConfig]);

  const tokenizeCard = async (): Promise<string | null> => {
    if (!cloverRef.current || !cloverReady) {
      return null;
    }

    try {
      setCardError(null);
      const result = await cloverRef.current.createToken();
      
      if (result.errors) {
        const errorMessages = Object.values(result.errors).join(', ');
        setCardError(errorMessages || 'Card validation failed');
        return null;
      }
      
      if (result.token) {
        return result.token;
      }
      
      setCardError('Failed to process card');
      return null;
    } catch (error: any) {
      console.error('Tokenization error:', error);
      setCardError(error.message || 'Card processing error');
      return null;
    }
  };

  const createOrderMutation = useMutation({
    mutationFn: async (data: typeof formData & { paymentToken?: string }) => {
      return await apiRequest("POST", "/api/orders", {
        ...data,
        total: totalPrice.toFixed(2),
        paymentToken: data.paymentToken,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      });
    },
    onSuccess: () => {
      clearCart();
      toast({
        title: "Order placed successfully!",
        description: "You will receive an email confirmation shortly.",
      });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Error placing order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.email || !formData.shippingName || !formData.shippingAddress || 
        !formData.shippingCity || !formData.shippingState || !formData.shippingZip) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    let token: string | undefined;
    
    // Tokenize card if Clover is configured
    if (cloverConfig?.configured && cloverReady) {
      const cardToken = await tokenizeCard();
      if (!cardToken) {
        toast({
          title: "Payment Error",
          description: cardError || "Please check your card details",
          variant: "destructive",
        });
        return;
      }
      token = cardToken;
    }

    createOrderMutation.mutate({ ...formData, paymentToken: token });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SEO {...seoPresets.checkout} />
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-8" data-testid="text-page-title">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        data-testid="input-email"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Information */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                    <div>
                      <Label htmlFor="shippingName">Full Name</Label>
                      <Input
                        id="shippingName"
                        name="shippingName"
                        required
                        value={formData.shippingName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        data-testid="input-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shippingAddress">Address</Label>
                      <Input
                        id="shippingAddress"
                        name="shippingAddress"
                        required
                        value={formData.shippingAddress}
                        onChange={handleChange}
                        placeholder="123 Main St"
                        data-testid="input-address"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shippingCity">City</Label>
                        <Input
                          id="shippingCity"
                          name="shippingCity"
                          required
                          value={formData.shippingCity}
                          onChange={handleChange}
                          placeholder="New York"
                          data-testid="input-city"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingState">State</Label>
                        <Input
                          id="shippingState"
                          name="shippingState"
                          required
                          value={formData.shippingState}
                          onChange={handleChange}
                          placeholder="NY"
                          data-testid="input-state"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="shippingZip">ZIP Code</Label>
                      <Input
                        id="shippingZip"
                        name="shippingZip"
                        required
                        value={formData.shippingZip}
                        onChange={handleChange}
                        placeholder="10001"
                        data-testid="input-zip"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">Payment</h2>
                    </div>

                    {cloverConfig?.configured ? (
                      <>
                        {/* Clover Card Elements */}
                        <div className="space-y-4">
                          <div>
                            <Label>Card Number</Label>
                            <div 
                              id="clover-card-number" 
                              className="h-10 px-3 py-2 rounded-md border border-input bg-background"
                              data-testid="input-card-number"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label>Expiry</Label>
                              <div 
                                id="clover-card-date" 
                                className="h-10 px-3 py-2 rounded-md border border-input bg-background"
                                data-testid="input-card-expiry"
                              />
                            </div>
                            <div>
                              <Label>CVV</Label>
                              <div 
                                id="clover-card-cvv" 
                                className="h-10 px-3 py-2 rounded-md border border-input bg-background"
                                data-testid="input-card-cvv"
                              />
                            </div>
                            <div>
                              <Label>ZIP</Label>
                              <div 
                                id="clover-card-postal" 
                                className="h-10 px-3 py-2 rounded-md border border-input bg-background"
                                data-testid="input-card-zip"
                              />
                            </div>
                          </div>
                          
                          {cardError && (
                            <div className="flex items-center gap-2 text-destructive text-sm">
                              <AlertCircle className="h-4 w-4" />
                              <span data-testid="text-card-error">{cardError}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            <span>Payments are securely processed by Clover</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-start gap-3">
                        <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold mb-1">Secure Payment</h3>
                          <p className="text-sm text-muted-foreground">
                            Clover payment processing is being configured. 
                            Your order will be recorded and you'll receive confirmation via email.
                            Payment will be collected upon order fulfillment.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={createOrderMutation.isPending || (cloverConfig?.configured && !cloverReady)}
                  data-testid="button-place-order"
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      {cloverConfig?.configured 
                        ? `Pay $${totalPrice.toFixed(2)}` 
                        : 'Place Order'}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                  
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3" data-testid={`cart-item-${item.product.id}`}>
                        <div className="w-16 h-16 rounded bg-muted overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold">
                            ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 py-4 border-y">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium" data-testid="text-subtotal">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium text-primary">Free</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold" data-testid="text-total">${totalPrice.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
