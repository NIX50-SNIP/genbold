/**
 * Gen Bold Cart & Checkout Engine
 * Strictly enforces:
 * 1. Only Cash on Delivery (COD) as the payment method.
 * 2. COD is FREE for orders >= ₹299.
 * 3. Orders under ₹299 incur a ₹49 INR COD delivery charge.
 * 4. Coupon code discounts and live recalculation.
 */

class Cart {
  constructor() {
    this.storageKey = "genbold_cart_v1";
    this.appliedCoupon = null;
    this.loadCouponFromSession();
  }

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch (e) {
      return [];
    }
  }

  saveItems(items) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("genbold:cartChanged", { detail: this.getSummary() }));
  }

  loadCouponFromSession() {
    try {
      const saved = sessionStorage.getItem("genbold_applied_coupon");
      if (saved) {
        this.appliedCoupon = JSON.parse(saved);
      }
    } catch (e) {
      this.appliedCoupon = null;
    }
  }

  saveCouponToSession(coupon) {
    this.appliedCoupon = coupon;
    if (coupon) {
      sessionStorage.setItem("genbold_applied_coupon", JSON.stringify(coupon));
    } else {
      sessionStorage.removeItem("genbold_applied_coupon");
    }
  }

  addItem(product, quantity = 1, selectedSize = null, selectedColor = null) {
    const items = this.getItems();
    const size = selectedSize || (product.sizes && product.sizes[0]) || "Standard";
    const color = selectedColor || (product.colors && product.colors[0]?.name) || "Default";
    
    // Unique key per product variant
    const cartItemId = `${product.id}_${size}_${color}`;
    const existingIndex = items.findIndex(item => item.cartItemId === cartItemId);

    if (existingIndex > -1) {
      items[existingIndex].quantity += Number(quantity);
    } else {
      items.push({
        cartItemId,
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        mrp: Number(product.mrp || product.price),
        image: product.image,
        selectedSize: size,
        selectedColor: color,
        quantity: Number(quantity)
      });
    }

    this.saveItems(items);
    return true;
  }

  updateQuantity(cartItemId, quantity) {
    let items = this.getItems();
    const target = items.find(i => i.cartItemId === cartItemId);
    if (!target) return;

    if (quantity <= 0) {
      items = items.filter(i => i.cartItemId !== cartItemId);
    } else {
      target.quantity = Number(quantity);
    }

    this.saveItems(items);
  }

  removeItem(cartItemId) {
    let items = this.getItems();
    items = items.filter(i => i.cartItemId !== cartItemId);
    this.saveItems(items);
  }

  clear() {
    this.saveItems([]);
    this.saveCouponToSession(null);
  }

  applyCoupon(code) {
    if (!code) return { success: false, message: "Please enter a coupon code." };
    const coupon = window.genBoldStore.findCoupon(code);
    if (!coupon) {
      return { success: false, message: `Coupon "${code}" is invalid or expired.` };
    }

    const summary = this.getSummary(false);
    if (summary.subtotal < coupon.minOrder) {
      return { 
        success: false, 
        message: `Coupon "${coupon.code}" requires a minimum order value of ₹${coupon.minOrder}.` 
      };
    }

    this.saveCouponToSession(coupon);
    window.dispatchEvent(new CustomEvent("genbold:cartChanged", { detail: this.getSummary() }));
    return { success: true, message: `Coupon "${coupon.code}" applied successfully!`, coupon };
  }

  removeCoupon() {
    this.saveCouponToSession(null);
    window.dispatchEvent(new CustomEvent("genbold:cartChanged", { detail: this.getSummary() }));
  }

  getSummary(applyCouponLogic = true) {
    const items = this.getItems();
    const settings = window.genBoldStore.getSettings();
    const minOrderForFreeCod = Number(settings.minOrderFreeCod) || 299;
    const standardCodFee = Number(settings.codFee) || 49;

    let totalItemsCount = 0;
    let subtotal = 0;
    let mrpTotal = 0;

    items.forEach(item => {
      totalItemsCount += item.quantity;
      subtotal += item.price * item.quantity;
      mrpTotal += (item.mrp || item.price) * item.quantity;
    });

    const catalogSavings = Math.max(0, mrpTotal - subtotal);

    // Coupon discount calculation
    let couponDiscount = 0;
    let activeCoupon = null;

    if (applyCouponLogic && this.appliedCoupon && subtotal > 0) {
      if (subtotal >= this.appliedCoupon.minOrder) {
        activeCoupon = this.appliedCoupon;
        if (activeCoupon.discountType === "percent") {
          couponDiscount = Math.round((subtotal * activeCoupon.discountValue) / 100);
        } else {
          couponDiscount = Math.min(subtotal, Number(activeCoupon.discountValue));
        }
      } else {
        // Condition no longer met
        this.saveCouponToSession(null);
      }
    }

    const afterCouponSubtotal = Math.max(0, subtotal - couponDiscount);

    // COD DELIVERY LOGIC:
    // If order subtotal >= 299, COD fee is 0 INR (Free COD)
    // If order subtotal < 299, COD fee is 49 INR
    let codFee = 0;
    let isFreeCod = false;
    let amountNeededForFreeCod = 0;

    if (subtotal > 0) {
      if (subtotal >= minOrderForFreeCod) {
        codFee = 0;
        isFreeCod = true;
        amountNeededForFreeCod = 0;
      } else {
        codFee = standardCodFee;
        isFreeCod = false;
        amountNeededForFreeCod = minOrderForFreeCod - subtotal;
      }
    }

    const finalTotal = subtotal > 0 ? (afterCouponSubtotal + codFee) : 0;

    return {
      items,
      totalItemsCount,
      subtotal,
      mrpTotal,
      catalogSavings,
      activeCoupon,
      couponDiscount,
      afterCouponSubtotal,
      codFee,
      isFreeCod,
      amountNeededForFreeCod,
      minOrderForFreeCod,
      finalTotal,
      paymentMethod: "Cash on Delivery (COD)"
    };
  }

  placeOrder(customerData) {
    const summary = this.getSummary();
    if (summary.items.length === 0) {
      return { success: false, message: "Your cart is empty." };
    }

    if (!customerData.name || !customerData.phone || !customerData.address || !customerData.pincode) {
      return { success: false, message: "Please fill all required delivery details for COD." };
    }

    const orderRecord = {
      customer: {
        name: customerData.name.trim(),
        phone: customerData.phone.trim(),
        email: customerData.email ? customerData.email.trim() : "",
        address: customerData.address.trim(),
        city: customerData.city ? customerData.city.trim() : "City",
        state: customerData.state ? customerData.state.trim() : "State",
        pincode: customerData.pincode.trim(),
        notes: customerData.notes || "Discreet packaging requested"
      },
      items: summary.items,
      subtotal: summary.subtotal,
      couponDiscount: summary.couponDiscount,
      couponCode: summary.activeCoupon ? summary.activeCoupon.code : null,
      codFee: summary.codFee,
      finalTotal: summary.finalTotal,
      paymentMethod: "Cash on Delivery (COD)",
      discreetDelivery: true
    };

    const saved = window.genBoldStore.saveOrder(orderRecord);
    this.clear();
    return { success: true, order: saved };
  }
}

// Global cart instance
window.genBoldCart = new Cart();
