// app/sitemap.js

export default async function sitemap() {
  const baseUrl = "https://kimiatoranj.com";

  // 1️⃣ Fetch products from your API
  const res = await fetch(
    "https://api.kimiatoranj.com/api/store/products/?page_size=1000",
    { next: { revalidate: 3600 } } // revalidate every hour
  );
  const data = await res.json();

  const products = Array.isArray(data)
    ? data
    : Array.isArray(data.results)
    ? data.results
    : [];

  // 2️⃣ Map product URLs
  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/product/${p.url_title}-${p.id}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  // 3️⃣ Add static routes
  const staticRoutes = [
    "/login",
    "/installment-payment",
    "/faq",
    "/shop",
    "/gift-selector",
    "/category/brass-samovar",
    "/category/brass-products",
    "/category/silver-plated",
    "/category/golden-brass",
    "/category/qalamzani",
    "/category/mirror-candleholder",
    "/category/organizational-gift-pack",
    "/category/khatamkari",
    "/category/khatamkari/saatkhatamkari",
    "/category/khatamkari/shokolatkhori",
    "/category/khatamkari/others-khatamkari",
    "/blog",
    "/post/Enlivening-your-home-with-iranian-arts-and-crafts",
    "/post/Isfahan-Handicrafts-A-lasting-legacy-from-the-heart-of-Iranian-history",
    "/post/a-guide-to-buying-a-brass-fruit-bowl-a-stylish-choice-for-home-decoration",
    "/post/The-art-of-calligraphy-and-inlay-work-masterpieces-of-Isfahan-handicrafts",
    "/post/Golden-products-the-magic-of-calligraphy-and-inlay-art-in-modern-Iranian-life",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
