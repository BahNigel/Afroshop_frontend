import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { getUserOrderData, deleteOrder, handlePaymentSuccess } from "../store/authSlice";
import LanguageContext from "../LanguageContext";
import translations from "../translations";
import {useContext } from "react";

const OrderProducts = () => {
  const dispatch = useDispatch();
  const { orderData, isLoading, error } = useSelector((state) => state.auth);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    dispatch(getUserOrderData());
  }, [dispatch]);

  const toggleExpand = (orderId) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(orderId)).then(() => {
        dispatch(getUserOrderData());
        window.location.reload();
      });
    }
  };

  const onPaymentSuccess = async (orderId, details) => {
    try {
      // Handle successful payment
      await dispatch(handlePaymentSuccess({ orderId, details })).unwrap();
      alert("Payment and order processing completed successfully!");
    } catch (error) {
      console.error("Payment success handling failed:", error);
      alert(`Error processing payment: ${error.message}`);
    }
  };

  const renderProducts = (orderItems) => {
    const items = Array.isArray(orderItems) ? orderItems : [];

    if (items.length === 0) {
      return <p>{translations[language].NoP}</p>;
    }

    return (
      <div className="mt-3">
        {items.map((orderItem) => (
          <div key={orderItem.product.id} className="card mb-2 p-2 shadow-sm d-flex ">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div className="d-flex justify-content-between align-items-center">
                <img
                  src={`${process.env.REACT_APP_URL}${orderItem.product.image}`}
                  alt={orderItem.product.name}
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                  className="me-3 rounded"
                />
                <div className="flex-grow-1">
                  <h6 className="mb-0">{orderItem.product.name}</h6>
                  <p className="mb-0 text-muted small">
                  ${orderItem.bulk ? orderItem.product.bulk_pirce : orderItem.product.price} | {orderItem.quantity} pcs
                </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <p>...</p>;
  }

  // Ensure orderData is an array
  if (!Array.isArray(orderData) || orderData.length === 0) {
    return (
      <section className="bg-light py-5">
        <div className="container">
          <p>{translations[language].NoP}</p>
        </div>
      </section>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <PayPalScriptProvider
      options={{
        "client-id": "AdafjQDYIGrmWh8IcPeStknz4ng3r3Jf_H1C48qhHwmvGVItrvG7rKgIEBAlczYSNObqWA0ULp7T85Et", // Replace with sandbox or live credentials
        currency: "USD",
      }}
    >
      <section className="bg-light py-5">
        <div className="container">
          {orderData.map((order) => (
            <div key={order.id} className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">{translations[language].orderId}: {order.orderId}</h5>
                  <p className="mb-0 text-muted small">{translations[language].total}: ${order.total_price}</p>
                </div>
                <div>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    {translations[language].Delete}
                  </button>
                  <button
                    className="btn btn-link p-0 text-dark"
                    onClick={() => toggleExpand(order.id)}
                  >
                    {expandedOrder === order.id ? (
                      <FaChevronUp size={20} />
                    ) : (
                      <FaChevronDown size={20} />
                    )}
                  </button>
                </div>
              </div>
              {expandedOrder === order.id && (
                <div className="p-3">
                  {renderProducts(order.items)} {/* Safely render products */}
                  <div className="d-flex justify-content-between mt-3">
                    <div className="paypal-button-wrapper ms-3">
                      {order.status === "unpayed" && (
                        <PayPalButtons
                          style={{ layout: "horizontal" }}
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: Number(order.total_price).toFixed(2),
                                  },
                                },
                              ],
                            });
                          }}
                          onApprove={(data, actions) => {
                            return actions.order.capture().then((details) => {
                              alert("Payment successful!");
                              onPaymentSuccess(order.id, details);
                            });
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </PayPalScriptProvider>
  );
};

export default OrderProducts;
