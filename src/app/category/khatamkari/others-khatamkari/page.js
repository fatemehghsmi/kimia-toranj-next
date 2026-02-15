import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CategoryClient from "@/components/CategoryClient/CategoryClient";
import styles from "./OthersKhatamkari.module.css";
import FooterMenu from "@/components/FooterMenu/FooterMenu";

const API_URL = "https://api.kimiatoranj.com/";

export const metadata = {
  title: "خاتمکاری اصل اصفهان | خرید اینترنتی از کیمیا ترنج",
  description:
    "فروش انواع آثار خاتمکاری دست‌ساز، شامل جعبه، قاب، ست پذیرایی و هدیه‌های هنری. هنر اصیل ایرانی را از کیمیا ترنج تجربه کنید. ارسال تضمینی.",
};

export default async function KhatamkariPage() {
  const productsRes = await fetch(
    `${API_URL}api/store/products/?collection=سایر محصولات خاتم &page=1`,
    { next: { revalidate: 60 } }
  );

  const productsData = productsRes.ok
    ? await productsRes.json()
    : { results: [], next: null };

  return (
    <>
      <Header />

      <div className={styles.pageContainer}>
        {/* Product Grid */}
        <h1 className={styles.title}>
          محصولات دیگر دسته بندی خاتم کاری کیمیاترنج{" "}
        </h1>
        <CategoryClient
          categoryName="سایر محصولات خاتم "
          initialProducts={productsData.results}
          initialHasMore={!!productsData.next}
        />
      </div>
      <FooterMenu />
      <Footer />
    </>
  );
}