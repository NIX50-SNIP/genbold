/**
 * Gen Bold Storefront Main Application
 * Connects storefront UI, category tree navigation, product modals, cart drawer,
 * COD checkout, coupon handling, and live countdown timer.
 */

class App {
  constructor() {
    this.activeCategory = "all";
    this.activeSubcategory = "all";
    this.activeGender = "all";
    this.searchQuery = "";
    this.sortBy = "featured";
    this.selectedModalProduct = null;
    this.selectedModalSize = null;
    this.selectedModalColor = null;

    this.init();
  }

  init() {
    this.startFlashSaleTimer();
    this.renderCategoryNav();
    this.renderCategoryCards();
    this.renderCatalog();
    this.bindEvents();
    this.updateCartBadges();
    this.updateWishlistBadges();

    // Re-render when products or categories change
    window.addEventListener("genbold:productsChanged", () => this.renderCatalog());
    window.addEventListener("genbold:categoriesChanged", () => {
      this.renderCategoryNav();
      this.renderCategoryCards();
      this.renderCatalog();
    });
    window.addEventListener("genbold:cartChanged", (e) => {
      this.updateCartBadges();
      this.renderCartDrawerContent(e.detail);
    });
    window.addEventListener("genbold:wishlistChanged", () => {
      this.updateWishlistBadges();
      this.renderCatalog();
    });
    window.addEventListener("genbold:storeReset", () => {
      this.renderCategoryNav();
      this.renderCategoryCards();
      this.renderCatalog();
      this.updateCartBadges();
    });
  }

  bindEvents() {
    // Search input
    const searchInput = document.getElementById("header-search-input");
    const searchCatSelect = document.getElementById("header-search-category");
    const searchBtn = document.getElementById("header-search-btn");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderCatalog();
      });
    }

    if (searchCatSelect) {
      searchCatSelect.addEventListener("change", (e) => {
        this.activeCategory = e.target.value;
        this.activeSubcategory = "all";
        this.renderCatalog();
      });
    }

    if (searchBtn && searchInput) {
      searchBtn.addEventListener("click", () => {
        this.searchQuery = searchInput.value.toLowerCase().trim();
        this.renderCatalog();
        document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
      });
    }

    // Sort select
    const sortSelect = document.getElementById("catalog-sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.renderCatalog();
      });
    }

    // Gender filter pills
    document.querySelectorAll(".gender-filter-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".gender-filter-btn").forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        this.activeGender = e.currentTarget.getAttribute("data-gender");
        this.renderCatalog();
      });
    });

    // Cart Drawer Open/Close
    const cartTrigger = document.getElementById("header-cart-btn");
    const cartDrawer = document.getElementById("cart-drawer");
    const closeCartBtn = document.getElementById("close-cart-drawer");
    const cartOverlay = document.getElementById("cart-drawer-overlay");

    if (cartTrigger) {
      cartTrigger.addEventListener("click", () => this.openCartDrawer());
    }
    if (closeCartBtn) {
      closeCartBtn.addEventListener("click", () => this.closeCartDrawer());
    }
    if (cartOverlay) {
      cartOverlay.addEventListener("click", () => this.closeCartDrawer());
    }

    // Checkout Modal Open/Close
    const proceedCheckoutBtn = document.getElementById("proceed-checkout-btn");
    const checkoutModal = document.getElementById("checkout-modal");
    const closeCheckoutBtn = document.getElementById("close-checkout-modal");

    if (proceedCheckoutBtn) {
      proceedCheckoutBtn.addEventListener("click", () => {
        this.closeCartDrawer();
        this.openCheckoutModal();
      });
    }
    if (closeCheckoutBtn) {
      closeCheckoutBtn.addEventListener("click", () => this.closeCheckoutModal());
    }

    // COD Checkout Form Submit
    const checkoutForm = document.getElementById("cod-checkout-form");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleCheckoutSubmit();
      });
    }

    // Coupon Apply button in Cart Drawer
    const applyCouponBtn = document.getElementById("cart-apply-coupon-btn");
    const couponInput = document.getElementById("cart-coupon-input");
    if (applyCouponBtn && couponInput) {
      applyCouponBtn.addEventListener("click", () => {
        const code = couponInput.value.trim();
        const res = window.genBoldCart.applyCoupon(code);
        if (res.success) {
          window.showToast(res.message, "success");
        } else {
          window.showToast(res.message, "error");
        }
      });
    }

    // Quick View Modal Close
    const closeQuickViewBtn = document.getElementById("close-quickview-modal");
    if (closeQuickViewBtn) {
      closeQuickViewBtn.addEventListener("click", () => this.closeProductModal());
    }

    // Keyboard ESC listener
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeProductModal();
        this.closeCartDrawer();
        this.closeCheckoutModal();
      }
    });

    // Track Order Trigger & Modal
    const trackOrderBtn = document.getElementById("header-track-order-btn");
    const trackOrderModal = document.getElementById("track-order-modal");
    const closeTrackBtn = document.getElementById("close-track-modal");
    const trackForm = document.getElementById("track-order-form");

    if (trackOrderBtn) {
      trackOrderBtn.addEventListener("click", () => {
        if (trackOrderModal) trackOrderModal.classList.add("active");
      });
    }
    if (closeTrackBtn) {
      closeTrackBtn.addEventListener("click", () => {
        if (trackOrderModal) trackOrderModal.classList.remove("active");
      });
    }
    if (trackForm) {
      trackForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleOrderLookup();
      });
    }

    // Wishlist Drawer Open/Close
    const wishlistBtn = document.getElementById("header-wishlist-btn");
    const wishlistModal = document.getElementById("wishlist-modal");
    const closeWishlistBtn = document.getElementById("close-wishlist-modal");

    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", () => this.openWishlistModal());
    }
    if (closeWishlistBtn) {
      closeWishlistBtn.addEventListener("click", () => {
        if (wishlistModal) wishlistModal.classList.remove("active");
      });
    }
  }

  // --- FLASH SALE COUNTDOWN ---
  startFlashSaleTimer() {
    const daysEl = document.getElementById("flash-days");
    const hoursEl = document.getElementById("flash-hours");
    const minsEl = document.getElementById("flash-mins");
    const secsEl = document.getElementById("flash-secs");

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    // Fixed 2 days 14 hours countdown from now, saved in session
    let targetTime = sessionStorage.getItem("genbold_flash_target");
    if (!targetTime) {
      targetTime = Date.now() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (36 * 60 * 1000);
      sessionStorage.setItem("genbold_flash_target", targetTime);
    } else {
      targetTime = Number(targetTime);
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, targetTime - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minsEl.textContent = String(minutes).padStart(2, "0");
      secsEl.textContent = String(seconds).padStart(2, "0");
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // --- CATEGORIES NAV & MEGA MENU ---
  renderCategoryNav() {
    const navDropdown = document.getElementById("nav-categories-dropdown");
    const megaMenu = document.getElementById("nav-mega-menu");
    const filterTabs = document.getElementById("catalog-filter-tabs");
    const categories = window.genBoldStore.getCategories();

    // Top Category Search Select
    const searchCatSelect = document.getElementById("header-search-category");
    if (searchCatSelect) {
      searchCatSelect.innerHTML = `<option value="all">All Categories</option>` +
        categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
    }

    // Mega Menu Layout
    if (megaMenu) {
      megaMenu.innerHTML = categories.map(cat => `
        <div class="mega-column">
          <div class="mega-head" onclick="window.genBoldApp.selectCategory('${cat.id}')">
            <span class="mega-icon">${cat.icon || '🛍️'}</span>
            <strong>${cat.name}</strong>
          </div>
          <ul class="mega-sub-list">
            ${(cat.subcategories || []).map(sub => `
              <li>
                <a href="#catalog-section" onclick="window.genBoldApp.selectSubcategory('${cat.id}', '${sub.id}')">
                  ${sub.name}
                </a>
              </li>
            `).join("")}
          </ul>
        </div>
      `).join("");
    }

    // Catalog Filter Tabs
    if (filterTabs) {
      filterTabs.innerHTML = `
        <button class="filter-tab-btn ${this.activeCategory === 'all' ? 'active' : ''}" onclick="window.genBoldApp.selectCategory('all')">
          All Products
        </button>
      ` + categories.map(cat => `
        <button class="filter-tab-btn ${this.activeCategory === cat.id ? 'active' : ''}" onclick="window.genBoldApp.selectCategory('${cat.id}')">
          ${cat.icon || ''} ${cat.name}
        </button>
      `).join("");
    }
  }

  // --- CATEGORY CARDS CAROUSEL ---
  renderCategoryCards() {
    const container = document.getElementById("shop-by-category-grid");
    if (!container) return;

    const categories = window.genBoldStore.getCategories();
    container.innerHTML = categories.map(cat => {
      // Find representative image
      const prods = window.genBoldStore.getProducts().filter(p => p.categoryId === cat.id);
      const img = prods.length > 0 ? prods[0].image : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80";

      return `
        <div class="category-card" onclick="window.genBoldApp.selectCategory('${cat.id}')">
          <div class="cat-img-wrap">
            <img src="${img}" alt="${cat.name}" loading="lazy">
          </div>
          <h4 class="cat-name">${cat.name}</h4>
          <span class="cat-count">${prods.length} Items</span>
        </div>
      `;
    }).join("");
  }

  selectCategory(catId) {
    this.activeCategory = catId;
    this.activeSubcategory = "all";
    document.querySelectorAll(".filter-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.textContent.includes(catId) || (catId === 'all' && btn.textContent.includes('All')));
    });
    this.renderCatalog();
    document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
  }

  selectSubcategory(catId, subId) {
    this.activeCategory = catId;
    this.activeSubcategory = subId;
    this.renderCatalog();
    document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
  }

  // --- CATALOG RENDERING & FILTERING ---
  renderCatalog() {
    const grid = document.getElementById("products-catalog-grid");
    const countEl = document.getElementById("catalog-results-count");
    if (!grid) return;

    let products = window.genBoldStore.getProducts();

    // 1. Category Filter
    if (this.activeCategory !== "all") {
      products = products.filter(p => p.categoryId === this.activeCategory);
    }

    // 2. Subcategory Filter
    if (this.activeSubcategory !== "all") {
      products = products.filter(p => p.subcategoryId === this.activeSubcategory);
    }

    // 3. Gender Filter
    if (this.activeGender !== "all") {
      products = products.filter(p => p.gender && p.gender.toLowerCase() === this.activeGender.toLowerCase());
    }

    // 4. Search Filter
    if (this.searchQuery) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(this.searchQuery) ||
        (p.description && p.description.toLowerCase().includes(this.searchQuery)) ||
        (p.badge && p.badge.toLowerCase().includes(this.searchQuery))
      );
    }

    // 5. Sorting
    if (this.sortBy === "price-low") {
      products.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === "price-high") {
      products.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === "discount") {
      products.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    } else if (this.sortBy === "rating") {
      products.sort((a, b) => b.rating - a.rating);
    } else {
      // Featured / default: hero items first
      products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    if (countEl) {
      countEl.textContent = `Showing ${products.length} products`;
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-catalog-message">
          <div class="empty-icon">🔍</div>
          <h3>No products match your filter</h3>
          <p>Try resetting your search query or selecting a different category.</p>
          <button class="btn btn-primary mt-3" onclick="window.genBoldApp.resetFilters()">View All Products</button>
        </div>
      `;
      return;
    }

    const categories = window.genBoldStore.getCategories();

    grid.innerHTML = products.map(prod => {
      const isWish = window.genBoldStore.isWishlisted(prod.id);
      const category = categories.find(c => c.id === prod.categoryId);
      const catName = category ? category.name : "";
      const mrp = Number(prod.mrp) || Number(prod.price);
      const price = Number(prod.price);
      const discount = prod.discount || (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);
      const savings = Math.max(0, mrp - price);

      return `
        <div class="product-card" data-id="${prod.id}">
          <div class="prod-badge-stack">
            ${discount > 0 ? `<span class="prod-discount-badge">-${discount}% OFF</span>` : ''}
            ${prod.flashSale ? `<span class="prod-flash-badge">⚡ FLASH</span>` : ''}
          </div>

          <button class="prod-wishlist-btn ${isWish ? 'active' : ''}" onclick="window.genBoldApp.toggleWishlist('${prod.id}', event)" title="Save to Wishlist">
            ${isWish ? '❤️' : '🤍'}
          </button>

          <div class="prod-img-box" onclick="window.genBoldApp.openProductModal('${prod.id}')">
            <img src="${prod.image}" alt="${prod.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300'">
            <div class="quick-view-overlay">
              <span>👁️ Quick View</span>
            </div>
          </div>

          <div class="prod-info-box">
            <div class="prod-category-tag">${catName}</div>
            <h3 class="prod-title" onclick="window.genBoldApp.openProductModal('${prod.id}')" title="${prod.name}">
              ${prod.name}
            </h3>

            <div class="prod-rating-row">
              <span class="stars">⭐⭐⭐⭐⭐</span>
              <span class="rating-num">${prod.rating || 4.8}</span>
              <span class="review-count">(${prod.reviewsCount || 45})</span>
            </div>

            <div class="prod-price-row">
              <span class="current-price">₹${price.toLocaleString("en-IN")}</span>
              ${mrp > price ? `<span class="mrp-price">₹${mrp.toLocaleString("en-IN")}</span>` : ''}
            </div>

            ${savings > 0 ? `<div class="prod-save-pill">Save ₹${savings.toLocaleString("en-IN")}</div>` : ''}

            <div class="prod-stock-status">
              ${prod.inStock ? 
                '<span class="text-in-stock">✔ In Stock (COD Available)</span>' : 
                '<span class="text-out-stock">✖ Out of Stock</span>'
              }
            </div>

            <div class="prod-actions-row">
              <button class="btn btn-add-cart" onclick="window.genBoldApp.quickAddToCart('${prod.id}', event)" ${!prod.inStock ? 'disabled' : ''}>
                🛒 Add to Cart
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  resetFilters() {
    this.activeCategory = "all";
    this.activeSubcategory = "all";
    this.activeGender = "all";
    this.searchQuery = "";
    const searchInput = document.getElementById("header-search-input");
    if (searchInput) searchInput.value = "";
    document.querySelectorAll(".filter-tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelector(".filter-tab-btn")?.classList.add("active");
    this.renderCatalog();
  }

  // --- WISHLIST ---
  toggleWishlist(productId, event) {
    if (event) event.stopPropagation();
    const added = window.genBoldStore.toggleWishlist(productId);
    const prod = window.genBoldStore.getProductById(productId);
    if (added) {
      window.showToast(`Added "${prod?.name || 'Item'}" to your Wishlist ❤️`, "success");
    } else {
      window.showToast(`Removed from Wishlist.`, "info");
    }
  }

  updateWishlistBadges() {
    const list = window.genBoldStore.getWishlist();
    const countEl = document.getElementById("header-wishlist-count");
    if (countEl) countEl.textContent = list.length;
  }

  openWishlistModal() {
    const modal = document.getElementById("wishlist-modal");
    const container = document.getElementById("wishlist-items-container");
    if (!modal || !container) return;

    const list = window.genBoldStore.getWishlist();
    const products = list.map(id => window.genBoldStore.getProductById(id)).filter(Boolean);

    if (products.length === 0) {
      container.innerHTML = `
        <div class="text-center py-5">
          <div style="font-size:3rem;margin-bottom:1rem;">❤️</div>
          <h4>Your wishlist is empty</h4>
          <p class="text-muted">Click the heart icon on any product to save it for later!</p>
        </div>
      `;
    } else {
      container.innerHTML = products.map(p => `
        <div class="wishlist-row">
          <img src="${p.image}" class="wishlist-thumb" alt="${p.name}">
          <div class="wishlist-info">
            <strong>${p.name}</strong>
            <div class="selling-bold">₹${Number(p.price).toLocaleString("en-IN")}</div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-primary" onclick="window.genBoldApp.quickAddToCart('${p.id}');">Add to Cart</button>
            <button class="btn btn-sm btn-outline" onclick="window.genBoldStore.toggleWishlist('${p.id}'); window.genBoldApp.openWishlistModal();">Remove</button>
          </div>
        </div>
      `).join("");
    }

    modal.classList.add("active");
  }

  // --- QUICK ADD & PRODUCT DETAILS MODAL ---
  quickAddToCart(productId, event) {
    if (event) event.stopPropagation();
    const prod = window.genBoldStore.getProductById(productId);
    if (!prod) return;

    // If product has multiple sizes or colors, open details modal for variant selection
    if ((prod.sizes && prod.sizes.length > 1) || (prod.colors && prod.colors.length > 1)) {
      this.openProductModal(productId);
      return;
    }

    window.genBoldCart.addItem(prod, 1);
    window.showToast(`Added "${prod.name}" to cart! 🛒`, "success");
    this.openCartDrawer();
  }

  openProductModal(productId) {
    const prod = window.genBoldStore.getProductById(productId);
    if (!prod) return;

    this.selectedModalProduct = prod;
    this.selectedModalSize = prod.sizes && prod.sizes.length > 0 ? prod.sizes[0] : "Standard";
    this.selectedModalColor = prod.colors && prod.colors.length > 0 ? (prod.colors[0].name || "Standard") : "Standard";

    const modal = document.getElementById("quickview-modal");
    if (!modal) return;

    const categories = window.genBoldStore.getCategories();
    const category = categories.find(c => c.id === prod.categoryId);
    const catName = category ? category.name : "Exclusive";
    const subcatObj = category?.subcategories?.find(s => s.id === prod.subcategoryId);
    const subcatName = subcatObj ? subcatObj.name : (prod.subcategoryId || "Premium");

    const mrp = Number(prod.mrp) || Number(prod.price);
    const price = Number(prod.price);
    const discount = prod.discount || (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);
    const savings = Math.max(0, mrp - price);

    // Breadcrumbs & Top Tags
    const crumbCat = document.getElementById("pdp-crumb-cat");
    const crumbTitle = document.getElementById("pdp-crumb-title");
    const catBadge = document.getElementById("pdp-cat-badge");
    const subcatBadge = document.getElementById("pdp-subcat-badge");

    if (crumbCat) crumbCat.textContent = catName;
    if (crumbTitle) crumbTitle.textContent = prod.name;
    if (catBadge) catBadge.textContent = catName;
    if (subcatBadge) subcatBadge.textContent = subcatName;

    // Main Image & Floating Badges
    const mainImg = document.getElementById("modal-prod-img");
    if (mainImg) mainImg.src = prod.image;

    const floatDiscount = document.getElementById("pdp-float-discount");
    if (floatDiscount) {
      floatDiscount.textContent = discount > 0 ? `-${discount}% OFF` : "HOT DEAL";
      floatDiscount.style.display = discount > 0 ? "inline-block" : "none";
    }

    // Thumbnails generation (Product gallery images or fallback)
    const thumbStrip = document.getElementById("pdp-thumbnails-strip");
    if (thumbStrip) {
      let galleryList = [];
      if (Array.isArray(prod.images) && prod.images.length > 0) {
        galleryList = prod.images.filter(img => typeof img === 'string' && img.trim().length > 0);
      }
      if (galleryList.length === 0) {
        galleryList = prod.image ? [prod.image] : ["https://via.placeholder.com/600"];
      }

      thumbStrip.innerHTML = galleryList.map((src, idx) => `
        <button type="button" class="pdp-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="window.genBoldApp.changeMainImage('${src}', this)">
          <img src="${src}" alt="Angle ${idx + 1}" onerror="this.src='${prod.image || 'https://via.placeholder.com/80'}'">
        </button>
      `).join("");
    }

    // Titles & Ratings
    document.getElementById("modal-prod-title").textContent = prod.name;
    document.getElementById("modal-prod-rating").textContent = prod.rating || 4.9;
    document.getElementById("modal-prod-reviews").textContent = `(${prod.reviewsCount || 142} verified customer reviews)`;
    document.getElementById("modal-prod-gender").textContent = prod.gender || "Unisex";

    // Pricing
    document.getElementById("modal-prod-price").textContent = `₹${price.toLocaleString("en-IN")}`;
    document.getElementById("modal-prod-mrp").textContent = mrp > price ? `₹${mrp.toLocaleString("en-IN")}` : "";
    document.getElementById("modal-prod-discount").textContent = discount > 0 ? `-${discount}% OFF` : "";
    document.getElementById("modal-prod-discount").style.display = discount > 0 ? "inline-flex" : "none";
    document.getElementById("modal-prod-savings").textContent = savings > 0 ? 
      `✓ You Save ₹${savings.toLocaleString("en-IN")} (${discount}% OFF - Best Direct Price)` : 
      "✓ Best Direct Price Guaranteed";

    // Stock Alert
    const stockText = document.getElementById("pdp-stock-status-text");
    if (stockText) {
      stockText.textContent = prod.inStock ? 
        `In Stock — Ready for Same-Day COD Dispatch (Only ${prod.stockCount || 12} items left)` : 
        "Currently Out of Stock — Backordering Available";
    }

    // Short Description & Full Story Tab
    document.getElementById("modal-prod-desc").textContent = prod.description || "High-performance item designed for extreme quality and durability.";
    const fullDescText = document.getElementById("pdp-full-desc-text");
    if (fullDescText) {
      fullDescText.textContent = prod.description || "";
    }

    // Reset Quantity
    const qtyInput = document.getElementById("modal-qty-input");
    if (qtyInput) qtyInput.value = 1;

    // Render Size Options
    const sizeContainer = document.getElementById("modal-size-options");
    if (sizeContainer) {
      if (prod.sizes && prod.sizes.length > 0) {
        sizeContainer.innerHTML = prod.sizes.map((s, idx) => `
          <button type="button" class="variant-pill ${idx === 0 ? 'active' : ''}" onclick="window.genBoldApp.selectModalSize('${s}', this)">
            ${s}
          </button>
        `).join("");
      } else {
        sizeContainer.innerHTML = `<span class="variant-pill active">Standard Fit</span>`;
      }
    }

    // Render Color Options
    const colorContainer = document.getElementById("modal-color-options");
    const colorLabel = document.getElementById("pdp-selected-color-name");
    if (colorLabel) {
      colorLabel.textContent = this.selectedModalColor;
    }

    if (colorContainer) {
      if (prod.colors && prod.colors.length > 0) {
        colorContainer.innerHTML = prod.colors.map((c, idx) => `
          <button type="button" class="color-swatch-btn ${idx === 0 ? 'active' : ''}" style="background-color:${c.hex || '#ff5722'}" title="${c.name || c}" onclick="window.genBoldApp.selectModalColor('${c.name || c}', this)">
            <span class="sr-only">${c.name || c}</span>
          </button>
        `).join("");
      } else {
        colorContainer.innerHTML = `<span class="text-muted text-xs">Standard Finish</span>`;
      }
    }

    // Render Comprehensive Technical Specs Table
    const specsTable = document.getElementById("pdp-specs-table");
    if (specsTable) {
      const defaultSpecs = {
        "Brand & Lineage": "Gen Bold Original Series",
        "Category & Tree": `${catName} > ${subcatName}`,
        "Suitability": prod.gender || "Unisex / Universal",
        "Body Safe & Medical Grade": "100% Certified Hypoallergenic & Skin-Friendly",
        "Packaging Mode": "100% Secret Unmarked Corrugated Brown Carton",
        "Doorstep Payment": "Cash on Delivery (COD) / UPI Scan Supported",
        "Warranty & Protection": "1-Year Comprehensive Replacement Guarantee"
      };

      const mergedSpecs = { ...defaultSpecs, ...(prod.specs || {}) };
      specsTable.innerHTML = Object.entries(mergedSpecs).map(([key, val]) => `
        <tr>
          <td>${key}</td>
          <td><strong>${val}</strong></td>
        </tr>
      `).join("");
    }

    // Reset Pincode Box
    const pinInput = document.getElementById("pdp-pincode-input");
    const pinResult = document.getElementById("pdp-pincode-result");
    if (pinInput) pinInput.value = "";
    if (pinResult) pinResult.innerHTML = `<span class="text-muted">Enter your area pincode to see express COD delivery estimates.</span>`;

    // Render Related Products (4 products from catalog)
    const relatedContainer = document.getElementById("pdp-related-products-grid");
    if (relatedContainer) {
      const allProds = window.genBoldStore.getProducts();
      const related = allProds.filter(p => p.id !== prod.id).slice(0, 4);

      relatedContainer.innerHTML = related.map(rel => {
        const relDiscount = rel.discount || (rel.mrp > rel.price ? Math.round(((rel.mrp - rel.price) / rel.mrp) * 100) : 0);
        return `
          <div class="product-card" onclick="window.genBoldApp.openProductModal('${rel.id}')">
            <div class="prod-badge-stack">
              ${relDiscount > 0 ? `<span class="prod-discount-badge">-${relDiscount}% OFF</span>` : ''}
            </div>
            <div class="prod-img-box">
              <img src="${rel.image}" alt="${rel.name}" loading="lazy">
            </div>
            <div class="prod-info-box">
              <h4 class="prod-title">${rel.name}</h4>
              <div class="prod-price-row">
                <span class="current-price">₹${Number(rel.price).toLocaleString("en-IN")}</span>
                ${rel.mrp > rel.price ? `<span class="mrp-price">₹${Number(rel.mrp).toLocaleString("en-IN")}</span>` : ''}
              </div>
              <button class="btn btn-sm btn-outline mt-2 w-100">View Fullscreen</button>
            </div>
          </div>
        `;
      }).join("");
    }

    // Lock body scroll and display fullscreen modal
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    // Scroll modal container to top
    const container = modal.querySelector(".fullscreen-product-container");
    if (container) container.scrollTop = 0;
  }

  changeMainImage(src, btnEl) {
    const mainImg = document.getElementById("modal-prod-img");
    if (mainImg) mainImg.src = src;
    document.querySelectorAll(".pdp-thumb-btn").forEach(b => b.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");
  }

  selectModalSize(size, btnEl) {
    this.selectedModalSize = size;
    document.querySelectorAll("#modal-size-options .variant-pill").forEach(b => b.classList.remove("active"));
    btnEl.classList.add("active");
  }

  selectModalColor(colorName, btnEl) {
    this.selectedModalColor = colorName;
    document.querySelectorAll("#modal-color-options .color-swatch-btn").forEach(b => b.classList.remove("active"));
    btnEl.classList.add("active");
    const label = document.getElementById("pdp-selected-color-name");
    if (label) label.textContent = colorName;
  }

  switchPdpTab(tabName, btnEl) {
    document.querySelectorAll(".pdp-tab-btn").forEach(b => b.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");
    document.querySelectorAll(".pdp-tab-content-pane").forEach(p => p.classList.remove("active"));
    const pane = document.getElementById(`pdp-pane-${tabName}`);
    if (pane) pane.classList.add("active");
  }

  checkPdpPincode() {
    const input = document.getElementById("pdp-pincode-input");
    const resultBox = document.getElementById("pdp-pincode-result");
    if (!input || !resultBox) return;

    const pin = input.value.trim();
    if (pin.length !== 6 || isNaN(pin)) {
      resultBox.innerHTML = `<span class="text-danger font-semibold">❌ Please enter a valid 6-digit Indian PIN code.</span>`;
      return;
    }

    // Delivery calculation simulation (2 to 3 days ahead)
    const date = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const dateStr = date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

    resultBox.innerHTML = `
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:0.75rem;border-radius:6px;">
        <span class="text-success font-bold">✔ Cash on Delivery (COD) Available for ${pin}!</span><br>
        <small class="text-secondary">Expected delivery by <strong>${dateStr}</strong>. Shipped in 100% secret, discreet plain packaging.</small>
      </div>
    `;
  }

  updateModalTotalPrice() {
    if (!this.selectedModalProduct) return;
    const qtyInput = document.getElementById("modal-qty-input");
    const qty = Math.max(1, Number(qtyInput ? qtyInput.value : 1));
    const price = Number(this.selectedModalProduct.price);
    const total = qty * price;
    const saveTag = document.getElementById("modal-prod-savings");
    if (saveTag) {
      const mrp = Number(this.selectedModalProduct.mrp || price);
      const savings = Math.max(0, (mrp - price) * qty);
      saveTag.textContent = savings > 0 ? 
        `✓ Total: ₹${total.toLocaleString("en-IN")} (You Save ₹${savings.toLocaleString("en-IN")})` : 
        `✓ Total: ₹${total.toLocaleString("en-IN")}`;
    }
  }

  closeProductModal() {
    const modal = document.getElementById("quickview-modal");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
    this.selectedModalProduct = null;
  }

  addModalProductToCart(andCheckout = false) {
    if (!this.selectedModalProduct) return;
    const qtyInput = document.getElementById("modal-qty-input");
    const qty = Number(qtyInput ? qtyInput.value : 1) || 1;

    window.genBoldCart.addItem(
      this.selectedModalProduct,
      qty,
      this.selectedModalSize,
      this.selectedModalColor
    );

    window.showToast(`Added ${qty}x "${this.selectedModalProduct.name}" to cart!`, "success");
    this.closeProductModal();

    if (andCheckout) {
      this.openCheckoutModal();
    } else {
      this.openCartDrawer();
    }
  }

  // --- CART DRAWER & COD RULES ---
  openCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-drawer-overlay");
    if (drawer && overlay) {
      drawer.classList.add("active");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
      this.renderCartDrawerContent(window.genBoldCart.getSummary());
    }
  }

  closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-drawer-overlay");
    if (drawer && overlay) {
      drawer.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  updateCartBadges() {
    const summary = window.genBoldCart.getSummary();
    const countBadges = document.querySelectorAll(".header-cart-count");
    const totalBadges = document.querySelectorAll(".header-cart-total");

    countBadges.forEach(el => el.textContent = summary.totalItemsCount);
    totalBadges.forEach(el => el.textContent = `₹${summary.finalTotal.toLocaleString("en-IN")}`);
  }

  renderCartDrawerContent(summary) {
    const itemsContainer = document.getElementById("cart-drawer-items");
    const subtotalEl = document.getElementById("cart-subtotal-val");
    const codFeeEl = document.getElementById("cart-cod-fee-val");
    const couponDiscountRow = document.getElementById("cart-coupon-discount-row");
    const couponDiscountVal = document.getElementById("cart-coupon-discount-val");
    const finalTotalEl = document.getElementById("cart-final-total-val");
    const freeCodProgressEl = document.getElementById("cart-free-cod-progress-bar");
    const freeCodNoticeEl = document.getElementById("cart-free-cod-notice");
    const proceedBtn = document.getElementById("proceed-checkout-btn");

    if (!itemsContainer) return;

    if (summary.items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty-view">
          <div class="cart-empty-icon">🛒</div>
          <h4>Your Cart is Empty</h4>
          <p class="text-muted">Explore bold lifestyle gear, hobby toys, and wellness products!</p>
          <button class="btn btn-primary mt-3" onclick="window.genBoldApp.closeCartDrawer();">Start Shopping</button>
        </div>
      `;
      if (proceedBtn) proceedBtn.disabled = true;
      if (subtotalEl) subtotalEl.textContent = "₹0";
      if (codFeeEl) codFeeEl.textContent = "₹0";
      if (finalTotalEl) finalTotalEl.textContent = "₹0";
      if (couponDiscountRow) couponDiscountRow.style.display = "none";
      if (freeCodNoticeEl) freeCodNoticeEl.innerHTML = `<span class="text-muted">Minimum order for Free COD is ₹${summary.minOrderForFreeCod}</span>`;
      if (freeCodProgressEl) freeCodProgressEl.style.width = "0%";
      return;
    }

    if (proceedBtn) proceedBtn.disabled = false;

    // Render Items
    itemsContainer.innerHTML = summary.items.map(item => `
      <div class="cart-item-row">
        <img src="${item.image}" class="cart-item-thumb" alt="${item.name}">
        <div class="cart-item-details">
          <h5 class="cart-item-title">${item.name}</h5>
          <div class="cart-item-meta">
            ${item.selectedSize ? `<span class="badge badge-neutral">Size: ${item.selectedSize}</span>` : ''}
            ${item.selectedColor ? `<span class="badge badge-neutral">Colour: ${item.selectedColor}</span>` : ''}
            <span class="badge badge-success">✓ COD Ready</span>
          </div>
          <div class="cart-item-price-row">
            <span class="selling-bold">₹${Number(item.price).toLocaleString("en-IN")}</span>
            ${item.mrp > item.price ? `<span class="mrp-old">₹${Number(item.mrp).toLocaleString("en-IN")}</span>` : ''}
            ${item.mrp > item.price ? `<span class="text-xs text-success font-bold">Save ₹${(item.mrp - item.price).toLocaleString("en-IN")}</span>` : ''}
          </div>
        </div>
        <div class="cart-item-qty-row">
          <div class="qty-stepper">
            <button onclick="window.genBoldCart.updateQuantity('${item.cartItemId}', ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button onclick="window.genBoldCart.updateQuantity('${item.cartItemId}', ${item.quantity + 1})">+</button>
          </div>
          <div class="text-xs text-muted mt-1">Item Total: <strong>₹${(item.price * item.quantity).toLocaleString("en-IN")}</strong></div>
        </div>
        <div>
          <button class="btn-remove-item" onclick="window.genBoldCart.removeItem('${item.cartItemId}')">🗑️ Remove</button>
        </div>
      </div>
    `).join("");

    // Free COD Progress
    if (summary.isFreeCod) {
      if (freeCodProgressEl) freeCodProgressEl.style.width = "100%";
      if (freeCodNoticeEl) {
        freeCodNoticeEl.innerHTML = `<span class="text-success font-semibold">🎉 Congratulations! You unlocked FREE COD Delivery!</span>`;
      }
    } else {
      const percentage = Math.min(100, Math.round((summary.subtotal / summary.minOrderForFreeCod) * 100));
      if (freeCodProgressEl) freeCodProgressEl.style.width = `${percentage}%`;
      if (freeCodNoticeEl) {
        freeCodNoticeEl.innerHTML = `Add <strong>₹${summary.amountNeededForFreeCod}</strong> more for <strong>FREE COD Delivery</strong>! (Otherwise ₹49 applied)`;
      }
    }

    // Totals
    if (subtotalEl) subtotalEl.textContent = `₹${summary.subtotal.toLocaleString("en-IN")}`;
    if (codFeeEl) {
      codFeeEl.innerHTML = summary.codFee === 0 ? 
        `<span class="badge badge-success">FREE COD</span>` : 
        `₹${summary.codFee}`;
    }

    if (summary.couponDiscount > 0 && summary.activeCoupon) {
      if (couponDiscountRow) couponDiscountRow.style.display = "flex";
      if (couponDiscountVal) {
        couponDiscountVal.innerHTML = `-₹${summary.couponDiscount.toLocaleString("en-IN")} <button class="btn-remove-coupon" onclick="window.genBoldCart.removeCoupon()" title="Remove coupon">✕</button>`;
      }
    } else {
      if (couponDiscountRow) couponDiscountRow.style.display = "none";
    }

    if (finalTotalEl) {
      finalTotalEl.textContent = `₹${summary.finalTotal.toLocaleString("en-IN")}`;
    }
  }

  // --- CHECKOUT MODAL ---
  openCheckoutModal() {
    const summary = window.genBoldCart.getSummary();
    if (summary.items.length === 0) {
      window.showToast("Your cart is empty.", "warning");
      return;
    }

    const modal = document.getElementById("checkout-modal");
    if (!modal) return;

    // Populate checkout review
    const summaryItems = document.getElementById("checkout-order-items");
    const subtotalEl = document.getElementById("checkout-subtotal");
    const codFeeEl = document.getElementById("checkout-cod-fee");
    const totalEl = document.getElementById("checkout-total");

    if (summaryItems) {
      summaryItems.innerHTML = summary.items.map(i => `
        <div class="d-flex justify-between text-sm py-1 border-b">
          <span>${i.quantity}x ${i.name}</span>
          <strong>₹${(i.price * i.quantity).toLocaleString("en-IN")}</strong>
        </div>
      `).join("");
    }

    if (subtotalEl) subtotalEl.textContent = `₹${summary.subtotal.toLocaleString("en-IN")}`;
    if (codFeeEl) codFeeEl.textContent = summary.codFee === 0 ? "FREE" : `₹${summary.codFee}`;
    if (totalEl) totalEl.textContent = `₹${summary.finalTotal.toLocaleString("en-IN")}`;

    modal.classList.add("active");
  }

  closeCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    if (modal) modal.classList.remove("active");
  }

  handleCheckoutSubmit() {
    const name = document.getElementById("checkout-name").value;
    const phone = document.getElementById("checkout-phone").value;
    const email = document.getElementById("checkout-email").value;
    const address = document.getElementById("checkout-address").value;
    const city = document.getElementById("checkout-city").value;
    const state = document.getElementById("checkout-state").value;
    const pincode = document.getElementById("checkout-pincode").value;
    const notes = document.getElementById("checkout-notes").value;

    const res = window.genBoldCart.placeOrder({
      name, phone, email, address, city, state, pincode, notes
    });

    if (res.success) {
      this.closeCheckoutModal();
      this.showOrderSuccessModal(res.order);
      window.showToast("COD Order Placed Successfully! 🎉", "success");
    } else {
      alert(res.message);
    }
  }

  showOrderSuccessModal(order) {
    const modal = document.getElementById("order-success-modal");
    if (!modal) return;

    document.getElementById("success-order-id").textContent = order.orderId;
    document.getElementById("success-customer-name").textContent = order.customer.name;
    document.getElementById("success-customer-phone").textContent = order.customer.phone;
    document.getElementById("success-customer-address").textContent = `${order.customer.address}, ${order.customer.city}, ${order.customer.pincode}`;
    document.getElementById("success-cod-amount").textContent = `₹${Number(order.finalTotal).toLocaleString("en-IN")}`;

    modal.classList.add("active");
  }

  closeSuccessModal() {
    const modal = document.getElementById("order-success-modal");
    if (modal) modal.classList.remove("active");
  }

  // --- ORDER TRACKING ---
  handleOrderLookup() {
    const input = document.getElementById("track-order-input");
    const resultBox = document.getElementById("track-order-result");
    if (!input || !resultBox) return;

    const query = input.value.trim().toUpperCase();
    const orders = window.genBoldStore.getOrders();
    const order = orders.find(o => o.orderId.toUpperCase() === query);

    if (!order) {
      resultBox.innerHTML = `
        <div class="alert alert-warning mt-3">
          ❌ No order found with ID "${query}". Please check your Order ID and retry.
        </div>
      `;
      return;
    }

    resultBox.innerHTML = `
      <div class="track-card mt-3">
        <div class="d-flex justify-between align-center mb-2">
          <strong>Order: ${order.orderId}</strong>
          <span class="badge badge-success">${order.status}</span>
        </div>
        <div class="text-xs text-muted mb-2">Payment: Cash on Delivery (COD) • Amount Payable: ₹${order.finalTotal}</div>
        <div class="timeline">
          <div class="timeline-step done">
            <div class="step-dot">✓</div>
            <div class="step-text"><strong>Order Placed</strong><br><small>Cash on Delivery confirmed</small></div>
          </div>
          <div class="timeline-step active">
            <div class="step-dot">📦</div>
            <div class="step-text"><strong>Discreetly Packed</strong><br><small>Plain box, zero markings</small></div>
          </div>
          <div class="timeline-step">
            <div class="step-dot">🚚</div>
            <div class="step-text"><strong>Dispatched with Courier</strong><br><small>COD verification pin generated</small></div>
          </div>
          <div class="timeline-step">
            <div class="step-dot">🏠</div>
            <div class="step-text"><strong>Delivered & Collected</strong><br><small>Handed to recipient in person</small></div>
          </div>
        </div>
      </div>
    `;
  }
}

// Global Toast System
window.showToast = function(message, type = "info") {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️'}</span>
    <span class="toast-message">${message}</span>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add("visible"), 50);

  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.genBoldApp = new App();
});
