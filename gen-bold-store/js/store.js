/**
 * Gen Bold Store State Management
 * Handles persistent localStorage data, catalog querying, filters, and reactivity.
 */

const STORAGE_KEYS = {
  PRODUCTS: "genbold_products_v1",
  CATEGORIES: "genbold_categories_v1",
  COUPONS: "genbold_coupons_v1",
  SETTINGS: "genbold_settings_v1",
  WISHLIST: "genbold_wishlist_v1",
  ORDERS: "genbold_orders_v1",
  ADMIN_AUTH: "genbold_admin_auth_v1"
};

class Store {
  constructor() {
    this.init();
  }

  init() {
    // Initialize Categories
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(window.GENBOLD_DEFAULT_CATEGORIES || []));
    }
    // Initialize Products
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(window.GENBOLD_DEFAULT_PRODUCTS || []));
    }
    // Initialize Coupons
    if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(window.GENBOLD_DEFAULT_COUPONS || []));
    }
    // Initialize Settings
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(window.GENBOLD_DEFAULT_SETTINGS || {}));
    }
    // Initialize Wishlist
    if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([]));
    }
    // Initialize Orders
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
  }

  // --- PRODUCTS ---
  getProducts() {
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
      return list.map(p => {
        if (!p.images || !Array.isArray(p.images) || p.images.length === 0) {
          p.images = p.image ? [p.image] : [];
        }
        return p;
      });
    } catch (e) {
      return [];
    }
  }

  saveProducts(products) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.emit("productsChanged", products);
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  }

  addProduct(productData) {
    const products = this.getProducts();
    const id = "gb-" + Date.now().toString(36) + "-" + Math.random().toString(36).substr(2, 4);
    
    // Auto calculate discount
    const mrp = Number(productData.mrp) || 0;
    const price = Number(productData.price) || 0;
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    const newProduct = {
      id,
      name: productData.name || "Untitled Product",
      categoryId: productData.categoryId || "hobbygrade-toys",
      subcategoryId: productData.subcategoryId || "",
      mrp: mrp,
      price: price,
      discount: discount,
      gender: productData.gender || "Unisex",
      sizes: Array.isArray(productData.sizes) ? productData.sizes : (productData.sizes ? productData.sizes.split(",").map(s => s.trim()) : ["Standard"]),
      colors: Array.isArray(productData.colors) ? productData.colors : (productData.colors ? productData.colors.split(",").map(c => ({ name: c.trim(), hex: "#ea580c" })) : [{ name: "Standard", hex: "#000000" }]),
      image: (Array.isArray(productData.images) && productData.images[0]) || productData.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      images: Array.isArray(productData.images) && productData.images.length > 0 ? productData.images : [productData.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"],
      rating: Number(productData.rating) || 4.8,
      reviewsCount: Number(productData.reviewsCount) || 12,
      inStock: productData.inStock !== false,
      stockCount: Number(productData.stockCount) || 25,
      badge: productData.badge || (discount > 0 ? `-${discount}% OFF` : "New"),
      featured: Boolean(productData.featured),
      flashSale: Boolean(productData.flashSale),
      description: productData.description || "Premium quality product from Gen Bold.",
      specs: productData.specs || {}
    };

    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  updateProduct(id, updatedFields) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const existing = products[index];
    const mrp = updatedFields.mrp !== undefined ? Number(updatedFields.mrp) : existing.mrp;
    const price = updatedFields.price !== undefined ? Number(updatedFields.price) : existing.price;
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    const merged = {
      ...existing,
      ...updatedFields,
      mrp,
      price,
      discount
    };

    if (updatedFields.images && Array.isArray(updatedFields.images) && updatedFields.images.length > 0) {
      merged.image = updatedFields.images[0];
      merged.images = updatedFields.images;
    }

    // Auto adjust badge if discount changed and badge isn't custom
    if (updatedFields.price !== undefined || updatedFields.mrp !== undefined) {
      if (!updatedFields.badge && discount > 0) {
        merged.badge = `-${discount}% OFF`;
      }
    }

    products[index] = merged;
    this.saveProducts(products);
    return merged;
  }

  deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
    return true;
  }

  // --- CATEGORIES ---
  getCategories() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
    } catch (e) {
      return [];
    }
  }

  saveCategories(categories) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    this.emit("categoriesChanged", categories);
  }

  addCategory(category) {
    const categories = this.getCategories();
    const id = category.id || category.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newCategory = {
      id,
      name: category.name,
      slug: id,
      icon: category.icon || "📦",
      badge: category.badge || "",
      description: category.description || "",
      subcategories: category.subcategories || []
    };
    categories.push(newCategory);
    this.saveCategories(categories);
    return newCategory;
  }

  addSubcategory(categoryId, subcategoryName) {
    const categories = this.getCategories();
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return null;

    if (!cat.subcategories) cat.subcategories = [];
    const subId = subcategoryName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newSub = { id: subId, name: subcategoryName };
    cat.subcategories.push(newSub);
    this.saveCategories(categories);
    return newSub;
  }

  // --- COUPONS ---
  getCoupons() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.COUPONS)) || [];
    } catch (e) {
      return [];
    }
  }

  saveCoupons(coupons) {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    this.emit("couponsChanged", coupons);
  }

  addCoupon(coupon) {
    const coupons = this.getCoupons();
    const newCoupon = {
      code: coupon.code.toUpperCase().trim(),
      discountType: coupon.discountType || "percent", // 'percent' or 'fixed'
      discountValue: Number(coupon.discountValue) || 10,
      minOrder: Number(coupon.minOrder) || 0,
      description: coupon.description || "",
      active: coupon.active !== false
    };
    coupons.push(newCoupon);
    this.saveCoupons(coupons);
    return newCoupon;
  }

  deleteCoupon(code) {
    const coupons = this.getCoupons().filter(c => c.code !== code.toUpperCase().trim());
    this.saveCoupons(coupons);
    return true;
  }

  findCoupon(code) {
    if (!code) return null;
    const coupons = this.getCoupons();
    return coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim() && c.active) || null;
  }

  // --- SETTINGS ---
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || window.GENBOLD_DEFAULT_SETTINGS;
    } catch (e) {
      return window.GENBOLD_DEFAULT_SETTINGS;
    }
  }

  saveSettings(newSettings) {
    const merged = { ...this.getSettings(), ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
    this.emit("settingsChanged", merged);
    return merged;
  }

  // --- WISHLIST ---
  getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
    } catch (e) {
      return [];
    }
  }

  toggleWishlist(productId) {
    let list = this.getWishlist();
    const exists = list.includes(productId);
    if (exists) {
      list = list.filter(id => id !== productId);
    } else {
      list.push(productId);
    }
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    this.emit("wishlistChanged", list);
    return !exists;
  }

  isWishlisted(productId) {
    return this.getWishlist().includes(productId);
  }

  // --- ORDERS ---
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
    } catch (e) {
      return [];
    }
  }

  saveOrder(orderData) {
    const orders = this.getOrders();
    const orderId = "GB-" + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      orderId,
      createdAt: new Date().toISOString(),
      status: "Confirmed (Cash on Delivery)",
      paymentMethod: "COD (Cash on Delivery)",
      ...orderData
    };
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.emit("ordersChanged", orders);
    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    const orders = this.getOrders();
    const order = orders.find(o => o.orderId === orderId);
    if (order) {
      order.status = status;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.emit("ordersChanged", orders);
    }
    return order;
  }

  // --- ADMIN AUTH STATE ---
  isAdminLoggedIn() {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === "true";
  }

  setAdminLoggedIn(status) {
    if (status) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
    this.emit("adminAuthChanged", status);
  }

  // --- RESTORE DEMO DATA ---
  restoreDefaults() {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(window.GENBOLD_DEFAULT_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(window.GENBOLD_DEFAULT_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(window.GENBOLD_DEFAULT_COUPONS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(window.GENBOLD_DEFAULT_SETTINGS));
    this.emit("storeReset");
  }

  // --- EVENT EMITTER ---
  emit(event, data) {
    window.dispatchEvent(new CustomEvent(`genbold:${event}`, { detail: data }));
  }

  on(event, callback) {
    window.addEventListener(`genbold:${event}`, (e) => callback(e.detail));
  }
}

// Global store instance
window.genBoldStore = new Store();
