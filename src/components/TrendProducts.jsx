import { IoRemoveCircle } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaCartPlus } from "react-icons/fa";
import { addToCart, removeFromCart } from "../store/prodectSlice";
import {selectCartProductIds} from "../store/prodectSlice"
import LanguageContext from "../LanguageContext";
import translations from "../translations";
import {useContext } from "react";

const TrendProducts = ({ data }) => {
  // const { cartProductIds } = useSelector((state) => state.products);
  const cartProductIds = useSelector(selectCartProductIds);
  const dispatch = useDispatch();
  const { language } = useContext(LanguageContext);

  if (data.length > 0) {
    data = data.results;
  }

 


  return (
    <section
      style={{
        backgroundColor: "#f8f9fa",
        padding: "40px 0",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
          {data.count > 0 ? (
            data.results.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  width: "300px",
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                <Link to={`/shop/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "250px",
                      objectFit: "cover",
                      borderBottom: "1px solid #eee",
                    }}
                  />
                </Link>

                <div style={{ padding: "15px" }}>
                  <Link
                    to={`/shop/${item.id}`}
                    style={{
                      fontSize: "1.25rem",
                      color: "#007bff",
                      textDecoration: "none",
                      fontWeight: "bold",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    {item.name.substring(0, 30)}
                  </Link>

                  <p style={{ color: "#6c757d", fontSize: "0.9rem", margin: "0 0 10px" }}>
                    {item.category.name}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    
                  </div>

                  <p style={{ fontSize: "1rem", fontWeight: "bold", color: "#343a40", textAlign: "center" }}>
                    €{item.price}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      marginTop: "10px",
                    }}
                  >
                    <button
                      onClick={() =>
                        cartProductIds.some(product => product.id === item.id)
                          ? dispatch(removeFromCart(item))
                          : dispatch(addToCart(item))
                      }
                      style={{
                        background: cartProductIds.some(product => product.id === item.id)
                          ? "#dc3545"
                          : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "8px 12px",
                        cursor: "pointer",
                      }}
                    >
                      {cartProductIds.some(product => product.id === item.id) ? <IoRemoveCircle /> : <FaCartPlus />}
                    </button>

                    <Link
                      to={`/shop/${item.id}`}
                      style={{
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "8px 12px",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FaEye />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#6c757d" }}>
             {translations[language].NoP}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendProducts;
