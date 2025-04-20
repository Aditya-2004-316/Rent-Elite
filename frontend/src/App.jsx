import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login"; // Ensure this import matches your file structure
import SignUp from "./components/SignUp"; // Import the SignUp component
import ForgotPassword from "./components/ForgotPassword"; // Import the ForgotPassword component
import Dashboard from "./components/Dashboard"; // Import the Dashboard component
import Favourites from "./components/Favourites";
import Profile from "./components/Profile";
import { BookingProvider } from "./context/BookingContext";
import MyBookings from "./components/MyBookings";
import PrivacyPolicy from "./components/PrivacyPolicy"; // Import the PrivacyPolicy component
import TermsOfService from "./components/TermsOfService";
import ContactUs from "./components/ContactUs"; // Import the TermsOfService component
import AboutUs from "./components/AboutUs";
import FAQs from "./components/FAQs";
import Support from "./components/Support";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import { SettingsProvider } from "./context/SettingsContext";
import LandingPage from "./components/LandingPage"; // Add this import
import Fleet from "./components/Fleet";
import LandingAboutUs from "./components/LandingAboutUs";
import LandingContact from "./components/LandingContact";
import LandingFAQs from "./components/LandingFAQs";
import LandingPrivacyPolicy from "./components/LandingPrivacyPolicy";
import LandingTermsOfService from "./components/LandingTermsOfService";
import { AuthProvider } from "./context/AuthContext";
import CompareView from "./components/CompareView";
import NewsletterAdmin from "./components/admin/NewsletterAdmin";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoutePopHandler from "./ProtectedRoutePopHandler";

const App = () => {
    return (
        <AuthProvider>
            <SettingsProvider>
                <BookingProvider>
                    <Router>
                        <ProtectedRoutePopHandler />
                        <Routes>
                            <Route path="/" element={<LandingPage />} />{" "}
                            {/* Change this line */}
                            <Route path="/login" element={<Login />} />{" "}
                            {/* Add this line */}
                            <Route path="/signup" element={<SignUp />} />{" "}
                            {/* Add SignUp route */}
                            <Route
                                path="/forgot-password"
                                element={<ForgotPassword />}
                            />{" "}
                            {/* Add Forgot Password route */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/favourites"
                                element={<Favourites />}
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/my-bookings"
                                element={<MyBookings />}
                            />
                            <Route
                                path="/privacy-policy"
                                element={<LandingPrivacyPolicy />}
                            />
                            <Route
                                path="/terms-of-service"
                                element={<LandingTermsOfService />}
                            />
                            <Route
                                path="/contact-us"
                                element={<LandingContact />}
                            />
                            <Route
                                path="/about-us"
                                element={<LandingAboutUs />}
                            />
                            <Route path="/faqs" element={<LandingFAQs />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/reset-password/:token"
                                element={<ResetPassword />}
                            />
                            <Route path="/cars" element={<Fleet />} />
                            <Route
                                path="/dashboard/privacy-policy"
                                element={<PrivacyPolicy />}
                            />
                            <Route
                                path="/dashboard/terms-of-service"
                                element={<TermsOfService />}
                            />
                            <Route
                                path="/dashboard/contact-us"
                                element={<ContactUs />}
                            />
                            <Route
                                path="/dashboard/about-us"
                                element={<AboutUs />}
                            />
                            <Route path="/dashboard/faqs" element={<FAQs />} />
                            <Route
                                path="/dashboard/support"
                                element={<Support />}
                            />
                            <Route path="/compare" element={<CompareView />} />
                            <Route
                                path="/admin/newsletter"
                                element={
                                    <AdminRoute>
                                        <NewsletterAdmin />
                                    </AdminRoute>
                                }
                            />
                        </Routes>
                    </Router>
                </BookingProvider>
            </SettingsProvider>
        </AuthProvider>
    );
};

export default App;
