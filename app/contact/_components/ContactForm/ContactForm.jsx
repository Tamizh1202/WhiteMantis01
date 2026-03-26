"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./ContactForm.module.css";
import testStyles from "../TestFormUi/TestFormUi.module.css";
import Image from "next/image";
import one from "./1.png";
import whatsappIcon from "./Whatsapp-icon.svg";
import Link from "next/link";
import { validateEmail, validateUAEPhone } from "@/utils/validatorFunctions";
import axiosClient from "@/lib/axios";

const ContactForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [enquiryType, setEnquiryType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseError, setResponseError] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const enquiryRef = useRef(null);

  // --- Click Outside logic for Dropdown ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (enquiryRef.current && !enquiryRef.current.contains(event.target)) {
        setEnquiryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const enquiryOptions = [
    {
      label: "Order or delivery issue",
      value: "order_issue",
    },
    {
      label: "Payment or refund",
      value: "payment_refund",
    },
    {
      label: "Rewards & stamps",
      value: "rewards_stamps",
    },
    {
      label: "Barista selection",
      value: "barista_selection",
    },
    {
      label: "Pickup or timing",
      value: "pickup_timing",
    },
    {
      label: "Menu & availability",
      value: "menu_availability",
    },
    {
      label: "Other",
      value: "other",
    },
  ];

  const ENDPOINT = "/api/web-contact-form";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage("");
    setResponseError(false);

    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !enquiryType.trim() ||
      !message.trim()
    ) {
      setResponseError(true);
      setResponseMessage("All fields are required.");
      return;
    }

    if (validateEmail(email.trim())) {
      setResponseError(true);
      setResponseMessage("Please enter a valid email address.");
      return;
    }

    if (validateUAEPhone(phone.trim())) {
      setResponseError(true);
      setResponseMessage("Please enter a valid UAE phone number.");
      return;
    }

    setLoading(true);

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      inquiryType: enquiryType.trim(),
      message: message.trim(),
    };

    try {
      const resp = await axiosClient.post(ENDPOINT, payload);

      if (resp.status === 201) {
        setResponseMessage(
          "Thank you for your message. We will get back to you soon!",
        );
        setFullName("");
        setEmail("");
        setPhone("");
        setEnquiryType("");
        setMessage("");
      } else {
        setResponseError(true);
        setResponseMessage(
          resp.data.message || "Something went wrong. Please try again later.",
        );
      }
    } catch (error) {
      const resData = error?.response?.data;
      const backendMsg =
        resData?.message || resData?.error || resData?.errors?.[0]?.message;
      setResponseError(true);
      setResponseMessage(
        backendMsg || error.message || "Network error. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.MainContainer}>
          <div className={styles.LeftConatiner}>
            <Image
              src={one}
              alt="Contact Form Image"
              className={styles.image}
            />
          </div>

          <div className={styles.RightContainer}>
            <form onSubmit={handleSubmit} className={testStyles.MainConatiner}>
              <div className={testStyles.Top}>
                <h3>Send us a message</h3>

                <Link href="https://wa.me/+9710589535337">
                  <Image
                    src={whatsappIcon}
                    alt="Whatsapp Icon"
                    width={34}
                    height={34}
                    className={testStyles.whatsappIcon}
                  />
                </Link>
              </div>

              <div className={testStyles.formBox}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

                <div className={testStyles.row}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div
                  className={`${testStyles.selectWrap} ${enquiryOpen ? testStyles.open : ""}`}
                  ref={enquiryRef}
                >
                  <div
                    className={`${testStyles.CustomSelectTrigger} ${enquiryType ? testStyles.hasValue : ""}`}
                    onClick={() => setEnquiryOpen(!enquiryOpen)}
                  >
                    <span>
                      {enquiryOptions.find((o) => o.value === enquiryType)
                        ?.label || "Please select enquiry type"}
                    </span>
                  </div>

                  {enquiryOpen && (
                    <div className={testStyles.CustomOptionsList}>
                      {enquiryOptions.map((option) => (
                        <div
                          key={option.value}
                          className={testStyles.OptionItem}
                          onClick={() => {
                            setEnquiryType(option.value);
                            setEnquiryOpen(false);
                          }}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <textarea
                  placeholder="Write your message here."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className={testStyles.Bottom}>
                <button
                  className={testStyles.btn}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>

              {responseMessage && (
                <div
                  style={{
                    color: responseError ? "crimson" : "#197B5B",
                    marginTop: 12,
                  }}
                >
                  {responseMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
