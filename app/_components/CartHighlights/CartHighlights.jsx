"use client";

import React, { useState } from "react";
import styles from "./CartHighlights.module.css";

const CartHighlights = ({ highlights, maxLength = 30 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!highlights || highlights.length === 0) return null;

  // Format: "Espresso Roast, Filter Grind"
  // Handles both [{items: [{point: '...'}]}] and potentially flattened structures
  const highlightsText = highlights
    .map((h) => {
      if (h.items && Array.isArray(h.items)) {
        return h.items.map((i) => i.point).join(", ");
      }
      return h.point || "";
    })
    .filter(Boolean)
    .join(", ");

  if (!highlightsText) return null;

  const shouldTruncate = highlightsText.length > maxLength;
  const displayText =
    shouldTruncate && !isExpanded
      ? highlightsText.slice(0, maxLength) + "..."
      : highlightsText;

  return (
    <div className={styles.HighlightsContainer}>
      <p
        className={styles.HighlightsText}
        onClick={(e) => {
          if (shouldTruncate) {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }
        }}
        style={{ cursor: shouldTruncate ? "pointer" : "default" }}
      >
        {displayText}
        {isExpanded && (
          <span className={styles.ViewLessBtn}> View less</span>
        )}
      </p>
    </div>
  );
};

export default CartHighlights;
