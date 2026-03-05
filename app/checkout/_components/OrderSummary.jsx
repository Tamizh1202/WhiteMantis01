"use client";
import Image from "next/image";
import styles from "../page.module.css";
import placeholderImage from "../1.png";

/**
 * OrderSummary
 * ─────────────────────────────────────────
 * Renders the right-side order summary panel:
 *  - Item list with image, name, weight, quantity, price
 *  - Subtotal, discount, shipping, tax, and total
 *
 * Props:
 *   product    : array  — list of product items
 *   cartTotals : object — { subtotal, discount, shipping, tax, total }
 *   delivery   : string — "ship" | "pickup"
 */
export default function OrderSummary({ product, cartTotals, delivery }) {
    return (
        <div className={styles.Right}>
            {/* Header */}
            <div className={styles.RightOne}>
                <h3>Order Summary</h3>
                <p>({product.length} items)</p>
            </div>

            {/* Item List */}
            <div className={styles.RightTwo}>
                {product.map((item, idx) => (
                    <div className={styles.ProdOne} key={item.id || idx}>
                        <div className={styles.ProdImage}>
                            <Image
                                src={item.image || placeholderImage}
                                alt="product image"
                                width={80}
                                height={80}
                                style={{ objectFit: "contain" }}
                            />
                        </div>

                        <div className={styles.ProdDetails}>
                            <h4>{cleanProductName(item.title || item.name)}</h4>
                            <p>
                                {item.attributes?.attribute_pa_weight || item.weight} | {item.quantity}x
                            </p>
                            {item.frequency && <span>{item.frequency}</span>}
                        </div>

                        <div className={styles.ProdPrice}>
                            <h4>AED {parseFloat(item.price?.final_price || item.price).toFixed(2)}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className={styles.RightThree}>
                <div className={styles.Subtotal}>
                    <p>Subtotal</p>
                    <h5>AED {cartTotals.subtotal.toFixed(2)}</h5>
                </div>

                {cartTotals.discount > 0 && (
                    <div className={styles.Subtotal}>
                        <p>Discount</p>
                        <h5 style={{ color: "green" }}>- AED {cartTotals.discount.toFixed(2)}</h5>
                    </div>
                )}

                <div className={styles.Shipping}>
                    <p>Shipping</p>
                    <h5>
                        {cartTotals.shipping === 0
                            ? delivery === "pickup"
                                ? "Free (Pickup)"
                                : "Calculated at next step"
                            : `AED ${cartTotals.shipping.toFixed(2)}`}
                    </h5>
                </div>

                <div className={styles.EstimatedTax}>
                    <p>Estimated Taxes</p>
                    <h5>AED {cartTotals.tax.toFixed(2)}</h5>
                </div>

                <div className={styles.RightLine}></div>

                <div className={styles.Total}>
                    <p>Total</p>
                    <h5>AED {cartTotals.total.toFixed(2)}</h5>
                </div>
            </div>
        </div>
    );
}
