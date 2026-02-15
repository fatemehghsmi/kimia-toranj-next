// src/components/Collections/Collections.jsx
import { API_URL } from "@/config/config";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import styles from "./Collections.module.css";

export default async function Collections() {
  let collections = [];

  try {
    const res = await axios.get(`${API_URL}api/store/collections/`);
    collections = Array.isArray(res.data) ? res.data : [];
    collections = collections.filter(collection => collection.parent === null)
  } catch (error) {
    return <div className={styles.error}>خطا در دریافت اطلاعات</div>;
  }

  if (!collections.length) {
    return <div className={styles.error}>هیچ دسته‌بندی‌ای یافت نشد</div>;
  }

  return (
    <div className={styles.collections}>
      <h2 className={styles.sectionTitle}>دسته‌بندی محصولات</h2>
      <div className={styles.row}>
        {collections.map((collection) => {
          const href = collection.landing_page_url
            ? `/category/${collection.landing_page_url}`
            : `/shop?collection=${encodeURIComponent(collection.title)}`;

          return (
            <Link
              href={href}
              key={collection.id}
              className={styles.collectionCard}
              style={{
                backgroundImage: `url(${collection.image})`,
              }}
            >
              <Image
                src={collection.image || "/placeholder.jpg"}
                alt={collection.title}
                className={styles.collectionImage}
                width={400}
                height={300}
                loading="lazy"
                unoptimized
              />
              <div className={styles.overlay}>
                <h3 className={styles.description}>
                  {collection.description || collection.title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
