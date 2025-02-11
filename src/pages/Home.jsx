import { getCarousalProducts, getFeaturedProducts, getTrendProducts, getProducts } from "../store/prodectSlice";
import { getCategories } from "../store/categoriesSlice"; // Import the getCategories action
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HeroCarousel from "../components/HeroCarousel";
import { useEffect, useContext } from "react";
import FeaturedProducts from "../components/FeaturedProducts";
import TrendProducts from "../components/TrendProducts";
import CategoriesPage from "../components/CategoriesPage"; // Import CategoriesPage component
import CheckoutProducts from "../components/CheckoutProducts";
import LanguageContext from "../LanguageContext";
import translations from "../translations";

const Home = () => {
  const { language } = useContext(LanguageContext); // Get the current language from context
  const { isLoding, carousalProducts, featuredProducts, trendProducts } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const { isLoading, categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getFeaturedProducts("featured"));
    dispatch(getCarousalProducts("carousel"));
    dispatch(getProducts({ page: 1, pageSize: 2 })); // Fetch data for the first page
    dispatch(getTrendProducts("trening"));
    dispatch(getCategories()); // Dispatch the getCategories action to fetch categories
  }, [dispatch]);

  return (
    <>
      {/* Start Hero Carousel */}
      <HeroCarousel data={carousalProducts} />
      {/* Hero Section with Brief Introduction */}
      <section className="py-5 bg-info text-white">
        <div className="container text-center">
          <h1>{translations[language].home}</h1>
          <p>
            {translations[language].heroDescription}
          </p>
          <Link to="/shop" className="btn btn-light">{translations[language].shopNow}</Link>
        </div>
      </section>

      {/* Trend Products */}
      {isLoding ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{translations[language].loading}</span>
        </div>
      ) : (
        <section className="py-5">
          <div className="container">
            <div className="row text-center mb-5">
              <div className="col-lg-8 mx-auto">
                <h2 className="h1">{translations[language].trending}</h2>
                <p className="text-muted">{translations[language].trendingDescription}</p>
              </div>
            </div>
            <TrendProducts data={trendProducts} />
          </div>
        </section>
      )}

      {/* About African Products Section */}
      <section className="bg-primary text-white py-5">
        <div className="container text-center">
          <h2 className="h2">{translations[language].whyChoose}</h2>
          <p>
            {translations[language].aboutDescription}
          </p>
          <div className="row">
            <div className="col-12 col-md-4 mb-4">
              <h4>{translations[language].beautyCosmetics}</h4>
              <p>{translations[language].beautyDescription}</p>
            </div>
            <div className="col-12 col-md-4 mb-4">
              <h4>{translations[language].africanFoodSpices}</h4>
              <p>{translations[language].foodDescription}</p>
            </div>
            <div className="col-12 col-md-4 mb-4">
              <h4>{translations[language].uniqueFashion}</h4>
              <p>{translations[language].fashionDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Start Categories Section */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h1 className="h2">{translations[language].exploreCategories}</h1>
          <p className="text-muted mb-5">{translations[language].categoriesDescription}</p>
          {/* Import and Display Categories */}
          <CategoriesPage categories={categories} /> {/* Passing categories data to CategoriesPage component */}
        </div>
      </section>
      {/* End Categories Section */}

      {/* Featured Products Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <h2 className="h1">{translations[language].featuredProducts}</h2>
              <p className="text-muted">
                {translations[language].featuredDescription}
              </p>
            </div>
          </div>
          <FeaturedProducts data={featuredProducts} />
        </div>
      </section>

      {/* Start Customer Testimonials Section */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="h2 mb-4">{translations[language].customerTestimonials}</h2>

          <div className="row">
            {/* Testimonial 1 */}
            <div className="col-12 col-md-3 mb-4">
              <div className="testimonial-box p-4 bg-white shadow rounded">
                <div className="testimonial-message bg-light p-3 rounded">
                  <p className="lead mb-3">{translations[language].testimonial1}</p>
                </div>
                <footer>- Sarah K.</footer>
                <p className="text-muted mt-2">{translations[language].testimonial1Description}</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="col-12 col-md-3 mb-4">
              <div className="testimonial-box p-4 bg-white shadow rounded">
                <div className="testimonial-message bg-light p-3 rounded">
                  <p className="lead mb-3">{translations[language].testimonial2}</p>
                </div>
                <footer>- John M.</footer>
                <p className="text-muted mt-2">{translations[language].testimonial2Description}</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="col-12 col-md-3 mb-4">
              <div className="testimonial-box p-4 bg-white shadow rounded">
                <div className="testimonial-message bg-light p-3 rounded">
                  <p className="lead mb-3">{translations[language].testimonial3}</p>
                </div>
                <footer>- Emma T.</footer>
                <p className="text-muted mt-2">{translations[language].testimonial3Description}</p>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="col-12 col-md-3 mb-4">
              <div className="testimonial-box p-4 bg-white shadow rounded">
                <div className="testimonial-message bg-light p-3 rounded">
                  <p className="lead mb-3">{translations[language].testimonial4}</p>
                </div>
                <footer>- Michael A.</footer>
                <p className="text-muted mt-2">{translations[language].testimonial4Description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Customer Testimonials Section */}
    </>
  );
};

export default Home;
