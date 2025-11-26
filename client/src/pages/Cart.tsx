import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
              <h1 className="text-3xl font-bold" data-testid="text-empty-cart">Your cart is empty</h1>
              <p className="text-muted-foreground">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Button asChild size="lg" data-testid="button-continue-shopping">
                <Link href="/products">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
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
          <h1 className="text-4xl font-bold mb-8" data-testid="text-page-title">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.product.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                          data-testid={`img-cart-item-${item.product.id}`}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.product.slug}`}>
                          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors" data-testid={`text-cart-item-name-${item.product.id}`}>
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-lg font-semibold text-primary" data-testid={`text-cart-item-price-${item.product.id}`}>
                          ${parseFloat(item.product.price).toFixed(2)}
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            data-testid={`button-decrease-${item.product.id}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium" data-testid={`text-cart-item-quantity-${item.product.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            data-testid={`button-increase-${item.product.id}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.product.id)}
                            className="ml-auto"
                            data-testid={`button-remove-${item.product.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold">Order Summary</h2>
                  
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

                  <Button asChild size="lg" className="w-full" data-testid="button-checkout">
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" size="lg" className="w-full" data-testid="button-continue-shopping">
                    <Link href="/products">
                      Continue Shopping
                    </Link>
                  </Button>
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
