import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCartPlus, FaEye, FaRegHeart, FaStar } from "react-icons/fa";
import { IoRemoveCircle } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { addToCart, removeFromCart } from "../store/prodectSlice";
import { selectCartProductIds } from "../store/prodectSlice";
import LanguageContext from "../LanguageContext";
import translations from "../translations";
import {useContext } from "react";

const ProductFilter = ({ categories, products }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(10);
  const cartProductIds = useSelector(selectCartProductIds);
  const dispatch = useDispatch();
  const { language } = useContext(LanguageContext);

  const productList = products?.results || [];
  const location = useLocation();
  const categoryParam = new URLSearchParams(location.search).get("category");

  useEffect(() => {
    setFilteredProducts(productList);
  }, [productList]);

  useEffect(() => {
    if (categoryParam) {
      setFilteredProducts(
        productList.filter(
          (product) => product.category.id === parseInt(categoryParam, 10)
        )
      );
    } else {
      setFilteredProducts(productList);
    }
  }, [categoryParam, productList]);

  const handleFilterChange = (categoryName) => {
    setFilteredProducts(
      categoryName === "all"
        ? productList
        : productList.filter((product) => product.category.name === categoryName)
    );
    setVisibleProducts(10); // Reset visible products when filter changes
  };

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 10);
  };


  const categoryList = categories.map((category) => (
    <button
      key={category.id}
      className="btn btn-outline-dark m-2"
      onClick={() => handleFilterChange(category.name)}
    >
      {category.name} ({category.products.length})
    </button>
  ));

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-12">
          <div className="d-flex flex-wrap">
            <button
              className="btn btn-outline-dark m-2"
              onClick={() => handleFilterChange("all")}
            >
              {translations[language].All}
            </button>
            {categoryList}
          </div>

          <div className="row mt-4">
            {filteredProducts.slice(0, visibleProducts).length > 0 ? (
              filteredProducts.slice(0, visibleProducts).map((item) => (
                <div
                  key={item.id}
                  className="col-lg-3 col-md-6 mb-4 d-flex align-items-stretch"
                >
                  <div className="card product-card shadow-sm">
                    <Link to={`/shop/${item.id}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="card-img-top"
                        style={{
                          maxHeight: "200px",
                          objectFit: "cover",
                          minWidth: "250px",
                        }}
                      />
                    </Link>
                    <div className="card-body">
                      <h5 className="card-title text-truncate">
                        <Link
                          to={`/shop/${item.id}`}
                          className="text-decoration-none"
                        >
                          <div style={{width: '100%', justifyContent: 'space-between'}}>
                           <p>{item.name}</p> 
                           <p>€{item.price}</p> 
                          </div>
                          
                        </Link>
                      </h5>
                      <p className="card-text">{item.category.name}</p>
                    </div>
                    <div className="card-footer bg-white">
                      <div className="d-flex justify-content-between">
                        <Link
                          className="btn btn-sm btn-outline-success"
                          to={`/shop/${item.id}`}
                        >
                          <FaEye /> {translations[language].View}
                        </Link>
                        <button
                          className={`btn btn-sm ${
                            cartProductIds.some(
                              (product) => product.id === item.id
                            )
                              ? "btn-danger"
                              : "btn-success"
                          }`}
                          onClick={() =>
                            cartProductIds.some(
                              (product) => product.id === item.id
                            )
                              ? dispatch(removeFromCart(item))
                              : dispatch(addToCart(item))
                          }
                        >
                          {cartProductIds.some(
                            (product) => product.id === item.id
                          ) ? (
                            <>
                              <IoRemoveCircle />{translations[language].Remove} 
                            </>
                          ) : (
                            <>
                              <FaCartPlus />{translations[language].Add} 
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p className="text-center">{translations[language].NoP}</p>
              </div>
            )}
          </div>

          {visibleProducts < filteredProducts.length && (
            <div className="text-center mt-4">
              <button
                className="btn btn-primary"
                onClick={loadMoreProducts}
              >
                {translations[language].seeMore}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
