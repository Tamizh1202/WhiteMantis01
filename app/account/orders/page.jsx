"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import OrderCard from "./_components/OrderCard/OrderCard";
import axiosClient from "@/lib/axios";
import CancelOrderPopup from "./_components/CancelOrderPopup/CancelOrderPopup";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchOrders(1);
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, session]);

  const fetchOrders = async (pageNumber = 1) => {
    if (!session || !session.user || !session.user.id) {
      return;
    }

    try {
      if (pageNumber === 1) setLoading(true);
      else setFetchingMore(true);

      const userId = session.user.id;
      const queryParams = {
        'where[user][equals]': userId,
        'where[paymentStatus][in]': 'completed,refunded,refund-initiated',
        'sort': '-createdAt',
        'depth': '2',
        'limit': '5',
        'page': pageNumber.toString(),
        'select[id]': 'true',
        'select[orderTotal]': 'true',
        'select[deliveryStatus]': 'true',
        'select[paymentStatus]': 'true', // Changed from 'status' (which doesn't exist)
        'select[createdAt]': 'true',
        'select[items]': 'true',
        'select[refundedOn]': 'true',
        'select[refundReason]': 'true',
        'select[deliveringBy]': 'true',
        'select[deliveredOn]': 'true',
        'select[refundedAmount]': 'true',
        'select[deliveryOption]': 'true',
        'select[origin]': 'true',
      };

      const query = new URLSearchParams(queryParams);
      const response = await axiosClient.get(`/api/web-orders?${query.toString()}`);
      const data = response.data;


      let newOrders = [];
      let hasNext = false;

      if (data.docs && Array.isArray(data.docs)) {
        newOrders = data.docs;
        hasNext = data.hasNextPage;
      } else if (data.orders && Array.isArray(data.orders)) {
        newOrders = data.orders;
        hasNext = data.hasNextPage;
      } else if (data.data && Array.isArray(data.data)) {
        newOrders = data.data;
        hasNext = data.hasNextPage;
      }

      if (pageNumber === 1) {
        setOrders(newOrders);
      } else {
        setOrders(prev => [...prev, ...newOrders]);
      }

      setHasNextPage(hasNext);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  console.log(orders)

  const handleLoadMore = () => {
    if (!fetchingMore && hasNextPage) {
      fetchOrders(page + 1);
    }
  };

  const handleCancelButton = (orderId) => {
    if (!orderId) return;
    setSelectedOrderId(orderId);
    setIsCancelPopupOpen(true);
  }

  const handleConfirmCancel = async (reason) => {
    if (!selectedOrderId) return;

    try {
      const response = await axiosClient.get(`api/web-orders/${selectedOrderId}/cancel`, {
        params: { reason }
      })

      if (response.status === 200) {
        // Refresh orders or update local state
        fetchOrders(1);
        setIsCancelPopupOpen(false);
        setSelectedOrderId(null);
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.Top}>
          <div className={styles.Left}>
            <h1>ALL ORDERS</h1>
          </div>
          <div className={styles.Right}>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                placeholder="Search in Orders"
                className={styles.searchInput}
              />
            </div>
            <div className={styles.Filter}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.65149 15C6.40016 15 6.18991 14.9153 6.02074 14.746C5.85141 14.5768 5.76674 14.3666 5.76674 14.1152V8.327L0.168743 1.2155C-0.0235907 0.959 -0.0515075 0.692333 0.0849925 0.4155C0.221659 0.1385 0.452159 0 0.776493 0H13.757C14.0813 0 14.3118 0.1385 14.4485 0.4155C14.585 0.692333 14.5571 0.959 14.3647 1.2155L8.76674 8.327V14.1152C8.76674 14.3666 8.68208 14.5768 8.51274 14.746C8.34358 14.9153 8.13333 15 7.88199 15H6.65149ZM7.26674 7.8L12.2167 1.5H2.31674L7.26674 7.8Z"
                  fill="#6E736A"
                />
              </svg>
            </div>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "20px" }}>Loading orders...</p>
        ) : orders.length > 0 ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} handleCancelButton={handleCancelButton} />
              ))}
            </div>

            {hasNextPage && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button
                  onClick={handleLoadMore}
                  disabled={fetchingMore}
                  className={styles.loadMoreBtn}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: 'transparent',
                    border: '1px solid #2F362A',
                    color: '#2F362A',
                    cursor: fetchingMore ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--lato)',
                    fontWeight: '500',
                    fontSize: '15px'
                  }}
                >
                  {fetchingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        ) : (
          <p style={{ textAlign: "center", padding: "20px" }}>No orders found.</p>
        )}
      </div>
      {isCancelPopupOpen && (
        <CancelOrderPopup
          orderId={selectedOrderId}
          onClose={() => setIsCancelPopupOpen(false)}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
}
