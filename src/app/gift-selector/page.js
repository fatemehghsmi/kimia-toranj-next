"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./GiftSelector.module.css";
import Header from "@/components/Header/Header";

export default function GiftSelector() {
  const priceRanges = [
    { label: "کمتر از یک میلیون", min: 0, max: 1000000 },
    { label: "از یک تا پنج میلیون", min: 1000000, max: 5000000 },
    { label: "از پنج تا ده میلیون", min: 5000000, max: 10000000 },
    { label: "بالاتر از ده میلیون", min: 10000000, max: "max" },
  ];

  const [selectedRange, setSelectedRange] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRange) return;

    const range = priceRanges.find((r) => r.label === selectedRange);
    if (range) {
      let query = `?min_price=${range.min}`;
      if (range.max !== "max") {
        query += `&max_price=${range.max}`;
      }
      // ✅ Navigate with Next.js router
      router.push(`/shop${query}`);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.header}>کادو چی بخرم؟</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {priceRanges.map((range) => (
            <div key={range.label} className={styles.radioOption}>
              <input
                type="radio"
                id={range.label}
                name="priceRange"
                value={range.label}
                onChange={(e) => setSelectedRange(e.target.value)}
              />
              <label htmlFor={range.label}>{range.label}</label>
            </div>
          ))}
          <button type="submit" className={styles.submitButton}>
            تایید 
          </button>
        </form>
      </div>
    </>
  );
}
