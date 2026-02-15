"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoHomeOutline,
  IoBagOutline,
  IoCartOutline,
  IoPersonOutline,
} from "react-icons/io5";
import styles from "./FooterMenu.module.css";
import axiosInstanceNoRedirect from "@/utils/axiosInstanceNoRedirect";
import { useCartStore } from "@/store/cartStore";

const FooterMenu = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  const cartCount = useCartStore((state) => state.cartCount());
  const fetchCartFromBackend = useCartStore(
    (state) => state.fetchCartFromBackend
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstanceNoRedirect.get("api/store/customer/me/");
        if (res.status === 200 && res.data) {
          setIsLoggedIn(true);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };

    fetchCartFromBackend();
    checkAuth();
  }, [fetchCartFromBackend]);

  return (
    <div className={styles.container}>
      <ul className={styles.footerul}>
        <li>
          <Link
            href="/"
            className={`${styles.footerLink} ${
              pathname === "/" ? styles.active : ""
            }`}
          >
            <IoHomeOutline size={24} />
            <span>خانه</span>
          </Link>
        </li>
        <li>
          <Link
            href="/shop"
            className={`${styles.footerLink} ${
              pathname.startsWith("/shop") ? styles.active : ""
            }`}
          >
            <IoBagOutline size={24} />
            <span>فروشگاه</span>
          </Link>
        </li>
        <li>
          <Link
            href="/user-panel/cart"
            className={`${styles.footerLink} ${
              pathname.startsWith("/user-panel/cart") ? styles.active : ""
            }`}
          >
            <div className={styles.iconWrapper}>
              <IoCartOutline size={24} />
              {cartCount > 0 && (
                <span className={styles.badge}>{cartCount}</span>
              )}
            </div>
            <span>سبد خرید</span>
          </Link>
        </li>
        <li>
          <Link
            href={isLoggedIn ? "/user-panel" : "/login"}
            className={`${styles.footerLink} ${
              pathname.startsWith("/user-panel") ||
              pathname.startsWith("/login")
                ? styles.active
                : ""
            }`}
          >
            <IoPersonOutline size={24} />
            <span>{isLoggedIn ? "پنل کاربری" : "ورود"}</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default FooterMenu;
