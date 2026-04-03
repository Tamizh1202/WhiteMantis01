"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import orderZero from "./orderZero.png";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import OrderCard from "./_components/OrderCard/OrderCard";
import axiosClient from "@/lib/axios";
import CancelOrderPopup from "./_components/CancelOrderPopup/CancelOrderPopup";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import FilterOrdersPopup from "./_components/FilterPopup/FilterOrdersPopup";
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({ status: "All", time: "" });

  const fetchOrders = async (
    pageNumber = 1,
    activeFilters = filters,
    activeSearch = debouncedSearch,
  ) => {
    if (!session || !session.user || !session.user.id) {
      return;
    }

    try {
      if (pageNumber === 1) setLoading(true);
      else setFetchingMore(true);

      const userId = session.user.id;

      // All conditions to AND together
      const andConditions = [
        { user: { equals: userId } },
        {
          paymentStatus: {
            in: ["completed", "refunded", "refund-initiated"],
          },
        },
      ];

      // Add Search Query
      if (activeSearch) {
        andConditions.push({
          or: [{ invoiceId: { like: activeSearch } }],
        });
      }

      // Add Status Filter
      if (activeFilters.status && activeFilters.status !== "All") {
        if (activeFilters.status === "In progress") {
          andConditions.push({
            deliveryStatus: { in: ["placed", "shipped"] },
          });
        } else if (activeFilters.status === "Delivered") {
          andConditions.push({
            deliveryStatus: { equals: "delivered" },
          });
        } else if (activeFilters.status === "Cancelled") {
          andConditions.push({
            or: [
              { deliveryStatus: { equals: "cancelled" } },
              { deliveryStatus: { equals: "refund-initiated" } },
              { deliveryStatus: { equals: "refunded" } },
            ],
          });
        }
      }

      // Add Time Filter
      if (activeFilters.time) {
        const now = new Date();
        let startDate;
        if (activeFilters.time === "Last 30 days") {
          startDate = new Date(now.setDate(now.getDate() - 30));
        } else if (activeFilters.time === "Last 6 months") {
          startDate = new Date(now.setMonth(now.getMonth() - 6));
        } else if (activeFilters.time === "Last year") {
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        }
        if (startDate) {
          andConditions.push({
            createdAt: { greater_than_equal: startDate.toISOString() },
          });
        }
      }

      const where = { and: andConditions };
      console.log("Fetching orders with where:", JSON.stringify(where));

      // Payload CMS v3 uses qs to parse query strings.
      // We must serialize the where object into bracket notation, NOT JSON.stringify.
      const flattenParams = (obj, prefix = "") => {
        const result = [];
        for (const key in obj) {
          const value = obj[key];
          const fullKey = prefix ? `${prefix}[${key}]` : key;
          if (Array.isArray(value)) {
            value.forEach((item, i) => {
              if (typeof item === "object" && item !== null) {
                flattenParams(item, `${fullKey}[${i}]`).forEach((p) =>
                  result.push(p),
                );
              } else {
                result.push([`${fullKey}[${i}]`, String(item)]);
              }
            });
          } else if (typeof value === "object" && value !== null) {
            flattenParams(value, fullKey).forEach((p) => result.push(p));
          } else {
            result.push([fullKey, String(value)]);
          }
        }
        return result;
      };

      const params = new URLSearchParams();
      flattenParams({ where }).forEach(([k, v]) => params.append(k, v));
      params.append("sort", "-createdAt");
      params.append("depth", "2");
      params.append("limit", "5");
      params.append("page", pageNumber.toString());

      const selectFields = [
        "id",
        "invoiceId",
        "orderTotal",
        "deliveryStatus",
        "paymentStatus",
        "createdAt",
        "items",
        "refundedOn",
        "refundReason",
        "deliveringBy",
        "deliveredOn",
        "refundedAmount",
        "deliveryOption",
        "origin",
        "isPickupReady",
        "pickedUpDate",
        "orderRating",
      ];
      selectFields.forEach((field) =>
        params.append(`select[${field}]`, "true"),
      );

      const response = await axiosClient.get(
        `/api/web-orders?${params.toString()}`,
      );
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
        setOrders((prev) => [...prev, ...newOrders]);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchOrders(1, filters, debouncedSearch);
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, session, debouncedSearch, filters]);

  const handleLoadMore = () => {
    if (!fetchingMore && hasNextPage) {
      fetchOrders(page + 1);
    }
  };

  const handleCancelButton = (orderId) => {
    if (!orderId) return;
    setSelectedOrderId(orderId);
    setIsCancelPopupOpen(true);
  };

  const handleConfirmCancel = async (reason) => {
    if (!selectedOrderId) return;

    try {
      const response = await axiosClient.get(
        `api/web-orders/${selectedOrderId}/cancel`,
        {
          params: { reason },
        },
      );

      if (response.status === 200) {
        fetchOrders(1);
        setIsCancelPopupOpen(false);
        setSelectedOrderId(null);
        toast.success("Order cancelled successfully.");
      }
    } catch (error) {
      const resData = error?.response?.data;
      const backendMsg =
        resData?.message || resData?.error || resData?.errors?.[0]?.message;
      toast.error(backendMsg || error?.message || "Failed to cancel order.");
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        {/* Always-visible search & filter toolbar */}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div
              className={styles.Filter}
              onClick={() => setIsFilterPopupOpen(true)}
              style={{ cursor: "pointer" }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.65149 15C6.40016 15 6.18991 14.9153 6.02074 14.746C5.85141 14.5768 5.76674 14.3666 5.76674 14.1152V8.327L0.168743 1.2155C-0.0235907 0.959 -0.0515075 0.692333 0.0849925 0.4155C0.221659 0.1385 0.452159 0 0.776493 0H13.757C14.0813 0 14.3118 0.1385 14.4485 0.4155C14.585 0.692333 14.5571 0.959 14.3647 1.2155L8.76674 8.327V14.1152C8.76674 14.3666 8.68208 14.5768 8.51274 14.746C8.34358 14.9153 8.13333 15 7.88199 15H6.65149ZM7.26674 7.8L12.2167 1.5H2.31674L7.26674 7.8Z"
                  fill={
                    filters.status !== "All" && filters.status
                      ? "#2F362A"
                      : "#6E736A"
                  }
                />
              </svg>
            </div>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "20px" }}>
            Loading orders...
          </p>
        ) : orders.length > 0 ? (
          <>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  handleCancelButton={handleCancelButton}
                />
              ))}
            </div>

            {hasNextPage && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={handleLoadMore}
                  disabled={fetchingMore}
                  className={styles.loadMoreBtn}
                  style={{
                    padding: "12px 30px",
                    backgroundColor: "transparent",
                    border: "1px solid #2F362A",
                    color: "#2F362A",
                    cursor: fetchingMore ? "not-allowed" : "pointer",
                    fontFamily: "var(--lato)",
                    fontWeight: "500",
                    fontSize: "15px",
                  }}
                >
                  {fetchingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div
            className={styles.EmptyOrdersState}
            style={{ marginTop: "10px" }}
          >
            <Image src={orderZero} alt="No products" width={140} height={160} />
            {debouncedSearch ||
            (filters.status && filters.status !== "All") ||
            filters.time ? (
              <>
                <h4>No orders found</h4>
                <p>Try adjusting your search or filters.</p>
                <button
                  className={styles.ShopNowBtn}
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({ status: "All", time: "" });
                  }}
                >
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <h4>No Orders yet</h4>
                <p>Explore our curated coffee collections.</p>
                <button
                  className={styles.ShopNowBtn}
                  onClick={() => router.push("/shop")}
                >
                  Shop now
                </button>
              </>
            )}
          </div>
        )}
      </div>
      {isCancelPopupOpen && (
        <CancelOrderPopup
          orderId={selectedOrderId}
          onClose={() => setIsCancelPopupOpen(false)}
          onConfirm={handleConfirmCancel}
        />
      )}
      {isFilterPopupOpen && (
        <FilterOrdersPopup
          onClose={() => setIsFilterPopupOpen(false)}
          currentFilters={filters}
          onApply={(appliedFilters) => {
            setFilters(appliedFilters);
          }}
        />
      )}
    </div>
  );
}
