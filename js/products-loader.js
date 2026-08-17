/* ============================================================
   ESHWA APPARELS — LIVE PRODUCT LOADER
   ------------------------------------------------------------
   Loads products.json safely.

   Features:
   - Prevents "Unexpected end of JSON input"
   - Retries when products.json is temporarily unavailable
   - Keeps the last valid product list as backup
   - Does NOT erase existing products when one request fails
   - Always fetches the latest products
   ============================================================ */

let PRODUCTS = [];

const PRODUCTS_CACHE_KEY = "eshwa_products_backup";
const MAX_RETRIES = 5;
const RETRY_DELAY = 800;


/* ------------------------------------------------------------
   Small delay helper
   ------------------------------------------------------------ */

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/* ------------------------------------------------------------
   Save a valid product list locally
   ------------------------------------------------------------ */

function saveProductsBackup(products) {
  try {
    if (Array.isArray(products) && products.length > 0) {
      localStorage.setItem(
        PRODUCTS_CACHE_KEY,
        JSON.stringify(products)
      );
    }
  } catch (e) {
    console.warn("Could not save products backup:", e);
  }
}


/* ------------------------------------------------------------
   Get last valid product list
   ------------------------------------------------------------ */

function getProductsBackup() {
  try {
    const saved = localStorage.getItem(PRODUCTS_CACHE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    return [];
  } catch (e) {
    console.warn("Could not read products backup:", e);
    return [];
  }
}


/* ------------------------------------------------------------
   Load products
   ------------------------------------------------------------ */

async function loadProducts() {

  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {

    try {

      const url =
        "products.json?t=" +
        Date.now() +
        "-" +
        Math.random();

      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        }
      });


      /* ---------------------------------------------
         Check HTTP response
         --------------------------------------------- */

      if (!res.ok) {
        throw new Error(
          `HTTP ${res.status} ${res.statusText}`
        );
      }


      /* ---------------------------------------------
         Read as text first
         --------------------------------------------- */

      const text = await res.text();


      /* ---------------------------------------------
         Prevent empty JSON parsing
         --------------------------------------------- */

      if (!text || !text.trim()) {
        throw new Error(
          "products.json is empty"
        );
      }


      /* ---------------------------------------------
         Parse JSON safely
         --------------------------------------------- */

      let data;

      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        throw new Error(
          "products.json contains incomplete or invalid JSON"
        );
      }


      /* ---------------------------------------------
         Make sure products is an array
         --------------------------------------------- */

      if (!Array.isArray(data)) {
        throw new Error(
          "products.json must contain a JSON array"
        );
      }


      /* ---------------------------------------------
         SUCCESS
         --------------------------------------------- */

      PRODUCTS = data;

      /*
       * Save the successful version locally.
       * If GitHub/Vercel temporarily serves
       * an incomplete file later, we can still
       * show the previous valid products.
       */

      saveProductsBackup(PRODUCTS);

      console.log(
        `Products loaded successfully: ${PRODUCTS.length}`
      );

      return PRODUCTS;


    } catch (e) {

      lastError = e;

      console.warn(
        `Product loading attempt ${attempt}/${MAX_RETRIES} failed:`,
        e.message
      );


      /* ---------------------------------------------
         Retry instead of immediately giving up
         --------------------------------------------- */

      if (attempt < MAX_RETRIES) {
        await wait(RETRY_DELAY);
      }
    }
  }


  /* ==========================================================
     ALL RETRIES FAILED
     ========================================================== */

  console.error(
    "Could not load products.json after multiple attempts:",
    lastError
  );


  /* ----------------------------------------------------------
     Use last known valid products instead of deleting
     everything from the current session.
     ---------------------------------------------------------- */

  const backup = getProductsBackup();

  if (backup.length > 0) {

    PRODUCTS = backup;

    console.warn(
      `Using backup product list: ${PRODUCTS.length} products`
    );

    return PRODUCTS;
  }


  /* ----------------------------------------------------------
     If there is no backup and nothing loaded before,
     keep PRODUCTS as an empty array.
     ---------------------------------------------------------- */

  PRODUCTS = [];

  return PRODUCTS;
}