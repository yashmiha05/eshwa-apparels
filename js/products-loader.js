/* ============================================================
   ESHWA APPARELS — LIVE PRODUCT LOADER
   Fetches products.json fresh every time (no caching), so the
   moment you save a product in the Admin page, every visitor
   sees it on their next page load.
   ============================================================ */

let PRODUCTS = [];

async function loadProducts() {
  try {
    const res = await fetch("products.json?t=" + Date.now());
    PRODUCTS = await res.json();
  } catch (e) {
    console.error("Could not load products.json", e);
    PRODUCTS = [];
  }
  return PRODUCTS;
}
