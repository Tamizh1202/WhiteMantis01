"use client";
import React from "react";
import dynamic from "next/dynamic";
import type { InvoiceData } from "@/lib/pdf/types/invoice.types";

const PDFPreview = dynamic(() => import("../_components/PDFPreview"), {
    ssr: false,
});

const dummyTakeAwayData: InvoiceData = {
    metadata: {
        invoiceNumber: "INV-11111",
        invoiceDate: "March 27, 2026",
        subscriptionNumber: "6969",
        paymentMethod: "Credit Card",
        transactionId: "dinein_123456789",
        // Added these for your DineIn layout
        tableNumber: "T-05",
        serverName: "Rahul",
        pickup: "09:48 PM"
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
    // Added billTo because your interface requires it
    billTo: {
        first_name: "Tamil",
        last_name: "Selvan",
        address_1: "In-Store",
        city: "Dubai",
        email: "bigbruhmantri@gmail.com",
        state: "Dubai",
        postcode: "",
        country: "UAE",
        phone: "+971 071236547",
    },
    lineItems: [

        {
            id: 1,
            name: "Espresso",
            weight: "250ml",
            quantity: 2,
            price: 35,
            subtotal: 70,
            total: 70,
            tax: 0,
            sku: "DINE-001",
            customization: "Extra shot (+3 AED),\nOat milk(+5 AED)",
        },
        {
            id: 2,
            name: "Avocado Toast",
            weight: "300g",
            quantity: 1,
            price: 65,
            subtotal: 65,
            total: 65,
            tax: 0,
            sku: "DINE-002",
            customization: "No onions, \n Extra Spicy (+2 AED)",
        },

    ],
    subtotal: 135,
    tax: 6.75,
    taxLabel: "VAT 5%",
    shipping: 0,
    CouponDiscount :10,
    BeansDiscount :18,
    discount: 0,
    total: 141.75,
    currency: "AED",
    currencySymbol: "AED",
    terms: "White Mantis Coffee LLC — Dubai, UAE\nTerms & Condition",
    type: "dineIn",
};

export default function PreviewTakeAwayPage() {
    return (
        <main>
            <PDFPreview data={dummyTakeAwayData} type="takeAway" />
        </main>
    );
}