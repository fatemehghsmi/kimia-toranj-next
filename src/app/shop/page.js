import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ShopClient from "./ShopClient";
import FooterMenu from "@/components/FooterMenu/FooterMenu";

const API_BASE = "https://api.kimiatoranj.com/api/store";
export const metadata = {
  title: "فروشگاه صنایع دستی | کیمیا ترنج",
  description:
    "خرید آنلاین محصولات دست‌ساز ایرانی در کیمیا ترنج. دسته‌بندی‌ها، فیلترها و مرتب‌سازی پیشرفته؛ ارسال سریع و پشتیبانی دوستانه.",
};

export default async function ShopPage({ searchParams }) {
  // Convert to a plain object
  const plainParams = await Promise.resolve(searchParams);

  const page = 1;
  const params = new URLSearchParams(
    Object.entries(plainParams)
      .filter(([_, v]) => v != null)
      .map(([k, v]) => [k, String(v)])
  );

  if (!params.get("order_by")) {
    params.set("order_by", "price");
  }
  params.set("page", String(page));

  const [productsRes, collectionsRes] = await Promise.all([
    fetch(`${API_BASE}/products/?${params.toString()}`, {
      next: { revalidate: 60 },
    }),
    fetch(`${API_BASE}/collections/`, { next: { revalidate: 300 } }),
  ]);

  const productsData = productsRes.ok
    ? await productsRes.json()
    : { results: [] };
  const collectionsData = collectionsRes.ok ? await collectionsRes.json() : [];

  return (
    <>
      <Header />
      <ShopClient
        initialProducts={productsData.results}
        initialCollections={collectionsData}
        initialHasMore={!!productsData.next}
      />
      <Footer />
      <FooterMenu />
    </>
  );
}
