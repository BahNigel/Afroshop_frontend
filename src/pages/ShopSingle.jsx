import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, Fragment } from "react";
import { getSingleProduct, addToCart } from "../store/prodectSlice"; 
import { Link } from "react-router-dom";
import { selectCartProductIds } from "../store/prodectSlice";
import LanguageContext from "../LanguageContext";
import translations from "../translations";
import { useContext } from "react";

const ShopSingle = () => {
  const cartProductIds = useSelector(selectCartProductIds);
  const { singleProduct } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { language } = useContext(LanguageContext);

  const productInCart = cartProductIds.find(product => product.id === Number(id));
  const initialQuantity = productInCart ? productInCart.quantity : 1;
  const [quantity, setQuantity] = useState(initialQuantity);
  const [mainImage, setMainImage] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [purchaseType, setPurchaseType] = useState("single"); // 'single' or 'bulk'
  const [notification, setNotification] = useState(""); // State to manage the popup notification visibility

  useEffect(() => {
    dispatch(getSingleProduct(id))
      .then((action) => {
        if (action.payload) {
          setMainImage(action.payload.image);
        }
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [dispatch, id]);

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const rect = e.target.getBoundingClientRect();
    const offsetX = ((e.clientX - rect.left) / rect.width) * 100;
    const offsetY = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x: offsetX, y: offsetY });
  };

  const handleAddToCart = () => {
    const price = purchaseType === "bulk" ? singleProduct.bulk_pirce : singleProduct.price;
    dispatch(addToCart({ 
      ...singleProduct, 
      quantity, 
      price: price,
      bulk: purchaseType === "bulk" 
    }));
    
    setNotification(translations[language]["itemAddedToCart"]); // Show notification with translation
    setTimeout(() => {
      setNotification(""); // Hide notification after 3 seconds
    }, 3000);
  };

  return (
    <Fragment>
      <section className="bg-light">
        <div className="container pb-5">
          <div className="row">
            {/* Main Image Section */}
            <div className="col-lg-5 mt-5">
              <div className="card mb-3">
                <div 
                  className="main-image-container"
                  style={{ overflow: "hidden", position: "relative", cursor: "zoom-in" }}
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    className="card-img img-fluid main-image"
                    src={mainImage}
                    alt={singleProduct?.title || translations[language]["productImageAlt"]}
                    style={{ 
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      transform: isZoomed ? "scale(2)" : "scale(1)",
                      transition: isZoomed ? "none" : "transform 0.3s ease-in-out"
                    }}
                  />
                </div>
              </div>

              {/* Related Images Section */}
              <div className="row">
                {singleProduct?.related_images?.map((item, index) => (
                  <div key={index} className="col-3 mb-2">
                    <img
                      src={item.image}
                      alt={`Related ${index}`}
                      className="related-image"
                      onClick={() => setMainImage(item.image)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="col-lg-7 mt-5">
              <div className="card">
                <div className="card-body">
                  <h1 className="h2">{singleProduct?.title}</h1>

                  {/* Price Logic */}
                  {singleProduct?.bulk_pirce && singleProduct?.price ? (
                    <div>
                      <label htmlFor="purchaseType">{translations[language]["selectPurchaseOption"]}</label>
                      <select 
                        id="purchaseType" 
                        className="form-control my-2"
                        value={purchaseType}
                        onChange={(e) => setPurchaseType(e.target.value)}
                      >
                        <option value="single">
                          {translations[language]["buySingle"]} - ${singleProduct.price}
                        </option>
                        <option value="bulk">
                          {translations[language]["buyBulk"]} - ${singleProduct.bulk_pirce}
                        </option>
                      </select>
                    </div>
                  ) : singleProduct?.bulk_pirce ? (
                    <p className="h3 py-2">{translations[language]["bulkPrice"]}: ${singleProduct.bulk_pirce}</p>
                  ) : (
                    <p className="h3 py-2">${singleProduct?.price}</p>
                  )}

                  <ul className="list-inline">
                    <li className="list-inline-item"><h6>{translations[language]["category"]}:</h6></li>
                    <li className="list-inline-item">
                      <p className="text-muted"><strong>{singleProduct?.category?.name || translations[language]["notAvailable"]}</strong></p>
                    </li>
                  </ul>

                  <h6 className="bold">{translations[language]["description"]}:</h6>
                  <p>{singleProduct?.description}</p>

                  {singleProduct?.quantity_in_stock > 0 ? (
                    <p className="text-success fw-bold">
                      {translations[language]["inStock"]} ({singleProduct?.quantity_in_stock} {translations[language]["available"]})
                    </p>
                  ) : (
                    <p className="text-danger fw-bold">{translations[language]["outOfStock"]}</p>
                  )}

                  {/* Quantity Selector */}
                  {singleProduct?.quantity_in_stock > 0 && (
                    <div className="row">
                      <div className="col-3">
                        <label htmlFor="quantity" className="form-label">{translations[language]["quantity"]}</label>
                        <input
                          type="number"
                          id="quantity"
                          name="quantity"
                          min="1"
                          max={singleProduct?.quantity_in_stock || 1}
                          className="form-control"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  )}

                  <div className="row pb-3">
                    <div className="col d-grid">
                      <Link to="/checkout" className="btn btn-success btn-lg">
                        {translations[language]["buy"]}
                      </Link>
                    </div>
                    <div className="col d-grid">
                      {singleProduct?.quantity_in_stock > 0 && !cartProductIds.includes(singleProduct?.id) && (
                        <button
                          className="btn btn-success text-white mt-2"
                          onClick={handleAddToCart}
                        >
                          {translations[language]["addToCart"]}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popup Notification */}
      {notification && (
        <div className="popup-notification">
          {notification}
        </div>
      )}

      {/* Styles */}
      <style>{`
        .related-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 5px;
          cursor: pointer;
          transition: transform 0.2s ease-in-out;
        }
        .related-image:hover {
          transform: scale(1.1);
        }
        .popup-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 15px;
          border-radius: 5px;
          z-index: 999;
          font-size: 16px;
          opacity: 0.9;
          transition: opacity 0.3s ease-in-out;
        }
      `}</style>
    </Fragment>
  );
};

export default ShopSingle;
