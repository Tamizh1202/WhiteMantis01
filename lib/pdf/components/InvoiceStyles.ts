import { StyleSheet, Font } from "@react-pdf/renderer";

// ─── Font Registration ───────────────────────────────────────────────────────
Font.register({
  family: "Lato",
  fonts: [
    { src: "/fonts/Lato-Regular.ttf" },
    { src: "/fonts/Lato-Bold.ttf", fontWeight: "bold" },
    { src: "/fonts/Lato-Italic.ttf", fontStyle: "italic" },
  ],
});

// ─── Color tokens ────────────────────────────────────────────────────────────
export const colors = {
  primary: "#6A7156",
  secondary: "#8a8d8e",
  dark: "#3A3833",
  text: "#4B3827",
  border: "#e4e4e4",
  white: "#ffffff",
  subtext: "#828282",
  lightGrey: "#c9cbcc",
  bg: "#ffffff",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
export const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingLeft: 56,
    paddingRight: 33,
    paddingBottom: 0,
    display: "flex",
    flexDirection: "column",
    minHeight: "100%", // PDF pages are finite, but we use flex to push footer down
    fontSize: 10,
    color: colors.text,
    fontFamily: "Lato",
    backgroundColor: colors.white,
  },

  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 25,
    backgroundColor: colors.primary,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderBottomStyle: "solid",
    paddingBottom: 16,
    marginBottom: 24,
  },
  invoiceTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.text,
    lineHeight: 1.1,
  },
  invoiceDate: {
    fontSize: 12,
    color: colors.dark,
    marginTop: 4,
  },
  logoArea: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
  },
  brandName: {
    fontSize: 9,
    letterSpacing: 2,
    color: colors.primary,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  // Info grid
  infoGrid: {
    flexDirection: "row",
    marginBottom: 28,
  },
  infoCol: {
    flexDirection: "column",
    gap: 3,
    minWidth: 150,
  },
  label: {
    fontSize: 10,
    color: colors.secondary,
    marginBottom: 2,
  },
  infoNameBold: {
    fontSize: 10,
    color: colors.dark,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 10,
    color: colors.dark,
  },
  infoTextBold: {
    fontSize: 10,
    color: colors.dark,
    fontWeight: "bold",
  },

  // Address grid
  addressGrid: {
    flexDirection: "row",
    marginBottom: 36,
  },
  addressCol: {
    flexDirection: "column",
    gap: 3,
    flex: 1,
  },
  addrBold: {
    fontSize: 10,
    color: colors.dark,
    fontWeight: "bold",
    marginBottom: 1,
  },
  addrText: {
    fontSize: 10,
    color: colors.dark,
    lineHeight: 1.6,
  },

  // Table
  table: {
    width: "100%",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tableHead: {
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    borderBottomStyle: "solid",
    paddingBottom: 10,
    marginBottom: 4,
  },
  tableBodyRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderBottomStyle: "solid",
    paddingTop: 12,
    paddingBottom: 12,
  },
  th: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.primary,
  },
  td: {
    fontSize: 9,
    color: colors.dark,
  },

  // Totals
  totalsWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 40,
  },
  totalsBlock: {
    width: "42%",
    flexDirection: "column",
    gap: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalRowLabel: {
    fontSize: 10,
    color: colors.dark,
  },
  totalRowValue: {
    fontSize: 10,
    color: colors.dark,
  },
  totalDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderTopStyle: "solid",
    marginTop: 8,
    marginBottom: 4,
  },
  totalFinalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 11,
    color: colors.dark,
  },
  totalValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.primary,
  },

  // Footer
  footer: {
    marginTop: "auto",
    paddingBottom: 30,
  },
  footerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderBottomStyle: "solid",
    paddingBottom: 10,
    marginBottom: 14,
  },
  thankYou: {
    fontSize: 10,
    fontStyle: "italic",
    color: colors.lightGrey,
  },
  paidVia: {
    fontSize: 10,
    color: colors.secondary,
  },
  footerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  trn: {
    fontSize: 10,
    color: colors.secondary,
  },
  companyFooter: {
    fontSize: 10,
    fontStyle: "italic",
    color: colors.secondary,
    textAlign: "right",
    marginBottom: 3,
  },
  terms: {
    fontSize: 10,
    color: colors.secondary,
    textDecoration: "underline",
  },
});
