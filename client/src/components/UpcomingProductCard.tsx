import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

type UpcomingProductCardProps = {
  product: Product;
};

export function UpcomingProductCard({ product }: UpcomingProductCardProps) {
  return (
    <Card className="group hover-elevate transition-all duration-200 flex flex-col h-full relative">
      <Badge 
        variant="secondary" 
        className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground"
      >
        <Clock className="mr-1 h-3 w-3" />
        Coming Soon
      </Badge>
      <Link href={`/products/${product.slug}`}>
        <CardHeader className="p-0">
          <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-testid={`img-upcoming-product-${product.id}`}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-6">
          <h3 className="text-xl font-semibold mb-2 line-clamp-2" data-testid={`text-upcoming-product-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {product.description}
          </p>
          <div className="space-y-1">
            <p className="text-3xl font-bold" data-testid={`text-upcoming-product-price-${product.id}`}>
              ${parseFloat(product.price).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              + $25.00 flat rate shipping
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 gap-2">
          <Button
            variant="outline"
            className="flex-1"
            data-testid={`button-view-upcoming-product-${product.id}`}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Product
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
