"use client";
import React from "react";
import dynamic from "next/dynamic";
import type { InvoiceData } from "@/lib/pdf/types/invoice.types";

const PDFPreview = dynamic(() => import("../_components/PDFPreview"), {
  ssr: false,
});

const dummySubscriptionData: InvoiceData = {
  metadata: {
    invoiceNumber: "INV-SUB-98765",
    invoiceDate: "January 1, 2020",
    subscriptionNumber: "SUB-98765",
    paymentMethod: "Credit Card",
    transactionId: "sub_123456789",
    nextBillingDate: "14 Apr 2026",
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
    first_name: "Jane",
    last_name: "Smith",
    address_1: "456 Office Tower",
    address_2: "Unit 4B",
    city: "Dubai",
    state: "Dubai",
    country: "UAE",
    postcode: "11111",
    email: "jane@example.com",
    phone: "+971 50 987 6543",
  },
  shipTo: {
    first_name: "Jane",
    last_name: "Smith",
    address_1: "456 Office Tower",
    address_2: "Unit 4B",
    city: "Dubai",
    state: "Dubai",
    country: "UAE",
    postcode: "11111",
    email: "jane@example.com",
    phone: "+971 50 987 6543",
  },
  lineItems: [
    {
      id: 1,
      name: "Monthly Roasters Choice",
      quantity: 1,
      price: 250,
      subtotal: 250,
      total: 250,
      tax: 0,
      sku: "SUB-001",
      frequency: "1 month",
    },
  ],
  subtotal: 250,
  tax: 12.5,
  taxLabel: "VAT tax",
  shipping: 0,
  discount: 0,
  total: 262.5,
  currency: "AED",
  currencySymbol: "AED",
  terms: "White Mantis Coffee LLC — Dubai, UAE\nTerms & Condition",
  type: "subscription",
};

export default function PreviewSubscriptionPage() {
  return (
    <main>
      <PDFPreview data={dummySubscriptionData} />
    </main>
  );
}
