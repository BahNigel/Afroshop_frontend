import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../store/categoriesSlice";
import { Link } from "react-router-dom";
import { FaTags } from "react-icons/fa";
import { useContext } from "react";
import LanguageContext from "../LanguageContext";
import translations from "../translations";

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories, isLoading, error } = useSelector((state) => state.categories);
  const { language } = useContext(LanguageContext);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Function to render category cards
  const renderCategories = () => {
    if (isLoading) {
      return <div className="text-center">{translations[language].loading}</div>;
    }

    if (categories.length === 0) {
      return <div className="text-center">{translations[language].NoCategory}</div>;
    }

    return categories.map((category) => (
      <div className="col-12 col-md-4 mb-4" key={category.id}>
        <div className="card shadow border-0 rounded">
          {/* Displaying category image */}
          {category.image && (
            <img
              src={category.image}
              alt={category.name}
              className="card-img-top rounded-top"
              style={{ objectFit: "cover", height: "200px" }}
            />
          )}
          <div className="card-body text-center">
            <h5 className="card-title">{category.name}</h5>
            <p className="card-text text-muted">{category.description}</p>
            {/* Update the link to pass the category ID to the Shop page */}
            <Link to={`/shop?category=${category.id}`} className="btn btn-primary">
              <FaTags />{translations[language].viewCategory}
            </Link>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <section className="bg-light py-5">
      <div className="container">
        <div className="row">{renderCategories()}</div>
      </div>
    </section>
  );
};

export default CategoriesPage;
