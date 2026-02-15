import Header from "@/components/Header/Header";
import BannerSlider from "@/components/BannerSlider/BannerSlider";
import Bestsellers from "@/components/Bestsellers/Bestsellers";
import styles from "./page.module.css";
import Highlights from "@/components/Highlights/Highlights";
import Collections from "@/components/Collections/Collections";
import SpecialOffer from "@/components/SpecialOffer/SpecialOffer";
import SpecialProducts from "@/components/SpecialProducts/SpecialProducts";
import FeaturesLine from "@/components/FeaturesLine/FeaturesLine";
import Footer from "@/components/Footer/Footer";
import FooterMenu from "@/components/FooterMenu/FooterMenu";
import ContactButton from "@/components/ContactButton/ContactButton";
import ArticleCarousel from "@/components/ArticleCarousel/ArticleCarousel";

export const metadata = {
  title: "فروشگاه کیمیا ترنج | صنایع دستی اصفهان ",
  description:
    "خرید صنایع دستی اصیل اصفهان و ایران؛ خاتم‌کاری، قلم‌زنی، مینیاتور، سماور برنجی، پک هدیه سازمانی و محصولات دست‌ساز با کیفیت.",
};

// Build-time fetch (static, like sitemap)
async function getAllProducts() {
  const res = await fetch(
    "https://kimiatoranj-api.liara.run/api/store/products/?page_size=1000",
    { cache: "force-cache" } // ensures build-time fetch
  );

  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : Array.isArray(data.results) ? data.results : [];
}

export default async function Home() {
  const products = await getAllProducts();

  // Build JSON-LD schema for all products
  const productSchema = products.map((p) => ({
    "@context": "https://schema.org/",
    "@type": "Product",
    name: p.title,
    image: Array.isArray(p.images)
      ? p.images.map((img) => img.image).filter(Boolean)
      : [],
    description: p.description || "",
    sku: p.sku || String(p.id),
    offers: {
      "@type": "Offer",
      url: `https://kimiatoranj.com/product/${p.slug}-${p.id}`,
      priceCurrency: "IRR",
      price: p.variants?.[0]?.price || p.price || 0,
      availability:
        (p.variants?.[0]?.inventory ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    ...(p.average_rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: p.average_rating,
            reviewCount: p.reviews_count || 1,
          },
        }
      : {}),
  }));

  return (
    <div className={styles.page}>
      {/* Inject JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <Header />

      <main className={styles.main}>
        <BannerSlider />
        <h1 className={styles.hidden}>صنایع دستی کیمیاترنج</h1>

        <Highlights />
        <Collections />
        <Bestsellers />
        <SpecialOffer />
        <SpecialProducts />
        <FeaturesLine />
        <ArticleCarousel />
        <Footer />
        <FooterMenu />
        <ContactButton />
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} کیمیا ترنج</p>
      </footer>
    </div>
  );
}
