import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import LanguageContext from "../LanguageContext";
import translations from "../translations";
import {useContext } from "react";

const HeroCarousel = ({ data }) => {
  // Ensure data is properly formatted
  const productList = data && data.results && Array.isArray(data.results) ? data.results : [];
  const { language } = useContext(LanguageContext);

  // Custom styles for carousel arrows
  const arrowStyles = {
    position: "absolute",
    zIndex: 2,
    top: "calc(50% - 20px)",
    cursor: "pointer",
    padding: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: "50%",
    border: "none",
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "white",
        padding: "20px 0",
      }}
    >
      <div
        style={{
          maxWidth: "90%",
          margin: "0 auto",
          borderRadius: "15px",
          overflow: "hidden",
        }}
      >
        {productList.length > 0 ? (
          <Carousel
            showArrows={true}
            showThumbs={false}
            dynamicHeight={false}
            showStatus={false}
            useKeyboardArrows={true}
            autoPlay
            infiniteLoop
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <button
                  onClick={onClickHandler}
                  title={label}
                  style={{ ...arrowStyles, left: 10 }}
                >
                  <FaChevronLeft style={{ fontSize: "20px", color: "#333" }} />
                </button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                <button
                  onClick={onClickHandler}
                  title={label}
                  style={{ ...arrowStyles, right: 10 }}
                >
                  <FaChevronRight style={{ fontSize: "20px", color: "#333" }} />
                </button>
              )
            }
          >
            {productList.map((item) => (
              <div
                key={item.id}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Link
                 style={{
                  width: "100%",
                  height: "500px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
                
                to={`/shop/${item.id}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "500px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
                </Link>
                <Link to={`/shop/${item.id}`}>
                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "20px",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    maxWidth: "80%",
                  }}
                >
                  <h3 style={{ margin: "0 0 10px", fontSize: "1.5rem" }}>{item.name}</h3>
                  <p style={{ margin: 0, fontSize: "1rem", lineHeight: "1.5" }}>
                    {item.description}
                  </p>
                </div>
                </Link>
              </div>
            ))}
          </Carousel>
        ) : (
          <p
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              color: "#555",
              padding: "20px",
            }}
          >
            {translations[language].NoP}
          </p>
        )}
      </div>
    </div>
  );
};

export default HeroCarousel;
