import Link from "next/link";
import styles from "./PaymentSuccess.module.css";

export default function PaymentSuccess({ searchParams }) {
  const refId = searchParams.ref || null;

  return (
    <div className={styles.successContainer}>
      <div className={styles.card}>
        <h2>✅ پرداخت موفق</h2>
        <p className={styles.message}>
          سفارش شما با موفقیت ایجاد شد.
          {refId && (
            <>
              {" "}
              کد پیگیری: <strong>{refId}</strong>
            </>
          )}
        </p>
        <p className={styles.subText}>
          می‌توانید جزئیات سفارش خود را در پنل کاربری مشاهده کنید.
        </p>

        {/* New info completion notice */}
        <p className={styles.warningText}>
          لطفاً اطلاعات حساب کاربری خود را تکمیل کنید تا در ارسال سفارش شما مشکلی پیش نیاید.
        </p>
        <Link
          href="/user-panel/account-info"
          className={`${styles.btn} ${styles.secondaryBtn}`}
        >
          تکمیل اطلاعات حساب
        </Link>

        {/* Existing orders link */}
        <Link href="/user-panel/orders" className={styles.btn}>
          مشاهده سفارش‌ها
        </Link>
      </div>
    </div>
  );
}
