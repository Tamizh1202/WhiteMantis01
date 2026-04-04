"use client";
import React, { useState } from "react";
import styles from "./FaqSection.module.css";

// const FAQS = [
//   {
//     q: "Can I customize my subscription?",
//     a: "Yes, you can fully customize your subscription at the time of purchase. Choose your coffee format (beans, capsules, drip bags) and delivery frequency.",
//   },
//   {
//     q: "How does the billing cycle work?",
//     a: "Subscriptions are billed automatically based on your selected delivery schedule (e.g., weekly, bi-weekly, or monthly). You’ll be charged before each shipment is processed.",
//   },
//   {
//     q: "Can I pause or cancel my subscription?",
//     a: "You can cancel your subscription at any time through your account without any additional charges. Pause or skip options are not available.",
//   },
//   {
//     q: "Can I change my coffee preferences after subscribing?",
//     a: "No, once your subscription is created, preferences such as coffee type, grind size, or quantity cannot be changed.",
//   },
//   {
//     q: "When will my subscription order be delivered?",
//     a: "Your order will be delivered based on your selected schedule. Once shipped, delivery timelines will follow standard shipping durations.",
//   },{
//     q: "Do subscribers get any exclusive benefits?",
//     a: "Yes, subscribers enjoy benefits like discounts on selected products, early access to new launches, and free shipping on eligible plans.",
//   },{
//     q: "Are all products available under subscription?",
//     a: "YSubscriptions are available only on select coffee products. Workshops, merchandise, and equipment are not included.",
//   },
//   {
//     q: "What happens if I miss a payment?",
//     a: "If a payment fails, we’ll notify you and retry the transaction. Your order will be processed only after the payment is successfully completed.",
//   },{
//     q: "Can I have multiple subscriptions at the same time?",
//     a: "Yes, you can create and manage multiple subscriptions with different products and schedules as per your needs.",
//   },{
//     q: "How do I manage my subscription?",
//     a: "You can easily manage your subscription and cancel it through your account under the “Manage Subscription” section.",
//   },
// ];
const FAQS = [
  {
    q: "How do I customize my subscription and can I change preferences later?",
    a: "You can fully customize your format (beans, capsules, drip bags) and frequency at purchase. however, once created, preferences such as coffee type, grind size, or quantity cannot be changed.",
  },
  {
    q: "How does the billing cycle work and what happens if a payment fails?",
    a: "Subscriptions are billed automatically based on your schedule before each shipment. If a payment fails, we’ll notify you and retry; your order processes only after successful payment.",
  },
  {
    q: "Can I pause, cancel, or manage my multiple subscriptions?",
    a: "You can manage or cancel subscriptions anytime via the “Manage Subscription” section of your account. You can have multiple subscriptions at once, but pause or skip options are not available.",
  },
  {
    q: "When will my subscription be delivered?",
    a: "Your order will be delivered based on your selected schedule. Once shipped, delivery timelines will follow standard shipping durations.",
  },
  {
    q: "What products are eligible for subscription and are there exclusive benefits?",
    a: "Subscriptions apply only to select coffee products (excluding workshops, merchandise, and equipment). Subscribers enjoy discounts, early access to new launches, and free shipping on eligible plans.",
  },
  {
    q: "Can I have multiple subscriptions at the same time?",
    a: "Yes, you can create and manage multiple subscriptions with different products and schedules as per your needs.",
  }
];
const PlusIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="mask0_4278_1304"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="24"
      height="24"
    >
      <rect width="24" height="24" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_4278_1304)">
      <path d="M11 21V13H3V11H11V3H13V11H21V13H13V21H11Z" fill="#6E736A" />
    </g>
  </svg>
);
const MinusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <rect x="0" y="8" width="18" height="2" fill="#525252" />
  </svg>
);

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (index) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  return (
    <section className={styles.section}>
      <div className={styles.bgWrap} />

      <div className={styles.center}>
        <div className={styles.card}>
          <div className={styles.heading}>
            <h3>FREQUENTLY ASKED QUESTIONS</h3>
          </div>

          <div className={styles.list}>
            {FAQS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div className={styles.row} key={i}>
                  <div className={styles.index}>
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className={styles.content}>
                    <div className={styles.top}>
                      <button
                        className={styles.question}
                        onClick={() => toggle(i)}
                      >
                        <span className={styles.qtext}>{item.q}</span>
                      </button>

                      <button
                        className={styles.iconBtn}
                        onClick={() => toggle(i)}
                      >
                        {isOpen ? <MinusIcon /> : <PlusIcon />}
                      </button>
                    </div>

                    <div
                      className={`${styles.answer} ${isOpen ? styles.open : ""}`}
                    >
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
