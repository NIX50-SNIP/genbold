# ⚡ Gen Bold - eCommerce Web Application

**Gen Bold** is a modern, high-converting eCommerce web application developed in accordance with the provided design theme, featuring a bold deep navy (`#0b1329`) and vibrant orange (`#ff5722`) visual language, hierarchical Category Tree navigation, a password-protected Admin Suite, Cash on Delivery (COD) threshold rules, and rich interactive shopping capabilities.

---

## 🚀 Key Features

### 1. 🎨 Theme Design & Layout
* **Header & Top Promo Bar**: Support email, phone, INR currency selector, and order tracker.
* **Hero Banner**: Faithfully reproduces the reference image layout with the headline **"SOUND THAT MOVES YOU"**, sub-badges, feature badges (ANC Noise Cancelling, 40H Battery Life, Bluetooth 5.3), vibrant orange CTA button **"SHOP NOW →"**, launch discount badge (**-30% OFF LAUNCH**), and circular accent backdrop.
* **4-Point Value Proposition Row**: Free Delivery over ₹299, 100% Discreet Packaging, Cash on Delivery (COD), and 24/7 Dedicated Support.
* **Shop by Category**: Visual circular image cards for all primary product trees.
* **Flash Sale Countdown Banner**: Real-time ticker counting down Days, Hours, Minutes, and Seconds with a direct deal link.
* **Featured Products Grid**: Product cards equipped with MRP (strikethrough), Selling Price, auto-calculated discount stickers (e.g. `-30% OFF`), savings amount, star reviews, stock badges, and instant "Add to Cart" actions.
* **Comprehensive Multi-Column Footer**: Brand narrative, catalog links, customer care policies, newsletter subscription, and payment method badges.

---

### 2. 🔒 Admin Panel (Top-Left 3-Dots `⋮` & Password: `1082`)
* **Location**: Click the `⋮` button positioned in the **top-left corner** of the page.
* **Master Password**: `1082`
* **Capabilities**:
  * **Dashboard Overview**: Real-time KPI counters for Total Products, Category Trees, Active Coupons, Total COD Orders, and Total Revenue.
  * **Product Management & CRUD**:
    * **Add New Product & Edit Existing Product**: Full modal form.
    * **Multi-Angle Image Gallery**:
      * Add multiple image angles per product via the **"+ Add Another Image URL"** dynamic builder.
      * Supports both direct image URLs (`https://...`) and local device file uploads (**"📁 Upload"** button) with instant Base64 preview.
      * Designates the 1st image as the **⭐ Primary Cover Image** for cards and listings.
      * Interactive thumbnail gallery strip in the full-screen product details view with instant image switching on hover/click.
    * **Pricing Control**: Add both **MRP** and **Selling Price**; the system dynamically calculates and previews the exact discount percentage (e.g., `-35% OFF`) and customer savings in real-time.
    * **Product Attributes**: Select/configure **Gender** (Unisex, Men, Women, Couples), **Size / Normal Size** options, **Colour** variants, **Stock count**, and **Stock availability**.
    * **Category Tree Assignment**: Assign items to any parent Category and nested Subcategory.
    * **Image Preview**: Live image preview with preset options.
  * **Category Tree Manager**:
    * View the complete multi-level tree hierarchy.
    * Add new main categories (with icons, slugs, and descriptions).
    * Add new subcategories to any parent category.
  * **Coupon Engine**:
    * Create, manage, and delete promo codes with percentage or fixed discount values and minimum order conditions.
  * **Customer COD Orders**:
    * Track customer details (Name, 10-digit mobile number, street address, pincode).
    * Update order fulfillment status (*Confirmed*, *Discreetly Packed*, *Dispatched*, *Delivered & Paid*).
  * **Settings & Backup**:
    * Configure Free COD minimum threshold (default: ₹299).
    * Configure small order delivery fee (default: ₹49 INR).
    * **Export to JSON**: Download the complete catalog and settings backup.
    * **Import from JSON**: Upload and restore catalog data.
    * **Reset to Factory Demo Data**: Restore all default demo products with one click.

---

### 3. 🌳 Professional Category Tree System
Pre-configured with demo products across all branches:

1. **🎮 Hobbygrade Toys**
   * RC High-Speed Vehicles & Crawlers (e.g., Apex 1/14 Brushless Monster Truck 60 km/h)
   * 4K GPS Drones & Quadcopters (e.g., AeroFalcon 4K Dual-Camera Folding Drone)
   * 1:18 Precision Die-cast Models (e.g., Die-cast Supercar Collectible)
   * Programmable Robotics & Mecha Kits (e.g., MechaStrike AI Combat Robot)
   * Aerobatic RC Planes & Helicopters
2. **✨ Sexual Toys**
   * Sonic & Dual-Stimulation Vibrators (e.g., Luxe Pulse Clitoral & G-Spot Vibrator)
   * Automated Warming Male Strokers (e.g., ThermoPulse 38°C Heated Stroker)
   * App-Controlled Long Distance Couple Toys (e.g., SyncroWave Dual Wand)
   * Smart Kegel & Pelvic Floor Trainers (e.g., BioFit Bluetooth Trainer)
   * Silk Bondage & Feather Romance Kits (e.g., Midnight Velvet Restraint Set)
3. **💧 Sexual Products & Wellness**
   * Aloe Silk Water & Silicone Lubricants (e.g., PureGlide 100% Organic Aloe Lube 150ml)
   * Warm Sensual Botanical Massage Oils (e.g., Madagascar Vanilla Orchid Warming Oil)
   * Daily pH-Balanced Intimate Foam Wash (e.g., CleanZen Gentle pH 3.5 Wash)
   * Ayurvedic Stamina & Vitality Capsules (e.g., VigorBold Shilajit & Ashwagandha KSM-66)
   * Ultra-Thin Feather Sensation Packs (e.g., FeatherLite <0.04mm 30 Pcs)
4. **🎧 Tech, Audio & Lifestyle**
   * ANC Over-Ear Pro Headphones (e.g., GenBold SoundMax ANC Pro Wireless)
   * AMOLED Health & Fitness Smartwatches (e.g., Pro Watch X1 Smart Health Tracker)
   * TWS Studio Earbuds & Bass Pods (e.g., SoundCore Elite TWS Earbuds)
   * Waterproof Heavy Bass Bluetooth Speakers (e.g., Pulse X Rugged IPX7 Speaker)
   * 15W Fast Magnetic Wireless Chargers (e.g., Slim CNC Aluminum Qi Dock)

---

### 4. 🛒 Fullscreen Cart & COD Rules
* **Fullscreen Shopping Bag Suite**: Clicking the cart opens an immersive full-screen shopping experience with an itemized table, variant tags, instant quantity steppers, and a sticky order summary column.
* **Strict Cash on Delivery (COD)**: Only COD is available as the payment method for total buyer convenience.
* **Minimum Order Value Threshold**:
  * **Orders >= ₹299**: COD Delivery is **100% FREE (₹0)**!
  * **Orders < ₹299**: COD handling fee of **₹49 INR** is charged.
* **Free COD Progress Bar**: Real-time animated progress bar in the cart prompting: *"Add ₹X more for FREE COD Delivery!"*.
* **100% Discreet Packaging Guarantee**: Plain brown eco-carton packaging with zero mention of brand or product names on exterior shipping labels.

---

### 5. 🔍 Fullscreen Product Window & Extended Details
* **Fullscreen Product View**: Clicking any product card opens a dedicated full-screen product presentation with breadcrumb navigation and quick actions.
* **Multi-Angle Gallery**: Interactive thumbnail strip allowing users to inspect product angles with instant zoom.
* **Comprehensive Variant Controls**: Live selection for **Gender**, **Size / Normal Size** (with Size Guide), and **Colour** swatches with active ring indicator.
* **Pincode Delivery Estimator**: Enter any 6-digit Indian PIN code for immediate COD delivery timeframe calculation.
* **In-Depth Extended Tabs**:
  * 📖 **Description & Key Highlights**: Medical-grade certification, motor acoustic dampening (&lt;40dB), and ergonomic design.
  * ⚙️ **Technical Specifications Table**: Dimensions, battery life, charging type, waterproof rating, and warranty.
  * 💡 **How to Use & Care Guidelines**: Step-by-step instructions for charging, lubrication, washing, and storage.
  * 🔒 **Discreet Packaging Promise**: Full transparency on unmarked brown outer boxes and neutral courier waybills.
  * ⭐ **Customer Reviews**: Rating breakdown (5-star distribution), recommendation rate, and verified buyer reviews.
* **Related Products Carousel**: 4 related products from the catalog ready to explore with one click.

---

### 6. 🎟️ Discount Coupons Engine
Pre-loaded active coupon codes:
* `GENBOLD10`: 10% OFF on all orders site-wide.
* `BOLD50`: Flat ₹50 OFF on orders above ₹499.
* `WELCOME20`: 20% OFF for new shoppers on orders above ₹699.
* `FREESHIP`: Flat ₹49 OFF (Offsets small order delivery fee).

---

## 📁 File Structure

```
gen-bold-store/
├── index.html                  # Main storefront markup, modals & drawers
├── README.md                   # System documentation & admin credentials
├── css/
│   ├── base.css                # Typography, variables, utility classes & toast system
│   ├── layout.css              # Top bar, header, 3-dots launcher, hero banner & footer
│   ├── store.css               # Category carousel, countdown banner, product cards & modals
│   ├── cart.css                # Cart drawer, COD rules progress bar & checkout modal
│   └── admin.css               # Admin password authentication modal & dashboard suite
└── js/
    ├── data.js                 # Initial catalog schema, category tree & demo products
    ├── store.js                # State management, localStorage persistence & CRUD
    ├── cart.js                 # Cart operations, ₹299 COD delivery rules & coupon calculations
    ├── admin.js                # Password verification ('1082'), admin forms & order handling
    └── app.js                  # Storefront controller, search, filtering & flash countdown
```

---

## 💻 How to Run the Application

You can open `index.html` directly in any web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari) or serve it with any static web server:

```powershell
# Directly launch in default browser:
Start-Process "C:\Users\user\.gemini\antigravity\scratch\gen-bold-store\index.html"
```

No external server or build tools are required—everything runs seamlessly in modern browsers with persistent `localStorage` support.
