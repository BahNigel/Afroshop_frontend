import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useContext } from "react";
import LanguageContext from "./LanguageContext";
import translations from "./translations";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ShopSingle from "./pages/ShopSingle";
import Login from "./pages/Login";
import Shop from "./pages/Shop";
import Checkout from "./pages/Checkout";
import Register from "./pages/Register";
import Location from "./pages/Location";
import UserProfilePage from "./pages/UserProfilePage";
import SecondUserProfilePage from "./pages/SecondUserProfilePage";

const PrivateRoute = ({ children }) => {
  const isLogin = JSON.parse(localStorage.getItem("isLogin")) || false;
  return isLogin ? children : <Navigate to="/" replace />;
};

const Main = () => {
  const location = useLocation();
  const { language } = useContext(LanguageContext);

  return (
    <>
      {location.pathname !== "/login" && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/location" element={<Location />} />
        <Route path="/shop/:id" element={<ShopSingle />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={<PrivateRoute> <UserProfilePage /> </PrivateRoute>}
        />
        <Route
          path="/profile_pay"
          element={<PrivateRoute> <SecondUserProfilePage /> </PrivateRoute>}
        />
      </Routes>
      {location.pathname !== "/login" && <Footer />}
    </>
  );
};

export default Main;
