// components/ArticleCarousel.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./ArticleCarousel.module.css";

// داده‌های مقالات
const posts = [
  {
    id: 1,
    slug: "Enlivening-your-home-with-iranian-arts-and-crafts",
    title: "زنده کردن فضای خانه با هنر و صنایع دستی ایرانی",
    excerpt: "صنایع دستی ایرانی فقط یک شیء تزئینی نیستند؛ هر کدام یک سفیر فرهنگی‌اند که روح هنر و مهارت نسل‌های گذشته را به فضای زندگی امروزی منتقل می‌کنند...",
    image: "/images/post2/khatam-esfahan.webp",
  },
  {
    id: 2,
    slug: "Isfahan-Handicrafts-A-lasting-legacy-from-the-heart-of-Iranian-history",
    title: "صنایع دستی اصفهان؛ میراثی ماندگار از دل تاریخ ایران",
    excerpt: "اصفهان، نگین درخشان فلات ایران، نه تنها به معماری بی‌نظیر و آثار تاریخی‌اش شهرت دارد، بلکه به عنوان مهد صنایع دستی ایران نیز شناخته می‌شود...",
    image: "/images/post2/qalamzani-esfahan.webp",
  },
  {
    id: 3,
    slug: "The-art-of-calligraphy-and-inlay-work-masterpieces-of-Isfahan-handicrafts",
    title: "هنر قلم‌زنی و خاتم‌کاری؛ شاهکارهای صنایع دستی اصفهان",
    excerpt: "اصفهان، نگین درخشان ایران، نه تنها به معماری و آثار تاریخی بی‌نظیرش معروف است، بلکه خاستگاه برخی از ارزشمندترین صنایع دستی ایران نیز محسوب می‌شود...",
    image: "/images/post3/qalamzani-khatam-products-3.webp",
  },
  {
    id: 4,
    slug: "a-guide-to-buying-a-brass-fruit-bowl-a-stylish-choice-for-home-decoration",
    title: "راهنمای خرید میوه‌خوری برنجی؛ انتخابی شیک برای دکوراسیون خانه",
    excerpt: "از دیرباز تا امروز، ظروف پذیرایی در خانه‌های ایرانی نقش مهمی در فرهنگ و مهمان‌نوازی داشته‌اند. وقتی صحبت از سفره و میز پذیرایی می‌شود...",
    image: "/images/post4/brass-fruit-bowl-3.webp",
  },
  {
    id: 5,
    slug: "Golden-products-the-magic-of-calligraphy-and-inlay-art-in-modern-Iranian-life",
    title: "محصولات زرینه خاتم اصفهان | خرید از فروشگاه کیمیا ترنج",
    excerpt: "محصولات زرینه خاتم قلم‌زنی اصفهان، با تلفیق دو هنر اصیل ایرانی، جلوه‌ای بی‌نظیر و لوکس به محیط زندگی می‌بخشند و حس ایرانی بودن و احترام به هنر سنتی را منتقل می‌کنند.",
    image: "/images/post5/golden-product-1.webp",
  },
  {
    id: 6,
    slug: "Brass-Products-The-Shine-of-Authenticity-in-Iranian-Home",
    title: "محصولات برنجی دست‌ساز اصفهان | خرید از کیمیا ترنج",
    excerpt:
      "در هر گوشه‌ای از خانه‌های اصیل ایرانی، نشانی از هنر و فرهنگ کهن به چشم می‌خورد؛ از فرش دست‌باف تا ظروف مسی و برنجی.",
    image: "/images/post6/brass-product-2.webp",
  },
];

const ArticleCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [slides, setSlides] = useState([]);
  const [totalSlides, setTotalSlides] = useState(0);

  // تشخیص دستگاه موبایل و محاسبه اسلایدها
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // محاسبه اسلایدها بر اساس دستگاه
      const itemsPerSlide = mobile ? 1 : 2;
      const total = Math.ceil(posts.length / itemsPerSlide);
      
      // ایجاد اسلایدها
      const newSlides = [];
      for (let i = 0; i < total; i++) {
        const startIndex = i * itemsPerSlide;
        const endIndex = startIndex + itemsPerSlide;
        const slidePosts = posts.slice(startIndex, endIndex);
        newSlides.push(slidePosts);
      }
      
      setSlides(newSlides);
      setTotalSlides(total);
      
      // اگر currentSlide از محدوده خارج شد، اصلاح کن
      if (currentSlide >= total && total > 0) {
        setCurrentSlide(total - 1);
      }
    };

    // بررسی اولیه
    checkMobile();
    
    // اضافه کردن event listener برای resize
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [currentSlide]);

  // رفتن به اسلاید بعدی
  const nextSlide = () => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // رفتن به اسلاید قبلی
  const prevSlide = () => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // رفتن به اسلاید مشخص
  const goToSlide = (index) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  };

  // اتوپلی کاروسل
  useEffect(() => {
    if (!isAutoPlaying || totalSlides <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying, totalSlides]);

  // توقف اتوپلی هنگام هاور
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  // اگر مقاله‌ای وجود ندارد، کامپوننت را نمایش نده
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section 
      className={styles.carouselSection}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>مقالات منتخب</h2>
        
        <div className={styles.carouselWrapper}>
          {/* دکمه قبلی - همیشه سمت چپ */}
          {totalSlides > 1 && (
            <button 
              className={`${styles.carouselBtn} ${styles.prevBtn}`}
              onClick={prevSlide}
              aria-label="مقاله قبلی"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {/* دکمه بعدی - همیشه سمت راست */}
          {totalSlides > 1 && (
            <button 
              className={`${styles.carouselBtn} ${styles.nextBtn}`}
              onClick={nextSlide}
              aria-label="مقاله بعدی"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {/* کاروسل */}
          <div className={styles.carousel}>
            <div 
              className={styles.carouselTrack}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slidePosts, slideIndex) => (
                <div 
                  key={slideIndex} 
                  className={`${styles.carouselSlide} ${
                    !isMobile && slidePosts.length === 1 ? styles.singleItemSlide : ''
                  }`}
                >
                  {slidePosts.map((post) => (
                    <Link
                      href={`/post/${post.slug}`}
                      key={post.id}
                      className={styles.articleCard}
                    >
                      <div className={styles.cardImageWrapper}>
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className={styles.cardImage}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className={styles.imageOverlay}></div>
                      </div>
                      <div className={styles.cardContent}>
                        <h3 className={styles.cardTitle}>{post.title}</h3>
                        <p className={styles.cardExcerpt}>{post.excerpt}</p>
                        <span className={styles.readMore}>مطالعه مقاله</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* نشانگرهای اسلاید */}
        {totalSlides > 1 && (
          <div className={styles.carouselIndicators}>
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${currentSlide === index ? styles.active : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`رفتن به اسلاید ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticleCarousel;