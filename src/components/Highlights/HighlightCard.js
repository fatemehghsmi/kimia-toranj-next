import Link from "next/link";
import Image from "next/image";
import styles from "./HighlightCard.module.css";

export default function HighlightCard({ highlight }) {
  return (
    <Link
      href={`/highlight/${highlight.id}`}
      className={styles.cardLink}
      aria-label={highlight.title}
    >
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            <Image
              src={highlight.cover_image || "/placeholder.jpg"} // put placeholder.jpg in /public
              alt={highlight.title}
              className={styles.image}
              width={300} // adjust to your design
              height={200}
              loading="lazy"
              unoptimized
            />
          </div>
        </div>
        <h2 className={styles.title}>{highlight.title}</h2>
      </div>
    </Link>
  );
}
