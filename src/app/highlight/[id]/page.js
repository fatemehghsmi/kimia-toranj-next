"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./HighlightMedia.module.css";
import { IoClose } from "react-icons/io5";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import {PuffLoader} from 'react-spinners'

export default function HighlightMedia({ params }) {
  const { id } = params; // ✅ Next.js gives params directly
  const router = useRouter();

  const [allHighlight, setAllHighlight] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    async function fetchAll() {
      try {
        const resp = await fetch(
          "https://kimiatoranj-api.liara.run/api/highlights/highlights/"
        );
        if (!resp.ok) throw new Error("Network response was not ok");
        const data = await resp.json();
        setAllHighlight(data);

        const idx = data.findIndex((h) => h.id === +id);
        setCurrentHighlightIndex(idx >= 0 ? idx : 0);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  const goToNextMedia = () => {
    const curr = allHighlight[currentHighlightIndex];
    if (currentMediaIndex < curr.media.length - 1) {
      setCurrentMediaIndex((p) => p + 1);
    } else {
      setCurrentHighlightIndex((p) =>
        p < allHighlight.length - 1 ? p + 1 : 0
      );
      setCurrentMediaIndex(0);
    }
    setProgressKey((p) => p + 1);
  };

  const goToPreviousMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex((p) => p - 1);
    } else {
      const prevIdx =
        currentHighlightIndex > 0
          ? currentHighlightIndex - 1
          : allHighlight.length - 1;
      const prev = allHighlight[prevIdx];
      setCurrentHighlightIndex(prevIdx);
      setCurrentMediaIndex(prev.media.length - 1);
    }
    setProgressKey((p) => p + 1);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <PuffLoader color="#ffed00" size={65} />
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;
  if (!allHighlight.length) return <div>No highlights found.</div>;

  const currentHighlight = allHighlight[currentHighlightIndex];
  const currentMedia = currentHighlight.media[currentMediaIndex];

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        {/* Close */}
        <button onClick={() => router.push("/")} className={styles.closeButton}>
          <IoClose />
        </button>

        {/* Title */}
        <h2 className={styles.title}>{currentHighlight.title}</h2>

        {/* Media & nav */}
        <div className={styles.mediaContainer}>
          <button
            onClick={goToPreviousMedia}
            className={`${styles.navButton} ${styles.prevButton}`}
          >
            <GrFormPrevious className={styles.navIcon} />
          </button>

          <div className={styles.mediaItem}>
            {currentMedia.aparat_url ? (
              <div className={styles.aparatWrapper}>
                <span className={styles.ratio} />
                <iframe
                  src={currentMedia.aparat_url}
                  frameBorder="0"
                  allowFullScreen
                  className={styles.aparatIframe}
                />
              </div>
            ) : (
              <img
                src={currentMedia.media_file}
                alt={currentHighlight.title}
                className={styles.mediaImage}
              />
            )}
          </div>

          <button
            onClick={goToNextMedia}
            className={`${styles.navButton} ${styles.nextButton}`}
          >
            <GrFormNext className={styles.navIcon} />
          </button>
        </div>

        {/* Dots */}
        <div className={styles.highlightIndicator}>
          {allHighlight.map((_, i) => (
            <span
              key={i}
              className={`${styles.indicatorDot} ${
                i === currentHighlightIndex ? styles.active : ""
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
