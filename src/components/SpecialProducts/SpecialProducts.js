// src/components/SpecialProducts/SpecialProducts.jsx
import Link from "next/link";
import { MdLocalOffer } from "react-icons/md";
import SpecialProductsSlider from "./SpecialProductsSlider";
import styles from "./SpecialProducts.module.css";

export default async function SpecialProducts() {
  const res = await fetch(
    "https://kimiatoranj-api.liara.run/api/store/products/",
    { next: { revalidate: 300 } } // ISR: refresh every 5 min
  );

  if (!res.ok) {
    return <div className={styles.error}>خطا در دریافت اطلاعات</div>;
  }

  const { results } = await res.json();
  const products = results.slice(0, 10);

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>محصولات تخفیف دار</h2>
          {/* <MdLocalOffer className={styles.icon} />
          <span className={styles.percent}>%</span> */}
        </div>
        <Link href="/shop" className={styles.shopLink}>
          مشاهده همه محصولات
        </Link>
      </div>

      {/* SLIDER (client component) */}
      <SpecialProductsSlider products={products} />
    </div>
  );
}
