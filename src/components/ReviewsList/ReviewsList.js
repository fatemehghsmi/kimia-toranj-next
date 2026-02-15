"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { FiMessageSquare, FiStar, FiCalendar, FiAlertCircle, FiShoppingBag } from "react-icons/fi";
import styles from "./ReviewsList.module.css";

export default function ReviewsList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axiosInstance.get("/api/store/reviews/");
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("خطا در دریافت دیدگاه‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar
        key={index}
        className={`${styles.star} ${index < rating ? styles.filled : ''}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>در حال بارگذاری دیدگاه‌ها...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorMessage}>
        <FiAlertCircle />
        <div className={styles.errorContent}>
          <span>{error}</span>
          <button onClick={fetchReviews} className={styles.retryButton}>
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className={styles.emptyState}>
        <FiMessageSquare className={styles.emptyIcon} />
        <h3>هنوز دیدگاهی ثبت نکرده‌اید</h3>
        <p>می‌توانید پس از خرید محصولات، دیدگاه خود را ثبت کنید</p>
        <a href="/shop" className={styles.ctaButton}>
          <FiShoppingBag />
          مشاهده محصولات
        </a>
      </div>
    );
  }

  return (
    <div className={styles.reviewsContainer}>
      <div className={styles.reviewsHeader}>
        <div className={styles.headerTitle}>
          <FiMessageSquare className={styles.headerIcon} />
          <h1>دیدگاه‌های شما</h1>
        </div>
        {reviews.length > 0 && (
          <div className={styles.reviewsCount}>
            {reviews.length} دیدگاه
          </div>
        )}
      </div>

      <div className={styles.reviewsList}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>
                  {review.product_title || review.product}
                </h3>
                <div className={styles.rating}>
                  {renderStars(review.rating)}
                  <span className={styles.ratingNumber}>({review.rating})</span>
                </div>
              </div>
              <div className={styles.reviewDate}>
                <FiCalendar />
                {new Date(review.created_at).toLocaleDateString("fa-IR")}
              </div>
            </div>
            
            <div className={styles.reviewContent}>
              <p>{review.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}