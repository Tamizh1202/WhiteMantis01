"use client";
import styles from "./page.module.css";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Logo from "./logo.png";
import flag from "./2.png";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axiosClient from "@/lib/axios";

export default function CreateProfile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState(session?.user?.email || "");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const genderRef = useRef(null);

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  // --- Click Outside logic for Dropdown ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genderRef.current && !genderRef.current.contains(event.target)) {
        setIsGenderOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
    setEmail(session?.user?.email || "");
    if (session?.user?.phone && !phone) {
      const formatted = session.user.phone.toString().replace(/[^0-9]/g, "");
      setPhone(formatted);
    }
  }, [session]);

  async function submit(e) {
    e.preventDefault();
    setError("");

    // UAE Phone Validation: 9 digits starting with 5 (after +971)
    // Common prefixes: 50, 52, 54, 55, 56, 58
    const uaePhoneRegex = /^5[024568]\d{7}$/;
    if (!uaePhoneRegex.test(phone)) {
      setError(
        "Please enter a valid UAE mobile number (9 digits starting with 5).",
      );
      return;
    }

    setLoading(true);

    try {
      const res = await axiosClient.patch(`/api/users/${session?.user?.id}`, {
        firstName: firstName,
        lastName: lastName,
        gender: gender.toLowerCase(),
        phone: phone,
      });

      const json = await res.data;

      if (res.status !== 200) {
        throw new Error(json.message || "Profile update failed");
      }

      router.push("/");
      router.refresh();
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.Main}>
      <div className={styles.MainContainer}>
        <div className={styles.LeftContainer}>
          <h4>PURE CRAFT. UNCOMPROMISING QUALITY.</h4>
          <p>
            Dedicated to the master transformation of green coffee into
            world-class specialty beans for you
          </p>
        </div>

        <div className={styles.RightContainer}>
          <form className={styles.FormWrapper} onSubmit={submit}>
            <div className={styles.LogoBox}>
              <Image src={Logo} alt="White Mantis Logo" />
            </div>

            <div className={styles.Header}>
              <h3>YOU'RE ALMOST IN</h3>
              <p>Your specialty coffee journey begins here.</p>
            </div>

            <div className={styles.Fields}>
              {error && <p className={styles.errorMessage}>{error}</p>}

              <input
                type="email"
                placeholder="username@gmail.com"
                value={email}
                disabled
                style={{
                  backgroundColor: "#f5f5f5",
                  cursor: "not-allowed",
                  opacity: 0.7,
                }}
              />

              <input
                type="text"
                placeholder="First Name*"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={loading}
              />
              <input
                type="text"
                placeholder="Last Name*"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={loading}
              />

              <div className={styles.PhoneRow}>
                <div className={styles.FlagBox}>
                  <Image src={flag} alt="UAE Flag" />
                  <span>+971</span>
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number*"
                  value={phone}
                  maxLength={9}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^0-9]/g, "");
                    if (val.startsWith("0")) val = val.substring(1);
                    setPhone(val);
                  }}
                  required
                  disabled={loading}
                />
              </div>

              <div className={styles.SelectWrapper} ref={genderRef}>
                <div
                  className={`${styles.CustomSelectTrigger} ${gender ? styles.hasValue : ""}`}
                  onClick={() => !loading && setIsGenderOpen(!isGenderOpen)}
                >
                  <span>
                    {genderOptions.find((o) => o.value === gender)?.label ||
                      "Gender (optional)"}
                  </span>
                </div>

                <svg
                  className={`${styles.DropArrow} ${isGenderOpen ? styles.Rotate : ""}`}
                  width="13"
                  height="7"
                  viewBox="0 0 13 7"
                  fill="none"
                >
                  <path
                    opacity="0.6"
                    d="M6.0625 6.75L0.000322705 1.88257e-07L12.1247 -8.71687e-07L6.0625 6.75Z"
                    fill="#6E736A"
                  />
                </svg>

                {isGenderOpen && (
                  <div className={styles.CustomOptionsList}>
                    {genderOptions.map((option) => (
                      <div
                        key={option.value}
                        className={styles.OptionItem}
                        onClick={() => {
                          setGender(option.value);
                          setIsGenderOpen(false);
                        }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                className={styles.PrimaryBtn}
                type="submit"
                disabled={loading}
              >
                {loading ? "Proceding" : "Begin Your Journey"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
