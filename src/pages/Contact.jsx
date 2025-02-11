import React, { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from "sweetalert2";
import { postContactUsMessage } from "../store/categoriesSlice";
import LanguageContext from "../LanguageContext";
import translations from "../translations";
// import{ useContext } from "react";
// const translations = {
//   en: {},
//   de: {},
// }


const Contact = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.categories); // Get loading state
  const { language } = useContext(LanguageContext);

  const [formData, setFormData] = useState({
    name: "",
    email_leble: "",
    subject: "",
    message: "",
  });

  const [recaptchaValue, setRecaptchaValue] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle reCAPTCHA change
  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaValue) {
      Swal.fire("Oops!", translations[language].captchaWarning, "warning");
      return;
    }

    if (!formData.name || !formData.email_leble || !formData.subject || !formData.message) {
      Swal.fire("Oops!", translations[language].formIncomplete, "error");
      return;
    }

    try {
      const response = await dispatch(postContactUsMessage(formData)).unwrap(); // Dispatch action

      if (response?.message) {
        Swal.fire("Success!", response?.message || translations[language].successMessage, "success");
        setFormData({ name: "", email_leble: "", subject: "", message: "" }); // Reset form
        setRecaptchaValue(null); // Reset reCAPTCHA
      } else {
        Swal.fire("Error!", response?.message || translations[language].errorMessage, "error");
      }
    } catch (error) {
      Swal.fire("Error!", error || translations[language].errorMessage, "error");
    }
  };

  return (
    <>
      {/* Start Content Page */}
      <div className="container-fluid bg-light py-5">
        <div className="col-md-6 m-auto text-center">
          <h2 className="h2">{translations[language].contactUs || "Contact Us"}</h2>
         
        </div>
      </div>

      {/* Start Contact Form */}
      <div className="container py-5">
        <div className="row py-5">
          <form className="col-md-9 m-auto" onSubmit={handleSubmit}>
            <div className="row">
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="name">{translations[language].name}</label>
                <input
                  type="text"
                  className="form-control mt-1"
                  id="name"
                  name="name"
                  placeholder={translations[language].name}
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="email_leble">{translations[language].email_leble}</label>
                <input
                  type="email_leble"
                  className="form-control mt-1"
                  id="email_leble"
                  name="email_leble"
                  placeholder={translations[language].email_leble}
                  value={formData.email_leble}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="subject">{translations[language].subject}</label>
              <input
                type="text"
                className="form-control mt-1"
                id="subject"
                name="subject"
                placeholder={translations[language].subject}
                value={formData.subject}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message">{translations[language].message}</label>
              <textarea
                className="form-control mt-1"
                id="message"
                name="message"
                placeholder={translations[language].message}
                rows="8"
                value={formData.message}
                onChange={handleChange}
                disabled={isLoading}
              ></textarea>
            </div>

            {/* Google reCAPTCHA */}
            <div className="mb-3">
              <ReCAPTCHA
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} // Ensure this is set in your .env file
                onChange={handleRecaptchaChange}
              />
            </div>

            <div className="row">
              <div className="col text-end mt-2">
                <button type="submit" className="btn btn-success btn-lg px-3" disabled={isLoading}>
                  {isLoading ? "Sending..." : translations[language].submitButton}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
