import { useState } from "react";
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
import { Loader2, Lock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    shippingName: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/orders", {
        ...data,
        total: totalPrice.toFixed(2),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrderMutation.mutate(formData);
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

                {/* Payment Note */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-1">Secure Payment</h3>
                        <p className="text-sm text-muted-foreground">
                          Payment processing will be integrated in the next phase. 
                          For now, your order will be recorded and you'll receive confirmation via email.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={createOrderMutation.isPending}
                  data-testid="button-place-order"
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Place Order</>
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
                      <div key={item.product.id} className="flex gap-3">
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
