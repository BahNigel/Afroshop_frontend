import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUs } from "../store/categoriesSlice";
import LanguageContext from "../LanguageContext";
import { useContext } from "react";
import translations from "../translations";

const Location = () => {
  const dispatch = useDispatch();
  
  // Get the About Us data from the Redux store
  const { aboutUs, isLoading, error } = useSelector((state) => state.categories);
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    // Fetch About Us data if not already fetched
    if (!aboutUs || aboutUs.length === 0) {
      dispatch(getAboutUs());
    }
  }, [dispatch, aboutUs]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{translations[language].errorMessage}</div>;
  }

  // Check if the About Us data contains latitude and longitude
  const aboutData = aboutUs && aboutUs[0] ? aboutUs[0] : {}; // Get the first item if available
  
  // Default coordinates in case data is not available
  const longitude = aboutData.longitude || 13.405000;
  const latitude = aboutData.latitude || 52.520000;

  return (
    <>
      {/* Display error message in case of failure */}
      
      {/* Start Content Page */}
      <div className="container-fluid bg-light py-5">
        <div className="col-md-6 m-auto text-center">
          <h1 className="h1">{translations[language].locationTitle}</h1>
          <p>{translations[language].locationText}</p>
        </div>
      </div>

      {/* Start Location */}
      <div className="container py-5">
        <div className="row py-5">
          <div className="col-md-12 text-center">
            <h3>{translations[language].locationMap}</h3>
            {/* Google Map iframe embed */}
            <div style={{ height: '400px' }}>
              {latitude && longitude ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.001}%2C${latitude - 0.001}%2C${longitude + 0.001}%2C${latitude + 0.001}&layer=mapnik`}
                  style={{ border: 'none' }}
                  title="Location Map"
                ></iframe>
              ) : (
                <div>{translations[language].locationNotAvailable}</div>
              )}
            </div>

            {/* Image of the Shop */}
            <div className="mt-5">
              <h3>{translations[language].shopImageTitle}</h3>
              <img
                src={aboutData.image || "your-image-url-here.jpg"} // Replace with actual image URL from About Us if available
                alt="Shop Image"
                style={{ maxWidth: '100%', height: 600 }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Location;
