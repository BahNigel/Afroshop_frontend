import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import "../css/login.css";
import LanguageContext from "../LanguageContext";
import { useContext } from "react";
import translations from "../translations";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLogin, isLoading } = useSelector((state) => state.auth);  // Get login state from Redux
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage2, setErrorMessage] = useState("");
  const { language } = useContext(LanguageContext);

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }
  }, [isLogin, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous error message
    dispatch(loginUser({ username: username, password }))
      .unwrap()
      .then(() => {
        navigate('/');  // Redirect to home after successful login
      })
      .catch((error) => {
        setErrorMessage(translations[language].errorMessage2); // Show error message in selected language
      });
  };

  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center mb-5">
            <h2 className="heading-section">{translations[language].loginTitle}</h2>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-10">
            <div className="wrap d-md-flex">
              <div className="text-wrap p-4 p-lg-5 text-center d-flex align-items-center order-md-last">
                <div className="text w-100">
                  <h2>{translations[language].welcomeMessage}</h2>
                  <p>{translations[language].signUpPrompt}</p>
                  <Link to="/register" className="btn btn-white btn-outline-white">
                    {translations[language].signUpButton}
                  </Link>
                </div>
              </div>
              <div className="login-wrap p-4 p-lg-5">
                <div className="d-flex">
                  <div className="w-100">
                    <h3 className="mb-4">{translations[language].signIn}</h3>
                  </div>
                </div>
                <form className="signin-form" onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label className="label" htmlFor="name">{translations[language].usernameLabel}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={translations[language].usernameLabel}
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="label" htmlFor="password">{translations[language].passwordLabel}</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder={translations[language].passwordLabel}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {errorMessage2 && <div className="alert alert-danger">{errorMessage2}</div>} {/* Display error */}
                  <div className="form-group">
                    <button
                      type="submit"
                      className="form-control btn btn-primary submit px-3"
                      disabled={isLoading}
                    >
                      {isLoading ? translations[language].loggingIn : translations[language].signInButton}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
