# UNDO: Pre-Loved, Reimagined
## Product Design Specification & Academic UX Documentation

**Course / Context:** Product Design Group Project  
**Deliverable:** Comprehensive Frontend Marketplace & Mobile Application Prototype  
**Date:** Academic Term 2024–2026  
**Status:** Complete Working Frontend Prototype  

---

## 1. Project Overview

**Brand Name:** UNDO  
**Tagline:** Pre-loved, reimagined.  
**Core Message:** Good things deserve another round.  
**Domain:** Circular e-commerce, sustainable fashion, pre-owned lifestyle marketplace.  

UNDO is a specialized circular-commerce platform engineered to reframe second-hand shopping from a cluttered, low-trust discount experience into an editorial, desirable, and curated lifestyle discovery journey. Built specifically for an Indian context, UNDO bridges the gap between college students seeking affordable self-expression, conscious consumers seeking lower environmental footprints, and everyday wardrobe owners seeking an intuitive avenue to recirculate quality items.

The project encompasses two complete, distinct frontend experiences:
1. **The Multi-Page Web Platform:** Desktop- and tablet-optimized responsive web store (`index.html`, `shop.html`, `product.html`, `wishlist.html`, `cart.html`, `checkout.html`, `sell.html`, `account.html`, `about.html`).
2. **The Dedicated Mobile Application Prototype:** A mobile-first, thumb-reach ergonomically engineered app shell (`app.html`) with bottom navigation, sliding bottom-sheets, splash screen, and one-tap checkout.

---

## 2. Problem Statement

While India possesses a deep cultural heritage of garment passing, traditional second-hand clothing marketplaces face severe consumer friction:
- **Perception of Inferior Quality:** Second-hand items are frequently stigmatized as dated, worn-out, or cluttered.
- **Opacity of Condition:** Buyers fear uncommunicated flaws, deceptive photographs, or incorrect sizing.
- **High Return & Shipping Waste:** Mismatches between tagged vintage sizes and modern body measurements lead to reverse-logistics emissions that negate environmental benefits.
- **Cluttered User Interfaces:** Typical thrifting apps suffer from overwhelming advertisements, intrusive gamified countdowns, and repetitive card layouts lacking art direction.
- **Seller Friction:** Listing an item often demands complicated authentication hurdles or steep commission penalties, discouraging casual wardrobe recirculators.

---

## 3. Product Objectives

1. **Elevate Circular Fashion Aesthetics:** Apply art direction inspired by independent editorial magazines and artisanal vintage boutiques rather than generic e-commerce templates.
2. **Establish Uncompromising Condition Transparency:** Institute four standardized, prominent condition tiers (*Like New*, *Excellent*, *Good*, *Gently Used*) paired with mandatory condition notes and visible wear disclosures.
3. **Ergonomic & Accessible Frontend Architecture:** Comply with WCAG 2.1 AA accessibility guidelines (semantic HTML, 44–48px touch targets, visible focus indicators, high contrast ratios, and reduced-motion consideration).
4. **Transparent Environmental Stewardship:** Educate shoppers on textile longevity and measurement-checking without resorting to unsubstantiated greenwashing or fabricated carbon claims.
5. **Frictionless Dual Interface:** Provide a robust, responsive web store alongside a thumb-optimized mobile app prototype powered by shared LocalStorage and mock inventory.

---

## 4. Target Users and User Needs

### User Persona 1: Ananya (21, University Student, Bengaluru)
- **Motivations:** Desires distinct, vintage personal style on a tight student budget; rejects fast-fashion sameness.
- **Frustrations:** Dislikes thrift stores where items smell or are uncatalogued; skeptical of dishonest Instagram resellers.
- **Needs on UNDO:** Precise measurements, actual garment photos, transparent condition ratings, easy filtering under ₹800.

### User Persona 2: Rohit (28, Creative Professional, Mumbai)
- **Motivations:** Environmentally conscious; appreciates archival denim, quality leather accessories, and vintage mechanical objects.
- **Frustrations:** Fatigued by greenwashing and apps cluttered with flashing discounts and spam notifications.
- **Needs on UNDO:** Editorial curation, brand authenticity notes, material provenance, and streamlined checkout.

### User Persona 3: Priya (34, Homemaker & Wardrobe Recirculator, Delhi)
- **Motivations:** Wants to declutter barely worn ethnic kurtas, wedding guest dresses, and bags without hassle.
- **Frustrations:** Intimidated by complex seller portals requiring GST numbers or complex shipping agreements.
- **Needs on UNDO:** A friendly, 2-minute listing flow with instant card preview and zero listing fee overhead.

---

## 5. Product Design Requirements

- **Editorial Layout Principles:** Asymmetric hero compositions, generous whitespace, deliberate typographic pairing (editorial serif headline with crisp sans-serif body).
- **Tactile Palette:** Earthy, nature-informed tones: Deep forest (`#233D35`), Warm ivory (`#F7F3EB`), Muted sage (`#DCE4D8`), Burnt orange (`#C76B45`), and Charcoal (`#252722`).
- **Unique Item Mental Model:** Clear cues reminding users that pre-loved pieces are unique single listings (1 of 1), preventing multi-unit cart errors.
- **Persistent Accessibility:** Unbroken keyboard navigation, visible focus rings, ARIA roles, skip-to-content links, and full alt descriptions.

---

## 6. Functional Requirements

| Module | Requirement | Implementation in UNDO |
| :--- | :--- | :--- |
| **Catalog** | 30+ varied items across 6 departments with Indian Rupee pricing | 35 mock records in `products.js` with photos, condition, sizes, locations |
| **Search & Filter** | Instant multi-criteria filtering by category, price, condition, brand, colour, and location | `filterProducts()` and `searchProducts()` in `shop.js` with active chip management |
| **Product Detail** | Multi-angle photo gallery, condition breakdown, seller profile, and sizing notes | `product.html` with interactive thumbnails, accordions, and related pieces |
| **Wishlist** | Save/unsave items, remove, move to cart, persistent count badge | `wishlist.js` synchronised with LocalStorage |
| **Cart** | 1-of-1 availability enforcement, subtotal, shipping calculation (Free > ₹1500) | `cart.js` with instant removal and persistence |
| **Checkout** | 5-step checkout (Contact, Address, Delivery, Payment, Confirmation) | `checkout.js` with field validations, demo UPI/COD, and order ID generation |
| **Seller Flow** | Friendly listing form, image preview/presets, live card preview, and local persistence | `sell.js` saving user pieces directly into active session inventory |
| **Account** | Demo login/signup, order tracking, address book, and user listing tabs | `account.js` with profile management |
| **Mobile App** | Dedicated mobile shell with splash, horizontal scrolls, bottom sheets, and tab bar | `app.html` and `app.js` |

---

## 7. Non-Functional Requirements

- **Performance & Zero Build Overhead:** Clean HTML5, Tailwind CSS, and Vanilla JS; runs directly in modern browsers without requiring Node.js build processes.
- **Fault Tolerance:** Graceful SVG fallbacks (`assets/images/fallback.svg`) for missing or broken external image links.
- **Safe Parsing:** Try-catch guarded `storageGet()` and `storageSet()` preventing crashes on corrupted LocalStorage keys.
- **XSS Prevention:** `escapeHtml()` utility sanitizing all user inputs before DOM rendering.

---

## 8. Information Architecture

```
UNDO Platform
├── Web Experience
│   ├── Home (index.html)
│   │   ├── Announcement Bar
│   │   ├── Editorial Hero
│   │   ├── Curated Category Grid
│   │   ├── Fresh Listings Feed
│   │   ├── Editorial Feature ("Not new. Still noteworthy.")
│   │   ├── Condition Transparency Guide
│   │   └── Circular Sustainability Stripe
│   ├── Shop Catalogue (shop.html)
│   │   ├── Multi-attribute Filter Drawer/Sidebar
│   │   ├── Search Bar & Active Filter Chips
│   │   └── Responsive Product Matrix
│   ├── Product Details (product.html?id=...)
│   │   ├── Photo Gallery & Angle Switcher
│   │   ├── Inspected Condition Card
│   │   ├── Seller Profile Card
│   │   ├── Measurements & Care Accordions
│   │   └── Sticky Purchase Bar
│   ├── Saved Pieces (wishlist.html)
│   ├── Shopping Bag (cart.html)
│   ├── Multi-Step Checkout (checkout.html)
│   ├── Sell an Item (sell.html)
│   │   ├── Form Inputs & Image Upload
│   │   └── Real-time Card Preview
│   ├── Profile & Orders (account.html)
│   └── The Circular Story (about.html)
└── Dedicated Mobile App Prototype (app.html)
    ├── Splash Screen
    ├── Tab 1: Home (Curated Carousels & Drops)
    ├── Tab 2: Explore (Instant Search, Filter Pills & 2-Col Grid)
    ├── Tab 3: Sell (Rapid Mobile Form)
    ├── Tab 4: Wishlist (Quick Action List)
    ├── Tab 5: Cart (Bag Summary & One-Tap Checkout Sheet)
    └── Tab 6: Profile (Simulated Tracking & Activity)
```

---

## 9. Main User Journeys

### User Journey 1: Discovering and Buying a Product
1. User lands on `index.html`, reads the brand tagline, and clicks **Explore the Collection**.
2. On `shop.html`, user selects the "Clothing" category and filters by "Like New" condition.
3. User selects the *Vintage Denim Jacket* (₹1,299), transitioning to `product.html?id=c001`.
4. User reviews the condition note ("Minor elbow fading, intact hardware") and clicks **Add to Cart**.
5. Cart badge increments immediately; user clicks **Cart**, confirms the single-item quantity, and proceeds to checkout.
6. User completes the 4 checkout steps and receives a unique confirmation ID (`UNDO-XXXXX`).

### User Journey 2: Searching and Filtering Products
1. User inputs "linen" into the shop search bar.
2. System evaluates product titles, tags, and descriptions in real time.
3. User drags the maximum price slider to ₹1,000.
4. Filter chips (`Category: Clothing`, `≤ ₹1,000`, `"linen"`) appear above the grid.
5. User clicks an individual chip's close icon (`✕`) to broaden results without restarting the search.

### User Journey 3: Saving and Comparing Finds
1. User browses several leather bags and jewelry pieces.
2. User taps the heart icon on cards; heart fills with colour and toast confirms: *"Saved to wishlist"*.
3. User navigates to `wishlist.html` to review prices, sizes, and sellers side-by-side.
4. User clicks **Move to Cart** on a chosen piece; item transfers seamlessly from wishlist to cart state.

### User Journey 4: Completing the Demo Checkout
1. User verifies cart contents and clicks **Proceed to Demo Checkout**.
2. **Step 1 (Contact):** User inputs name, email, and 10-digit phone. Inline regex validates inputs.
3. **Step 2 (Address):** User fills street, city, state, and 6-digit postal PIN.
4. **Step 3 (Delivery):** User chooses Carbon-Neutral Standard or Priority Express.
5. **Step 4 (Payment):** User selects Simulated UPI, reviews order total, and clicks **Place Simulated Order**.
6. **Confirmation Screen:** Order is archived to LocalStorage, cart is cleared, and summary is presented.

### User Journey 5: Creating and Previewing a Resale Listing
1. User visits `sell.html`.
2. As user types "Vintage Corduroy Overshirt" and enters ₹799, the **Live Card Preview** on the right reflects changes instantaneously.
3. User drags a photo into the drop zone (or taps a sample preset).
4. User inputs condition notes and clicks **Publish Listing**.
5. Modal confirms creation; user clicks **View My Piece**, opening the newly created item directly in `product.html`.

---

## 10. Website Wireframe Descriptions

- **Home (`index.html`):** Split 50/50 hero layout on desktop (editorial typography left, campaign photography right). Below: 4-column category tiles with gradient vignettes, 4-column product grid with condition badges, editorial banner with sage background, 4-column condition transparency cards, and dark charcoal footer.
- **Catalogue (`shop.html`):** Fixed search header with horizontal category pills. 2-column layout: Left fixed 240px filter sidebar (price slider, checkboxes, location select); Right responsive 3-column product card grid.
- **Product Detail (`product.html`):** Left 60% contains vertical thumbnail strip and primary 3:4 aspect-ratio photograph. Right 40% contains product title, condition banner, size attributes, buy actions, seller bio card, and accordion FAQs. Sticky bottom purchase bar ensures thumb reach on scroll.
- **Checkout (`checkout.html`):** Linear horizontal progress stepper across top (1-Contact, 2-Address, 3-Delivery, 4-Payment). Left 60% contains active form step pane; Right 40% displays order summary with live item thumbnails.

---

## 11. Mobile App Wireframe Descriptions (`app.html`)

- **Device Shell:** Centered 440px viewport shell with dark letterboxing on desktop screens.
- **Splash View:** Full-height deep forest background with bold typography and a single primary entry button.
- **Home Screen:** Horizontal swipeable category chips, campaign hero tile, and horizontal product cards (`overflow-x: auto`).
- **Explore Screen:** Sticky search bar at top, filter category row, and 2-column touch-friendly grid.
- **Product Inspection Sheet:** Slide-up bottom sheet covering 88% of screen height with image, condition badge, size metrics, and sticky purchase button.
- **Persistent Bottom Navigation:** Fixed 56px bottom navigation bar with 48px touch targets for Home, Explore, Sell, Wishlist, and Profile, complete with dynamic badge indicators.

---

## 12. Ergonomic Principles and Implementation

1. **Fitts' Law & Thumb-Zone Reach:**
   - In both the mobile website and dedicated mobile app, critical purchase and navigation controls are anchored to the bottom third of the viewport.
   - The sticky purchase bar on `product.html` keeps the "Add to Cart" action within immediate thumb reach without requiring users to scroll back to the top.
2. **Touch Target Dimensions:**
   - All interactive touch targets adhere to a minimum dimension of 44 × 44 CSS pixels (with 48 × 48 px for primary navigation buttons).
3. **Prevention of Accidental Actions:**
   - Wishlist toggles and delete buttons have comfortable padding preventing mis-taps.
   - Cart removals include clear toast notifications and undo opportunities.
4. **Cognitive Load Reduction:**
   - Forms are chunked into logical steps rather than presented as intimidating single-page walls of text.

---

## 13. Aesthetic Decisions and Visual Design System

- **Color Harmony:**
  - *Deep Forest (`#233D35`):* Represents grounding, heritage, and circular renewal. Used for headers, primary CTAs, and announcement bars.
  - *Warm Ivory (`#F7F3EB`):* Primary background color; eliminates harsh clinical glare of `#FFFFFF` and provides a tactile, paper-like feeling.
  - *Muted Sage (`#DCE4D8`):* Secondary accent for badges, informational banners, and image containers.
  - *Burnt Orange (`#C76B45`):* Reserved strictly for discount tags, sale highlights, and energetic accents.
  - *Charcoal (`#252722`):* High-contrast text color ensuring maximum readability.
- **Typography:**
  - *Headlines:* `DM Serif Display` — imparts an editorial, vintage publication voice.
- **Brand Logo & Mark (`assets/images/logo.png`):**
  - *Symbology:* An upward-curving circular "U" arrow symbolizing renewal, loop closure, and circular life extension.
  - *Central Hanger & Garment:* Encapsulates textile reuse and wardrobe curation at the heart of the circular loop.
  - *Sprouting Leaves:* Represents biological and material regeneration through sustainable consumption without greenwashing.
  - *Logotype:* Bold, rounded sans-serif wordmark anchoring the identity with friendly, modern consumer confidence.
- **Visual Restraint:**
  - No generic gradients, excessive glassmorphism, or floating decorative blobs.

---

## 14. Accessibility Considerations (WCAG 2.1 AA)

- **Contrast Ratios:** Forest-on-Ivory (10.4:1) and Charcoal-on-Ivory (12.1:1) exceed WCAG AAA standards for normal text.
- **Keyboard Navigation:** Explicit `:focus-visible` styles with burnt orange focus rings and offset outlines.
- **Screen Reader Support:** Semantic HTML5 elements (`<nav>`, `<main>`, `<article>`, `<aside>`, `<header>`, `<footer>`), `aria-live` regions on notifications, and descriptive `aria-label` tags on all icon-only buttons.
- **Skip Links:** Accessible "Skip to main content" link placed at the top of every page.
- **Reduced Motion Support:** Media query `@media (prefers-reduced-motion: reduce)` zeroes out animation durations.

---

## 15. Environmental Aspects

- **Honest Environmental Communication:** Avoids fabricated carbon calculators or dubious statistics. Focuses instead on verified circular tenets: extending garment life by 9 months reduces textile footprint by ~30% (WRAP UK study).
- **Proactive Sizing Guidance:** Displays measurement prompts on product pages to reduce return logistics.
- **Lightweight Digital Footprint:** Vanilla JS architecture with zero heavy framework runtimes minimizes device battery consumption and client-side processing.

---

## 16. Technical Implementation

- **Directory Organization:** Clean separation of concerns (`/css/styles.css`, `/js/*.js`, `/assets/`).
- **State Management:** Unified LocalStorage schema (`undo_cart`, `undo_wishlist`, `undo_orders`, `undo_listings`, `undo_user`).
- **Zero Runtime Dependencies:** Runs natively in any modern web browser.

---

## 17. Limitations of the Frontend-Only Prototype

1. **Local Scope:** Data stored in LocalStorage is confined to the individual browser instance; listings created on one machine will not appear on another.
2. **Simulated Payments:** No real financial transactions, payment gateway tokens, or credit cards are processed.
3. **Simulated Image Uploads:** User images are read into local base64 DataURLs via FileReader API.
4. **Mock Logistics:** Tracking numbers and delivery estimates are illustrative demonstration data.

---

## 18. Comprehensive Testing Checklist

- [x] Multi-page navigation links operational across all 10 HTML files.
- [x] Multi-criteria filtering (category, price slider, condition, brand, colour, location) validated.
- [x] Search matches name, category, brand, and description correctly.
- [x] Wishlist persistence and live header badge synchronization tested.
- [x] Cart 1-of-1 quantity logic and shipping calculations tested.
- [x] Multi-step checkout form validation (email, 10-digit phone, 6-digit PIN) verified.
- [x] Live listing preview card on `sell.html` updates in real time.
- [x] Dedicated mobile app (`app.html`) tabs, bottom sheets, and splash screen functional.
- [x] Responsive layout inspected at 360px, 390px, 768px, 1024px, and 1440px.
- [x] Keyboard focus visible on all buttons, links, and inputs.
- [x] Fallback SVG image loads gracefully if external images fail.

---

## 19. Future Enhancements

1. **Peer-to-Peer Chat:** Integrated messaging allowing buyers to ask sellers questions about measurements or fabric stretch.
2. **Community Resale Circles:** University campus or neighborhood thrift circles with local handoff to eliminate shipping entirely.
3. **Virtual Wardrobe Integration:** Digital closet management tool where buyers can track how many times they have worn each piece.
4. **Backend Migration:** Seamless transition to a Node.js/PostgreSQL backend with automated image moderation and real payment rails (UPI Intent / Razorpay).

---
*Documentation compiled for UNDO Product Design Evaluation.*
