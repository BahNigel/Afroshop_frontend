import React, { useContext, useEffect } from "react";
import { FaUser, FaCartArrowDown } from "react-icons/fa";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { getUserCheckoutData } from "../store/authSlice";
import { getAboutUs } from "../store/categoriesSlice";
import LanguageContext from "../LanguageContext";
import translations from "../translations";

const Header = () => {
  const dispatch = useDispatch();
  const { language, setLanguage } = useContext(LanguageContext); // Use LanguageContext

  useEffect(() => {
    dispatch(getUserCheckoutData());
    dispatch(getAboutUs());
  }, [dispatch]);

  const { checkoutData } = useSelector((state) => state.auth);
  const { cartProductIds } = useSelector((state) => state.products);
  const { isLogin } = useSelector((state) => state.auth);
  const { aboutUs } = useSelector((state) => state.categories);

  const itemNumber = checkoutData?.length || 0;
  const user = JSON.parse(localStorage.getItem("userData"));

  const shopName = aboutUs?.[0]?.company_name || "Shop Name";
  const contactEmail = aboutUs?.[0]?.email || "info@company.com";
  const contactPhone = aboutUs?.[0]?.phone || "+49 176 57860615";

  // Change Language Handler
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg bg-dark navbar-light d-none d-lg-block">
        <div className="container text-light">
          <div className="d-flex justify-content-between w-100">
            {/* Contact Info */}
            <div>
              <i className="fa fa-envelope mx-2"></i>
              <NavLink
                className="text-light text-decoration-none"
                to={`mailto:${contactEmail}`}
              >
                {contactEmail}
              </NavLink>
              <i className="fa fa-phone mx-2"></i>
              <NavLink
                className="text-light text-decoration-none"
                to={`tel:${contactPhone}`}
              >
                {contactPhone}
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Header */}
      <nav className="navbar navbar-expand-lg navbar-light shadow sticky-top">
        <div className="container">
          <Link className="navbar-brand text-success logo h1" to="/">
            {shopName}
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  {translations[language].home}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/shop">
                  {translations[language].shop}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/about">
                  {translations[language].about}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/contact">
                  {translations[language].contact}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/location">
                  {translations[language].location}
                </NavLink>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              {/* Translation Dropdown */}
              <select
                className="form-select me-3"
                value={language}
                onChange={handleLanguageChange}
                style={{ width: "120px" }}
              >
                <option value="en">English</option>
                <option value="de">Deutsch</option>
              </select>

              {/* Cart Icon */}
              <Link
                to="/checkout"
                className="position-relative text-decoration-none text-dark me-3"
              >
                <FaCartArrowDown size={24} />
                <span className="position-absolute top-0 start-100 translate-middle badge bg-light text-dark">
                  {cartProductIds.length || 0}
                </span>
              </Link>

              {/* User Info or Login/Logout */}
              {isLogin ? (
                <>
                  <Link
                    to="/profile"
                    className="me-3 text-decoration-none text-dark d-flex align-items-center"
                  >
                    <span>{user?.first_name || "User"}</span>
                    <span className="badge bg-secondary ms-2">{itemNumber}</span>
                  </Link>
                  <Link to="/profile" className="text-dark cursor-pointer">
                    <RiLogoutBoxRFill size={24} />
                  </Link>
                </>
              ) : (
                <Link to="/login" className="text-dark text-decoration-none">
                  <FaUser size={24} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
