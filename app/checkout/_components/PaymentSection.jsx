"use client";
import { useState } from "react";
import styles from "../page.module.css";
import { PaymentElement } from "@stripe/react-stripe-js";
import { Lexend } from "next/font/google";

// --- Policy Content (fill in your own text) ---
const POLICIES = {
    refund: {
        title: "Cancellation & Refund Policy",
        content: (
            <>
                <p>White Mantis Roastery aims to provide high-quality products and reliable service. This policy outlines the terms related to order cancellations, refunds, and product issues.</p>

                {/* FIXED: Changed style string to object */}
                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>1. Order Cancellation</b>
                <p>Customers may request cancellation of an order before the order has been processed or dispatched.</p>
                <p>Due to the nature of roasted coffee products, orders that have already been roasted, prepared, packed, or shipped may not be eligible for cancellation.</p>
                <p>To request cancellation, please contact us as soon as possible:</p>
                <p>Email: support@whitemantis.ae<br />
                    Phone: 0589535337</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>2. Refund Eligibility</b>
                <p>Refunds may be issued under the following circumstances:</p>
                <ul style={{ paddingLeft: "20px", marginBottom: "15px" }}>
                    <li style={{ marginBottom: "5px" }}>The order was cancelled before processing</li>
                    <li style={{ marginBottom: "5px" }}>The product received was incorrect</li>
                    <li style={{ marginBottom: "5px" }}>The product arrived damaged or defective</li>
                </ul>
                <p>Refund requests must be submitted within 24 hours of receiving the order.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>3. Non-Refundable Items</b>
                <p>The following items are generally not eligible for refunds:</p>
                <ul style={{ paddingLeft: "20px", marginBottom: "15px" }}>
                    <li style={{ marginBottom: "5px" }}>Opened or used coffee products</li>
                    <li style={{ marginBottom: "5px" }}>Products damaged due to improper storage after delivery</li>
                    <li style={{ marginBottom: "5px" }}>Items purchased during promotional clearance sales</li>
                </ul>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>4. Refund Processing</b>
                <p>Approved refunds will be processed through the original payment method used during checkout.</p>
                <p>Processing time may vary depending on the payment provider or banking institution.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>5. Incorrect or Damaged Orders</b>
                <p>If you receive an incorrect or damaged product, please contact us with:</p>
                <ul style={{ paddingLeft: "20px", marginBottom: "15px" }}>
                    <li style={{ marginBottom: "5px" }}>Your order number</li>
                    <li style={{ marginBottom: "5px" }}>A description of the issue</li>
                    <li style={{ marginBottom: "5px" }}>Photos of the product if applicable</li>
                </ul>
                <p>After review, we may offer a replacement product or refund, depending on the situation.</p>
            </>
        ),
    },
    contact: {
        title: "Contact",
        content: (
            <>
                <div data-lenis-prevent style={{ fontFamily: "var(--Lexend)", overscrollBehavior: "contain" }}>
                    <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#444", marginBottom: "30px" }}>
                        For orders, subscriptions, wholesale enquiries, or anything else — our team is based in Dubai and typically responds within a few hours.
                        <span style={{ display: "block", marginTop: "10px", fontWeight: "600", color: "#1a1a1a" }}>
                            WhatsApp is the fastest way to reach us.
                        </span>
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {/* Call Us Section */}
                        <div>
                            <span style={{
                                display: "block",
                                fontFamily: "var(--Lexend)",
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#000000",
                                marginBottom: "4px"
                            }}>
                                Call us
                            </span>
                            <a href="tel:+9710589535337" style={{ fontSize: "16px", color: "#1a1a1a", textDecoration: "none", fontWeight: 500 }}>
                                +971 - 05 8953 5337
                            </a>
                        </div>

                        {/* Email Section */}
                        <div>
                            <span style={{
                                display: "block",
                                fontFamily: "var(--Lexend)",
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#000000",
                                marginBottom: "4px"
                            }}>
                                Email
                            </span>
                            <a href="mailto:hello@whitemantis.ae" style={{ fontSize: "16px", color: "#1a1a1a", textDecoration: "none", fontWeight: 500 }}>
                                hello@whitemantis.ae
                            </a>
                        </div>

                        {/* Visit Section */}
                        <div>
                            <span style={{
                                display: "block",
                                fontFamily: "var(--Lexend)",
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#000000",
                                marginBottom: "4px"
                            }}>
                                Visit
                            </span>
                            <address style={{ fontSize: "16px", fontStyle: "normal", color: "#1a1a1a", lineHeight: "1.5", fontWeight: 500 }}>
                                Warehouse 2-26,<br />
                                26th Street Al Quoz Industrial Area 4<br />
                                Dubai, UAE
                            </address>
                        </div>
                    </div>
                </div>
            </>
        )
    },
    privacy: {
        title: "Privacy Policy",
        content: (
            <>
                <p style={{ marginBottom: "15px" }}>Welcome to White Mantis Roastery.</p>
                <p style={{ marginBottom: "15px" }}>This Privacy Policy is intended to help you understand how we use and protect the personal information you share with us, what data we collect, why we collect it, and what we do with it. Protecting your personal information is important to us, and we respect your privacy.</p>
                <p style={{ marginBottom: "15px", paddingLeft: "15px", borderLeft: "2px solid #eee" }}>Information collected through our website does not include credit/debit card details, and such details will not be stored, sold, shared, rented, or leased to any third parties.</p>
                <p style={{ marginBottom: "15px" }}>WHITE MANTIS ROASTERY LLC complies with the privacy laws and regulations of the United Arab Emirates.</p>
                <p style={{ marginBottom: "15px" }}>Our website makes no representation that this site is governed by or operated in accordance with the laws of other countries, or that the site or any part thereof is appropriate or available for use in any particular jurisdiction. Those who choose to access the site from outside the UAE do so on their own initiative and are responsible for complying with local laws.</p>
                <p style={{ marginBottom: "20px" }}>By using this site, visitors from outside the UAE acknowledge that this site is subject to the laws and regulations of the United Arab Emirates and waive any claims that may arise under their own national laws.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "25px 0" }} />

                <b style={{ display: "block", marginBottom: "15px" }}>1. WHAT INFORMATION WE COLLECT</b>
                <p style={{ fontWeight: "600", marginBottom: "10px" }}>Personal Information</p>
                <p style={{ marginBottom: "10px" }}>The personal information we collect may include:</p>
                <ul style={{ paddingLeft: "20px", marginBottom: "15px" }}>
                    <li style={{ marginBottom: "5px" }}>Name</li>
                    <li style={{ marginBottom: "5px" }}>Email address</li>
                    <li style={{ marginBottom: "5px" }}>Phone number</li>
                    <li style={{ marginBottom: "5px" }}>Delivery address</li>
                    <li style={{ marginBottom: "5px" }}>Company or organization name (if applicable)</li>
                </ul>

                <p style={{ marginBottom: "15px" }}>Users may visit our website anonymously. We only collect personal information if it is voluntarily submitted by the user, for example when placing an order, subscribing to updates, or contacting us.</p>
                <p style={{ marginBottom: "15px" }}>Users can always refuse to supply personal information, although it may prevent them from engaging in certain website-related activities such as placing an order.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "25px 0" }} />

                <p style={{ fontWeight: "600", marginBottom: "10px" }}>Non-Personal Information</p>
                <p style={{ marginBottom: "10px" }}>When you visit our website, White Mantis Roastery and service providers working with us may collect Non-Personal Identification Information (Non-PII).</p>
                <p style={{ marginBottom: "10px" }}>This may include:</p>
                <ul style={{ paddingLeft: "20px", marginBottom: "15px" }}>
                    <li style={{ marginBottom: "5px" }}>Browser type</li>
                    <li style={{ marginBottom: "5px" }}>Device type</li>
                    <li style={{ marginBottom: "5px" }}>Operating system</li>
                    <li style={{ marginBottom: "5px" }}>Internet service provider</li>
                    <li style={{ marginBottom: "5px" }}>Technical connection details</li>
                    <li style={{ marginBottom: "5px" }}>Website interaction data</li>
                </ul>

                <p style={{ marginBottom: "10px" }}>Non-PII does not identify you personally and is typically collected through:</p>
                <ul style={{ paddingLeft: "20px", marginBottom: "15px" }}>
                    <li style={{ marginBottom: "5px" }}>Internet protocol (IP) addresses</li>
                    <li style={{ marginBottom: "5px" }}>Web logs</li>
                    <li style={{ marginBottom: "5px" }}>Pixel tags</li>
                    <li style={{ marginBottom: "5px" }}>Cookies</li>
                    <li style={{ marginBottom: "5px" }}>Other analytics technologies</li>
                </ul>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "25px 0" }} />

                <b style={{ display: "block", marginBottom: "10px" }}>IP Protocol Addresses / Web Logs</b>
                <p style={{ marginBottom: "15px" }}>Our website servers automatically collect IP addresses and log files when visitors access the website. An IP address is a number automatically assigned to your computer by your Internet Service Provider (ISP). This number is logged along with:</p>
                <ul style={{ paddingLeft: "20px", marginBottom: "15px" }}>
                    <li style={{ marginBottom: "5px" }}>Time of visit</li>
                    <li style={{ marginBottom: "5px" }}>Pages visited</li>
                    <li style={{ marginBottom: "5px" }}>Website usage activity</li>
                </ul>
                <p style={{ marginBottom: "15px" }}>This information is collected in aggregate form only and does not contain personal identification data. We use this information to: Monitor website performance, Diagnose server issues, Improve user experience, and Prevent fraud or unauthorized activity.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "25px 0" }} />

                <b style={{ display: "block", marginBottom: "10px" }}>Pixel Tags</b>
                <p style={{ marginBottom: "15px" }}>We and our service providers may use pixel tags, web beacons, or clear GIFs on certain pages or emails. These technologies help us: Track website usage, Understand customer behavior, Improve website performance, and Measure marketing campaign effectiveness. Pixel tags do not collect personal information.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "25px 0" }} />

                <b style={{ display: "block", marginBottom: "15px" }}>2. CONSENT</b>
                <p style={{ marginBottom: "15px" }}>By using our website, you consent to the collection and use of your information as outlined in this Privacy Policy.</p>
                <p style={{ fontWeight: "600", marginBottom: "10px" }}>Withdrawing Consent</p>
                <p style={{ marginBottom: "10px" }}>If you no longer wish to receive communications or allow continued use of your information, you may withdraw consent at any time by contacting us at:</p>
                <p style={{ marginBottom: "15px" }}>
                    Email: support@whitemantis.ae<br />
                    Company: WHITE MANTIS ROASTERY LLC<br />
                    Location: Dubai, United Arab Emirates<br />
                    Phone: 0589535337
                </p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "25px 0" }} />

                <b style={{ display: "block", marginBottom: "15px" }}>3. DISCLOSURE</b>
                <p style={{ marginBottom: "10px" }}>We may disclose your personal information if:</p>
                <ul style={{ paddingLeft: "20px", marginBottom: "15px" }}>
                    <li style={{ marginBottom: "5px" }}>Required by law</li>
                    <li style={{ marginBottom: "5px" }}>Requested by government authorities</li>
                    <li style={{ marginBottom: "5px" }}>Necessary to enforce our website terms and policies</li>
                    <li style={{ marginBottom: "5px" }}>Needed to prevent fraud or security issues</li>
                </ul>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "25px 0" }} />

                <b style={{ display: "block", marginBottom: "15px" }}>4. WEBSITE PLATFORM & PAYMENTS</b>
                <p style={{ marginBottom: "15px" }}>Our website may use secure e-commerce platforms or payment service providers to process transactions. All online payments are processed through secure payment gateways. White Mantis Roastery does not store credit card or debit card information on its servers. Payment providers may store and process payment data according to their own privacy policies.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "25px 0" }} />

                <b style={{ display: "block", marginBottom: "15px" }}>5. THIRD-PARTY SERVICES</b>
                <p style={{ marginBottom: "10px" }}>Third-party service providers used by our website may include: Payment gateways, Delivery services, Website hosting providers, and Analytics tools. These providers only collect and use information to the extent necessary to perform their services. Each provider has its own privacy policy regarding the information required to process transactions. Once you leave our website or are redirected to a third-party website, this Privacy Policy no longer applies.</p>
                <p style={{ fontWeight: "600", marginBottom: "10px", marginTop: "15px" }}>External Links</p>
                <p style={{ marginBottom: "15px" }}>Our website may contain links to other websites. White Mantis Roastery is not responsible for the content or privacy practices of external websites. We recommend reviewing their privacy policies before providing personal information.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "25px 0" }} />

                <b style={{ display: "block", marginBottom: "15px" }}>6. SECURITY</b>
                <p style={{ marginBottom: "15px" }}>We take reasonable precautions and follow industry best practices to protect your personal information from: Loss, Misuse, Unauthorized access, Disclosure, Alteration, or Destruction. However, no internet transmission is completely secure. While we strive to protect your information, we cannot guarantee absolute security.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "25px 0" }} />

                <b style={{ display: "block", marginBottom: "15px" }}>7. COOKIES</b>
                <p style={{ fontWeight: "600", marginBottom: "10px" }}>What is a Cookie?</p>
                <p style={{ marginBottom: "15px" }}>A cookie is a small file placed on your device or browser that allows a website to recognize your device and track usage activity. Cookies help websites improve functionality and user experience.</p>
                <p style={{ fontWeight: "600", marginBottom: "10px" }}>Cookies on Our Website</p>
                <p style={{ marginBottom: "15px" }}>Our website may use cookies to: Store user preferences, Maintain shopping cart information, Analyze website performance, and Improve user experience.</p>
                <p style={{ fontWeight: "600", marginBottom: "10px" }}>Rejecting or Deleting Cookies</p>
                <p style={{ marginBottom: "15px" }}>If you do not want cookies to be stored on your device, you can disable them through your browser settings. You may also visit: http://www.aboutcookies.org for detailed information on managing cookies across different browsers.</p>

                <p style={{ fontWeight: "600", marginBottom: "10px", marginTop: "15px" }}>Examples of Cookies Used</p>
                <p style={{ marginBottom: "10px" }}><strong>Analytical / Performance Cookies:</strong> These cookies collect anonymous data on how visitors use the website, helping us improve performance and user experience. Example tools may include: Google Analytics.</p>
                <p style={{ marginBottom: "15px" }}><strong>Functional / Shopping Cookies:</strong> Used by e-commerce systems to store: Cart information, Session details, and User preferences. These cookies help ensure the website operates properly.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "25px 0" }} />

                <b style={{ display: "block", marginBottom: "15px" }}>8. AGE OF CONSENT</b>
                <p style={{ marginBottom: "15px" }}>By using this website, you confirm that you are at least the age of majority in your jurisdiction, or that you have permission from a legal guardian to use this website.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "25px 0" }} />

                <b style={{ display: "block", marginBottom: "15px" }}>9. CHANGES TO THIS PRIVACY POLICY</b>
                <p style={{ marginBottom: "15px" }}>White Mantis Roastery reserves the right to modify this Privacy Policy at any time. Any changes will take effect immediately upon being posted on the website. If significant changes are made, we will notify users by updating the policy on this page. If our company is acquired or merged with another organization, customer information may be transferred to the new owners so that services can continue.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "25px 0" }} />

                <b style={{ display: "block", marginBottom: "15px" }}>QUESTIONS & CONTACT INFORMATION</b>
                <p style={{ marginBottom: "10px" }}>If you would like to: Access your personal data, Correct or update your information, Request deletion of your information, or Submit a privacy complaint, please contact us:</p>
                <p style={{ marginBottom: "15px" }}>
                    WHITE MANTIS ROASTERY LLC<br />
                    Dubai, United Arab Emirates<br />
                    Email: support@whitemantis.ae<br />
                    Phone: 0589535337
                </p>
            </>
        ),
    },
    shipping: {
        title: "Shipping",
        content: (
            <>
                <p>White Mantis Roastery provides delivery services for products ordered through our website.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>1. Delivery Areas</b>
                <p>Delivery services are primarily available within the United Arab Emirates. Delivery availability may vary depending on location.</p>
                <p>Certain areas may have additional delivery time requirements.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>2. Order Processing</b>
                <p>Orders are typically processed within 1–3 business days, depending on product availability and roasting schedules.</p>
                <p>Orders placed on weekends or public holidays may be processed on the next business day.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>3. Delivery Time</b>
                <p>Typical delivery time within the UAE ranges from 1 to 5 business days.</p>
                <p>Please note that delays may occur during peak periods, public holidays, or unforeseen logistical circumstances.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>4. Delivery Charges</b>
                <p>Delivery fees are displayed during checkout. Promotions or minimum order values may occasionally include free delivery offers.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>5. Delivery Responsibility</b>
                <p>Customers are responsible for providing accurate details. White Mantis Roastery is not responsible for issues caused by incorrect or incomplete addresses.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>6. Failed Deliveries</b>
                <p>If a delivery attempt fails because the customer is unavailable, additional charges may apply for re-delivery.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>Contact Information</b>
                <p>
                    WHITE MANTIS ROASTERY LLC<br />
                    Dubai, United Arab Emirates<br />
                    Email: support@whitemantis.ae<br />
                    Phone: 0589535337
                </p>
            </>
        ),
    },
    terms: {
        title: "Terms of Service",
        content: (
            <>
                <p>Welcome to the website of White Mantis Roastery. By accessing or using this website, you agree to comply with the following Terms and Conditions. If you do not agree, please discontinue use.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>1. Company Information</b>
                <p>
                    WHITE MANTIS ROASTERY LLC<br />
                    Dubai, United Arab Emirates<br />
                    Email: support@whitemantis.ae<br />
                    Phone: 0589535337
                </p>
                <p>White Mantis Roastery operates as a coffee roastery and coffee shop offering roasted coffee, beverages, merchandise, and related products.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>2. Website Use</b>
                <p>Users agree to use this website responsibly and only for lawful purposes. Unauthorized activities including hacking or misuse are strictly prohibited.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>3. Product Information</b>
                <p>We aim for accuracy in descriptions and pricing, but minor variations may occur. White Mantis Roastery reserves the right to:</p>
                <ul style={{ paddingLeft: "20px", marginBottom: "15px" }}>
                    <li style={{ marginBottom: "5px" }}>Modify product descriptions or prices</li>
                    <li style={{ marginBottom: "5px" }}>Limit quantities of products</li>
                    <li style={{ marginBottom: "5px" }}>Discontinue products without prior notice</li>
                </ul>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>4. Orders and Acceptance</b>
                <p>Orders are confirmed only after payment is successfully processed. We reserve the right to decline orders due to:</p>
                <ul style={{ paddingLeft: "20px", marginBottom: "15px" }}>
                    <li style={{ marginBottom: "5px" }}>Payment authorization failure</li>
                    <li style={{ marginBottom: "5px" }}>Suspected fraud or misuse</li>
                    <li style={{ marginBottom: "5px" }}>Product availability issues</li>
                </ul>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>5. Pricing and Payment</b>
                <p>All prices are in United Arab Emirates Dirhams (AED). Payments are processed through secure third-party gateways. We do not store credit or debit card information.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>6. Intellectual Property</b>
                <p>All content including text, graphics, and logos are the property of White Mantis Roastery LLC. Content may not be reproduced without prior written permission.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>7. Governing Law</b>
                <p>These Terms and Conditions are governed by the laws and regulations of the United Arab Emirates and the Emirate of Dubai.</p>
            </>
        ),
    },
    cancellations: {
        title: "Cancellations",
        content: (
            <>
                <p>White Mantis Roastery aims to provide high-quality products and reliable service. This policy outlines the terms related to order cancellations, refunds, and product issues.</p>

                {/* FIXED: Changed style string to object */}
                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>1. Order Cancellation</b>
                <p>Customers may request cancellation of an order before the order has been processed or dispatched.</p>
                <p>Due to the nature of roasted coffee products, orders that have already been roasted, prepared, packed, or shipped may not be eligible for cancellation.</p>
                <p>To request cancellation, please contact us as soon as possible:</p>
                <p>Email: support@whitemantis.ae<br />
                    Phone: 0589535337</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>2. Refund Eligibility</b>
                <p>Refunds may be issued under the following circumstances:</p>
                <ul style={{ paddingLeft: "20px", marginBottom: "15px" }}>
                    <li style={{ marginBottom: "5px" }}>The order was cancelled before processing</li>
                    <li style={{ marginBottom: "5px" }}>The product received was incorrect</li>
                    <li style={{ marginBottom: "5px" }}>The product arrived damaged or defective</li>
                </ul>
                <p>Refund requests must be submitted within 24 hours of receiving the order.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>3. Non-Refundable Items</b>
                <p>The following items are generally not eligible for refunds:</p>
                <ul style={{ paddingLeft: "20px", marginBottom: "15px" }}>
                    <li style={{ marginBottom: "5px" }}>Opened or used coffee products</li>
                    <li style={{ marginBottom: "5px" }}>Products damaged due to improper storage after delivery</li>
                    <li style={{ marginBottom: "5px" }}>Items purchased during promotional clearance sales</li>
                </ul>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>4. Refund Processing</b>
                <p>Approved refunds will be processed through the original payment method used during checkout.</p>
                <p>Processing time may vary depending on the payment provider or banking institution.</p>

                <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />

                <b>5. Incorrect or Damaged Orders</b>
                <p>If you receive an incorrect or damaged product, please contact us with:</p>
                <ul style={{ paddingLeft: "20px", marginBottom: "15px" }}>
                    <li style={{ marginBottom: "5px" }}>Your order number</li>
                    <li style={{ marginBottom: "5px" }}>A description of the issue</li>
                    <li style={{ marginBottom: "5px" }}>Photos of the product if applicable</li>
                </ul>
                <p>After review, we may offer a replacement product or refund, depending on the situation.</p>
            </>
        ),
    },
};

// --- Modal Component ---
function PolicyModal({ policy, onClose }) {
    if (!policy) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    zIndex: 999,
                }}
            />

            {/* Modal */}
            <div data-lenis-prevent
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#faf9f6",
                    borderRadius: "12px",
                    padding: "32px",
                    width: "min(520px, 90vw)",
                    maxHeight: "75vh",
                    overflowY: "auto",
                    zIndex: 1000,
                    boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <h2 style={{
                        margin: 0,
                        fontFamily: "var(--Lexend)",
                        fontSize: "24px",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        color: "#1a1a1a"
                    }}>
                        {policy.title}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "1.25rem",
                            cursor: "pointer",
                            lineHeight: 1,
                            color: "#555",
                            padding: "4px 8px",
                        }}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div style={{
                    fontFamily: "var(--Lexend)",
                    fontSize: "15px",         // 0.9rem can sometimes feel too small for legal text
                    fontWeight: 400,          // Clean, light weight
                    lineHeight: "1.8",        // Increased for better readability
                    color: "#444",            // Softer than pure black
                    letterSpacing: "-0.01em"
                }}>
                    {policy.content}
                </div>
            </div>
        </>
    );
}

// --- Sections ---
export function PaymentCardSection({ validationErrors }) {
    return (
        <div className={styles.Five}>
            <h3>PAYMENT</h3>
            <p>All transactions are secure and encrypted.</p>

            <div className={styles.PaymentContainer}>
                <div className={styles.PaymentBody}>
                    <div className={styles.StripeInput}>
                        <PaymentElement />
                    </div>

                    {validationErrors.card && (
                        <span className={styles.ErrorMessage}>{validationErrors.card}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export function PaymentButtonSection({ isProcessing, handlePayment }) {
    const [activePolicy, setActivePolicy] = useState(null);

    const openPolicy = (key) => setActivePolicy(POLICIES[key]);
    const closePolicy = () => setActivePolicy(null);

    return (
        <div className={styles.Six}>
            <button
                className={styles.Pay}
                onClick={handlePayment}
                disabled={isProcessing}
            >
                {isProcessing ? "Processing..." : "Pay Now"}
            </button>

            <div className={styles.PageLinks} >
                <p onClick={() => openPolicy("refund")} style={{ cursor: "pointer" }}>
                    Cancellation & Refund Policy
                </p>
                <p onClick={() => openPolicy("shipping")} style={{ cursor: "pointer" }}>
                    Shipping
                </p>
                <p onClick={() => openPolicy("privacy")} style={{ cursor: "pointer" }}>
                    Privacy Policy
                </p>

                <p onClick={() => openPolicy("terms")} style={{ cursor: "pointer" }}>
                    Terms of service
                </p>
                <p onClick={() => openPolicy("contact")} style={{ cursor: "pointer" }}>
                    Contact
                </p>

            </div>

            <PolicyModal policy={activePolicy} onClose={closePolicy} />
        </div>
    );
}

export default function PaymentSection({ validationErrors, isProcessing, handlePayment }) {
    return (
        <>
            <PaymentCardSection validationErrors={validationErrors} />
            <PaymentButtonSection isProcessing={isProcessing} handlePayment={handlePayment} />
        </>
    );
}