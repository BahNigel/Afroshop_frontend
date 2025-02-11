import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/authSlice";  // Make sure you have the appropriate action for registration
import "../css/login.css";
import LanguageContext from "../LanguageContext";
import { useContext } from "react";
import translations from "../translations";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { language } = useContext(LanguageContext);

  // Get isLoading and error from the Redux store
  const { isLoading, error } = useSelector((state) => state.auth);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for passwords
    if (password !== confirmPassword) {
      alert(translations[language].passwordsDoNotMatch); // Use translated message
      return;
    }

    // Dispatch registerUser action
    await dispatch(registerUser({ username, email, password }));

    // After successful registration, navigate to login page
    if (!isLoading && !error) {
      navigate("/login");
    }
  };

  return (
    <>
      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center mb-5">
              <h2 className="heading-section">{translations[language].registerPage}</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-12 col-lg-10">
              <div className="wrap d-md-flex">
                <div className="text-wrap p-4 p-lg-5 text-center d-flex align-items-center order-md-last">
                  <div className="text w-100">
                    <h2>{translations[language].welcomeRegister}</h2>
                    <p>{translations[language].haveAccount}</p>
                    <Link to="/login" className="btn btn-white btn-outline-white">
                      {translations[language].login}
                    </Link>
                  </div>
                </div>
                <div className="login-wrap p-4 p-lg-5">
                  <div className="d-flex">
                    <div className="w-100">
                      <h3 className="mb-4">{translations[language].signUp}</h3>
                    </div>
                  </div>
                  <form className="signin-form" onSubmit={handleSubmit}>
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    <div className="form-group mb-3">
                      <label className="label" htmlFor="username">
                        {translations[language].username}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={translations[language].username}
                        name="username"
                        required
                        value={username}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="label" htmlFor="email">
                        {translations[language].email}
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder={translations[language].email}
                        name="email"
                        required
                        value={email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="label" htmlFor="password">
                        {translations[language].password}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder={translations[language].password}
                        name="password"
                        required
                        value={password}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="label" htmlFor="confirmPassword">
                        {translations[language].confirmPassword}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder={translations[language].confirmPassword}
                        name="confirmPassword"
                        required
                        value={confirmPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <button
                        type="submit"
                        className="form-control btn btn-primary submit px-3"
                        disabled={isLoading} // Disable button while loading
                      >
                        {isLoading ? translations[language].signingUpButton : translations[language].signUpButton}
                      </button>
                    </div>
                    <div className="form-group d-md-flex"></div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
