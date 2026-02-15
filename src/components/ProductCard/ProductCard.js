import Link from "next/link";
import Image from "next/image";
import styles from "./ProductCard.module.css";
import { formatPrice } from "@/utils/formatPrice";
import { toPersianDigits } from "@/utils/faDigits";

export default function ProductCard({ product }) {
  const productLink = `/product/${product.url_title}-${product.id}`;
  const variant = product.variants?.[0] || {};
  const stock = variant.stock ?? 0;

  // Safe promotions array
  const promotions = Array.isArray(product.promotions)
    ? product.promotions
    : [];
  const hasPromotion = promotions.length > 0;
  const discountPercent = hasPromotion ? promotions[0]?.discount ?? 0 : 0;

  const discountedPrice =
    hasPromotion && variant.price
      ? Math.round(variant.price * (1 - discountPercent / 100))
      : variant.price ?? 0;

  const imageSrc =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0].image
      : "/placeholder.jpg"; // fallback

  return (
    <Link
      href={productLink}
      className={styles.cardLink}
      aria-label={`مشاهده ${product.title}`}
    >
      <div className={styles.card}>
        {/* Image wrapper enforces aspect ratio */}
        <div className={styles.imgWrapper}>
          <Image
            src={imageSrc}
            alt={product.title}
            className={styles.img}
            fill
            sizes="(max-width: 768px) 100vw, 250px"
            loading="lazy"
            unoptimized
          />
        </div>

        {/* Title */}
        <h2 className={styles.title}>{toPersianDigits(product.title)}</h2>

        {/* Info row: stock OR promotion OR empty placeholder */}
        <div className={styles.infoRow}>
          {stock > 0 && stock < 4 ? (
            <span className={styles.stock}>
              تنها {toPersianDigits(stock)} عدد در انبار باقی مانده
            </span>
          ) : hasPromotion ? (
            <span className={styles.discountBadge}>
              {toPersianDigits(discountPercent)}٪ تخفیف
            </span>
          ) : (
            <span style={{ visibility: "hidden" }}>placeholder</span>
          )}
        </div>

        {/* Price / Call to action */}
        {stock > 0 ? (
          <div className={styles.priceWrapper}>
            {hasPromotion && variant.price && (
              <span className={styles.oldPrice}>
                {formatPrice(variant.price)} تومان
              </span>
            )}
            <button className={styles.price}>
              {formatPrice(discountedPrice)} تومان
            </button>
          </div>
        ) : (
          <button className={styles.callButton} disabled>
            تماس بگیرید
          </button>
        )}
      </div>
    </Link>
  );
}
