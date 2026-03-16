"use client";

import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { InvoiceDocument } from "@/lib/pdf/components/InvoiceDocument";
import type { InvoiceData } from "@/lib/pdf/types/invoice.types";

export default function PDFPreview({ data }: { data: InvoiceData }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Loading PDF Viewer...
      </div>
    );
  }

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
        <InvoiceDocument data={data} />
      </PDFViewer>
    </div>
  );
}
