import "../css/login.css";
import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { useNavigate } from "react-router-dom"; // React Router hook
import { updateUser } from "../store/authSlice"; // Assuming updateUser is a thunk action
import CheckoutProducts from "../components/CheckoutProducts";
import OrderProducts from "../components/OrderProducts";
import LanguageContext from "../LanguageContext";
import translations from "../translations";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const { language } = useContext(LanguageContext); // Get the current language
  const { userData, tokens } = useSelector((state) => state.auth); // Get user data from Redux
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch logged-in user info from Redux state and set it in the form
    if (userData) {
      setUserInfo({
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        email: userData.email || "",
      });
    }
  }, [userData]);

  const handleUserInfoUpdate = async () => {
    const updatedInfo = {
      first_name: userInfo.firstName,
      last_name: userInfo.lastName,
      email: userInfo.email,
    };

    try {
      await dispatch(updateUser({ tokens, updatedInfo })); // Dispatch updateUser action
      alert(translations[language].updateSuccess); // Show success message
    } catch (err) {
      alert(translations[language].updateError); // Show error message
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("isLogin");
    window.location.reload();
  };

  const handleNextProfile = () => {
    navigate("/profile_pay"); // Navigate to the profile_pay page
  };

  return (
    <div className="user-profile-page">
      <CheckoutProducts />
      <button className="nex-profile-btn" onClick={handleNextProfile}>
        {translations[language].nextProfileBtn} {/* Translated button text */}
      </button>
      <div className="user-profile-container">
        {/* Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          {translations[language].logoutBtn} {/* Translated logout button text */}
        </button>

        <h2>{translations[language].userProfile}</h2>

        {/* User Info Section */}
        <div className="user-info">
          <h3>{translations[language].updateInfo}</h3>
          <div className="input-group">
            <input
              type="text"
              value={userInfo.firstName}
              onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
              placeholder={translations[language].firstName}  // Placeholder text translation
              className="input-field"
            />
            <input
              type="text"
              value={userInfo.lastName}
              onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
              placeholder={translations[language].lastName}  // Placeholder text translation
              className="input-field"
            />
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              placeholder={translations[language].email}  // Placeholder text translation
              className="input-field"
            />
          </div>
          <button className="update-btn" onClick={handleUserInfoUpdate}>
            {translations[language].updateBtn} {/* Translated button text */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
