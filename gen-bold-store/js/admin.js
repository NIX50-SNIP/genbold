/**
 * Gen Bold Admin Panel Controller
 * Protected by password: 1082
 * Gives full control over:
 * - Products: Add / Edit / Delete, MRP, Selling Price, Auto-Discount, Gender, Sizes, Colours, Stock.
 * - Category Tree: Categories and Subcategories hierarchy.
 * - Coupons: Add / Delete promo codes.
 * - Orders: View COD orders and manage dispatch status.
 * - Store Settings: Free COD threshold (default 299), COD fee (default 49), Backup & Reset.
 */

class AdminPanel {
  constructor() {
    this.adminPassword = "1082";
    this.currentTab = "products";
    this.editingProductId = null;
    this.init();
  }

  init() {
    this.bindEvents();
    // Listen to store updates
    window.addEventListener("genbold:productsChanged", () => {
      if (window.genBoldStore.isAdminLoggedIn()) {
        this.renderProductsTable();
        this.renderStats();
      }
    });
    window.addEventListener("genbold:categoriesChanged", () => {
      if (window.genBoldStore.isAdminLoggedIn()) {
        this.renderCategoryTreeManager();
        this.populateCategorySelects();
      }
    });
    window.addEventListener("genbold:couponsChanged", () => {
      if (window.genBoldStore.isAdminLoggedIn()) {
        this.renderCouponsTable();
      }
    });
    window.addEventListener("genbold:ordersChanged", () => {
      if (window.genBoldStore.isAdminLoggedIn()) {
        this.renderOrdersTable();
        this.renderStats();
      }
    });
  }

  bindEvents() {
    // 3-Dots Admin launcher in top-left
    const triggerBtn = document.getElementById("admin-launcher-btn");
    if (triggerBtn) {
      triggerBtn.addEventListener("click", () => this.handleLauncherClick());
    }

    // Password Form
    const authForm = document.getElementById("admin-login-form");
    if (authForm) {
      authForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.verifyPassword();
      });
    }

    // Close Auth Modal
    const closeAuthBtn = document.getElementById("close-admin-auth-modal");
    if (closeAuthBtn) {
      closeAuthBtn.addEventListener("click", () => this.closeAuthModal());
    }

    // Logout
    const logoutBtn = document.getElementById("admin-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.logout());
    }

    // Close Admin Panel
    const closeAdminBtn = document.getElementById("close-admin-panel");
    if (closeAdminBtn) {
      closeAdminBtn.addEventListener("click", () => this.closePanel());
    }

    // Tab Navigation
    const tabBtns = document.querySelectorAll(".admin-nav-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tab = e.currentTarget.getAttribute("data-tab");
        this.switchTab(tab);
      });
    });

    // Product Form Realtime Discount Calculator
    const mrpInput = document.getElementById("prod-form-mrp");
    const priceInput = document.getElementById("prod-form-price");
    if (mrpInput && priceInput) {
      const updateDiscountPreview = () => {
        const mrp = Number(mrpInput.value) || 0;
        const price = Number(priceInput.value) || 0;
        const previewEl = document.getElementById("prod-form-discount-preview");
        if (!previewEl) return;

        if (mrp > 0 && price > 0 && mrp > price) {
          const disc = Math.round(((mrp - price) / mrp) * 100);
          const diff = mrp - price;
          previewEl.innerHTML = `<span class="badge badge-success">✓ ${disc}% OFF</span> (Customer saves ₹${diff.toLocaleString("en-IN")})`;
          previewEl.className = "text-success font-semibold";
        } else if (price > mrp && mrp > 0) {
          previewEl.innerHTML = `<span class="badge badge-warning">Selling price is higher than MRP!</span>`;
          previewEl.className = "text-warning";
        } else {
          previewEl.innerHTML = `<span class="text-muted">Enter MRP and Selling Price to see discount</span>`;
          previewEl.className = "text-muted";
        }
      };

      mrpInput.addEventListener("input", updateDiscountPreview);
      priceInput.addEventListener("input", updateDiscountPreview);
    }

    // Image URL Preview
    const imgInput = document.getElementById("prod-form-image");
    const imgPreview = document.getElementById("prod-form-img-preview");
    if (imgInput && imgPreview) {
      imgInput.addEventListener("input", () => {
        imgPreview.src = imgInput.value || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80";
      });
    }

    // Category Select change in Product Form to update Subcategories
    const catSelect = document.getElementById("prod-form-category");
    if (catSelect) {
      catSelect.addEventListener("change", () => {
        this.populateSubcategorySelect(catSelect.value);
      });
    }

    // Add / Edit Product Submit
    const productForm = document.getElementById("admin-product-form");
    if (productForm) {
      productForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveProductFromForm();
      });
    }

    // Add Category Form
    const catForm = document.getElementById("admin-add-category-form");
    if (catForm) {
      catForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveCategoryFromForm();
      });
    }

    // Add Subcategory Form
    const subcatForm = document.getElementById("admin-add-subcategory-form");
    if (subcatForm) {
      subcatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveSubcategoryFromForm();
      });
    }

    // Add Coupon Form
    const couponForm = document.getElementById("admin-add-coupon-form");
    if (couponForm) {
      couponForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveCouponFromForm();
      });
    }

    // Settings Form
    const settingsForm = document.getElementById("admin-settings-form");
    if (settingsForm) {
      settingsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveSettingsFromForm();
      });
    }

    // Reset Demo Data Button
    const resetBtn = document.getElementById("admin-reset-demo-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to restore all default products, categories, coupons, and settings? This will reset custom items.")) {
          window.genBoldStore.restoreDefaults();
          window.showToast("All demo products and store data restored!", "success");
          this.renderAll();
        }
      });
    }

    // Export Catalog JSON
    const exportBtn = document.getElementById("admin-export-json-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => this.exportData());
    }

    // Import Catalog JSON
    const importInput = document.getElementById("admin-import-json-input");
    if (importInput) {
      importInput.addEventListener("change", (e) => this.importData(e));
    }
  }

  handleLauncherClick() {
    if (window.genBoldStore.isAdminLoggedIn()) {
      this.openPanel();
    } else {
      this.openAuthModal();
    }
  }

  openAuthModal() {
    const modal = document.getElementById("admin-auth-modal");
    if (modal) {
      modal.classList.add("active");
      const pwdInput = document.getElementById("admin-pwd-input");
      if (pwdInput) {
        pwdInput.value = "";
        setTimeout(() => pwdInput.focus(), 150);
      }
      const err = document.getElementById("admin-auth-error");
      if (err) err.textContent = "";
    }
  }

  closeAuthModal() {
    const modal = document.getElementById("admin-auth-modal");
    if (modal) modal.classList.remove("active");
  }

  verifyPassword() {
    const pwdInput = document.getElementById("admin-pwd-input");
    const errEl = document.getElementById("admin-auth-error");
    const entered = pwdInput ? pwdInput.value.trim() : "";

    if (entered === this.adminPassword) {
      window.genBoldStore.setAdminLoggedIn(true);
      this.closeAuthModal();
      this.openPanel();
      window.showToast("Admin access granted! Welcome, Store Manager.", "success");
    } else {
      if (errEl) {
        errEl.textContent = "Invalid Admin Password. Access Denied.";
      }
      if (pwdInput) {
        pwdInput.classList.add("shake-error");
        setTimeout(() => pwdInput.classList.remove("shake-error"), 500);
      }
    }
  }

  logout() {
    window.genBoldStore.setAdminLoggedIn(false);
    this.closePanel();
    window.showToast("Admin session ended.", "info");
  }

  openPanel() {
    const panel = document.getElementById("admin-panel-overlay");
    if (panel) {
      panel.classList.add("active");
      document.body.style.overflow = "hidden";
      this.renderAll();
    }
  }

  closePanel() {
    const panel = document.getElementById("admin-panel-overlay");
    if (panel) {
      panel.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll(".admin-nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
    });
    document.querySelectorAll(".admin-tab-pane").forEach(pane => {
      pane.classList.toggle("active", pane.id === `admin-tab-${tabName}`);
    });
  }

  renderAll() {
    this.renderStats();
    this.renderProductsTable();
    this.populateCategorySelects();
    this.renderCategoryTreeManager();
    this.renderCouponsTable();
    this.renderOrdersTable();
    this.loadSettingsToForm();
  }

  renderStats() {
    const products = window.genBoldStore.getProducts();
    const categories = window.genBoldStore.getCategories();
    const coupons = window.genBoldStore.getCoupons();
    const orders = window.genBoldStore.getOrders();

    const revenue = orders.reduce((sum, o) => sum + (Number(o.finalTotal) || 0), 0);

    const statProds = document.getElementById("admin-stat-products");
    const statCats = document.getElementById("admin-stat-categories");
    const statCoupons = document.getElementById("admin-stat-coupons");
    const statOrders = document.getElementById("admin-stat-orders");
    const statRev = document.getElementById("admin-stat-revenue");

    if (statProds) statProds.textContent = products.length;
    if (statCats) statCats.textContent = categories.length;
    if (statCoupons) statCoupons.textContent = coupons.length;
    if (statOrders) statOrders.textContent = orders.length;
    if (statRev) statRev.textContent = `₹${revenue.toLocaleString("en-IN")}`;
  }

  // --- PRODUCTS MANAGEMENT ---
  populateCategorySelects() {
    const categories = window.genBoldStore.getCategories();
    const catSelect = document.getElementById("prod-form-category");
    const filterSelect = document.getElementById("admin-filter-category");

    if (catSelect) {
      catSelect.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
      if (categories.length > 0) {
        this.populateSubcategorySelect(categories[0].id);
      }
    }

    if (filterSelect) {
      filterSelect.innerHTML = `<option value="all">All Categories</option>` +
        categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
    }

    const parentCatSelect = document.getElementById("subcat-form-parent");
    if (parentCatSelect) {
      parentCatSelect.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
    }
  }

  populateSubcategorySelect(categoryId, selectedSubId = null) {
    const categories = window.genBoldStore.getCategories();
    const subSelect = document.getElementById("prod-form-subcategory");
    if (!subSelect) return;

    const cat = categories.find(c => c.id === categoryId);
    if (cat && cat.subcategories && cat.subcategories.length > 0) {
      subSelect.innerHTML = cat.subcategories.map(s => 
        `<option value="${s.id}" ${s.id === selectedSubId ? "selected" : ""}>${s.name}</option>`
      ).join("");
    } else {
      subSelect.innerHTML = `<option value="">General</option>`;
    }
  }

  renderProductsTable() {
    const tableBody = document.getElementById("admin-products-table-body");
    if (!tableBody) return;

    const products = window.genBoldStore.getProducts();
    const categories = window.genBoldStore.getCategories();

    if (products.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">No products found. Click "Add Product" to create one.</td></tr>`;
      return;
    }

    tableBody.innerHTML = products.map((prod, idx) => {
      const category = categories.find(c => c.id === prod.categoryId);
      const catName = category ? category.name : prod.categoryId;
      const discount = prod.mrp > prod.price ? Math.round(((prod.mrp - prod.price) / prod.mrp) * 100) : 0;

      return `
        <tr>
          <td><span class="text-muted text-xs">#${idx + 1}</span></td>
          <td>
            <div class="d-flex align-center gap-2">
              <img src="${prod.image}" class="table-thumb" alt="${prod.name}" onerror="this.src='https://via.placeholder.com/60'">
              <div>
                <strong class="product-title-cell">${prod.name}</strong>
                <div class="text-muted text-xs">${prod.gender || 'Unisex'} • ${prod.sizes ? prod.sizes.join(', ') : 'Standard'}</div>
              </div>
            </div>
          </td>
          <td><span class="category-pill">${catName}</span></td>
          <td>
            <div class="price-cell">
              <div class="mrp-old">₹${Number(prod.mrp).toLocaleString("en-IN")}</div>
              <div class="selling-bold">₹${Number(prod.price).toLocaleString("en-IN")}</div>
            </div>
          </td>
          <td>
            <span class="badge ${discount > 0 ? 'badge-discount' : 'badge-neutral'}">
              ${discount > 0 ? `-${discount}% OFF` : '0%'}
            </span>
          </td>
          <td>
            <button class="badge-stock-toggle ${prod.inStock ? 'in-stock' : 'out-stock'}" onclick="window.genBoldAdmin.toggleProductStock('${prod.id}')">
              ${prod.inStock ? `In Stock (${prod.stockCount || 10})` : 'Out of Stock'}
            </button>
          </td>
          <td>
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-outline" onclick="window.genBoldAdmin.openEditProductModal('${prod.id}')" title="Edit Product">✏️ Edit</button>
              <button class="btn btn-sm btn-danger-outline" onclick="window.genBoldAdmin.deleteProduct('${prod.id}')" title="Delete Product">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  // --- MULTIPLE GALLERY IMAGES HANDLERS ---
  addGalleryImageRow(url = "") {
    const container = document.getElementById("admin-gallery-inputs-container");
    if (!container) return;

    const rowIdx = container.children.length;
    const isPrimary = rowIdx === 0;
    const defaultImg = url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";

    const row = document.createElement("div");
    row.className = "gallery-image-row";
    row.innerHTML = `
      <img src="${defaultImg}" class="gallery-row-thumb" alt="Preview" onerror="this.src='https://via.placeholder.com/60'">
      <div class="gallery-row-tag">${isPrimary ? '⭐ Cover Image' : `Angle #${rowIdx + 1}`}</div>
      <div class="d-flex flex-1 gap-2 align-center" style="min-width:0;">
        <input type="text" class="form-control gallery-image-input" placeholder="Paste image URL (https://...) or choose file" value="${url}" oninput="window.genBoldAdmin.onGalleryInputChanged(this)" required>
        <label class="btn btn-sm btn-outline text-xs d-flex align-center gap-1 cursor-pointer" title="Upload local image from device" style="white-space:nowrap;margin:0;padding:0.45rem 0.65rem;cursor:pointer;">
          📁 Upload
          <input type="file" accept="image/*" style="display:none;" onchange="window.genBoldAdmin.handleImageFileUpload(this)">
        </label>
      </div>
      ${!isPrimary ? 
        `<button type="button" class="btn btn-sm btn-danger-outline" onclick="window.genBoldAdmin.removeGalleryImageRow(this)" title="Remove this angle">✕</button>` : 
        `<span class="badge badge-success text-xs">Primary</span>`
      }
    `;

    container.appendChild(row);
    this.updateGalleryPreviews();
  }

  handleImageFileUpload(fileInput) {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      window.showToast("Image is over 2MB. A smaller image is recommended for fast loading.", "warning");
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const row = fileInput.closest(".gallery-image-row");
      if (row) {
        const textInput = row.querySelector(".gallery-image-input");
        const thumb = row.querySelector(".gallery-row-thumb");
        if (textInput) {
          textInput.value = dataUrl;
        }
        if (thumb) {
          thumb.src = dataUrl;
        }
        this.updateGalleryPreviews();
        window.showToast("Local image uploaded successfully! 📷", "success");
      }
    };
    reader.readAsDataURL(file);
  }

  removeGalleryImageRow(btn) {
    const row = btn.closest(".gallery-image-row");
    if (row) {
      row.remove();
      this.refreshGalleryTags();
      this.updateGalleryPreviews();
    }
  }

  refreshGalleryTags() {
    const container = document.getElementById("admin-gallery-inputs-container");
    if (!container) return;
    Array.from(container.children).forEach((row, idx) => {
      const tag = row.querySelector(".gallery-row-tag");
      if (tag) {
        tag.textContent = idx === 0 ? "⭐ Cover Image" : `Angle #${idx + 1}`;
      }
    });
  }

  onGalleryInputChanged(input) {
    const row = input.closest(".gallery-image-row");
    if (row) {
      const thumb = row.querySelector(".gallery-row-thumb");
      if (thumb) {
        thumb.src = input.value.trim() || "https://via.placeholder.com/60";
      }
    }
    this.updateGalleryPreviews();
  }

  updateGalleryPreviews() {
    const strip = document.getElementById("admin-gallery-preview-strip");
    if (!strip) return;
    const inputs = document.querySelectorAll(".gallery-image-input");
    const urls = Array.from(inputs).map(i => i.value.trim()).filter(Boolean);

    if (urls.length === 0) {
      strip.innerHTML = `<span class="text-xs text-muted">No images added yet. Click "+ Add Another Image URL" to add image angles.</span>`;
      return;
    }

    strip.innerHTML = urls.map((u, idx) => `
      <img src="${u}" class="admin-preview-pill-img" title="${idx === 0 ? 'Cover Image' : `Gallery Angle #${idx + 1}`}" onerror="this.src='https://via.placeholder.com/46'">
    `).join("");
  }

  setGalleryImages(urlsArray) {
    const container = document.getElementById("admin-gallery-inputs-container");
    if (!container) return;
    container.innerHTML = "";
    const list = Array.isArray(urlsArray) && urlsArray.length > 0 ? 
      urlsArray : 
      ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"];
    
    list.forEach(u => this.addGalleryImageRow(u));
  }

  openAddProductModal() {
    this.editingProductId = null;
    const form = document.getElementById("admin-product-form");
    if (form) form.reset();
    
    this.populateCategorySelects();

    const titleEl = document.getElementById("prod-modal-title");
    if (titleEl) titleEl.textContent = "Add New Product";
    const idEl = document.getElementById("prod-form-id");
    if (idEl) idEl.value = "";
    const discPrev = document.getElementById("prod-form-discount-preview");
    if (discPrev) discPrev.innerHTML = '<span class="text-muted">Enter MRP and Selling Price to preview discount</span>';

    // Setup 2 initial demo gallery images (Front view + Side view)
    this.setGalleryImages([
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80"
    ]);

    const modal = document.getElementById("admin-product-modal");
    if (modal) {
      modal.classList.add("active");
      modal.style.display = "flex";
      const container = modal.querySelector(".modal-container");
      if (container) container.scrollTop = 0;
    }
  }

  openEditProductModal(productId) {
    const prod = window.genBoldStore.getProductById(productId);
    if (!prod) {
      alert("Product not found: " + productId);
      return;
    }

    this.editingProductId = productId;
    this.populateCategorySelects();

    const titleEl = document.getElementById("prod-modal-title");
    if (titleEl) titleEl.textContent = "Edit Product: " + prod.name;
    const idEl = document.getElementById("prod-form-id");
    if (idEl) idEl.value = prod.id;
    const nameEl = document.getElementById("prod-form-name");
    if (nameEl) nameEl.value = prod.name;
    const catEl = document.getElementById("prod-form-category");
    if (catEl) catEl.value = prod.categoryId;

    this.populateSubcategorySelect(prod.categoryId, prod.subcategoryId);

    const mrpEl = document.getElementById("prod-form-mrp");
    if (mrpEl) mrpEl.value = prod.mrp;
    const priceEl = document.getElementById("prod-form-price");
    if (priceEl) priceEl.value = prod.price;
    const genderEl = document.getElementById("prod-form-gender");
    if (genderEl) genderEl.value = prod.gender || "Unisex";
    const sizesEl = document.getElementById("prod-form-sizes");
    if (sizesEl) sizesEl.value = Array.isArray(prod.sizes) ? prod.sizes.join(", ") : (prod.sizes || "Standard");
    const colorsEl = document.getElementById("prod-form-colors");
    if (colorsEl) colorsEl.value = Array.isArray(prod.colors) ? prod.colors.map(c => c.name || c).join(", ") : "Default";

    // Populate multiple images
    const currentImages = Array.isArray(prod.images) && prod.images.length > 0 ? 
      prod.images : 
      (prod.image ? [prod.image] : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"]);
    this.setGalleryImages(currentImages);

    const stockEl = document.getElementById("prod-form-stock-count");
    if (stockEl) stockEl.value = prod.stockCount || 10;
    const inStockEl = document.getElementById("prod-form-in-stock");
    if (inStockEl) inStockEl.checked = prod.inStock !== false;
    const badgeEl = document.getElementById("prod-form-badge");
    if (badgeEl) badgeEl.value = prod.badge || "";
    const featEl = document.getElementById("prod-form-featured");
    if (featEl) featEl.checked = Boolean(prod.featured);
    const flashEl = document.getElementById("prod-form-flash");
    if (flashEl) flashEl.checked = Boolean(prod.flashSale);
    const descEl = document.getElementById("prod-form-desc");
    if (descEl) descEl.value = prod.description || "";

    // Trigger discount preview update
    const mrp = Number(prod.mrp) || 0;
    const price = Number(prod.price) || 0;
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
    const discPrev = document.getElementById("prod-form-discount-preview");
    if (discPrev) {
      discPrev.innerHTML = discount > 0 ? 
        `<span class="badge badge-success">✓ ${discount}% OFF</span> (Customer saves ₹${(mrp - price).toLocaleString("en-IN")})` : 
        '<span class="text-muted">No discount</span>';
    }

    const modal = document.getElementById("admin-product-modal");
    if (modal) {
      modal.classList.add("active");
      modal.style.display = "flex";
      const container = modal.querySelector(".modal-container");
      if (container) container.scrollTop = 0;
    }
  }

  closeProductModal() {
    const modal = document.getElementById("admin-product-modal");
    if (modal) {
      modal.classList.remove("active");
      modal.style.display = "none";
    }
  }

  saveProductFromForm() {
    const id = document.getElementById("prod-form-id").value;
    const name = document.getElementById("prod-form-name").value.trim();
    const categoryId = document.getElementById("prod-form-category").value;
    const subcategoryId = document.getElementById("prod-form-subcategory").value;
    const mrp = Number(document.getElementById("prod-form-mrp").value) || 0;
    const price = Number(document.getElementById("prod-form-price").value) || 0;
    const gender = document.getElementById("prod-form-gender").value;
    const sizesRaw = document.getElementById("prod-form-sizes").value;
    const colorsRaw = document.getElementById("prod-form-colors").value;
    
    // Collect all gallery image inputs
    const imageInputs = document.querySelectorAll(".gallery-image-input");
    const imageList = Array.from(imageInputs).map(i => i.value.trim()).filter(Boolean);
    const finalImages = imageList.length > 0 ? 
      imageList : 
      ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"];

    const stockCount = Number(document.getElementById("prod-form-stock-count").value) || 10;
    const inStock = document.getElementById("prod-form-in-stock").checked;
    const badge = document.getElementById("prod-form-badge").value.trim();
    const featured = document.getElementById("prod-form-featured").checked;
    const flashSale = document.getElementById("prod-form-flash").checked;
    const description = document.getElementById("prod-form-desc").value.trim();

    if (!name || price <= 0) {
      alert("Please provide a valid product name and selling price.");
      return;
    }

    const sizes = sizesRaw.split(",").map(s => s.trim()).filter(Boolean);
    const colors = colorsRaw.split(",").map(c => {
      const trimmed = c.trim();
      return { name: trimmed, hex: "#ff5722" };
    }).filter(c => c.name);

    const productPayload = {
      name,
      categoryId,
      subcategoryId,
      mrp: mrp || price,
      price,
      gender,
      sizes: sizes.length > 0 ? sizes : ["Standard"],
      colors: colors.length > 0 ? colors : [{ name: "Standard", hex: "#000000" }],
      image: finalImages[0],
      images: finalImages,
      stockCount,
      inStock,
      badge,
      featured,
      flashSale,
      description
    };

    if (id) {
      window.genBoldStore.updateProduct(id, productPayload);
      window.showToast(`Product "${name}" updated successfully!`, "success");
    } else {
      window.genBoldStore.addProduct(productPayload);
      window.showToast(`New product "${name}" added to catalog!`, "success");
    }

    this.closeProductModal();
    this.renderProductsTable();
    this.renderStats();
  }

  toggleProductStock(productId) {
    const prod = window.genBoldStore.getProductById(productId);
    if (!prod) return;
    const newStatus = !prod.inStock;
    window.genBoldStore.updateProduct(productId, { inStock: newStatus });
    window.showToast(`Updated "${prod.name}" status to ${newStatus ? 'In Stock' : 'Out of Stock'}.`, "info");
    this.renderProductsTable();
  }

  deleteProduct(productId) {
    const prod = window.genBoldStore.getProductById(productId);
    if (!prod) return;
    if (confirm(`Are you sure you want to delete "${prod.name}" from Gen Bold store?`)) {
      window.genBoldStore.deleteProduct(productId);
      window.showToast(`Deleted "${prod.name}".`, "warning");
      this.renderProductsTable();
      this.renderStats();
    }
  }

  // --- CATEGORIES TREE MANAGEMENT ---
  renderCategoryTreeManager() {
    const container = document.getElementById("admin-category-tree-display");
    if (!container) return;

    const categories = window.genBoldStore.getCategories();
    container.innerHTML = categories.map(cat => {
      const subItems = cat.subcategories && cat.subcategories.length > 0 ?
        cat.subcategories.map(sub => `
          <div class="tree-sub-item">
            <span class="tree-branch">└─</span>
            <span class="tree-sub-name">${sub.name}</span>
            <span class="text-xs text-muted font-mono">(ID: ${sub.id})</span>
          </div>
        `).join("") :
        `<div class="tree-sub-item text-muted text-xs">No subcategories defined.</div>`;

      return `
        <div class="category-tree-node">
          <div class="tree-node-header">
            <span class="tree-icon">${cat.icon || '📁'}</span>
            <strong>${cat.name}</strong>
            <span class="badge badge-neutral">${cat.badge || 'Active'}</span>
            <span class="text-xs text-muted font-mono">slug: ${cat.slug}</span>
          </div>
          <div class="tree-node-body">
            <p class="text-xs text-muted mb-2">${cat.description || ''}</p>
            <div class="tree-sub-list">
              ${subItems}
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  saveCategoryFromForm() {
    const nameInput = document.getElementById("cat-form-name");
    const iconInput = document.getElementById("cat-form-icon");
    const descInput = document.getElementById("cat-form-desc");

    const name = nameInput ? nameInput.value.trim() : "";
    if (!name) {
      alert("Please provide a category name.");
      return;
    }

    window.genBoldStore.addCategory({
      name,
      icon: iconInput ? iconInput.value.trim() : "📦",
      description: descInput ? descInput.value.trim() : ""
    });

    if (nameInput) nameInput.value = "";
    if (descInput) descInput.value = "";
    window.showToast(`Category "${name}" created!`, "success");
    this.renderCategoryTreeManager();
    this.populateCategorySelects();
    this.renderStats();
  }

  saveSubcategoryFromForm() {
    const parentSelect = document.getElementById("subcat-form-parent");
    const nameInput = document.getElementById("subcat-form-name");

    const parentId = parentSelect ? parentSelect.value : "";
    const name = nameInput ? nameInput.value.trim() : "";

    if (!parentId || !name) {
      alert("Please select a parent category and enter subcategory name.");
      return;
    }

    window.genBoldStore.addSubcategory(parentId, name);
    if (nameInput) nameInput.value = "";
    window.showToast(`Subcategory "${name}" added!`, "success");
    this.renderCategoryTreeManager();
    this.populateCategorySelects();
  }

  // --- COUPONS MANAGEMENT ---
  renderCouponsTable() {
    const tableBody = document.getElementById("admin-coupons-table-body");
    if (!tableBody) return;

    const coupons = window.genBoldStore.getCoupons();
    if (coupons.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-3 text-muted">No coupons created yet.</td></tr>`;
      return;
    }

    tableBody.innerHTML = coupons.map(c => `
      <tr>
        <td><strong class="font-mono text-primary">${c.code}</strong></td>
        <td><span class="badge ${c.discountType === 'percent' ? 'badge-info' : 'badge-success'}">${c.discountType === 'percent' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}</span></td>
        <td>₹${c.minOrder || 0}</td>
        <td><span class="text-xs text-muted">${c.description || 'Valid on store'}</span></td>
        <td><span class="badge ${c.active ? 'badge-success' : 'badge-neutral'}">${c.active ? 'Active' : 'Disabled'}</span></td>
        <td>
          <button class="btn btn-sm btn-danger-outline" onclick="window.genBoldAdmin.deleteCoupon('${c.code}')">🗑️ Delete</button>
        </td>
      </tr>
    `).join("");
  }

  saveCouponFromForm() {
    const code = document.getElementById("coupon-form-code").value.trim();
    const type = document.getElementById("coupon-form-type").value;
    const val = Number(document.getElementById("coupon-form-value").value) || 0;
    const minOrder = Number(document.getElementById("coupon-form-min").value) || 0;
    const desc = document.getElementById("coupon-form-desc").value.trim();

    if (!code || val <= 0) {
      alert("Please enter a valid coupon code and discount value.");
      return;
    }

    window.genBoldStore.addCoupon({
      code,
      discountType: type,
      discountValue: val,
      minOrder,
      description: desc
    });

    document.getElementById("admin-add-coupon-form").reset();
    window.showToast(`Coupon "${code.toUpperCase()}" created!`, "success");
    this.renderCouponsTable();
    this.renderStats();
  }

  deleteCoupon(code) {
    if (confirm(`Delete coupon "${code}"?`)) {
      window.genBoldStore.deleteCoupon(code);
      window.showToast(`Coupon "${code}" deleted.`, "info");
      this.renderCouponsTable();
      this.renderStats();
    }
  }

  // --- ORDERS MANAGEMENT ---
  renderOrdersTable() {
    const tableBody = document.getElementById("admin-orders-table-body");
    if (!tableBody) return;

    const orders = window.genBoldStore.getOrders();
    if (orders.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No customer orders placed yet. Place a test order through the storefront!</td></tr>`;
      return;
    }

    tableBody.innerHTML = orders.map(ord => {
      const itemsList = (ord.items || []).map(i => `${i.quantity}x ${i.name}`).join("<br>");
      const dateStr = new Date(ord.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
      });

      return `
        <tr>
          <td><strong class="font-mono text-primary">${ord.orderId}</strong><br><span class="text-xs text-muted">${dateStr}</span></td>
          <td>
            <strong>${ord.customer?.name || 'Customer'}</strong><br>
            <span class="text-xs text-muted">📞 ${ord.customer?.phone || ''}</span><br>
            <span class="text-xs text-muted">📍 ${ord.customer?.city || ''}, ${ord.customer?.pincode || ''}</span>
          </td>
          <td><div class="text-xs" style="max-width:240px;line-height:1.4;">${itemsList}</div></td>
          <td>
            <div class="font-bold">₹${Number(ord.finalTotal).toLocaleString("en-IN")}</div>
            <span class="badge badge-cod">COD Only</span>
            ${ord.codFee > 0 ? `<div class="text-xs text-muted">+₹${ord.codFee} Delivery</div>` : `<div class="text-xs text-success">Free COD</div>`}
          </td>
          <td>
            <select class="form-select form-select-sm" onchange="window.genBoldAdmin.updateOrderStatus('${ord.orderId}', this.value)">
              <option value="Confirmed (Cash on Delivery)" ${ord.status.includes('Confirmed') ? 'selected' : ''}>Confirmed</option>
              <option value="Packed (Discreet Outer Box)" ${ord.status.includes('Packed') ? 'selected' : ''}>Packed Discreetly</option>
              <option value="Dispatched with Courier" ${ord.status.includes('Dispatched') ? 'selected' : ''}>Dispatched (COD)</option>
              <option value="Delivered & Cash Collected" ${ord.status.includes('Delivered') ? 'selected' : ''}>Delivered & Paid</option>
            </select>
          </td>
          <td>
            <span class="badge badge-info">100% Discreet</span>
          </td>
        </tr>
      `;
    }).join("");
  }

  updateOrderStatus(orderId, newStatus) {
    window.genBoldStore.updateOrderStatus(orderId, newStatus);
    window.showToast(`Order ${orderId} updated to: ${newStatus}`, "info");
  }

  // --- SETTINGS ---
  loadSettingsToForm() {
    const s = window.genBoldStore.getSettings();
    const minCod = document.getElementById("settings-min-cod");
    const codFee = document.getElementById("settings-cod-fee");
    const email = document.getElementById("settings-email");
    const phone = document.getElementById("settings-phone");

    if (minCod) minCod.value = s.minOrderFreeCod || 299;
    if (codFee) codFee.value = s.codFee || 49;
    if (email) email.value = s.supportEmail || "support@genbold.in";
    if (phone) phone.value = s.supportPhone || "+91 (800) 123-4567";
  }

  saveSettingsFromForm() {
    const minCod = Number(document.getElementById("settings-min-cod").value) || 299;
    const codFee = Number(document.getElementById("settings-cod-fee").value) || 49;
    const email = document.getElementById("settings-email").value.trim();
    const phone = document.getElementById("settings-phone").value.trim();

    window.genBoldStore.saveSettings({
      minOrderFreeCod: minCod,
      codFee: codFee,
      supportEmail: email,
      supportPhone: phone
    });

    window.showToast("Store settings & COD rules updated successfully!", "success");
    // Trigger cart recalculation
    window.dispatchEvent(new CustomEvent("genbold:cartChanged", { detail: window.genBoldCart.getSummary() }));
  }

  // --- EXPORT / IMPORT ---
  exportData() {
    const data = {
      exportedAt: new Date().toISOString(),
      products: window.genBoldStore.getProducts(),
      categories: window.genBoldStore.getCategories(),
      coupons: window.genBoldStore.getCoupons(),
      settings: window.genBoldStore.getSettings()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gen-bold-store-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    window.showToast("Catalog & Settings exported as JSON file!", "success");
  }

  importData(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.products) window.genBoldStore.saveProducts(imported.products);
        if (imported.categories) window.genBoldStore.saveCategories(imported.categories);
        if (imported.coupons) window.genBoldStore.saveCoupons(imported.coupons);
        if (imported.settings) window.genBoldStore.saveSettings(imported.settings);

        window.showToast("Store data imported successfully!", "success");
        this.renderAll();
      } catch (err) {
        alert("Invalid JSON file format.");
      }
    };
    reader.readAsText(file);
  }
}

// Global admin instance
window.genBoldAdmin = new AdminPanel();
