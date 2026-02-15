"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";
import { FiTrash2, FiHeart, FiShoppingCart, FiAlertCircle } from "react-icons/fi";
import styles from "./WishlistItems.module.css";

export default function WishlistItems() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(new Set());

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/api/store/liked-items/");
        setWishlist(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("خطا در دریافت لیست علاقه‌مندی‌ها");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemoveItem = async (id) => {
    try {
      await axiosInstance.delete(`/api/store/liked-items/${id}/`);
      setWishlist((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError("خطا در حذف از لیست علاقه‌مندی‌ها");
    }
  };

  const handleAddToCart = async (variantId, itemId) => {
    try {
      setAddingToCart(prev => new Set(prev).add(itemId));
      await axiosInstance.post("/api/store/cart/", {
        variant: variantId,
        quantity: 1,
      });
    } catch (err) {
      console.error(err);
      setError("خطا در افزودن به سبد خرید");
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const getFinalPrice = (item) => {
    const basePrice = item.product_variant?.price || 0;
    const promotions = item.product_variant?.product?.promotions || [];
    if (promotions.length > 0 && promotions[0].discount) {
      const discountPercent = promotions[0].discount;
      return Math.round(basePrice * (1 - discountPercent / 100));
    }
    return basePrice;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorMessage}>
        <FiAlertCircle />
        {error}
      </div>
    );
  }

  return (
    <div className={styles.wishlistContainer}>
      <div className={styles.wishlistHeader}>
        <div className={styles.headerTitle}>
          <FiHeart className={styles.headerIcon} />
          <h1>علاقه‌مندی‌ها</h1>
        </div>
        {wishlist.length > 0 && (
          <div className={styles.wishlistCount}>
            {wishlist.length} کالا
          </div>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className={styles.emptyState}>
          <FiHeart className={styles.emptyIcon} />
          <h3>لیست علاقه‌مندی‌های شما خالی است</h3>
          <p>محصولات مورد علاقه خود را اینجا ذخیره کنید</p>
        </div>
      ) : (
        <div className={styles.wishlistList}>
          {wishlist.map((item) => {
            const variant = item.product_variant;
            const product = variant?.product;
            const imgUrl = product?.images?.[0]?.image || "/placeholder.jpg";
            const basePrice = variant?.price || 0;
            const finalPrice = getFinalPrice(item);
            const hasDiscount = finalPrice !== basePrice;
            const isAddingToCart = addingToCart.has(item.id);

            return (
              <div key={item.id} className={styles.wishlistItem}>
                <div className={styles.itemImage}>
                  <Image
                    src={imgUrl}
                    alt={product?.title || "محصول"}
                    width={80}
                    height={80}
                    className={styles.image}
                  />
                </div>

                <div className={styles.itemInfo}>
                  <h3 className={styles.itemTitle}>
                    {product?.title || "محصول"}
                  </h3>
                  
                  <div className={styles.priceSection}>
                    {hasDiscount ? (
                      <div className={styles.priceWrapper}>
                        <span className={styles.oldPrice}>
                          {basePrice.toLocaleString()}
                        </span>
                        <span className={styles.finalPrice}>
                          {finalPrice.toLocaleString()} تومان
                        </span>
                      </div>
                    ) : (
                      <span className={styles.finalPrice}>
                        {basePrice.toLocaleString()} تومان
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.itemActions}>
                  <button
                    className={styles.addToCartButton}
                    onClick={() => handleAddToCart(variant.id, item.id)}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <div className={styles.buttonSpinner}></div>
                    ) : (
                      <FiShoppingCart />
                    )}
                  </button>
                  
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}