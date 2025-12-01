import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="group hover-elevate transition-all duration-200 flex flex-col h-full">
      <Link href={`/products/${product.slug}`}>
        <CardHeader className="p-0">
          <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-testid={`img-product-${product.id}`}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-6">
          <h3 className="text-xl font-semibold mb-2 line-clamp-2" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {product.description}
          </p>
          <div className="space-y-1">
            <p className="text-3xl font-bold" data-testid={`text-product-price-${product.id}`}>
              ${parseFloat(product.price).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              + $25.00 flat rate shipping
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 gap-2">
          <Button
            className="flex-1"
            onClick={handleAddToCart}
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
