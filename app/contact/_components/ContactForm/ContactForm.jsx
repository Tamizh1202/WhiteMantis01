"use client";
import React, { useState } from "react";
import styles from "./ContactForm.module.css";
import testStyles from "../TestFormUi/TestFormUi.module.css";
import Image from "next/image";
import one from "./1.png";
import whatsappIcon from "./Whatsapp-icon.svg";
import Link from "next/link";
import { validateEmail, validateUAEPhone } from "@/utils/validatorFunctions";

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
  const enquiryOptions = [
    {
      "label": "Order issue",
      "value": "order_issue"
    },
    {
      "label": "Payment or refund",
      "value": "payment_refund"
    },
    {
      "label": "Rewards & stamps",
      "value": "rewards_stamps"
    },
    {
      "label": "Barista selection",
      "value": "barista_selection"
    },
    {
      "label": "Pickup or timing",
      "value": "pickup_timing"
    },
    {
      "label": "Menu & availability",
      "value": "menu_availability"
    },
    {
      "label": "Other",
      "value": "other"
    }
  ]

  const ENDPOINT = "/api/website/contact";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage("");
    setResponseError(false);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !enquiryType.trim() || !message.trim()) {
      setResponseError(true);
      setResponseMessage("Invalid Input");
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
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      enquiry_type: enquiryType.trim(),
      message: message.trim(),
    };

    console.log(payload)
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
                  className={`${testStyles.selectWrap} ${enquiryOpen ? testStyles.open : ""
                    }`}
                >
                  <select
                    value={enquiryType}
                    onClick={() => setEnquiryOpen((prev) => !prev)}
                    onChange={(e) => {
                      setEnquiryType(e.target.value);
                      setEnquiryOpen(false);
                    }}
                  >
                    <option value="">Please select enquiry type</option>
                    {enquiryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
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
