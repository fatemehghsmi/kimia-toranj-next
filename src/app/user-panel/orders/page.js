"use client";

import { useState, useEffect } from "react";
import styles from "./UserOrders.module.css";
import axiosInstance from "@/utils/axiosInstance";
import { FiPackage, FiCalendar, FiMapPin, FiChevronDown, FiChevronUp, FiShoppingBag } from "react-icons/fi";

const statusMap = {
  pending: "در انتظار پرداخت",
  processing: "در حال پردازش",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
};

const statusColors = {
  pending: "#f59e0b",
  processing: "#3b82f6", 
  completed: "#10b981",
  cancelled: "#ef4444",
};

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [error, setError] = useState("");

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("api/store/orders/");
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("خطا در بارگذاری سفارش‌ها", err);
        setError("خطا در بارگذاری سفارش‌ها");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatPrice = (price) => {
    return price?.toLocaleString() || "0";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fa-IR");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>در حال بارگذاری سفارش‌ها...</p>
      </div>
    );
  }

  return (
    <div className={styles.ordersContainer}>
      <div className={styles.ordersMain}>
        <div className={styles.ordersContent}>
          <div className={styles.ordersHeader}>
            <div className={styles.headerTitle}>
              <FiShoppingBag className={styles.headerIcon} />
              <h1>سفارش‌های من</h1>
            </div>
            {orders.length > 0 && (
              <div className={styles.ordersCount}>
                {orders.length} سفارش
              </div>
            )}
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <FiPackage className={styles.emptyIcon} />
              <h3>هنوز سفارشی ثبت نکرده‌اید</h3>
              <p>می‌توانید از فروشگاه ما دیدن کنید و اولین خرید خود را انجام دهید</p>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {orders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderInfo}>
                      <div className={styles.orderId}>
                        <FiPackage className={styles.orderIcon} />
                        سفارش #{order.order_id || order.id}
                      </div>
                      <div 
                        className={styles.statusBadge}
                        style={{ backgroundColor: `${statusColors[order.status]}15`, color: statusColors[order.status] }}
                      >
                        {statusMap[order.status] || order.status}
                      </div>
                    </div>
                    
                    <div className={styles.orderMeta}>
                      <div className={styles.metaItem}>
                        <FiCalendar className={styles.metaIcon} />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                      <div className={styles.totalPrice}>
                        {formatPrice(order.total)} تومان
                      </div>
                    </div>
                  </div>

                  <div className={styles.orderPreview}>
                    <div className={styles.previewItems}>
                      {order.items?.slice(0, 3).map((item, index) => (
                        <div key={item.id} className={styles.previewItem}>
                          {item.product_variant?.product?.images?.[0]?.image && (
                            <img
                              src={item.product_variant.product.images[0].image}
                              alt={item.product_variant?.product?.title}
                              className={styles.previewThumb}
                            />
                          )}
                          {index === 2 && order.items.length > 3 && (
                            <div className={styles.moreItems}>+{order.items.length - 3}</div>
                          )}
                        </div>
                      ))}
                    </div>
                    <span className={styles.itemsCount}>
                      {order.items?.length || 0} کالا
                    </span>
                  </div>

                  {expanded[order.id] && (
                    <div className={styles.orderDetails}>
                      <div className={styles.detailSection}>
                        <h4 className={styles.detailTitle}>
                          <FiMapPin className={styles.detailIcon} />
                          آدرس ارسال
                        </h4>
                        <div className={styles.addressText}>
                          {order.shipping_address_detail
                            ? `${order.shipping_address_detail.state}، ${order.shipping_address_detail.city}، ${order.shipping_address_detail.address}`
                            : "—"}
                        </div>
                      </div>

                      <div className={styles.detailSection}>
                        <h4 className={styles.detailTitle}>محصولات سفارش</h4>
                        <div className={styles.productsList}>
                          {order.items?.length > 0 ? (
                            order.items.map((item) => (
                              <div key={item.id} className={styles.productItem}>
                                <div className={styles.productImage}>
                                  <img
                                    src={item.product_variant?.product?.images?.[0]?.image || "/placeholder.png"}
                                    alt={item.product_variant?.product?.title}
                                    className={styles.productThumb}
                                  />
                                </div>
                                <div className={styles.productInfo}>
                                  <h5 className={styles.productTitle}>
                                    {item.product_variant?.product?.title || "محصول"}
                                    {item.product_variant?.variant_display && (
                                      <span className={styles.variantName}>
                                        ({item.product_variant.variant_display})
                                      </span>
                                    )}
                                  </h5>
                                  <div className={styles.productMeta}>
                                    <span className={styles.productQuantity}>
                                      تعداد: {item.quantity}
                                    </span>
                                    <span className={styles.productPrice}>
                                      {formatPrice(item.price)} تومان
                                    </span>
                                  </div>
                                  <div className={styles.productTotal}>
                                    جمع: {formatPrice(item.price * item.quantity)} تومان
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className={styles.noProducts}>—</div>
                          )}
                        </div>
                      </div>

                      <div className={styles.orderSummary}>
                        <div className={styles.summaryRow}>
                          <span>جمع کل محصولات:</span>
                          <span>{formatPrice(order.total)} تومان</span>
                        </div>
                        <div className={styles.summaryRow}>
                          <span>هزینه ارسال:</span>
                          <span>
                            {order.shipping_cost === 0 
                              ? "رایگان" 
                              : `${formatPrice(order.shipping_cost)} تومان`
                            }
                          </span>
                        </div>
                        <div className={styles.divider}></div>
                        <div className={`${styles.summaryRow} ${styles.finalTotal}`}>
                          <span>مبلغ نهایی:</span>
                          <span>{formatPrice(order.final_total || order.total)} تومان</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={styles.orderActions}>
                    <button
                      className={styles.detailsButton}
                      onClick={() => toggleExpand(order.id)}
                    >
                      {expanded[order.id] ? (
                        <>
                          <FiChevronUp />
                          بستن جزئیات
                        </>
                      ) : (
                        <>
                          <FiChevronDown />
                          نمایش جزئیات
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}