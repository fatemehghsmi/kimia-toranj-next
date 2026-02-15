"use client";

import { useState, useEffect } from "react";

import styles from "./ProductDetails.module.css";
import "./ProductDetailsSeo.css";

import axiosInstanceNoRedirect from "@/utils/axiosInstanceNoRedirect";
import { API_URL } from "@/config/config";

import ImageSlider from "@/components/ProductDetails/ImageSlider/ImageSlider";
import ProductTabs from "@/components/ProductDetails/ProductTabs/ProductTabs";
import ProductRating from "@/components/ProductDetails/ProductRating/ProductRating";
import PriceBox from "@/components/ProductDetails/PriceBox/PriceBox";
import IconsBox from "@/components/ProductDetails/IconsBox/IconsBox";
import ReviewForm from "@/components/ProductDetails/ReviewForm/ReviewForm";
import SimilarProducts from "@/components/ProductDetails/SimilarProducts/SimilarProducts";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export default function ProductDetailsClient({ initialProduct }) {
  const router = useRouter();

  const product = initialProduct; // no setProduct needed
  const [likedItems, setLikedItems] = useState([]);
  const [like, setLike] = useState(false);
  const [error, setError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activeTab, setActiveTab] = useState("specs");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const id = product.id;

  // Load liked items
  useEffect(() => {
    axiosInstanceNoRedirect
      .get(`${API_URL}api/store/liked-items/`)
      .then(({ data }) => setLikedItems(data))
      .catch((err) => console.error("Failed to load liked items:", err));
  }, []);

  // Set like state
  useEffect(() => {
    const variantId = product.variants?.[0]?.id;
    setLike(
      Boolean(likedItems.find((li) => li.product_variant.id === variantId))
    );
  }, [likedItems, product.variants]);

  const handleAddToCart = async () => {
    try {
      const variantId = product.variants?.[0]?.id;
      if (!variantId) throw new Error("Variant ID not available");

      await addToCart({
        product,
        variantId,
        price: product.variants?.[0]?.price || 0,
        orderCount: product.order_count || 1,
      });

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      if (err?.response?.status === 401) {
        router.push(
          `/login?next=${encodeURIComponent(
            window.location.pathname + window.location.search
          )}`
        );
        return;
      }
      console.error("Error adding to cart:", err);
      setError("خطا در اضافه کردن به سبد خرید");
    }
  };

  const likeHandler = async () => {
    try {
      const variantId = product.variants?.[0]?.id;
      if (!variantId) return;

      if (like) {
        const likedItem = likedItems.find(
          (li) => li.product_variant.id === variantId
        );
        if (!likedItem) return;

        await axiosInstanceNoRedirect.delete(
          `${API_URL}api/store/liked-items/${likedItem.id}/`
        );
        setLikedItems((prev) => prev.filter((li) => li.id !== likedItem.id));
        setLike(false);
      } else {
        const payload = { product_variant_id: variantId };
        const { data: newLikedItem } = await axiosInstanceNoRedirect.post(
          `${API_URL}api/store/liked-items/`,
          payload
        );
        setLikedItems((prev) => [...prev, newLikedItem]);
        setLike(true);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const variant = product.variants?.[0] || {};

  if (error) {
    return <div className={styles.errorContainer}>خطا: {error}</div>;
  }

  return (
    <div className={styles.productPage}>
      {showSuccessMessage && (
        <div className={styles.successToast}>
          <div className={styles.toastContent}>
            <span>✓</span>
            <p>محصول مورد نظر به سبد خرید اضافه شد</p>
          </div>
        </div>
      )}

      <div className={styles.pageContent}>
        <div className={styles.circle}></div>

        {product.images?.length > 0 && <ImageSlider images={product.images} />}

        <div className={styles.container}>
          <div className={styles.leftSidebar}>
            <PriceBox
              price={variant.price || 0}
              promotions={product.promotions || []}
              onAddToCart={handleAddToCart}
              stock={variant.stock || 0}
              orderCount={product.order_count}
            />
        <IconsBox isLiked={like} onLikeClick={likeHandler} />

          </div>

          <ProductTabs
            product={product}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showAllReviews={showAllReviews}
            setShowAllReviews={setShowAllReviews}
          />
        </div>

        <SimilarProducts productId={id} />
        <ProductRating rating={product.average_rating || 0} />
        <ReviewForm productId={id} />
      </div>
    </div>
  );
}
