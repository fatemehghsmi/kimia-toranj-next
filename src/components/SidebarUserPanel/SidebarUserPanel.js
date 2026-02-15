"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SidebarUserPanel.module.css";

const items = [
  { to: "/user-panel/account-info", label: "اطلاعات حساب" },
  { to: "/user-panel/cart", label: "سبد خرید" },
  { to: "/user-panel/orders", label: "سفارش‌ها" },
  { to: "/user-panel/wishlist", label: "علاقه‌مندی‌ها" },
  { to: "/user-panel/reviews", label: "دیدگاه‌ها" },
  { to: "/user-panel/addresses", label: "آدرس‌ها" },
];

export default function SidebarUserPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="منوی کاربری"
      >
        منوی کاربری
      </button>

      <nav className={`${styles.sidebarNav} ${isOpen ? styles.open : ""}`}>
        {items.map(({ to, label }) => (
          <Link
            key={to}
            href={to}
            className={`${styles.link} ${pathname === to ? styles.active : ""}`}
            onClick={() => setIsOpen(false)}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
