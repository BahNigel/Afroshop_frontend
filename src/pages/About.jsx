import { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUs } from '../store/categoriesSlice';
import LanguageContext from '../LanguageContext'; // Importing the context
import translations from '../translations';

const About = () => {
    const dispatch = useDispatch();
    const { language } = useContext(LanguageContext); // Accessing the current language from context

    // Accessing data from Redux store
    const { aboutUs, isLoading, error } = useSelector(state => state.categories);

    // Fetch about us content when the component mounts
    useEffect(() => {
        dispatch(getAboutUs());
    }, [dispatch]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const lang = translations[language] || translations.en; // Default to English if language not found

    return (
        <>
            <section className="bg-success py-5">
                <div className="container">
                    <div className="row align-items-center py-5">
                        <div className="col-md-6">
                            <img
                                style={{ width: '100%', height: 500, borderRadius: 5 }}
                                src={aboutUs ? aboutUs[0].image : " "}
                                alt="About Hero"
                            />
                        </div>
                        <div className="col-md-6 text-white">
                            <h1>{lang.aboutTitle}</h1>
                            <p>
                                {aboutUs ? 
                                    (language === "en" ? aboutUs[0].description : aboutUs[0].description_de) 
                                    : "Loading content..."
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Start Section */}
            <section className="container py-5">
                <div className="row text-center pt-5 pb-3">
                    <div className="col-lg-6 m-auto">
                        <h1 className="h1">{lang.servicesTitle}</h1>
                        <p>
                            {lang.ourServicesTitle}
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 col-lg-3 pb-5">
                        <div className="h-100 py-5 services-icon-wap shadow">
                            <div className="h1 text-success text-center"><i className="fa fa-truck fa-lg"></i></div>
                            <h2 className="h5 mt-4 text-center">{lang.fastDelivery}</h2>
                            <p className="text-center">
                                {lang.fastDeliveryDesc}
                            </p>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-5">
                        <div className="h-100 py-5 services-icon-wap shadow">
                            <div className="h1 text-success text-center"><i className="fas fa-exchange-alt"></i></div>
                            <h2 className="h5 mt-4 text-center">{lang.easyReturns}</h2>
                            <p className="text-center">
                                {lang.easyReturnsDesc}
                            </p>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-5">
                        <div className="h-100 py-5 services-icon-wap shadow">
                            <div className="h1 text-success text-center"><i className="fa fa-percent"></i></div>
                            <h2 className="h5 mt-4 text-center">{lang.specialOffers}</h2>
                            <p className="text-center">
                                {lang.specialOffersDesc}
                            </p>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-5">
                        <div className="h-100 py-5 services-icon-wap shadow">
                            <div className="h1 text-success text-center"><i className="fa fa-user"></i></div>
                            <h2 className="h5 mt-4 text-center">{lang.customerSupport}</h2>
                            <p className="text-center">
                                {lang.customerSupportDesc}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default About;
