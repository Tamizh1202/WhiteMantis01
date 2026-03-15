'use client';
import React, { useState } from 'react';
import styles from './BuyNowPopup.module.css';
import AddToCart from '@/app/_components/AddToCart';

const BuyNowPopup = ({ product, handleOpenSubscribePopup, getDisplayData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);

    // 1. Safety check
    if (!product) return null;

    // 2. Derive cartProduct inside the component so it's always fresh
    // This replicates exactly what your desktop version does
    const displayData = getDisplayData ? getDisplayData(product) : null;
    const cartProduct = displayData?.cartProduct;

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const increment = () => setQuantity((prev) => prev + 1);
    const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const displayPrice = displayData?.price || product.salePrice || product.regularPrice || 0;

    return (
        <>
            {/* Trigger Button */}
            <button className={styles.TriggerBtn} onClick={handleOpen}>
                Buy Now
            </button>

            {/* The Actual Popup */}
            {isOpen && (
                <div className={styles.Overlay} onClick={handleClose}>
                    <div className={styles.Popup} onClick={(e) => e.stopPropagation()}>

                        <div className={styles.Closebtn}>
                            <span className={styles.CloseBtn} onClick={handleClose}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.39954 14L0 12.6L5.59815 7L0 1.4L1.39954 0L6.99768 5.6L12.5958 0L13.9954 1.4L8.39722 7L13.9954 12.6L12.5958 14L6.99768 8.4L1.39954 14Z" fill="#6C7A5F" />
                                </svg>
                            </span>
                        </div>

                        <div className={styles.HeaderRow}>
                            <div className={styles.TitleArea}>
                                <h2>{product.name} {product.tagline}</h2>
                            </div>
                            <div className={styles.QtySelector}>
                                <button onClick={decrement}>-</button>
                                <span>{quantity.toString().padStart(2, '0')}</span>
                                <button onClick={increment}>+</button>
                            </div>
                        </div>

                        <div className={styles.PriceArea}>
                            <h2>AED {displayPrice}</h2>
                        </div>

                        <hr className={styles.Divider} />

                        <div className={styles.Actions}>
                            {/* Subscribe Logic */}
                            {(product.hasSimpleSub ||
                                (product.hasVariantOptions && product.variants?.some(v => v.hasVariantSub))) && (
                                    <button
                                        className={styles.SubscribeBtn}
                                        onClick={() => {
                                            handleClose();
                                            handleOpenSubscribePopup(product);
                                        }}
                                    >
                                        Subscribe
                                    </button>
                                )}

                            {/* AddToCart Logic - Using the derived cartProduct */}
                            <div className={styles.CartWrapper}>
                                {cartProduct ? (
                                    <AddToCart
                                        product={cartProduct}
                                        quantity={quantity}
                                        onAddSuccess={handleClose} // Pass handleClose as a prop
                                    />
                                ) : (
                                    <AddToCart
                                        product={product}
                                        quantity={quantity}
                                        onAddSuccess={handleClose}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BuyNowPopup;