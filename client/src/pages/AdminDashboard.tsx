import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, ShoppingBag, Package, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Order, Product, Affiliate, AffiliateSale } from "@shared/schema";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { toast } = useToast();

  const { data: orders } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  const { data: affiliates } = useQuery<Affiliate[]>({
    queryKey: ["/api/admin/affiliates"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  const { data: affiliateSales } = useQuery<AffiliateSale[]>({
    queryKey: ["/api/admin/affiliate-sales"],
    enabled: isAuthenticated && user?.isAdmin,
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
      return;
    }

    if (!authLoading && isAuthenticated && !user?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAuthenticated, authLoading, user, toast, navigate]);

  if (authLoading || !user?.isAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Skeleton className="h-32 w-32" />
        </main>
        <Footer />
      </div>
    );
  }

  const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;
  const totalOrders = orders?.length || 0;
  const totalAffiliateCommission = affiliates?.reduce((sum, aff) => sum + parseFloat(aff.totalCommission), 0) || 0;
  const totalAffiliates = affiliates?.length || 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your store, products, orders, and affiliates
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-revenue">
                  ${totalRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">All-time sales</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-orders">
                  {totalOrders}
                </div>
                <p className="text-xs text-muted-foreground">Orders placed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-products">
                  {products?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Active products</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Affiliates</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-affiliates">
                  {totalAffiliates}
                </div>
                <p className="text-xs text-muted-foreground">${totalAffiliateCommission.toFixed(2)} commission</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList>
              <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
              <TabsTrigger value="products" data-testid="tab-products">Products</TabsTrigger>
              <TabsTrigger value="affiliates" data-testid="tab-affiliates">Affiliates</TabsTrigger>
              <TabsTrigger value="affiliate-sales" data-testid="tab-affiliate-sales">Affiliate Sales</TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>All orders placed in your store</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders && orders.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Affiliate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono text-xs">
                              {order.id.slice(0, 8)}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{order.shippingName}</p>
                                <p className="text-sm text-muted-foreground">{order.email}</p>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">
                              ${parseFloat(order.total).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={order.status === "pending" ? "secondary" : "default"}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(order.createdAt!).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {order.affiliateId ? (
                                <Badge variant="outline">Affiliate</Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No orders yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>Manage your product catalog</CardDescription>
                </CardHeader>
                <CardContent>
                  {products && products.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Slug</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded bg-muted overflow-hidden flex-shrink-0">
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <span className="font-medium">{product.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">
                              ${parseFloat(product.price).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {product.inStock ? (
                                <Badge variant="default">In Stock</Badge>
                              ) : (
                                <Badge variant="destructive">Out of Stock</Badge>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {product.slug}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No products available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Affiliates Tab */}
            <TabsContent value="affiliates">
              <Card>
                <CardHeader>
                  <CardTitle>Affiliates</CardTitle>
                  <CardDescription>Manage affiliate partners</CardDescription>
                </CardHeader>
                <CardContent>
                  {affiliates && affiliates.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Affiliate Code</TableHead>
                          <TableHead>Total Clicks</TableHead>
                          <TableHead>Total Sales</TableHead>
                          <TableHead>Commission Earned</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {affiliates.map((affiliate) => (
                          <TableRow key={affiliate.id}>
                            <TableCell className="font-mono font-semibold">
                              {affiliate.affiliateCode}
                            </TableCell>
                            <TableCell>{affiliate.totalClicks}</TableCell>
                            <TableCell>{affiliate.totalSales}</TableCell>
                            <TableCell className="font-semibold text-primary">
                              ${parseFloat(affiliate.totalCommission).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={affiliate.status === "active" ? "default" : "secondary"}>
                                {affiliate.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(affiliate.createdAt!).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No affiliates yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Affiliate Sales Tab */}
            <TabsContent value="affiliate-sales">
              <Card>
                <CardHeader>
                  <CardTitle>Affiliate Sales</CardTitle>
                  <CardDescription>Track affiliate-generated sales</CardDescription>
                </CardHeader>
                <CardContent>
                  {affiliateSales && affiliateSales.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sale ID</TableHead>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Affiliate ID</TableHead>
                          <TableHead>Commission</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {affiliateSales.map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell className="font-mono text-xs">
                              {sale.id.slice(0, 8)}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {sale.orderId.slice(0, 8)}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {sale.affiliateId.slice(0, 8)}
                            </TableCell>
                            <TableCell className="font-semibold text-primary">
                              ${parseFloat(sale.commission).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={sale.status === "pending" ? "secondary" : "default"}>
                                {sale.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(sale.createdAt!).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No affiliate sales yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
