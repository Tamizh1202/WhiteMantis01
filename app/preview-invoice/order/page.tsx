"use client";
import React from "react";
import dynamic from "next/dynamic";
import type { InvoiceData } from "@/lib/pdf/types/invoice.types";

const PDFPreview = dynamic(() => import("../_components/PDFPreview"), {
  ssr: false,
});

const dummyOrderData: InvoiceData = {
  metadata: {
    invoiceNumber: "INV-ORD-12345",
    invoiceDate: "14 Mar 2026",
    orderNumber: "12345",
    paymentMethod: "Credit Card",
    transactionId: "ch_123456789",
  },
  company: {
    name: "White Mantis",
    logo: "/logo.png",
    address: "Shop 12, Al Wasl Road, Jumeirah 1",
    city: "Dubai",
    state: "Dubai",
    postcode: "UAE — P.O. Box 73401",
    country: "UAE",
    email: "billing@whitemantis.ae",
    phone: "+971 4 000 0000",
    website: "www.whitemantis.ae",
    taxId: "TRN: 100123456700003",
  },
  billTo: {
    first_name: "John",
    last_name: "Doe",
    address_1: "123 Main St",
    city: "Dubai",
    state: "Dubai",
    country: "UAE",
    postcode: "00000",
    email: "john@example.com",
    phone: "+971 50 123 4567",
  },
  lineItems: [
    {
      id: 1,
      name: "Premium Coffee Beans",
      quantity: 2,
      price: 75,
      subtotal: 150,
      total: 150,
      tax: 0,
      sku: "COF-001",
    },
    {
      id: 2,
      name: "Espresso Blend",
      quantity: 1,
      price: 80,
      subtotal: 80,
      total: 80,
      tax: 0,
      sku: "COF-002",
    },
  ],
  subtotal: 230,
  tax: 11.5,
  taxLabel: "VAT tax",
  shipping: 10,
  discount: 20,
  couponDiscount: 10,
  beansDiscount: 10,
  discountLabel: "Discounts",
  total: 231.5,
  currency: "AED",
  currencySymbol: "AED",
  terms: "White Mantis Coffee LLC — Dubai, UAE\nTerms & Condition",
  type: "order",
};

export default function PreviewOrderPage() {
  return (
    <main>
      <PDFPreview data={dummyOrderData} />
    </main>
  );
}
