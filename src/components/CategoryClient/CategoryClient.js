"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import ProductCardSkeleton from "@/components/ProductCard/ProductCard.Skeleton";
import styles from "./CategoryClient.module.css";

const API_URL = "https://api.kimiatoranj.com/";

export default function CategoryClient({
  categoryName,
  initialProducts,
  initialHasMore,
}) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(!initialProducts.length);

  const observer = useRef();

  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (page === 1) return;
    let active = true;
    setLoading(true);
    setError(null);

    fetch(`${API_URL}api/store/products/?collection=${categoryName}&page=${page}`)
      .then((res) => {
        if (!res.ok) throw new Error("خطا در دریافت محصولات");
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setProducts((prev) => [...prev, ...data.results]);
        setHasMore(data.next !== null);
        setInitialLoading(false);
      })
      .catch(() => {
        if (active) setError("خطا در دریافت محصولات");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, categoryName]);

  // اسکلتون برای لودینگ اولیه
  const renderSkeletons = (count = 8) => {
    return Array.from({ length: count }, (_, index) => (
      <ProductCardSkeleton key={`skeleton-${index}`} />
    ));
  };

  return (
    <section className={styles.productGridSection}>
      <div className={styles.container}>
        {initialLoading ? (
          <div className={styles.productGrid}>
            {renderSkeletons()}
          </div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : products.length === 0 ? (
          <div className={styles.empty}>هیچ محصولی یافت نشد.</div>
        ) : (
          <div className={styles.productGrid}>
            {products.map((product, i) => {
              const isLast = i === products.length - 1;
              return (
                <div key={product.id} ref={isLast ? lastProductRef : null}>
                  <ProductCard product={product} />
                </div>
              );
            })}
            
            {/* اسکلتون برای لودینگ صفحات بعدی */}
            {loading && renderSkeletons(4)}
            
            {!hasMore && products.length > 0 && (
              <div className={styles.endMessage}>
                هیچ محصول بیشتری موجود نیست
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}