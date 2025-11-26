import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">
              TIGON <span className="text-primary">Spray</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Premium golf cart clear spray cleaners for superior protection and maintenance.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-products">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products/original-formula" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-original">
                  Original Formula
                </Link>
              </li>
              <li>
                <Link href="/products/pro-shield" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-pro">
                  Pro Shield
                </Link>
              </li>
              <li>
                <Link href="/products/ultra-clean" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-ultra">
                  Ultra Clean
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-blog">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/affiliate-signup" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-affiliate-signup">
                  Become an Affiliate
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground">
                  Support: support@tigonspray.com
                </span>
              </li>
              <li>
                <span className="text-muted-foreground">
                  © 2024 TIGON Spray. All rights reserved.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>Free shipping on all orders · 30-day money-back guarantee</p>
        </div>
      </div>
    </footer>
  );
}
