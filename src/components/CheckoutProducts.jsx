import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  getUserCheckoutData,
  deleteCheckout,
  deleteCheckoutItem,
  pleaseOrder,
  handlePaymentSuccess,
} from "../store/authSlice";
import { useContext } from "react";
import LanguageContext from "../LanguageContext";
import translations from "../translations";

const CheckoutProducts = () => {
  const dispatch = useDispatch();
  const { checkoutData, isLoading, error } = useSelector((state) => state.auth);
  const [expandedCheckout, setExpandedCheckout] = useState(null);
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    dispatch(getUserCheckoutData());
  }, [dispatch]);

  const toggleExpand = (checkoutId) => {
    setExpandedCheckout((prev) => (prev === checkoutId ? null : checkoutId));
  };

  const handleDeleteCheckout = (checkoutId) => {
    if (window.confirm(translations[language].deleteCheckoutConfirm)) {
      dispatch(deleteCheckout(checkoutId)).then(() => {
        dispatch(getUserCheckoutData());
        window.location.reload();
      });
    }
  };

  const handleDeleteItem = (checkoutId, itemId, cartItems) => {
    if (window.confirm(translations[language].deleteItemConfirm)) {
      dispatch(deleteCheckoutItem({ checkoutId, itemId })).then(() => {
        dispatch(getUserCheckoutData());

        if (cartItems.length === 1) {
          handleDeleteCheckout(checkoutId);
        }
      });
    }
  };

  const handlePlaceOrder = async (checkout) => {
    try {
      const orderId = Date.now(); // Example: Generate a dynamic order ID (replace with backend logic)
      const result = await dispatch(
        pleaseOrder({
          items: checkout.cart_items.map((item) => ({
            id: item.product.id,
            quantity: item.quantity,
            bulk: item.bulk,
          })),
          orderId: orderId,
          id: checkout.id,
        })
      ).unwrap();

      alert(`${translations[language].orderPlaced} ${checkout.id}!`);

      // Reload the page and navigate to a new page (replace '/order-success' with your route)
      window.location.href = `/profile_pay`;

      return result; // Return result for further handling (optional)
    } catch (error) {
      console.error("Order placement failed:", error);
      alert(`${translations[language].orderPlacementFailed} ${error}`);
      throw error; // Propagate the error for the caller
    }
  };

  const onPaymentSuccess = async (checkoutId, details) => {
    try {
      // Find the relevant checkout data by ID
      const checkout = checkoutData.find((data) => data.id === checkoutId);
      if (!checkout) {
        throw new Error("Checkout data not found.");
      }

      // Place the order
      const orderResult = await handlePlaceOrder(checkout);

      // Handle successful payment
      const orderId = Number(orderResult.order.id);
      await dispatch(handlePaymentSuccess({ orderId, details })).unwrap();

      alert(translations[language].paymentSuccess);
      console.log("Order result:", orderResult);
    } catch (error) {
      console.error("Payment success handling failed:", error);
      alert(`${translations[language].paymentError} ${error.message}`);
    }
  };

  const renderProducts = (cartItems, checkoutId) => (
    <div className="mt-3">
      {cartItems.map((cartItem) => (
        <div key={cartItem.product.id} className="card mb-2 p-2 shadow-sm d-flex">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-between align-items-center">
              <img
                src={`${process.env.REACT_APP_URL}${cartItem.product.image}`}
                alt={cartItem.product.name}
                style={{ width: "60px", height: "60px", objectFit: "cover" }}
                className="me-3 rounded"
              />
              <div className="flex-grow-1">
                <h6 className="mb-0">{cartItem.product.name}</h6>
                <p className="mb-0 text-muted small">
                  €{cartItem.bulk ? cartItem.product.bulk_pirce : cartItem.product.price} | {cartItem.quantity} pcs
                </p>
              </div>
            </div>
            <div>
              <button
                className="btn btn-danger btn-sm ms-2"
                onClick={() => handleDeleteItem(checkoutId, cartItem.product.id, cartItems)}
              >
                <FaTrashAlt size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return <p>{translations[language].loading}</p>;
  }

  if (!Array.isArray(checkoutData) || checkoutData.length === 0) {
    return (
      <section className="bg-light py-5">
        <div className="container">
          <p>{translations[language].noCheckoutFound}</p>
        </div>
      </section>
    );
  }

  if (error) {
    return <p>{translations[language].error} {error}</p>;
  }

  return (
    <PayPalScriptProvider
      options={{
        "client-id": "AVLaW6oUryRQPa_fqFpDODgcuH-QUUUx6kHb_psYGqMIkUqHqaaPaO2a_Z0dByjeh8H7Z5Z0pJPGNU6w",
        currency: "EUR",
      }}
    >
      <section className="bg-light py-5">
        <div className="container">
          {checkoutData.map((checkout) => (
            <div key={checkout.id} className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">{translations[language].checkoutId} {checkout.id}</h5>
                  <p className="mb-0 text-muted small">
                  {translations[language].date}: {new Date(checkout.created_at).toLocaleDateString()} | {translations[language].total}:
                    €{checkout.total_price}
                  </p>
                </div>
                <div>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleDeleteCheckout(checkout.id)}
                  >
                    {translations[language].delete}
                  </button>
                  <button
                    className="btn btn-link p-0 text-dark"
                    onClick={() => toggleExpand(checkout.id)}
                  >
                    {expandedCheckout === checkout.id ? (
                      <FaChevronUp size={20} />
                    ) : (
                      <FaChevronDown size={20} />
                    )}
                  </button>
                </div>
              </div>
              {expandedCheckout === checkout.id && (
                <div className="p-3">
                  {renderProducts(checkout.cart_items, checkout.id)}
                  <div className="d-flex justify-content-between mt-3 align-items-center">
                    <button
                      className="btn btn-success"
                      onClick={() => handlePlaceOrder(checkout)}
                      style={{ flexShrink: 0 }}
                    >
                      {translations[language].placeOrder}
                    </button>
                    <div className="paypal-button-wrapper ms-3">
                      <PayPalButtons
                        style={{ layout: "horizontal" }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  value: Number(checkout.total_price).toFixed(2),
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order.capture().then((details) => {
                            alert(translations[language].paymentSuccess);
                            onPaymentSuccess(checkout.id, details);
                          });
                        }}
                        onError={(err) => {
                          console.error("PayPal Checkout onError:", err);
                          alert(translations[language].paymentError);
                        }}
                      />
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

export default CheckoutProducts;
