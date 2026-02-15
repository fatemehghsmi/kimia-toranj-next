"use client";

import { useState, useEffect } from "react";
import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";

import styles from "./Header.module.css";

export default function Header() {
  return (
    <>
      <div className={styles.headerDesktop}>
        <HeaderDesktop />
      </div>
      <div className={styles.headerMobile}>
        <HeaderMobile />
      </div>
    </>
  );
}
