import Link from "next/link";
import styles from "./PaymentFailure.module.css";

export default function PaymentFailure({ searchParams }) {
  const errorMsg = searchParams.error || null;

  return (
    <div className={styles.failureContainer}>
      <div className={styles.card}>
        <h2>❌ پرداخت ناموفق</h2>
        <p className={styles.message}>متأسفانه پرداخت شما انجام نشد.</p>

        {errorMsg && (
          <p className={styles.errorDetail}>
            خطا: {decodeURIComponent(errorMsg)}
          </p>
        )}

        <p className={styles.subText}>
          اگر وجهی از حساب شما کسر شده، ممکن است طی ۷۲ ساعت کاری بازگردد.
        </p>

        <Link href="/checkout" className={styles.btn}>
          تلاش مجدد
        </Link>
      </div>
    </div>
  );
}
