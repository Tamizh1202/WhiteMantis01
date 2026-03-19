"use client";
// ─── AddressSection ───────────────────────────────────────────────────────────
// Renders the full "Saved Address" section:
//   - Section header with "Add new Address" button
//   - Default address card
//   - List of other address cards
//
// Props:
//   addresses         object[]  — full addresses array from state
//   onAddNew          () => void
//   onEdit            (address) => void
//   onDeleteRequest   (id: string) => void   — sets id + opens delete popup

import React from "react";
import styles from "../ProfileComponents.module.css";
import AddressCard from "./AddressCard";

const AddressSection = ({ addresses, onAddNew, onEdit, onDeleteRequest }) => {
  // Defensive check to ensure addresses is always an array
  const addressList = Array.isArray(addresses) ? addresses : [];

  // Only identify as default if explicitly marked
  const defaultAddress = addressList.find((a) => a.isDefaultAddress);
  const otherAddresses = defaultAddress
    ? addressList.filter((a) => a.id !== defaultAddress.id)
    : addressList;

  return (
    <div className={styles.AddressSection}>
      {/* Header */}
      <div className={styles.AddressHeader}>
        <h4>SAVED ADDRESS</h4>
        <button onClick={onAddNew}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.33333 12V6.66667H0V5.33333H5.33333V0H6.66667V5.33333H12V6.66667H6.66667V12H5.33333Z"
              fill="#6E736A"
            />
          </svg>
        </button>
      </div>

      {addressList.length > 0 ? (
        defaultAddress ? (
          <>
            <div className={styles.fixerOne}>
              <p>Default address</p>
              <AddressCard
                address={defaultAddress}
                onEdit={onEdit}
                onDelete={onDeleteRequest}
              />
            </div>

            {otherAddresses.length > 0 && (
              <div className={styles.fixerTwo}>
                <h6 className={styles.other}>Other addresses</h6>
                {otherAddresses.map((addr) => (
                  <AddressCard
                    key={addr.id}
                    address={addr}
                    onEdit={onEdit}
                    onDelete={onDeleteRequest}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          /* No default address: just show all addresses without labels */
          <div className={styles.fixerTwo}>
            {addressList.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                onEdit={onEdit}
                onDelete={onDeleteRequest}
              />
            ))}
          </div>
        )
      ) : (
        <div className={styles.NoAddressCard}>No Saved Addresses</div>
      )}
    </div>
  );
};

export default AddressSection;
