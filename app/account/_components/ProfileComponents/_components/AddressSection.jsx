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
    const defaultAddress = addresses.find((a) => a.isDefaultAddress) || addresses[0];
    const otherAddresses = addresses.filter((a) => a !== defaultAddress);

    return (
        <div className={styles.AddressSection}>
            {/* Header */}
            <div className={styles.AddressHeader}>
                <h4>SAVED ADDRESS</h4>
                <button onClick={onAddNew}>Add new Address</button>
            </div>

            {/* Default address */}
            {defaultAddress && (
                <div className={styles.fixerOne}>
                    <p>Default address</p>
                    <AddressCard
                        address={defaultAddress}
                        onEdit={onEdit}
                        onDelete={onDeleteRequest}
                    />
                </div>
            )}

            {/* Other addresses */}
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
        </div>
    );
};

export default AddressSection;
