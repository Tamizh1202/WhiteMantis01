"use client";
import React, { useState, useEffect } from "react";
import styles from "./CommunityPopup.module.css";
import Image from "next/image";
import popupimage from "./popup.png";
import axiosClient from "@/lib/axios";

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const CommunityPopup = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (subscribed) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [subscribed, onClose]);

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axiosClient.post("/api/newsletters", { email });
      setSubscribed(true);
    } catch (err) {
      const errData = err?.response?.data;
      const backendMsg =
        errData?.message || errData?.error || errData?.errors?.[0]?.message;
      setError(
        backendMsg || err?.message || "Subscription failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.left}>
          <Image
            src={popupimage}
            alt="Coffee plant"
            fill
            priority
            className={styles.image}
          />
        </div>

        <div className={styles.right}>
          {/* CLOSE BUTTON */}
          <button className={styles.close} onClick={onClose}>
            ✕
          </button>

          {/* AFTER SUBSCRIBE STATE */}
          {subscribed ? (
            <div className={styles.thankYou}>
              <h3>Thanks for subscribing!</h3>
              <p>You’re now part of the White Mantis Inner Circle ☕</p>
            </div>
          ) : (
            <>
              {/* <span className={styles.label}>
                Specialty Coffee News in Your Inbox
              </span> */}

              <h3>
                THE WHITE MANTIS DISPATCH:
                <br />
                SUBSCRIBE TO OUR NEWSLETTER!
              </h3>

              <p>
                Stay connected to the world of specialty coffee craft. Get
                exclusive access to new product offers, learn expert brewing
                tips, and receive curated updates on global coffee releases
                directly in your inbox.
              </p>

              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              {error && <p className={styles.error}>{error}</p>}

              <button
                className={styles.subscribe}
                disabled={!email || loading}
                onClick={handleSubscribe}
              >
                {loading ? "Subscribing..." : "Subscribe now"}
              </button>

              <button
                className={styles.noThanks}
                onClick={onClose}
                disabled={loading}
              >
                No Thanks
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPopup;
