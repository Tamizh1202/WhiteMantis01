import React from "react";
import { Document, Page, Text, View, Svg, Polygon } from "@react-pdf/renderer";
import { InvoiceData } from "../types/invoice.types";
import { styles, colors as C } from "./InvoiceStyles";

interface InvoiceDocumentProps {
  data: InvoiceData;
}

// ─── Triangle/Arrow SVG logo (PDF version) ────────────────────────────────────
const DiamondLogo = () => (
  <Svg width="32" height="40" viewBox="0 0 32 40">
    <Polygon
      points="16,2 30,20 2,20"
      fill="none"
      stroke={C.primary}
      strokeWidth={2}
    />
    <Polygon
      points="16,10 24,20 8,20"
      fill="none"
      stroke={C.primary}
      strokeWidth={1.5}
    />
    <Polygon
      points="15,20 17,20 17,36 15,36"
      fill={C.primary}
      stroke={C.primary}
      strokeWidth={0}
    />
  </Svg>
);

// ─── Small helper ─────────────────────────────────────────────────────────────
const TotalRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.totalRow}>
    <Text style={styles.totalRowLabel}>{label}</Text>
    <Text style={styles.totalRowValue}>{value}</Text>
  </View>
);

// ─── Main component ───────────────────────────────────────────────────────────
export const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ data }) => {
  const isSubscription = data.type === "subscription";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Left green sidebar */}
        <View style={styles.sidebar} />

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.invoiceTitle}>Invoice</Text>
            <Text style={styles.invoiceDate}>{data.metadata.invoiceDate}</Text>
          </View>
          <View style={styles.logoArea}>
            <DiamondLogo />
            <Text style={styles.brandName}>WHITE MANTIS</Text>
          </View>
        </View>

        {/* ── INFO GRID ──
            [Recipient flex:1] [16pt gap] [Order Id 110pt] [Order Date 108pt]
        */}
        <View style={styles.infoGrid}>
          {/* Recipient */}
          <View style={{ flex: 1, flexDirection: "column", gap: 2 }}>
            <Text style={styles.label}>Recipient</Text>
            <Text style={styles.infoNameBold}>
              {data.billTo.first_name} {data.billTo.last_name}
            </Text>
            <Text style={styles.infoText}>{data.billTo.email || "N/A"}</Text>
            <Text style={styles.infoText}>{data.billTo.phone || "N/A"}</Text>
          </View>

          {/* Gap */}
          <View style={{ width: 16 }} />

          {/* Order Id + Invoice no */}
          <View style={{ ...styles.infoCol, width: 110 }}>
            <Text style={styles.label}>Order Id</Text>
            <Text style={styles.infoText}>
              #{data.metadata.orderNumber || data.metadata.subscriptionNumber}
            </Text>
            <Text style={{ ...styles.label, marginTop: 10 }}>Invoice no.</Text>
            <Text style={styles.infoTextBold}>
              {data.metadata.invoiceNumber}
            </Text>
          </View>

          {/* Order Date + Next Billing */}
          <View style={{ ...styles.infoCol, width: 108 }}>
            <Text style={styles.label}>Order Date</Text>
            <Text style={styles.infoText}>{data.metadata.invoiceDate}</Text>
            {isSubscription && data.metadata.nextBillingDate && (
              <>
                <Text style={{ ...styles.label, marginTop: 10 }}>
                  Next Billing Date
                </Text>
                <Text style={styles.infoTextBold}>
                  {data.metadata.nextBillingDate}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* ── ADDRESS GRID ──
            [Bill To flex:1] [16pt gap] [Issued By 218pt]
            218pt = 110 + 108 → same right edge as info grid
        */}
        <View style={styles.addressGrid}>
          {/* Bill To + Ship To */}
          <View style={styles.addressCol}>
            <Text style={styles.label}>Bill to</Text>
            <Text style={styles.addrBold}>
              {data.billTo.first_name} {data.billTo.last_name}
            </Text>
            <Text style={styles.addrText}>{data.billTo.address_1}</Text>
            {data.billTo.address_2 && (
              <Text style={styles.addrText}>{data.billTo.address_2}</Text>
            )}
            <Text style={styles.addrText}>
              {data.billTo.country} — {data.billTo.postcode}
            </Text>
            <Text style={styles.addrText}>
              Email: {data.billTo.email || "N/A"}
            </Text>
            <Text style={styles.addrText}>
              Phone: {data.billTo.phone || "N/A"}
            </Text>

            {data.shipTo && (
              <View style={{ marginTop: 14 }}>
                <Text style={styles.label}>Ship to</Text>
                <Text style={styles.addrBold}>
                  {data.shipTo.first_name} {data.shipTo.last_name}
                </Text>
                <Text style={styles.addrText}>{data.shipTo.address_1}</Text>
                {data.shipTo.address_2 && (
                  <Text style={styles.addrText}>{data.shipTo.address_2}</Text>
                )}
                <Text style={styles.addrText}>
                  {data.shipTo.city}, {data.shipTo.country} —{" "}
                  {data.shipTo.postcode}
                </Text>
              </View>
            )}
          </View>

          {/* Gap — same 16pt as info grid */}
          <View style={{ width: 16 }} />

          {/* Issued By */}
          <View style={styles.addressIssuedCol}>
            <Text style={styles.label}>Issued By</Text>
            <Text style={styles.addrBold}>{data.company.name}</Text>
            <Text style={styles.addrText}>Email: {data.company.email}</Text>
            <Text style={styles.addrText}>Phone: {data.company.phone}</Text>
            <Text style={styles.addrText}>
              Address: {data.company.address} {data.company.city},{" "}
              {data.company.country}
            </Text>
          </View>
        </View>

        {/* ── LINE ITEMS TABLE ── */}
        <View style={styles.table}>
          {/* Table head */}
          <View style={{ ...styles.tableRow, ...styles.tableHead }}>
            <Text style={{ ...styles.th, flex: 4 }}>Description</Text>
            {isSubscription && (
              <Text style={{ ...styles.th, flex: 1.5, textAlign: "center" }}>
                Frequency
              </Text>
            )}
            <Text style={{ ...styles.th, flex: 1, textAlign: "center" }}>
              Qty
            </Text>
            <Text style={{ ...styles.th, flex: 1.5, textAlign: "right" }}>
              Unit Price
            </Text>
            <Text style={{ ...styles.th, flex: 1.5, textAlign: "right" }}>
              Amount
            </Text>
          </View>

          {/* Rows */}
          {data.lineItems.map((item) => (
            <View
              key={item.id}
              style={{ ...styles.tableRow, ...styles.tableBodyRow }}
            >
              <Text style={{ ...styles.td, flex: 4 }}>{item.name}</Text>
              {isSubscription && (
                <Text style={{ ...styles.td, flex: 1.5, textAlign: "center" }}>
                  {item.frequency || "—"}
                </Text>
              )}
              <Text style={{ ...styles.td, flex: 1, textAlign: "center" }}>
                {item.quantity}
              </Text>
              <Text style={{ ...styles.td, flex: 1.5, textAlign: "right" }}>
                AED{item.price.toFixed(0)}
              </Text>
              <Text style={{ ...styles.td, flex: 1.5, textAlign: "right" }}>
                AED {(item.price * item.quantity).toFixed(0)}
              </Text>
            </View>
          ))}
        </View>

        {/* ── TOTALS ── */}
        <View style={styles.totalsWrapper}>
          <View style={styles.totalsBlock}>
            <TotalRow
              label="Subtotal :"
              value={`AED ${data.subtotal.toFixed(0)}`}
            />
            {data.couponDiscount > 0 && (
              <TotalRow
                label="Coupon Discount :"
                value={`AED ${data.couponDiscount.toFixed(0)}`}
              />
            )}
            {data.beansDiscount > 0 && (
              <TotalRow
                label="Beans Discount :"
                value={`AED ${data.beansDiscount.toFixed(0)}`}
              />
            )}
            <TotalRow
              label="Shipping :"
              value={`AED ${data.shipping.toFixed(0)}`}
            />
            <TotalRow
              label={`${data.taxLabel} :`}
              value={`AED ${data.tax.toFixed(0)}`}
            />

            <View style={styles.totalDivider} />

            <View style={styles.totalFinalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                AED {Math.round(data.total)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── FOOTER ── */}
        <View style={styles.footer}>
          <View style={styles.footerTop}>
            <Text style={styles.thankYou}>Thank you for your purchase</Text>
            <Text style={styles.paidVia}>
              Paid via{" "}
              <Text style={{ color: C.dark, fontWeight: "bold" }}>Stripe</Text>
            </Text>
          </View>
          <View style={styles.footerBottom}>
            <Text style={styles.trn}>
              {data.company.taxId.split(":")[0]}:{" "}
              <Text style={{ color: C.dark, fontWeight: "bold" }}>
                {data.company.taxId.split(":")[1]?.trim()}
              </Text>
            </Text>
            <View style={{ textAlign: "right" }}>
              <Text style={styles.companyFooter}>
                White Mantis Coffee LLC — Dubai, UAE
              </Text>
              <Text style={styles.terms}>Terms & Condition</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};