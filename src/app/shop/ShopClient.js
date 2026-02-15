"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard/ProductCard";
import ProductCardSkeleton from "@/components/ProductCard/ProductCard.Skeleton";
import styles from "./Shop.module.css";

const API_BASE = "https://api.kimiatoranj.com/api/store";

export default function ShopClient({ initialProducts, initialCollections, initialHasMore }) {
  const [products, setProducts] = useState(initialProducts);
  const [collections] = useState(initialCollections);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [showFilters, setShowFilters] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  // 🔑 Track request key to ignore stale responses
  const requestKeyRef = useRef(0);

  const buildQuery = (p = page) => {
    const qs = searchParams.toString();
    return qs ? `?${qs}&page=${p}` : `?page=${p}`;
  };

  // Fetch products when filters/page change
  useEffect(() => {
    if (page === 1 && products.length) return; // skip initial render
    let active = true;
    const abort = new AbortController();
    const currentKey = ++requestKeyRef.current;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/products/${buildQuery()}`, {
          signal: abort.signal,
        });
        if (!res.ok) {
          if (res.status === 404) {
            if (active) setHasMore(false);
            return;
          }
          throw new Error("مشکل در دریافت محصولات");
        }
        const data = await res.json();
        if (!active || currentKey !== requestKeyRef.current) return; // ✅ ignore stale
        setProducts((prev) => (page === 1 ? data.results : [...prev, ...data.results]));
        setHasMore(data.next !== null);
      } catch (err) {
        if (active && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (active && currentKey === requestKeyRef.current) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
      abort.abort();
    };
  }, [searchParams, page]);

  const applyFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "collection" && value === "all") {
      params.delete("collection");
    } else {
      params.set(key, value);
    }
    router.push(`/shop?${params.toString()}`);
    // reset state
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setShowFilters(false);
    requestKeyRef.current++; // ✅ bump key to cancel old responses
  };

  const filterByCollection = (title) => applyFilter("collection", title);
  const filterAllProducts = () => applyFilter("collection", "all");
  const sortCheapest = () => applyFilter("order_by", "price");
  const sortExpensive = () => applyFilter("order_by", "-price");
  const sortNewest = () => applyFilter("order_by", "-created_at");

  const observer = useRef();
  const lastRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((p) => p + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>فروشگاه صنایع دستی کیمیاترنج</h1>

      {/* Mobile filters */}
      <div className={styles.filterDropdownMobile}>
        <button
          className={styles.filterToggleButton}
          onClick={() => setShowFilters((s) => !s)}
        >
          {showFilters ? "بستن فیلتر" : "فیلتر و دسته بندی"}
        </button>
        {showFilters && (
          <div className={styles.dropdownFilters}>
            <div className={styles.collections}>
              <h2 className={styles.collectionsTitle}>فیلتر بر اساس مجموعه</h2>
              <p onClick={filterAllProducts} className={styles.collectionFilter}>
                همه محصولات
              </p>
              {collections.map((c) => (
                <p
                  key={c.id}
                  onClick={() => filterByCollection(c.title)}
                  className={styles.collectionFilter}
                >
                  {c.title}
                </p>
              ))}
            </div>
            <div className={styles.sort}>
              <h2 className={styles.sortTitle}>مرتب کردن بر اساس</h2>
              <p onClick={sortCheapest} className={styles.sortOption}>ارزان‌ترین</p>
              <p onClick={sortExpensive} className={styles.sortOption}>گران‌ترین</p>
              <p onClick={sortNewest} className={styles.sortOption}>جدیدترین</p>
            </div>
          </div>
        )}
      </div>

      {/* Main */}
      <div className={styles.container}>
        <div className={styles.productContainer}>
          {/* ✅ Skeletons when loading first page */}
          {loading && page === 1 && products.length === 0
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={styles.productWrapper}>
                  <ProductCardSkeleton />
                </div>
              ))
            : products.map((product, i) => {
                const isLast = i === products.length - 1;
                return (
                  <div
                    key={product.id}
                    ref={isLast ? lastRef : null}
                    className={styles.productWrapper}
                  >
                    <ProductCard product={product} />
                  </div>
                );
              })}

          {loading && page > 1 && <div className={styles.loading}>در حال بارگذاری...</div>}
          {error && <div className={styles.error}>خطا: {error}</div>}
          {!loading && products.length === 0 && (
            <div className={styles.empty}>هیچ محصولی یافت نشد.</div>
          )}
          {!loading && !hasMore && products.length > 0 && (
            <div className={styles.endMessage}>هیچ محصول بیشتری موجود نیست</div>
          )}
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebarContainer}>
          <div className={styles.sidebarInner}>
            <div className={styles.collections}>
              <h2 className={styles.collectionsTitle}>فیلتر بر اساس مجموعه</h2>
              <p onClick={filterAllProducts} className={styles.collectionFilter}>
                همه محصولات
              </p>
              {collections.map((c) => (
                <p
                  key={c.id}
                  onClick={() => filterByCollection(c.title)}
                  className={styles.collectionFilter}
                >
                  {c.title}
                </p>
              ))}
            </div>
            <div className={styles.sort}>
              <h2 className={styles.sortTitle}>مرتب کردن بر اساس</h2>
              <p onClick={sortCheapest} className={styles.sortOption}>ارزان‌ترین</p>
              <p onClick={sortExpensive} className={styles.sortOption}>گران‌ترین</p>
              <p onClick={sortNewest} className={styles.sortOption}>جدیدترین</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}