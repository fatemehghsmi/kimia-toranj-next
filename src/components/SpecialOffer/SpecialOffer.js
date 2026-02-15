// src/components/SpecialOffer/SpecialOffer.jsx
import Image from "next/image";
import styles from "./SpecialOffer.module.css";
import { toPersianDigits } from "@/utils/faDigits";

export default function SpecialOffer() {
  // numeric values
  const price = 113000000;
  const plateDiameter = 50;
  const bowlDiameter = 34;
  const bowlHeight = 23;

  return (
    <div className={styles.container}>
      {/* Right side */}
      <div className={styles.rightDiv}>
        <h2 className={styles.title}>کاسه بشقاب لاله</h2>
        <p className={styles.description}>
          <span>
            کار فاخر و خاص، جنس محصول برنج ضخیم، قلمزنی صورت با روکش قلع، دور
            رنگ کارشده و تماما دست ساز، دارای شناسنامه
          </span>
          <span>
            قطر بشقاب {toPersianDigits(plateDiameter)} سانتی‌متر، دهانه کاسه{" "}
            {toPersianDigits(bowlDiameter)} سانتی‌متر، ارتفاع{" "}
            {toPersianDigits(bowlHeight)} سانتی‌متر
          </span>
        </p>
        <div className={styles.priceContainer}>
          <button className={styles.price}>
            {toPersianDigits(price.toLocaleString("en-US"))} تومان
          </button>
          <button className={styles.addtocard}>افزودن به سبد خرید</button>
        </div>
      </div>

      {/* Left side */}
      <div className={styles.leftDiv}>
        <Image
          src="/special.png" // place special.png in /public
          alt="کاسه بشقاب لاله"
          className={styles.img}
          width={400}
          height={400}
          priority
        />
        <div className={styles.attrContainer}>
          <div className={styles.attr1}>قلم {toPersianDigits("صورت")}</div>
          <div className={styles.attr2}>
            قطر {toPersianDigits(plateDiameter)} cm
          </div>
          <div className={styles.attr3}>نقش و نگار زیبا</div>
        </div>
      </div>
    </div>
  );
}
