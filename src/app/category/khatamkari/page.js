import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import FooterMenu from "@/components/FooterMenu/FooterMenu";
import styles from "./Khatamkari.module.css";
import Link from "next/link";
import Image from "next/image";

const API_URL = "https://api.kimiatoranj.com/";

export const metadata = {
  title: "خاتمکاری اصل اصفهان | خرید اینترنتی از کیمیا ترنج",
  description:
    "فروش انواع آثار خاتمکاری دست‌ساز، شامل جعبه، قاب، ست پذیرایی و هدیه‌های هنری. هنر اصیل ایرانی را از کیمیا ترنج تجربه کنید. ارسال تضمینی.",
};

export default async function KhatamkariPage() {
  // Fetch all collections
  const res = await fetch(`${API_URL}api/store/collections/`, {
    cache: "force-cache", // build-time cache
  });

  const allCollections = res.ok ? await res.json() : [];
  // Filter only subcollections of Khatamkari (parent = 8)
  const subCollections = allCollections.filter((c) => c.parent === 8);

  return (
    <>
      <Header />

      <div className={styles.pageContainer}>
        <h1 className={styles.title}>محصولات خاتم کاری کیمیاترنج</h1>

        <div className={styles.collectionsRow}>
          {subCollections.map((collection) => {
            const href = collection.landing_page_url
              ? `/category/${collection.landing_page_url}`
              : `/shop?collection=${encodeURIComponent(collection.title)}`;

            return (
              <Link
                href={href}
                key={collection.id}
                className={styles.collectionCard}
              >
                <Image
                  src={collection.image || "/placeholder.jpg"}
                  alt={collection.title}
                  width={400}
                  height={300}
                  className={styles.collectionImage}
                  unoptimized
                />
                <div className={styles.overlay}>
                  <h3 className={styles.description}>
                    {collection.description || collection.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
        <div className={styles.seoSection}>
          <h2>خرید محصولات خاتمکاری اصفهان | ترکیب هنر، ظرافت و اصالت</h2>

          <p>
            خاتمکاری یکی از زیباترین و ظریف‌ترین هنرهای صنایع‌دستی ایران است؛
            هنری که با کنار هم نشاندن قطعات ریز چوب، فلز و استخوان، آثاری
            خیره‌کننده می‌آفریند. محصولات خاتمکاری، ترکیبی بی‌نظیر از دقت، صبر و
            هنر ایرانی هستند؛ از جعبه‌های خاتم گرفته تا قاب آینه، میز، قلمدان و
            سرویس‌های پذیرایی. در این صفحه، مجموعه‌ای از نفیسترین آثار خاتمکاری
            شده توسط هنرمندان اصفهانی را می‌توانید ببینید و خریداری کنید. آثاری
            کاربردی، تزئینی و ماندگار، مناسب برای هدیه، دکوراسیون و تکمیل
            جهیزیه.
          </p>

          <h2>انواع محصولات خاتمکاری موجود در فروشگاه کیمیا ترنج</h2>

          <p>
            ما در فروشگاه کیمیا ترنج تنوع کاملی از محصولات خاتمکاری را با
            سلیقه‌های مختلف آماده کرده‌ایم:
          </p>

          <h3>جعبه‌های خاتمکاری</h3>
          <p>برای جواهرات، قرآن، چای، و یا هدیه. ترکیبی از هنر و کارایی.</p>

          <h3>آینه و شمعدان خاتم</h3>
          <p>مناسب سفره عقد یا دکوراسیون سنتی با جلوه‌ای هنرمندانه و اصیل.</p>

          <h3>ست‌های پذیرایی خاتمکاری</h3>
          <p>شامل سینی، قندان، شکلات‌خوری و سایر ظروف، زیبا و بادوام.</p>

          <h3>قاب و تابلو خاتم</h3>
          <p>
            قاب‌های خوشنویسی، تزئین شده با خاتم، مناسب دفاتر رسمی و منازل
            کلاسیک.
          </p>

          <h2>ویژگی‌ها و مزایای خاتمکاری اصیل ایرانی</h2>

          <ul>
            <li>
              <strong>ظرافت بی‌نظیر:</strong>
              استفاده از قطعات ریز چوب، فلز و استخوان با نظم هندسی دقیق.
            </li>
            <li>
              <strong>هنر دست:</strong>
              تمام مراحل با دستان هنرمندان خبره انجام می‌شود.
            </li>
            <li>
              <strong>دوام بالا:</strong>
              با رعایت نکات نگهداری، محصولات خاتمکاری سال‌ها ماندگار می‌مانند.
            </li>
            <li>
              <strong>نماد فرهنگ ایرانی:</strong>
              حضور در موزه‌ها، کاخ‌ها و خانه‌های اصیل ایرانی.
            </li>
          </ul>

          <h2>خاتمکاری؛ هنر نجیب و درخشان اصفهان</h2>

          <p>
            محصولات خاتمکاری نه‌فقط برای تزئین، بلکه برای انتقال حس اصالت و سنت
            به محیط زندگی طراحی شده‌اند.
          </p>

          <p>
            چه برای پذیرایی باشد، چه برای ویترین یا هدیه دادن، یک اثر خاتمکاری
            همیشه حرفی برای گفتن دارد.
          </p>

          <p>خانه‌ات را با ظرافت بی‌زمان خاتم، گرم‌تر و اصیل‌تر کن.</p>

          <h2>راهنمای خرید خاتمکاری از فروشگاه کیمیا ترنج</h2>

          <ul>
            <li>
              <strong>اندازه و کاربرد:</strong>
              جعبه بزرگ یا کوچک؟ قاب یا ست کامل؟
            </li>
            <li>
              <strong>طرح و سبک:</strong>
              کلاسیک یا ترکیبی با هنرهای دیگر مثل مینا یا میکرو خاتم؟
            </li>
            <li>
              <strong>جنس و کیفیت مواد اولیه:</strong>
              هرچه ریزتر و متراکم‌تر، خاتم باارزش‌تر است.
            </li>
            <li>
              <strong>هدیه دادن؟</strong>
              حتماً مدل‌هایی با جعبه و بسته‌بندی شیک را بررسی کنید.
            </li>
            <li>
              <strong>ارسال امن و تضمینی:</strong>
              تمام محصولات کیمیا ترنج با بسته‌بندی ایمن و ضمانت اصالت ارسال
              می‌شوند.
            </li>
          </ul>
          <h2>سؤالات متداول درباره خاتمکاری</h2>

          <h3>محصولات خاتمکاری فقط تزئینی هستن؟</h3>
          <p>
            نه لزوماً. بسیاری از آن‌ها کاملاً کاربردی هستند (مثالً جعبه چای،
            قندان یا سینی) و علاوه بر زیبایی، استفاده روزمره هم دارند.
          </p>

          <h3>آیا خاتمکاری پوسته‌پوسته یا خراب میشه؟</h3>
          <p>
            در صورت نگهداری درست (دوری از رطوبت و ضربه)، بسیار بادوام و ماندگار
            است.
          </p>

          <h3>محصولات شما ساخت ایران هستن؟</h3>
          <p>
            بله. تمامی محصولات خاتمکاری فروشگاه کیمیا ترنج ساخت دست هنرمندان
            اصفهانی هستند.
          </p>
        </div>
      </div>
      <FooterMenu />
      <Footer />
    </>
  );
}
