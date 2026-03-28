"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import { downloadInvoice } from "@/lib/pdf/utils/downloadInvoiceClient";

export default function Invoice({ order }) {
  const [downloading, setDownloading] = useState(false);

  if (!order) return null;

  const handleDownload = async () => {
    setDownloading(true);
    const type = order.origin === "app" ? "app-order" : "order";
    await downloadInvoice(type, order.id);
    setDownloading(false);
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <h1>Get invoice for your shipment </h1>
        <button
          style={{
            cursor: downloading ? "not-allowed" : "pointer",
            opacity: downloading ? 0.7 : 1,
          }}
          disabled={downloading}
          onClick={handleDownload}
        >
          {downloading ? "Downloading..." : "Download Invoice"}
        </button>
      </div>
    </div>
  );
}
