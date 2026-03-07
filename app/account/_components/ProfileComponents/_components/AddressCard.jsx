"use client";
// ─── AddressCard ──────────────────────────────────────────────────────────────
// Renders one saved address block with edit and delete icon buttons.
//
// Props:
//   address   object  — one entry from the addresses array
//   onEdit    (address) => void
//   onDelete  (id: string) => void  — triggers the delete confirmation popup

import React from "react";
import styles from "../ProfileComponents.module.css";

import { UAE_STATES } from "../profileConstants";

const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.41176 14.5882H2.59906L12.2334 4.95388L11.0461 3.76659L1.41176 13.4009V14.5882ZM0 16V12.8146L12.4146 0.405411C12.5569 0.276156 12.714 0.176314 12.8859 0.105882C13.058 0.0352941 13.2384 0 13.4271 0C13.6158 0 13.7985 0.0334907 13.9753 0.100471C14.1522 0.167451 14.3089 0.27396 14.4452 0.419999L15.5946 1.58376C15.7406 1.72008 15.8447 1.87694 15.9068 2.05435C15.9689 2.23176 16 2.40918 16 2.58659C16 2.77592 15.9677 2.95655 15.9031 3.12847C15.8384 3.30055 15.7356 3.45773 15.5946 3.6L3.18541 16H0ZM11.6294 4.37059L11.0461 3.76659L12.2334 4.95388L11.6294 4.37059Z" fill="#6E736A" />
    </svg>
);

const DeleteIcon = () => (
    <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.66067 16C2.18812 16 1.78444 15.8327 1.44961 15.498C1.11495 15.1632 0.947615 14.7595 0.947615 14.287V2.25959H0V0.838165H4.26427V0H9.94995V0.838165H14.2142V2.25959H13.2666V14.287C13.2666 14.7657 13.1008 15.1708 12.7691 15.5025C12.4374 15.8342 12.0323 16 11.5536 16H2.66067ZM11.8452 2.25959H2.36904V14.287C2.36904 14.3721 2.39636 14.442 2.45101 14.4966C2.50565 14.5513 2.57554 14.5786 2.66067 14.5786H11.5536C11.6265 14.5786 11.6933 14.5482 11.754 14.4874C11.8148 14.4267 11.8452 14.3599 11.8452 14.287V2.25959ZM4.6471 12.6833H6.06829V4.15482H4.6471V12.6833ZM8.14593 12.6833H9.56712V4.15482H8.14593V12.6833Z" fill="#6E736A" />
    </svg>
);

const AddressCard = ({ address, onEdit, onDelete }) => {
    const emirateLabel = UAE_STATES.find(s => s.value === address.emirates)?.label || address.emirates;

    return (
        <div className={styles.AddressCard}>
            <div className={styles.AddressText}>
                <p className={styles.Label}>{address.label || "Others"}</p>
                <p className={styles.Name}>
                    {`${address.addressFirstName || ""} ${address.addressLastName || ""}`.trim()}
                </p>
                <hr />
                <p className={styles.Name}>
                    {address.street && <>{address.street}<br /></>}
                    {address.apartment && <>{address.apartment}<br /></>}
                    {address.city}, {emirateLabel}, {address.country}
                </p>
                <hr />
                <p className={styles.Name}>Phone number: {address.phoneNumber}</p>
            </div>

            <div className={styles.AddressActions}>
                <span onClick={() => onEdit(address)}><EditIcon /></span>
                <span onClick={() => onDelete(address.id)}><DeleteIcon /></span>
            </div>
        </div>
    );
};

export default AddressCard;
