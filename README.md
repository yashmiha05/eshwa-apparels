# Eshwa Apparels — Website

A free, static e-commerce style website for your kurti business. No backend, no hosting cost, no coding skills needed to update it.

## What's inside
- `index.html` — Homepage
- `shop.html` — Full product listing with category filters
- `product.html` — Product detail page with swipeable photo gallery, size/colour picker
- `cart.html` — Shopping cart
- `checkout.html` — Collects delivery details and sends the order to your WhatsApp
- `about.html`, `contact.html` — Info pages
- `js/products.js` — **Your product catalog. Edit this to add/update products.**
- `js/settings.js` — **Your business name, WhatsApp number, email. Edit this once.**
- `css/style.css` — All styling (brown & beige theme)
- `images/products/` — Product photos go here

## How checkout works (important)
There's no real payment gateway wired in yet — that needs a business KYC with a
provider like Razorpay or Instamojo, which is a separate step. For now, checkout
collects the customer's delivery details and payment preference (Net Banking or
GPay/PhonePe UPI), then opens WhatsApp with the full order pre-filled as a message
to your number, so you receive every order instantly and confirm/collect payment
manually. This is how most small D2C clothing brands in India start out —
completely free.

When you're ready for real online payments, Razorpay's Payment Links or Payment
Pages are the easiest next step and are also free to set up.

## Managing products from your website (no code needed)

Go to **yoursite.vercel.app/admin.html** — this is a private admin page where you
can add, edit, or delete products directly from your browser: name, price,
sizes, colours, stock, description, and as many photos as you want (they're
compressed automatically so the site stays fast).

**One-time setup:**
1. On the admin page, it'll ask for your GitHub username, repo name
   (`eshwa-apparels`), and a GitHub Personal Access Token.
2. To get a token: go to https://github.com/settings/tokens/new → give it any
   name → tick the **repo** checkbox → click **Generate token** → copy it and
   paste it into the admin page. (Full steps are also shown on the admin page
   itself.)
3. This token is saved only in your own browser — never share it with anyone,
   since it lets whoever has it edit your site.

Once unlocked, every product you add/edit/delete there is saved straight to
your GitHub repository, and Vercel automatically redeploys — your live site
updates within about a minute, with **no VS Code, no git, no code required.**

Bookmark the admin page on your phone or laptop and manage your store from
anywhere.

## STEP 1 — Edit your details
Open `js/settings.js` and change:
```js
whatsappNumber: "911234567890",   // your number, country code + number, no + or spaces
contactEmail: "support@eshwa.com",
instagram: "@apparelsbyeshwa",
```

## STEP 2 — Add your real products
Open `js/products.js`. Each product is one block like this:
```js
{
  id: "maroon-zari-kurti",        // unique, no spaces
  name: "Eshwa Maroon Zari Kurti",
  price: 1499,
  category: "kurties",            // "kurties" | "2-piece" | "3-piece"
  sizes: ["S","M","L","XL"],
  colours: [{ name: "Maroon", hex: "#6b2323" }],
  stock: 3,
  description: "...",
  images: ["images/products/maroon-zari-1.jpg", "images/products/maroon-zari-2.jpg"]
}
```
Copy an existing block, change the values, add as many photos as you like to the
`images` array — the product page automatically becomes swipeable/scrollable with
however many photos you list.

## STEP 3 — Add your photos
Drop your photos into `images/products/`, named however you like (e.g.
`maroon-kurti-1.jpg`, `maroon-kurti-2.jpg`), then reference those exact filenames
in `js/products.js`. The current placeholder images are plain colored boxes — swap
them out with real photos before going live.

---

## Deploy it for free — GitHub + Vercel

### A. Push the code to GitHub
1. Go to https://github.com and sign in (or create a free account).
2. Click **New repository** → name it `eshwa-apparels` → keep it **Public** or
   **Private**, your choice → click **Create repository**. Leave it empty (don't
   add a README from GitHub's side, you already have one).
3. On your computer, open a terminal **inside this folder** and run:
   ```bash
   git init
   git add .
   git commit -m "Initial Eshwa Apparels website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/eshwa-apparels.git
   git push -u origin main
   ```
   Replace `YOUR-USERNAME` with your actual GitHub username. If you don't have
   `git` installed, download it from https://git-scm.com — or use **GitHub
   Desktop** (https://desktop.github.com) which lets you do this with buttons
   instead of commands: File → Add Local Repository → select this folder →
   Publish repository.

### B. Deploy to Vercel (free)
1. Go to https://vercel.com and sign up using your GitHub account (one click).
2. Click **Add New → Project**.
3. Select your `eshwa-apparels` repository from the list → click **Import**.
4. Framework preset: choose **Other** (it's a plain static site, no build step
   needed). Leave all settings as default.
5. Click **Deploy**. In under a minute, Vercel gives you a live URL like
   `eshwa-apparels.vercel.app` — that's your live website, free, forever, with
   free HTTPS.
6. Want a custom domain like `eshwaapparels.com`? Buy it from any registrar
   (GoDaddy, Namecheap, etc.) then in Vercel go to your project → **Settings →
   Domains** → add it and follow the DNS steps shown.

### C. Making updates later
Every time you edit `js/products.js` (add a new kurti, change a price) or add new
photos:
```bash
git add .
git commit -m "Updated products"
git push
```
Vercel automatically redeploys within seconds — no need to touch Vercel again.

If you're not comfortable with terminal commands, GitHub Desktop or even editing
files directly on GitHub.com's web interface (click a file → pencil icon → edit →
commit) works too, and Vercel will still auto-deploy.

## Working in VS Code
1. Open VS Code → File → Open Folder → select this `eshwa-apparels` folder.
2. Install the **Live Server** extension (search it in the Extensions panel) to
   preview the site locally — right-click `index.html` → "Open with Live Server".
3. Edit `js/products.js` or `css/style.css`, save, and the preview updates
   instantly.
