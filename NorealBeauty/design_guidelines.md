# NORÉAL Design Guidelines

## Design Approach: Reference-Based (Luxury Beauty E-Commerce)

**Primary References:** Glossier, Sephora, Aesop, The Ordinary  
**Design Philosophy:** Minimalist luxury with emphasis on product imagery, clean typography, and generous whitespace. Create an aspirational yet approachable experience that emphasizes visual product discovery.

---

## Typography System

**Font Families:**
- Primary (Headings): "Playfair Display" (serif) - elegant, premium feel
- Secondary (Body/UI): "Inter" (sans-serif) - clean, highly readable

**Hierarchy:**
- Hero Heading: text-6xl/text-7xl, font-light
- Section Headings: text-4xl, font-light
- Product Titles: text-xl, font-medium
- Body Text: text-base, font-normal
- Captions/Meta: text-sm, font-light
- Buttons/CTAs: text-sm, font-medium, uppercase tracking-wider

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Tight spacing: p-2, gap-4
- Standard spacing: p-6, gap-8
- Section padding: py-16 to py-24
- Generous margins: mb-12, mt-16

**Container Strategy:**
- Full-width hero with max-w-7xl inner container
- Content sections: max-w-6xl centered
- Product grids: max-w-7xl with generous gutters

**Grid System:**
- Product catalog: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Feature sections: grid-cols-1 md:grid-cols-2
- Reviews: grid-cols-1 lg:grid-cols-2

---

## Component Library

### Navigation
- Sticky header with subtle backdrop blur
- Logo left, primary nav center, cart/wishlist/language icons right
- Dropdown mega-menu for product categories with category images
- Mobile: Slide-in drawer with full-screen navigation

### Hero Section
- Full-bleed hero image (80vh) with centered overlay content
- Headline + subheadline + dual CTAs ("Shop Now" primary, "Explore Collection" secondary)
- CTAs with backdrop blur backgrounds (bg-white/90 backdrop-blur-md)
- Subtle parallax scroll effect on background image

### Product Cards
- High-quality product image (4:5 aspect ratio)
- Quick-add heart icon (wishlist) positioned top-right on image
- Product name, category tag, price below image
- Star rating with review count
- Hover state: Subtle lift (translate-y-1) + shadow increase
- "Add to Cart" button appears on hover for desktop

### Product Detail Page
- Two-column layout: Image gallery left (60%), product info right (40%)
- Image gallery with main image + thumbnail strip below
- Product info: Name, price, rating, description, ingredient list
- Quantity selector + "Add to Cart" + "Add to Wishlist" buttons
- Tabbed content below: Description, Ingredients, Reviews, How to Use
- Related products carousel at bottom

### Reviews Section
- Individual review cards with user avatar (or initials circle), name, star rating, date
- Review text with "Read More" expansion for long reviews
- Filter/sort controls: Most Recent, Highest Rated, Lowest Rated
- "Write a Review" CTA prominently placed

### Shopping Cart (Slide-out Panel)
- Right-side drawer overlay
- Product thumbnails with name, variant, quantity controls
- Subtotal calculation
- "Continue Shopping" and "Checkout" CTAs
- Empty state with illustration and product suggestions

### Wish List
- Grid layout similar to product catalog
- Easy move-to-cart functionality
- Share wish list button with social icons

### Subscription Modal
- Clean modal with product image, subscription frequency selector (weekly, bi-weekly, monthly)
- Savings indicator ("Save 15% with subscription")
- Next delivery date preview
- Manage/cancel subscription link

### Footer
- Four-column layout: About, Shop, Support, Connect
- Newsletter signup with elegant input + button combo
- Social media icons (Instagram, Pinterest)
- Payment method badges
- Language selector dropdown
- Copyright and legal links

---

## Animations

**Principle:** Subtle and purposeful only - enhance, don't distract

**Approved Animations:**
- Page transitions: Fade-in (duration-300)
- Product card hover: Translate + shadow (duration-200)
- Cart/wishlist slide-in: translate-x (duration-300)
- Image loading: Blur fade-in
- Review submission: Success checkmark animation

**Explicitly Avoid:**
- Scroll-triggered animations (except subtle parallax on hero)
- Loading spinners (use skeleton screens instead)
- Excessive micro-interactions

---

## Images

**Hero Image:** Full-width lifestyle shot of diverse models using skincare products in elegant bathroom/natural setting - aspirational yet authentic

**Product Images:** Clean, white-background product photography with consistent lighting and shadows

**Category Headers:** Lifestyle imagery showing product application or ingredients (botanical elements, water droplets)

**About/Brand Section:** Behind-the-scenes lab/formulation images, ingredient sourcing

**Testimonial Section:** User-generated content style photos (authentic, diverse skin types)

**Empty States:** Minimalist line-art illustrations for empty cart/wishlist

---

## Responsive Strategy

**Mobile (base):**
- Single column product grid
- Hamburger menu
- Stacked product detail (image above, info below)
- Simplified filters (drawer overlay)

**Tablet (md):**
- Two-column product grid
- Horizontal navigation visible
- Side-by-side layouts for features

**Desktop (lg+):**
- Three-to-four column product grids
- Mega-menu dropdowns
- Hover interactions active
- Multi-column footer

---

## Key Sections

1. **Hero:** Full-bleed image + centered headline + dual CTAs
2. **Featured Categories:** 3-column grid with category images and names
3. **Best Sellers:** Product carousel with "Shop All" link
4. **Why NORÉAL:** 3-column feature grid (icons + titles + descriptions) - Clean formulas, Sustainable, Dermatologist-tested
5. **Customer Reviews:** Featured review cards + overall rating stats
6. **Instagram Feed:** 4-column grid of user posts with "Follow Us" CTA
7. **Newsletter:** Centered headline + input/button combo + privacy note

This design creates a premium, conversion-optimized experience that balances luxury aesthetics with functional e-commerce capabilities.