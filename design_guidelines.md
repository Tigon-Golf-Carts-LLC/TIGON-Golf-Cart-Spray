# TIGON Spray E-Commerce Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based (E-commerce Leaders)

Drawing inspiration from Shopify's clean product presentation, Stripe's professional restraint, and modern DTC brands, creating a trustworthy, conversion-optimized shopping experience for golf cart maintenance products.

**Core Principles:**
- Professional credibility for B2C product sales
- Frictionless checkout experience
- Clear product differentiation across 4 spray variants
- Trust-building through clean, structured layouts
- Mobile-first responsive design

---

## Typography System

**Font Selection:** Single sans-serif family via Google Fonts CDN (Inter or similar modern geometric sans)

**Hierarchy:**
- **Hero/H1:** 3xl to 5xl (48-60px desktop), bold weight, tight leading
- **H2 (Section Headers):** 2xl to 3xl (32-48px), semibold
- **H3 (Product Names, Card Titles):** xl to 2xl (24-32px), semibold
- **H4 (Subsections):** lg to xl (20-24px), medium
- **Body Text:** base (16px), regular weight, relaxed leading (1.6)
- **Small Text (Captions, Labels):** sm (14px), medium weight
- **Micro (Legal, Footer):** xs (12px), regular weight

---

## Layout & Spacing System

**Tailwind Spacing Units:** Standardize on 2, 4, 6, 8, 12, 16, 20, 24, 32 (e.g., p-4, gap-8, mb-16)

**Container Strategy:**
- Max-width: 7xl (1280px) for main content
- Max-width: 6xl (1152px) for product grids
- Max-width: 2xl (672px) for checkout forms
- Full-width sections with inner containers

**Grid Systems:**
- Product Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Blog Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Dashboard: grid-cols-1 lg:grid-cols-3 (sidebar + main + stats)

**Section Padding:** py-16 md:py-24 for major sections

---

## Component Library

### Navigation
**Header:** Fixed top navigation, full-width, backdrop blur
- Logo left, main nav center, cart/account/theme-toggle right
- Mobile: Hamburger menu with slide-out drawer
- Height: 16 (64px) on desktop, 14 (56px) mobile
- Search bar integrated in header (desktop) or expandable (mobile)

### Product Cards
- 1:1 aspect ratio image (square, exactly as specified)
- Product name (H3 weight, truncate to 2 lines)
- Price display (large, bold)
- Quick "Add to Cart" button
- Hover: subtle scale transform (scale-105)
- Border with subtle shadow, rounded-lg

### Shopping Cart (Sidebar Drawer)
- Slide-in from right, w-96 (384px) max
- Each item: Thumbnail (80x80), name, quantity controls, remove icon
- Subtotal section at bottom with prominent "Checkout" CTA
- Empty state: Icon + message + "Continue Shopping" link

### Buttons
**Primary CTA:** Rounded-md, px-8 py-3, font-semibold, shadow-md
**Secondary:** Outlined style, same padding
**Icon Buttons:** Square (w-10 h-10), rounded-md, centered icon
**Add to Cart:** Full-width on mobile, inline on desktop

### Forms
- Input fields: Rounded-md, px-4 py-3, border with focus ring
- Labels: font-medium, mb-2
- Error states: border treatment + text-sm error message below
- Grouped fields: gap-4 vertical spacing

### Cards & Containers
- Rounded-lg borders throughout
- Shadow-sm for subtle elevation
- Shadow-md for interactive elements
- Padding: p-6 for content cards

---

## Page-Specific Layouts

### Homepage
**Hero Section:** Full-width, min-h-[600px]
- Large hero image: Golf cart in pristine condition (1920x600+, blurred background treatment)
- Overlay content: Centered, max-w-3xl
- H1: "Premium Golf Cart Clear Spray Protection"
- Subheading + dual CTAs ("Shop Now" primary, "Learn More" secondary)

**Featured Products:** 4-column grid (responsive to 2-col, 1-col)
- Equal height cards with 1:1 product images
- Direct "Buy Now" + "Buy on Amazon" buttons on each card

**Trust Indicators:** Single row, 4 columns
- Icons + short text: "Free Shipping", "Easy Returns", "Eco-Friendly", "Made in USA"

**Blog Preview:** 3-column grid, latest 3 posts
- Featured image (16:9), title, excerpt (2 lines), "Read More" link

### Product Pages
**Layout:** 2-column (image left, details right) on desktop, stacked mobile

**Image Section:**
- Main 1:1 product image, max 600px square
- Thumbnail gallery below if multiple angles available

**Details Section:**
- Product name (H1)
- Price (large, 3xl)
- Short description (2-3 sentences)
- "Buy Now" button (primary, full-width mobile)
- "Buy on Amazon" button directly underneath (secondary style)
- Specifications accordion
- Reviews section below (stars + count)

### Checkout (Single Page)
**Layout:** 2-column on desktop (form left 66%, summary right 33%), stacked mobile

**Form Sections:** Vertical flow with clear section headers
1. Contact (email only)
2. Shipping address (minimal fields)
3. Payment (Stripe elements integration, structured for Clover)
- Progress indicator: 3 steps (Info → Payment → Confirm)

**Order Summary:** Sticky sidebar
- Line items with thumbnails
- Subtotal, shipping, tax breakdown
- Total (large, bold)

### Admin Dashboard
**Sidebar Navigation:** Fixed left, w-64
- Logo top, nav links with icons, logout bottom

**Main Content:** ml-64, p-8
- Stats grid: grid-cols-1 md:grid-cols-4 (Total Sales, Orders, Products, Affiliates)
- Recent orders table below
- Charts/graphs for analytics

### Affiliate Dashboard
**Header Stats:** 4-column grid
- Total Clicks, Conversions, Commission Earned, Pending Payment

**Affiliate Links:** Table with product name, unique link, copy button, QR code download

**Sales History:** Sortable table with date, product, commission

### Blog Index
**Header:** Page title (H1), optional category filters

**Article Grid:** 3-column, masonry optional for varied content
- Featured image (16:9, 400x225+)
- Category tag, publish date
- Title (H3), excerpt (3 lines)
- "Read More" link

### Blog Post
**Layout:** Single column, max-w-3xl centered

**Header:**
- Category + date breadcrumb
- H1 title
- Hero image (16:9, 1200x675+, full-width within container)

**Content:** Semantic HTML with clear H2/H3/H4 hierarchy
- Generous line-height (1.7-1.8)
- Images: Centered, rounded-lg, max-w-full
- Blockquotes: border-left accent, italic, pl-6

**Related Posts:** 3-column grid at bottom

---

## Images

**Product Images:**
- 1:1 square format (1000x1000px minimum)
- Clean white/transparent backgrounds
- Consistent lighting and angle across all 4 products
- Alt text: "TIGON Spray [Product Name] - Golf Cart Clear Spray Cleaner"

**Hero Image (Homepage):**
- Pristine golf cart in outdoor/club setting
- 1920x800px+, professional photography
- Overlay: 40-50% darkening for text legibility
- Buttons on image: Implement blurred background treatment (backdrop-blur-sm with semi-transparent backgrounds)

**Blog Images:**
- Featured/hero per post: 1200x675px (16:9)
- In-content: Variable sizes, maintain aspect ratios
- All images: Descriptive, keyword-rich alt text

**Icons:**
- Use Heroicons via CDN for UI elements (cart, user, search, menu, etc.)
- Trust badges: Simple line icons, 48x48px display size

---

## Animations

**Minimal, Purposeful Motion:**
- Button hover: subtle scale or shadow increase (transition-all duration-200)
- Cart drawer: slide-in from right (transition-transform duration-300)
- Product card hover: scale-105 transform (transition-transform duration-200)
- No scroll-triggered animations, no parallax effects
- Loading states: Simple spinner or skeleton screens

---

## Accessibility

- WCAG 2.1 AA compliance throughout
- Focus states: Clear ring-2 ring-offset-2 treatment
- Keyboard navigation: Logical tab order, skip links
- Screen reader: Proper ARIA labels, semantic HTML
- Form inputs: Associated labels, error announcements
- Consistent implementation across all form inputs and text fields