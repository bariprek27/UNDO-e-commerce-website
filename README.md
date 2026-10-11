# UNDO — Pre-Loved, Reimagined
> A circular-commerce marketplace prototype for thrifted, pre-owned, and vintage goods.

Built as an academic Product Design project demonstrating human-computer interaction (HCI), ergonomics, accessibility (WCAG 2.1 AA), responsive layout, and circular fashion principles.

---

## 🌿 Overview

UNDO is a working frontend-only marketplace designed to feel like an independent editorial fashion publication combined with a carefully curated vintage store. It eliminates the visual clutter and distrust typical of second-hand thrifting apps through:
- **Editorial Art Direction:** Warm ivory backgrounds, deep forest typography, restrained burnt orange accents, and generous whitespace.
- **Uncompromising Transparency:** 4-tier condition grading (*Like New*, *Excellent*, *Good*, *Gently Used*) with visible wear notes.
- **Unique Piece Mental Model:** Strictly 1-of-1 availability on listings.
- **Dual Prototype Experience:** A multi-page responsive web platform and a dedicated thumb-ergonomic mobile application prototype.

---

## 🛠️ Technology Stack

- **Structure:** Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`)
- **Styling:** Tailwind CSS (via CDN) + Custom Brand Design System (`css/styles.css`)
- **Typography:** Google Fonts (`DM Serif Display` + `DM Sans`)
- **Logic & State:** Vanilla JavaScript (ES6+) with zero frameworks
- **Persistence:** LocalStorage for cart, wishlist, orders, listings, and user preferences
- **Mock Inventory:** 35 realistic second-hand products across 6 departments with Indian Rupee (₹) pricing

*No database, authentication server, Node build process, or external API keys required.*

---

## 📂 Project Structure

```text
UNDO/
├── index.html              # Home page with editorial hero & curated departments
├── shop.html               # Catalogue page with multi-criteria filters & live search
├── product.html            # Product detail view with gallery, condition & seller bio
├── wishlist.html           # Dedicated saved pieces screen with move-to-cart actions
├── cart.html               # Shopping bag with 1-of-1 quantity logic & shipping thresholds
├── checkout.html           # 5-step simulated checkout (Contact, Address, Delivery, Payment, Confirmed)
├── sell.html               # Community listing flow with live card preview & image upload
├── account.html            # Profile dashboard, demo sign-in/up, order history & user listings
├── about.html              # The Circular Story, 4-step reuse model & garment care guide
├── app.html                # Dedicated Mobile App Prototype (Splash, Tabs, Bottom-Sheets)
├── DESIGN_DOCUMENTATION.md # Comprehensive 19-section academic product design report
├── README.md               # Setup and project guide
├── assets/
│   ├── images/
│   │   ├── logo.png        # Official brand logo (circular U arrow + hanger + leaves)
│   │   └── fallback.svg    # Graceful image fallback placeholder
│   └── icons/
├── css/
│   └── styles.css          # Design system tokens, typography, and custom UI components
└── js/
    ├── products.js         # 35-item product database & helper functions
    ├── storage.js          # Safe LocalStorage state management
    ├── shared.js           # Toast alerts, card generator, search/sort helpers & navigation
    ├── home.js             # Home page feeds and interactions
    ├── shop.js             # Catalogue filtering, search query handling & active chips
    ├── product.js          # Detail view, gallery thumbnail switching & sticky purchase bar
    ├── wishlist.js         # Wishlist management and cart transfer logic
    ├── cart.js             # Cart items, removal confirmation, and subtotal calculation
    ├── checkout.js         # Multi-step checkout validation & simulated order generation
    ├── sell.js             # Listing form validation, drag-and-drop preview & local publishing
    ├── account.js          # Demo authentication and simulated order history
    └── app.js              # Dedicated mobile application state and tab switching
```

---

## 🚀 How to Run the Prototype Locally

No installation or compilation step is needed.

### Option A: Direct Browser Opening (Quickest)
Simply double-click or open `index.html` in any modern web browser (Chrome, Safari, Firefox, Edge).
To evaluate the dedicated mobile app prototype directly, open `app.html`.

### Option B: Using a Simple Local Development Server
If you prefer running via a local HTTP server:

Using Python:
```bash
cd UNDO
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

Using Node (`npx serve`):
```bash
cd UNDO
npx serve .
```

---

## 📱 Mobile App Prototype (`app.html`)

In addition to responsive browser resizing on the website, `app.html` provides a dedicated mobile smartphone shell featuring:
- **Splash Introduction:** Brand statement and entry transition.
- **Persistent Bottom Navigation:** 5 key tabs (Home, Explore, Sell, Saved, Cart, Profile) with live item count badges.
- **Ergonomic Reach:** Touch controls sized to 44–48px placed in the lower screen third.
- **Sliding Bottom Sheets:** Full product inspection and fast one-tap simulated checkout.

---

## 🧪 Demo Data & LocalStorage Reset

- Any newly created listings created via `sell.html` or `app.html` are stored in your browser's LocalStorage under `undo_listings` and appear immediately in the shop catalogue.
- Orders placed during simulated checkout are saved under `undo_orders` and can be inspected in `account.html`.
- To completely reset demo state to factory defaults, run this in your browser developer console:
```javascript
localStorage.clear();
location.reload();
```

---

## 🎓 Academic Evaluation Highlights

1. **Ergonomics & HCI:** Form step chunking, sticky purchase bar on product view, thumb-friendly navigation.
2. **Accessibility:** WCAG 2.1 AA compliant color contrast (Forest on Ivory > 10:1), full keyboard support, visible `:focus-visible` outlines, ARIA attributes.
3. **Environmental Transparency:** Real-world longevity messaging (care guides, measurement verification) without greenwashing.
4. **Resale Startup Credibility:** Believable pricing in Indian Rupees (₹), realistic photography, and genuine seller notes.

For detailed design rationale, user personas, wireframe descriptions, and user journey breakdowns, refer to [DESIGN_DOCUMENTATION.md](file:///d:/Preksha/PD%20New/UNDO/DESIGN_DOCUMENTATION.md).
