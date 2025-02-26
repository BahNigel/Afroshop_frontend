import "../css/checkout.css";
import { useDispatch, useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { removeFromCart, clearAllItems } from "../store/prodectSlice";
import { useState, useEffect, useContext } from "react";
import LanguageContext from "../LanguageContext";
import translations from "../translations";

const Checkout = () => {
  
  const { language } = useContext(LanguageContext); // Access current language from context
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access cartProductIds from Redux store
  const { cartProductIds } = useSelector((state) => state.products);

  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem("userData"));

  // Access token from Redux store (assuming you store it in the auth slice)
  const token = useSelector((state) => state.auth.tokens.access);

  const [cardInfo, setCardInfo] = useState({});
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const rating = (item) => {
    return Array(5)
      .fill()
      .map((_, index) => (
        <FaStar key={index} className={index < item ? "text-warning" : "text-muted"} />
      ));
  };

  const availableItems = cartProductIds.filter((item) => item.quantity_in_stock > 0);

  const totalPrice = availableItems.reduce((price, item) => {
    const itemPrice = item.cart_bulk ? item.bulk_pirce : item.price;
    return price + (parseFloat(itemPrice) * (item.quantity || 1));
  }, 0);

  const handleCheckout = () => {
    if (!user) {
      setShowLoginPopup(true);
    } else if (!token) {
      console.error("No access token available");
      return;
    } else {
      // Create an array with product id and quantity, following the backend model
      const checkoutData = {
        cartItems: availableItems.map((item) => ({
          id: item.id,  // Product ID
          quantity: item.quantity || 1,  // Quantity, default to 1 if not specified
          bulk: item.cart_bulk
        })),
        userId: user.id,  // Pass user ID
        cardInfo,  // Include card information if necessary (this should be handled securely)
      };

      // Send the request to the backend for checkout
      fetch(`${process.env.REACT_APP_API_URL}checkout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  // Ensures data is sent as JSON
          "Authorization": `Bearer ${token}`,  // Include the token in Authorization header
        },
        body: JSON.stringify(checkoutData),  // Convert the JS object to a JSON string
      })
        .then((response) => response.json())  // Parse the response as JSON
        .then((data) => {
          if (data.message === 'Checkout successful') {
            console.log("Checkout successful:", data);
            dispatch(clearAllItems());  // Clear all items in the cart after a successful checkout
            navigate("/profile");  // Navigate to the profile page or any other page after successful checkout
          } else {
            console.error("Checkout failed:", data);
          }
        })
        .catch((error) => {
          console.error("Error during checkout:", error);
        });
    }
  };

  useEffect(() => {
    if (showLoginPopup) {
      const timer = setTimeout(() => setShowLoginPopup(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showLoginPopup]);

  return (
    <div className="checkout">
      <div className="container">
        {cartProductIds.length === 0 && (
          <div className="no-items">
            <h2 className="desc">{translations[language].cartEmpty}</h2>
          </div>
        )}

        {cartProductIds.length > 0 && (
          <div className="wrapper wrapper-content animated fadeInRight">
            <div className="row">
              <div className="col-md-9">
                <div className="ibox">
                  <div className="ibox-title">
                    <span className="pull-right">
                      (<strong>{availableItems.length}</strong>){translations[language].items}
                    </span>
                    <h5>{translations[language].itemsInCart}</h5>
                  </div>

                  {cartProductIds.map((item) => (
                    <div className="ibox-content" key={item.id}>
                      <div className="table-responsive">
                        <table className="table shoping-cart-table">
                          <tbody>
                            <tr>
                              <td>
                                <img
                                  src={item.image}
                                  alt="product"
                                  width={90}
                                  height={100}
                                />
                              </td>
                              <td className="desc">
                                <h3>
                                  <Link to={`/shop/${item.id}`} className="text-navy">
                                    {item.name.substring(0, 30)}
                                  </Link>
                                </h3>
                                <dl className="small m-b-none">
                                  {rating(item.rating)}
                                  <dt>{translations[language].description}</dt>
                                  <dd>{item.description.substring(0, 180)}</dd>
                                </dl>

                                {item.quantity_in_stock === 0 ? (
                                  <div className="text-danger">{translations[language].OStock}</div>
                                ) : (
                                  <>
                                    {item.quantity ? (
                                      <dt>{translations[language].quantity}: {item.quantity}</dt>
                                    ) : (
                                      <dt>{translations[language].quantity}: 1</dt>
                                    )}
                                    <div className="m-t-sm">
                                      <Link
                                        to="#"
                                        className="text-muted"
                                        onClick={() => dispatch(removeFromCart(item))}
                                      >
                                        <i className="fa fa-trash"></i> {translations[language].removeItem}
                                      </Link>
                                    </div>
                                  </>
                                )}
                              </td>
                              <td>
                                {item.quantity_in_stock !== 0 && (
                                  <h4>
                                    {item.quantity
                                      ? `${item.quantity} * €${item.cart_bulk ? item.bulk_pirce : item.price} = €${(item.cart_bulk ? item.bulk_pirce : item.price) * item.quantity}`
                                      : `€${item.cart_bulk ? item.bulk_pirce : item.price}`}
                                  </h4>
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}

                  <div className="ibox-content">
                    <button
                      className="btn btn-primary pull-right"
                      onClick={handleCheckout}
                      disabled={availableItems.length === 0}
                    >
                      <i className="fa fa-shopping-cart"></i> {translations[language].checkout} 
                    </button>
                    <button
                      className="btn btn-primary pull-right"
                      onClick={() => dispatch(clearAllItems())}
                    >
                      <MdDelete /> {translations[language].clear}
                    </button>
                    <Link to="/shop" className="btn btn-primary">
                      <i className="fa fa-arrow-left"></i> {translations[language].continue}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="ibox">
                  <div className="ibox-title">
                    <h5>{translations[language].summary}</h5>
                  </div>
                  <div className="ibox-content">
                    <span>{translations[language].total}</span>
                    <h2 className="font-bold">€{totalPrice.toFixed(2)}</h2>
                    <hr />
                    <span className="text-muted small">
                      *{translations[language].statment}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showLoginPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>{translations[language].needRegister}</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              {translations[language].login}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/register")}
            >
              {translations[language].register}
            </button>
            <button
              className="close-btn"
              onClick={() => setShowLoginPopup(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
