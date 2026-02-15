"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { API_URL } from "@/config/config";
import styles from "./ShoppingCart.module.css";
import { MdDeleteOutline, MdShoppingCart } from "react-icons/md";
import { FiPlus, FiMinus, FiTruck, FiAlertTriangle } from "react-icons/fi";
import { RiCoupon3Line } from "react-icons/ri";

export default function ShoppingCartPage() {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const router = useRouter();

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${API_URL}api/store/cart/`);
        setCartData(response.data);
      } catch (err) {
        console.error(err);
        setError("خطا در بارگذاری سبد خرید");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const getItemFinalPrice = (item) => {
    const basePrice = item.product_variant?.price || 0;
    const promotions = item.product_variant?.product?.promotions || [];
    if (promotions.length > 0 && promotions[0].discount) {
      const discountPercent = promotions[0].discount;
      return Math.round(basePrice * (1 - discountPercent / 100));
    }
    return basePrice;
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (!cartData) return;
    
    const item = cartData.items.find((it) => it.id === itemId);
    if (!item) return;

    const step = item.product_variant?.product?.order_count || 1;
    const availableStock = item.product_variant?.stock || 0;

    if (newQuantity % step !== 0) return;
    if (newQuantity > availableStock || newQuantity < step) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    const updatedItems = cartData.items.map((it) =>
      it.id === itemId
        ? { product_variant_id: it.product_variant.id, quantity: newQuantity }
        : { product_variant_id: it.product_variant.id, quantity: it.quantity }
    );

    const updatedLocalItems = cartData.items.map((it) =>
      it.id === itemId ? { ...it, quantity: newQuantity } : it
    );
    setCartData({ ...cartData, items: updatedLocalItems });

    try {
      await axiosInstance.patch(`${API_URL}api/store/cart/`, {
        items: updatedItems,
      });
    } catch (err) {
      console.error("Failed to update item quantity", err);
      // Revert on error
      const revertedItems = cartData.items.map((it) =>
        it.id === itemId ? { ...it, quantity: item.quantity } : it
      );
      setCartData({ ...cartData, items: revertedItems });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const removeItem = async (itemId) => {
    if (!cartData) return;
    
    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    const itemToRemove = cartData.items.find((it) => it.id === itemId);
    setCartData({
      ...cartData,
      items: cartData.items.filter((it) => it.id !== itemId),
    });

    try {
      const updatedItems = cartData.items
        .filter((it) => it.id !== itemId)
        .map((it) => ({
          product_variant_id: it.product_variant.id,
          quantity: it.quantity,
        }));

      await axiosInstance.patch(`${API_URL}api/store/cart/`, {
        items: updatedItems,
      });
    } catch (err) {
      console.error("Failed to remove item", err);
      // Revert on error
      setCartData({
        ...cartData,
        items: [...cartData.items, itemToRemove],
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const calculateTotal = () => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce(
      (total, item) => total + getItemFinalPrice(item) * item.quantity,
      0
    );
  };

  const calculateShippingPrice = () => {
    const total = calculateTotal();
    return total < 1000000 ? 80000 : 0;
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const total = calculateTotal();
    return Math.round(total * (appliedCoupon.discount_percent / 100));
  };

  const calculateFinalTotal = () => {
    return calculateTotal() + calculateShippingPrice() - calculateDiscount();
  };

  // محاسبه مبلغ باقیمانده تا خرید رایگان
  const calculateRemainingForFreeShipping = () => {
    const freeShippingThreshold = 1000000;
    const total = calculateTotal();
    const remaining = freeShippingThreshold - total;
    return remaining > 0 ? remaining : 0;
  };

  // محاسبه درصد پیشرفت برای نوار پیشرفت
  const calculateShippingProgress = () => {
    const freeShippingThreshold = 1000000;
    const total = calculateTotal();
    const progress = (total / freeShippingThreshold) * 100;
    return Math.min(progress, 100);
  };

  const isCartValid = () => {
    if (!cartData?.items || cartData.items.length === 0) return false;
    return cartData.items.every((item) => {
      const availableStock = item.product_variant?.stock || 0;
      const step = item.product_variant?.product?.order_count || 1;
      return (
        item.quantity <= availableStock &&
        item.quantity >= step &&
        item.quantity % step === 0
      );
    });
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      // This would be your actual coupon API call
      // const response = await axiosInstance.post(`${API_URL}api/coupons/apply/`, { code: couponCode });
      // setAppliedCoupon(response.data);
      
      // Mock success for demonstration
      setAppliedCoupon({
        code: couponCode,
        discount_percent: 10,
        message: "کد تخفیف با موفقیت اعمال شد"
      });
      setCouponCode("");
    } catch (err) {
      setError("کد تخفیف معتبر نیست");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleCheckout = () => {
    router.push("/user-panel/checkout");
  };

  const continueShopping = () => {
    router.push("/shop");
  };

  if (loading && !cartData) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>در حال بارگذاری سبد خرید...</p>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartMain}>
        <div className={styles.cartHeader}>
          <div className={styles.headerTitle}>
            <MdShoppingCart className={styles.cartIcon} />
            <h1>سبد خرید شما</h1>
          </div>
          {cartData?.items?.length > 0 && (
            <div className={styles.itemCount}>
              {cartData.items.length} کالا
            </div>
          )}
        </div>

        <div className={styles.cartContent}>
          {error && (
            <div className={styles.errorMessage}>
              <FiAlertTriangle />
              {error}
            </div>
          )}

          {cartData?.items?.length > 0 ? (
            <div className={styles.cartWithSummary}>
              <div className={styles.itemsSection}>
                <div className={styles.itemsList}>
                  {cartData.items.map((item) => {
                    const promotions = item.product_variant?.product?.promotions || [];
                    const hasPromotion = promotions.length > 0 && promotions[0].discount;
                    const discountPercent = hasPromotion ? promotions[0].discount : 0;
                    const basePrice = item.product_variant?.price || 0;
                    const finalPrice = getItemFinalPrice(item);
                    const imageUrl = item.product_variant?.product?.images?.[0]?.image || "/placeholder.png";
                    const step = item.product_variant?.product?.order_count || 1;
                    const isUpdating = updatingItems.has(item.id);
                    const stockStatus = item.product_variant?.stock || 0;

                    return (
                      <div key={item.id} className={`${styles.cartItem} ${isUpdating ? styles.updating : ''}`}>
                        {isUpdating && <div className={styles.updatingOverlay}></div>}
                        
                        <div className={styles.itemImage}>
                          {hasPromotion && (
                            <span className={styles.discountBadge}>
                              %{discountPercent}
                            </span>
                          )}
                          <img
                            src={imageUrl}
                            alt={item.product_variant?.product?.title || "Product Image"}
                          />
                        </div>
                        
                        <div className={styles.itemDetails}>
                          <div className={styles.itemHeader}>
                            <h3 className={styles.itemTitle}>
                              {item.product_variant?.product?.title || "Product Name"}
                            </h3>
                            <button
                              className={styles.removeItemButton}
                              onClick={() => removeItem(item.id)}
                              disabled={isUpdating}
                            >
                              <MdDeleteOutline />
                            </button>
                          </div>
                          
                          <p className={styles.itemDescription}>
                            {item.product_variant?.product?.description || ""}
                          </p>
                          
                          <div className={styles.priceSection}>
                            {hasPromotion ? (
                              <div className={styles.priceWrapper}>
                                <span className={styles.oldPrice}>
                                  {basePrice.toLocaleString()} تومان
                                </span>
                                <span className={styles.newPrice}>
                                  {finalPrice.toLocaleString()} تومان
                                </span>
                              </div>
                            ) : (
                              <span className={styles.itemPrice}>
                                {basePrice.toLocaleString()} تومان
                              </span>
                            )}
                            
                            <div className={styles.itemTotal}>
                              جمع: {(finalPrice * item.quantity).toLocaleString()} تومان
                            </div>
                          </div>

                          <div className={styles.itemInfo}>
                            <p className={`${styles.itemStock} ${stockStatus < 3 ? styles.lowStock : ''}`}>
                              موجودی: {stockStatus} عدد
                              {stockStatus < 3 && stockStatus > 0 && " (کم موجودی)"}
                              {stockStatus === 0 && " (ناموجود)"}
                            </p>
                            {step > 1 && (
                              <p className={styles.itemStep}>
                                حداقل سفارش: {step} عدد
                              </p>
                            )}
                          </div>

                          <div className={styles.quantityControl}>
                            <div className={styles.quantityBox}>
                              <button
                                className={`${styles.quantityButton} ${styles.plusButton}`}
                                onClick={() => updateQuantity(item.id, item.quantity + step)}
                                disabled={
                                  item.quantity + step > stockStatus || isUpdating
                                }
                              >
                                <FiPlus />
                              </button>

                              <span className={styles.quantityNumber}>
                                {item.quantity}
                              </span>

                              {item.quantity > step ? (
                                <button
                                  className={`${styles.quantityButton} ${styles.minusButton}`}
                                  onClick={() => updateQuantity(item.id, item.quantity - step)}
                                  disabled={isUpdating}
                                >
                                  <FiMinus />
                                </button>
                              ) : (
                                <button
                                  className={`${styles.quantityButton} ${styles.deleteButton}`}
                                  onClick={() => removeItem(item.id)}
                                  disabled={isUpdating}
                                >
                                  <MdDeleteOutline />
                                </button>
                              )}
                            </div>
                            
                            {stockStatus === 0 && (
                              <span className={styles.outOfStock}>ناموجود</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary Section */}
              <div className={styles.summarySection}>
                <div className={styles.summaryCard}>
                  <h3 className={styles.summaryTitle}>خلاصه سفارش</h3>
                  
                  {!isCartValid() && (
                    <div className={styles.stockWarning}>
                      <FiAlertTriangle />
                      برخی از محصولات در سبد خرید شما از موجودی موجود بیشتر هستند یا تعدادشان با حداقل سفارش همخوانی ندارد.
                    </div>
                  )}

                  {/* Coupon Section */}
                  {/* <div className={styles.couponSection}>
                    {appliedCoupon ? (
                      <div className={styles.appliedCoupon}>
                        <div className={styles.couponInfo}>
                          <RiCoupon3Line />
                          <span>کد تخفیف: {appliedCoupon.code}</span>
                          <span className={styles.couponDiscount}>
                            {appliedCoupon.discount_percent}% تخفیف
                          </span>
                        </div>
                        <button 
                          className={styles.removeCouponButton}
                          onClick={removeCoupon}
                        >
                          حذف
                        </button>
                      </div>
                    ) : (
                      <div className={styles.couponInputGroup}>
                        <input
                          type="text"
                          placeholder="کد تخفیف دارید؟"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className={styles.couponInput}
                        />
                        <button 
                          className={styles.applyCouponButton}
                          onClick={applyCoupon}
                          disabled={!couponCode.trim()}
                        >
                          اعمال
                        </button>
                      </div>
                    )}
                  </div> */}

                  <div className={styles.summaryDetails}>
                    <div className={styles.summaryRow}>
                      <span>جمع سبد خرید:</span>
                      <span>{calculateTotal().toLocaleString()} تومان</span>
                    </div>

                    {appliedCoupon && (
                      <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                        <span>تخفیف:</span>
                        <span>-{calculateDiscount().toLocaleString()} تومان</span>
                      </div>
                    )}

                    <div className={styles.summaryRow}>
                      <span>
                        <FiTruck className={styles.shippingIcon} />
                        هزینه ارسال:
                      </span>
                      <span>
                        {calculateShippingPrice() === 0
                          ? "رایگان"
                          : `${calculateShippingPrice().toLocaleString()} تومان`}
                      </span>
                    </div>

                    {/* بخش نمایش مبلغ باقیمانده تا خرید رایگان */}
                    {calculateShippingPrice() > 0 ? (
                      <div className={styles.freeShippingProgress}>
                        <div className={styles.freeShippingText}>
                          <FiTruck className={styles.truckIcon} />
                          {calculateRemainingForFreeShipping().toLocaleString()} تومان تا ارسال رایگان
                        </div>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${calculateShippingProgress()}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div className={`${styles.freeShippingProgress} ${styles.freeShippingAchieved}`}>
                        <div className={styles.freeShippingText}>
                          <FiTruck className={styles.truckIcon} />
                          🎉 تبریک! خرید شما رایگان ارسال می‌شود
                        </div>
                      </div>
                    )}

                    <div className={styles.divider}></div>

                    <div className={`${styles.summaryRow} ${styles.totalPayRow}`}>
                      <span>مبلغ نهایی:</span>
                      <span>{calculateFinalTotal().toLocaleString()} تومان</span>
                    </div>
                  </div>

                  <button
                    className={styles.checkoutButton}
                    onClick={handleCheckout}
                    disabled={loading || !isCartValid() || cartData.items.length === 0}
                  >
                    {loading ? "در حال پردازش..." : "ادامه فرآیند خرید"}
                  </button>

                  <button
                    className={styles.continueShoppingButton}
                    onClick={continueShopping}
                  >
                    ادامه خرید
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyCart}>
              <MdShoppingCart className={styles.emptyCartIcon} />
              <h3>سبد خرید شما خالی است</h3>
              <p>می‌توانید برای مشاهده محصولات بیشتر به صفحه فروشگاه بروید</p>
              <button 
                className={styles.continueShoppingButton}
                onClick={continueShopping}
              >
                مشاهده محصولات
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}