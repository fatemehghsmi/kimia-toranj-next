import React from "react";
import styles from "./ProductCardSkeleton.module.css";

export default function ProductCardSkeleton() {
  return (
    <div className={styles.card}>
      {/* Image skeleton with aspect ratio */}
      <div className={styles.imageWrapper}>
        <div className={styles.image} />
      </div>
      
      {/* Title lines (2 lines like real product card) */}
      <div className={styles.titleSection}>
        <div className={styles.textLine} />
        <div className={styles.textLineShort} />
      </div>
      
      {/* Info row (stock/promo) */}
      <div className={styles.infoRow}>
        <div className={styles.infoLine} />
      </div>
      
      {/* Price button */}
      <div className={styles.priceSection}>
        <div className={styles.price} />
      </div>
    </div>
  );
}