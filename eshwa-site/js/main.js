/* ============================================================
   ESHWA APPARELS — CORE SITE LOGIC
   Cart is stored in the browser's localStorage (free, no backend).
   ============================================================ */

/* ---------- Cart helpers ---------- */
const CART_KEY = "eshwa_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId, size, colour, qty) {
  const cart = getCart();
  const existing = cart.find(
    (i) => i.productId === productId && i.size === size && i.colour === colour
  );
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ productId, size, colour, qty });
  }
  saveCart(cart);
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

function updateCartQty(index, qty) {
  const cart = getCart();
  if (qty <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].qty = qty;
  }
  saveCart(cart);
}

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function cartTotal() {
  const cart = getCart();
  let total = 0;
  cart.forEach((item) => {
    const p = PRODUCTS.find((x) => x.id === item.productId);
    if (p) total += p.price * item.qty;
  });
  return total;
}

function updateCartCount() {
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = cartCount();
  });
}

/* ---------- Toast ---------- */
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------- Header / Footer injection ---------- */
function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  el.innerHTML = `
    <div class="topbar">Free Shipping on all orders above ${STORE.currencySymbol}${STORE.freeShippingAbove}</div>
    <header class="site-header">
      <div class="container">
        <a href="index.html" class="logo">
          <span class="name">${STORE.name}</span>
          <span class="tagline">${STORE.tagline}</span>
        </a>
        <nav class="main-nav" id="main-nav">
          <a href="index.html">HOME</a>
          <a href="shop.html">SHOP</a>
          <a href="about.html">ABOUT US</a>
          <a href="contact.html">CONTACT</a>
        </nav>
        <div class="header-icons">
          <a href="cart.html" class="icon-btn" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h2l2.4 12.2a2 2 0 002 1.8h8.2a2 2 0 002-1.8L21 8H6"/><circle cx="9" cy="21" r="1"/><circle cx="18" cy="21" r="1"/></svg>
            <span class="cart-count">0</span>
          </a>
          <button class="nav-toggle" id="nav-toggle" aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
      </div>
    </header>
  `;
  document.getElementById("nav-toggle").addEventListener("click", () => {
    document.getElementById("main-nav").classList.toggle("open");
  });
  updateCartCount();
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  el.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="name">${STORE.name}</div>
            <p>Timeless styles, made for you.</p>
            <div class="social-row">
              <a href="https://instagram.com/${STORE.instagram.replace("@","")}" target="_blank" rel="noopener" aria-label="Instagram">IG</a>
              <a href="https://wa.me/${STORE.whatsappNumber}" target="_blank" rel="noopener" aria-label="WhatsApp">W</a>
            </div>
          </div>
          <div>
            <h4>Quick Links</h4>
            <a href="index.html">Home</a><br/>
            <a href="shop.html">Shop</a><br/>
            <a href="about.html">About Us</a><br/>
            <a href="contact.html">Contact</a>
          </div>
          <div>
            <h4>Customer Service</h4>
            <a href="#">Shipping Policy</a><br/>
            <a href="#">Return Policy</a><br/>
            <a href="#">Privacy Policy</a><br/>
            <a href="#">Terms & Conditions</a>
          </div>
          <div>
            <h4>Contact Us</h4>
            <p>WhatsApp: +${STORE.whatsappNumber}</p>
            <p>Email: ${STORE.contactEmail}</p>
            <p>Instagram: ${STORE.instagram}</p>
          </div>
        </div>
        <div class="footer-bottom">&copy; ${new Date().getFullYear()} ${STORE.name} Apparels. All rights reserved.</div>
      </div>
    </footer>
  `;
}

/* ---------- Product card rendering ---------- */
function productCardHTML(p) {
  const swatches = p.colours
    .map((c) => `<span class="swatch" style="background:${c.hex}" title="${c.name}"></span>`)
    .join("");
  return `
    <div class="product-card">
      <a href="product.html?id=${p.id}" class="product-thumb">
        ${p.tag ? `<span class="tag-badge">${p.tag}</span>` : ""}
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
      </a>
      <div class="product-info">
        <a href="product.html?id=${p.id}"><h3>${p.name}</h3></a>
        <div class="product-price">${STORE.currencySymbol}${p.price}</div>
        <div class="product-meta">Sizes: ${p.sizes.join(", ")}</div>
        <div class="swatches">${swatches}</div>
        <div class="stock-note">Stock left: ${p.stock}</div>
        <div class="card-actions">
          <a href="product.html?id=${p.id}" class="btn btn-primary">Buy Now</a>
          <button class="btn btn-outline" onclick="quickAdd('${p.id}')">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}

function quickAdd(productId) {
  const p = PRODUCTS.find((x) => x.id === productId);
  if (!p) return;
  addToCart(productId, p.sizes[0], p.colours[0].name, 1);
  showToast(`${p.name} added to cart`);
}

function renderProductGrid(containerId, products) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (products.length === 0) {
    el.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--brown);padding:40px 0;">No products found.</p>`;
    return;
  }
  el.innerHTML = products.map(productCardHTML).join("");
}

/* ---------- Init on every page ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});
