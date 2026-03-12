'use client';
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import axiosClient from "@/lib/axios";
import styles from './page.module.css';

const QUESTIONS = [{
    question: " What are White Mantis Beans and how do they work?",
    answer: "White Mantis Coins are reward points you earn on orders, subscriptions, and workshop bookings, on every purchase, you earn WM Coins worth 10% of the order value (e.g. AED 1,000 = 100 coins) and can be used for discounts on eligible purchases."
}, {
    question: " What are White Mantis Beans and how do they work?",
    answer: "White Mantis Coins are reward points you earn on orders, subscriptions, and workshop bookings, on every purchase, you earn WM Coins worth 10% of the order value (e.g. AED 1,000 = 100 coins) and can be used for discounts on eligible purchases."
}, {
    question: " What are White Mantis Beans and how do they work?",
    answer: "White Mantis Coins are reward points you earn on orders, subscriptions, and workshop bookings, on every purchase, you earn WM Coins worth 10% of the order value (e.g. AED 1,000 = 100 coins) and can be used for discounts on eligible purchases."
}, {
    question: " What are White Mantis Beans and how do they work?",
    answer: "White Mantis Coins are reward points you earn on orders, subscriptions, and workshop bookings, on every purchase, you earn WM Coins worth 10% of the order value (e.g. AED 1,000 = 100 coins) and can be used for discounts on eligible purchases."
}]

function formatDateParts(isoString) {
    if (!isoString) return { datePart: 'N/A', timePart: '' };
    const d = new Date(isoString);
    const datePart = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timePart = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { datePart, timePart };
}

const WhiteMantisBeans = () => {
    const { data: session } = useSession();
    const [openIndex, setOpenIndex] = useState(null);
    const faqRef = useRef(null);
    const [allTransactions, setAllTransactions] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const [totalBalance, setTotalBalance] = useState(0);

    useEffect(() => {
        const fetchBeans = async () => {
            if (session?.user?.id) {
                try {
                    const response = await axiosClient.get(`/api/user-wt-coins`, {
                        params: {
                            'where[user][equals]': session.user.id,
                            'sort': '-date',
                            'limit': 1,
                            'depth': 1
                        }
                    });

                    const doc = response.data?.docs?.[0] || response.data;

                    setTotalBalance(doc.totalBalance || 0);

                    const earningTransactions = (doc.coinEarningHistory || []).map(item => ({
                        details: item.type === 'offline' ? `Reference Id: ${item.offlineReferenceId}` : `Order Id: ${item.linkedOrder?.value?.id ?? 'N/A'}`,
                        transaction_type: 'Beans Credit',
                        transaction_date: item.earnedAt,
                        expiry_date: item.expiryDate,
                        coins: `+${item.amount}`,
                        _sortDate: new Date(item.earnedAt),
                    }));

                    const redemptionTransactions = (doc.pointsRedemptionHistory || []).map(item => ({
                        details: item.type === 'offline' ? `Reference Id: ${item.offlineReferenceId}` : `Order Id: ${item.associatedOrder?.value?.id ?? 'N/A'}`,
                        transaction_type: 'Beans Redeemed',
                        transaction_date: item.redeemedAt,
                        expiry_date: null,
                        coins: `-${item.redeemedPoints}`,
                        _sortDate: new Date(item.redeemedAt),
                    }));

                    const merged = [...earningTransactions, ...redemptionTransactions]
                        .sort((a, b) => b._sortDate - a._sortDate);

                    setAllTransactions(merged);
                } catch (error) {
                    console.error("BEANS API ERROR:", error.response?.data || error.message);
                }
            }
        };

        fetchBeans();
    }, [session]);

    const toggleQuestion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const scrollToFAQ = () => {
        faqRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const displayData = allTransactions.slice(0, visibleCount);
    const hasMore = visibleCount < allTransactions.length;
    const loadMore = () => setVisibleCount(prev => prev + 10);

    return (
        <div className={styles.head}>
            <div className={styles.border}>
                <div className={styles.main}>
                    <h1>WHITE MANTIS BEANS</h1>
                </div>
                <div className={styles.main1}>
                    <div className={styles.olive}>
                        <div className={styles.content1}>
                            <div className={styles.left}>
                                <h1 className={styles.p}>Total WM Beans</h1>
                                <h1 className={styles.heading}>{totalBalance} BEANS</h1>
                            </div>

                            <div className={styles.right} onClick={scrollToFAQ} style={{ cursor: "pointer" }}>
                                <p>How to use?</p>
                            </div>
                        </div>

                        <hr />

                        <div className={styles.months}>
                            <h1 className={styles.validity}>White Mantis Beans are valid for 12 months from the date they're earned.</h1>
                        </div>

                    </div>
                    <div className={styles.box}>
                        <div className={styles.heading}>
                            <h1>Transaction History</h1>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.gridss}>

                                <div className={styles.tableHeading}>
                                    <div>Details</div>
                                    <div>Transaction Type</div>
                                    <div>Transaction Date</div>
                                    <div>Expiry Date</div>
                                    <div>Coins</div>
                                </div>

                                {displayData.map((item, index) => {
                                    const { datePart: txDate, timePart: txTime } = formatDateParts(item.transaction_date);
                                    const { datePart: expDate, timePart: expTime } = formatDateParts(item.expiry_date);
                                    return (
                                        <div key={index} className={styles.tableContent}>
                                            <div className={styles.itemDetail}>
                                                {item.details.split(':').map((part, i) => (
                                                    <div key={i}>
                                                        {i === 0 ? part + ':' : part.trim()}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className={styles.itemDate}
                                                style={{ color: item.coins.includes('+') ? '#428B54' : '#E54842' }}>
                                                {item.transaction_type}
                                            </div>
                                            <div className={styles.itemDate}>
                                                <div>{txDate}</div>
                                                <div>{txTime}</div>
                                            </div>
                                            <div className={styles.itemDate}>
                                                <div className={styles.itemDate}>
                                                    {item.expiry_date ? (
                                                        <>
                                                            <div>{expDate}</div>
                                                            <div>{expTime}</div>
                                                        </>
                                                    ) : (
                                                        <div>-</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={styles.itemDate} style={{
                                                textAlign: 'center',
                                                color: item.coins.includes('+') ? '#428B54' : '#E54842'
                                            }}>
                                                {item.coins}
                                            </div>
                                        </div>
                                    );
                                })}
                                {hasMore && (
                                    <div className={styles.more}>
                                        <a onClick={loadMore} style={{ cursor: 'pointer' }}>View More</a>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                    <div className={styles.mobileOnly}>
                        <div className={styles.grid}>
                            <div className={styles.gridss}>

                                {displayData.map((item, index) => {
                                    const { datePart: txDate, timePart: txTime } = formatDateParts(item.transaction_date);
                                    return (
                                        <div key={index} className={styles.tableContent}>
                                            <div className={styles.LHS}>
                                                <div className={styles.itemDate}
                                                    style={{ color: item.coins.includes('+') ? '#428B54' : '#E54842' }}>
                                                    {item.transaction_type}
                                                </div>
                                                <div className={styles.itemDetail}>
                                                    {item.details.split(':').map((part, i) => (
                                                        <div key={i}>
                                                            {i === 0 ? part + ':' : part.trim()}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className={styles.RHS}>
                                                <div className={styles.itemDate} style={{
                                                    color: item.coins.includes('+') ? '#428B54' : '#E54842'
                                                }}>
                                                    {item.coins}
                                                </div>
                                                <div className={styles.itemDate}>
                                                    <div>{txDate}</div>
                                                    <div>{txTime}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {hasMore && (
                                    <div className={styles.more}>
                                        <a onClick={loadMore} style={{ cursor: 'pointer' }}>View more</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div ref={faqRef} className={styles.faq}>
                        <div className={styles.faqMain}>
                            <div className={styles.faqHeading}>
                                <h1>FREQUENTLY ASKED QUESTIONS</h1>
                            </div>
                            <div className={styles.faqQuestions}>
                                {QUESTIONS.map((item, index) => (
                                    <div key={index} className={styles.Qsection}>

                                        <div
                                            className={styles.quesStyle}
                                            onClick={() => toggleQuestion(index)}
                                            style={{ cursor: "pointer" }}
                                        >

                                            <div className={styles.questionLeft}>
                                                <span className={styles.number}>
                                                    {(index + 1).toString().padStart(2, "0")}
                                                </span>

                                                <h4>{item.question}</h4>
                                            </div>

                                            <span
                                                className={styles.cross}
                                                style={{
                                                    transform: openIndex === index ? "rotate(45deg)" : "rotate(0deg)",
                                                    transition: "transform 0.3s ease",
                                                }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 18 18">
                                                    <path
                                                        d="M8 18V10H0V8H8V0H10V8H18V10H10V18H8Z"
                                                        fill="#6E736A"
                                                    />
                                                </svg>
                                            </span>

                                        </div>

                                        <div
                                            className={`${styles.answers} ${openIndex === index ? styles.answersOpen : ""
                                                }`}
                                        >
                                            <p style={{ textAlign: "justify" }}>{item.answer}</p>
                                        </div>

                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div >
    )

}

export default WhiteMantisBeans
