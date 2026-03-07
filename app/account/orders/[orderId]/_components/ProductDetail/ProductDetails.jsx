import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProductDetails.module.css";
import { formatImageUrl } from '@/lib/imageUtils'
import { getStatusConfig, formatDate } from "@/app/account/orders/_components/GetStatus";

const ProductDetail = ({ order }) => {

    console.log(order)

    if (!order) return null;

    const config = getStatusConfig(order.deliveryStatus || order.status, order);
    const items = order.items || order.line_items || [];

    return (
        <div className={styles.orderCard}>
            <div className={styles.orderTop}>
                <div className={styles.orderTopLeft}>
                    <span>{config.icon}</span>
                    <div>
                        <p className={styles.orderStatusTitle} style={{ color: config.color }}>{config.label}</p>
                        <p className={styles.orderDateSub}>{config.date}</p>
                        {config.refundedAmount && (<p className={styles.orderDateSub}>
                            <span className={styles.orderRefundAmountHeading}>Refund Credited: </span>
                            <span className={styles.orderDateSub}>{config.refundedAmount}</span>
                        </p>)}
                    </div>
                </div>
                <div className={styles.orderTopRight}>
                    <p>Order Date: <span>{formatDate(order.date_created || order.createdAt)}</span></p>
                    <p>Order ID: <span>#{order.id}</span></p>
                </div>
            </div>

            <div className={`${styles.orderMiddle} ${config.noBottom ? styles.orderMiddleNoBottom : ""}`}>
                <div className={styles.orderItems}>
                    {items.map((item, idx) => (
                        <div className={styles.orderItem} key={idx}>
                            <Image
                                src={formatImageUrl(item.productImage?.url) || formatImageUrl(item.product?.productImage?.url) || "https://placehold.co/100x100"}
                                alt={item.name || item.product?.name || "Product"}
                                width={80}
                                height={80}
                                className={styles.orderItemImg}
                            />
                            <div className={styles.orderItemInfo}>
                                <p>{item.product?.name || item.name || "Product name"} {item.product?.tagline}</p>
                                <p>
                                    {item.product?.variants?.find(v => v.id === item.variantID) && (
                                        <>
                                            {item.product.variants.find(v => v.id === item.variantID).variantName}
                                            &nbsp; &nbsp;<span className={styles.Separator}>|</span>&nbsp;&nbsp;
                                        </>
                                    )}
                                    Qty: {item.quantity || "0"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* 
                <div className={styles.orderActions}>
                    <Link href={`/account/orders/${order.id}`} className={styles.orderDetailsLink}>
                        Order Details
                    </Link>
                    {config.showCancel && <button className={styles.cancelBtn}>Cancel Order</button>}
                </div> */}
            </div>

            {/* {config.bottomText && (
                <div className={styles.orderBottom}>
                    <p>{config.bottomText}</p>
                </div>
            )} */}

            <div className={`${styles.orderMobileMeta} ${config.noBottom ? styles.orderMobileMetaNoBorder : ""}`}>
                <p>Order Date: <span>{formatDate(order.date_created || order.createdAt)}</span></p>
                <p>Order ID: <span>#{order.id}</span></p>
            </div>
        </div>
    );
};

export default ProductDetail;
