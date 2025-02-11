import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCategories } from "../store/categoriesSlice";
import { getAboutUs } from "../store/categoriesSlice";
import LanguageContext from "../LanguageContext";
import translations from "../translations";
import {useContext } from "react";

const Footer = () => {
  const dispatch = useDispatch();
  const { categories, isLoading } = useSelector((state) => state.categories);
  const { aboutUs, isLoading: isLoadingAboutUs } = useSelector((state) => state.categories); // Fix: Access 'aboutUs' from the 'categories' slice
  const { language } = useContext(LanguageContext);

  // Fetch categories and About Us data when component mounts
  useEffect(() => {
    dispatch(getCategories());
    dispatch(getAboutUs()); // Dispatch the action to fetch About Us data
  }, [dispatch]);

  const shopName = aboutUs?.[0]?.company_name || "Shop Name";

  return (
    <>
      {/* <!-- Start Footer --> */}
      <footer className="bg-dark" id="tempaltemo_footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4 pt-5">
              <h2 className="h2 text-success border-bottom pb-3 border-light logo">
                {shopName}
              </h2>
              <ul className="list-unstyled text-light footer-link-list">
                <li>
                  <i className="fas fa-map-marker-alt fa-fw"></i>
                  {isLoadingAboutUs ? (
                    "Loading address..."
                  ) : (
                    aboutUs?.[0]?.location || "Address not available"
                  )}
                </li>
                <li>
                  <i className="fa fa-phone fa-fw"></i>
                  <a
                    className="text-decoration-none"
                    href={`tel:${isLoadingAboutUs ? "" : aboutUs?.[0]?.phone}`}
                  >
                    {isLoadingAboutUs ? "Loading..." : aboutUs?.[0]?.phone}
                  </a>
                </li>
                <li>
                  <i className="fa fa-envelope fa-fw"></i>
                  <a
                    className="text-decoration-none"
                    href={`mailto:${isLoadingAboutUs ? "" : aboutUs?.[0]?.email}`}
                  >
                    {isLoadingAboutUs ? "Loading..." : aboutUs?.[0]?.email}
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-md-4 pt-5">
              <h2 className="h2 text-light border-bottom pb-3 border-light">
                {translations[language].Pcategory}
              </h2>
              <ul className="list-unstyled text-light footer-link-list">
                {isLoading ? (
                  <li>{translations[language].Loading}...</li>
                ) : (
                  categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        className="text-decoration-none"
                        to={`/shop/?category=${category.id}`}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="col-md-4 pt-5">
              <h2 className="h2 text-light border-bottom pb-3 border-light">
              {translations[language].Finfo}
              </h2>
              <ul className="list-unstyled text-light footer-link-list">
                <li>
                  <a className="text-decoration-none" href="/">
                  {translations[language].home}
                  </a>
                </li>
                <li>
                  <a className="text-decoration-none" href="/about">
                  {translations[language].about}
                  </a>
                </li>
                <li>
                  <a className="text-decoration-none" href="/location">
                  {translations[language].location}
                  </a>
                </li>
                <li>
                  <a className="text-decoration-none" href="/shop">
                  {translations[language].shop}
                  </a>
                </li>
                <li>
                  <a className="text-decoration-none" href="/contact">
                  {translations[language].contact}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="row text-light mb-4">
            <div className="col-12 mb-3">
              <div className="w-100 my-3 border-top border-light"></div>
            </div>
            <div className="col-auto">
              <label className="sr-only" htmlFor="subscribeEmail">
                {translations[language].email}
              </label>
            </div>
          </div>
        </div>
      </footer>
      {/* <!-- End Footer --> */}
    </>
  );
};

export default Footer;
