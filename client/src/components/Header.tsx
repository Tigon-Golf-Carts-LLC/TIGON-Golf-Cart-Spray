import { Link } from "wouter";
import { ShoppingCart, Moon, Sun, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tight">
            TIGON <span className="text-primary">Spray</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-home">
            Home
          </Link>
          <Link href="/products" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-products">
            Products
          </Link>
          <Link href="/blog" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-blog">
            Blog
          </Link>
          {isAuthenticated && user?.isAdmin && (
            <Link href="/admin" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-admin">
              Admin
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            data-testid="button-theme-toggle"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {/* Cart */}
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground" data-testid="text-cart-count">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-user-menu">
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/affiliate" className="cursor-pointer" data-testid="link-affiliate">
                    Affiliate Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/api/logout" className="cursor-pointer" data-testid="link-logout">
                    Log out
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" size="sm" data-testid="button-login">
              <a href="/api/login">Log in</a>
            </Button>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/"
                    className="text-lg font-medium hover-elevate px-4 py-3 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="link-mobile-home"
                  >
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className="text-lg font-medium hover-elevate px-4 py-3 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="link-mobile-products"
                  >
                    Products
                  </Link>
                  <Link
                    href="/blog"
                    className="text-lg font-medium hover-elevate px-4 py-3 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="link-mobile-blog"
                  >
                    Blog
                  </Link>
                  {isAuthenticated && user?.isAdmin && (
                    <Link
                      href="/admin"
                      className="text-lg font-medium hover-elevate px-4 py-3 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid="link-mobile-admin"
                    >
                      Admin
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
