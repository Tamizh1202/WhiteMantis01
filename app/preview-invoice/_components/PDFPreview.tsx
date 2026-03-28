"use client";

import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";

// Import all 4 specialized documents from your lib folder
import { SubOneTime } from "@/lib/pdf/components/SubOneTime";
import { SubscriptionInvoice } from "@/lib/pdf/components/SubscriptionInvoice";
import { TakeAwayInvoice } from "@/lib/pdf/components/TakeAwayInvoice";
import { DineInInvoice } from "@/lib/pdf/components/DineInInvoice";

import type { InvoiceData } from "@/lib/pdf/types/invoice.types";

// We add 'type' to the props to handle your 4 different routes
interface PDFPreviewProps {
  data: InvoiceData;
  // Ensure all these strings match your folder names and switch cases
  type: "subscription" | "subOneTime" | "takeAway" | "dineIn" | "order";
}

export default function PDFPreview({ data, type }: PDFPreviewProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>
        Preparing {type} Invoice...
      </div>
    );
  }

  // This function decides which file from /lib/pdf/components to show
  const renderSelectedDocument = () => {
    switch (type) {
      case "subscription":
        return <SubscriptionInvoice data={data} />;

      case "subOneTime":
        return <SubOneTime data={data} />;

      case "dineIn":
        return <DineInInvoice data={data} />; // IT NOW USES THE REAL FILE

      case "takeAway":
        return <TakeAwayInvoice data={data} />;
      case "order":
      default:
        return <SubOneTime data={data} />;
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 90px)",
        marginTop: "90px",
        overflow: "hidden",
      }}
    >
      <PDFViewer style={{ width: "100%", height: "100%", border: "none" }}>
        {renderSelectedDocument()}
      </PDFViewer>
    </div>
  );
}