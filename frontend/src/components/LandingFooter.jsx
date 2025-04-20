import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaCheckCircle,
    FaExclamationCircle,
} from "react-icons/fa";
import { FaXTwitter, FaPhone, FaEnvelope, FaPaperPlane } from "react-icons/fa6";
import { useSettings } from "../context/SettingsContext";
import logo from "../assets/logo.png";
import { Tooltip } from "react-tooltip";
import emailjs from "emailjs-com";

const LandingFooter = () => {
    const location = useLocation();
    const { darkMode } = useSettings();
    const [email, setEmail] = useState("");
    const [subscribeStatus, setSubscribeStatus] = useState({
        success: false,
        error: "",
        loading: false,
    });

    // Function to hide tooltips
    const hideTooltips = () => {
        const tooltipElements = document.querySelectorAll(
            '[id^="react-tooltip"]'
        );
        tooltipElements.forEach((tooltip) => {
            if (tooltip) {
                tooltip.style.visibility = "hidden";
                tooltip.style.opacity = "0";
                tooltip.style.display = "none";
            }
        });
    };

    // Hide tooltips on location change
    useEffect(() => {
        hideTooltips();
    }, [location.pathname]);

    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    // Social media links data with updated onClick handler
    const socialLinks = [
        {
            Icon: FaFacebookF,
            url: "https://www.facebook.com/profile.php?id=61575164133624&sk=about",
            name: "Facebook",
            id: "facebook-tooltip-landing",
        },
        {
            Icon: FaXTwitter,
            url: "https://x.com/RentEliteCars",
            name: "X",
            id: "x-tooltip-landing",
        },
        {
            Icon: FaInstagram,
            url: "https://www.instagram.com/rent_elite?igsh=Ym90amJtczJnMDll",
            name: "Instagram",
            id: "instagram-tooltip-landing",
        },
        {
            Icon: FaLinkedinIn,
            url: "https://www.linkedin.com/in/rent-elite-718296360/",
            name: "LinkedIn",
            id: "linkedin-tooltip-landing",
        },
    ];

    const getLogoStyles = () => {
        if (darkMode) {
            return "brightness-0 invert sepia(100%) saturate(3000%) hue-rotate(120deg) brightness(0.8)";
        }
        return "brightness-0 sepia(100%) saturate(3000%) hue-rotate(120deg) brightness(0.8)";
    };

    // Validate email function
    const validateEmail = (email) => {
        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    // Handle newsletter subscription
    const handleSubscribe = (e) => {
        e.preventDefault();

        // Reset status
        setSubscribeStatus({
            success: false,
            error: "",
            loading: true,
        });

        // Validate email
        if (!email) {
            setSubscribeStatus({
                success: false,
                error: "Please enter your email address",
                loading: false,
            });
            return;
        }

        if (!validateEmail(email)) {
            setSubscribeStatus({
                success: false,
                error: "Please enter a valid email address",
                loading: false,
            });
            return;
        }

        // Check for existing subscription
        const subscribers = JSON.parse(
            localStorage.getItem("newsletter_subscribers") || "[]"
        );
        if (subscribers.some((subscriber) => subscriber.email === email)) {
            setSubscribeStatus({
                success: false,
                error: "This email is already subscribed to our newsletter",
                loading: false,
            });
            return;
        }

        // EmailJS service, template, and user IDs
        const serviceID = "service_4ffcb8j";
        const templateID = "template_2aqx694";
        const userID = "ZqfFDcSi_NjM6cL6K";

        // Prepare template parameters
        const templateParams = {
            subscriber_email: email,
            to_email: email,
            subscription_date: new Date().toLocaleDateString(),
        };

        // Send subscription email using EmailJS
        emailjs
            .send(serviceID, templateID, templateParams, userID)
            .then((response) => {
                console.log("Newsletter subscription successful:", response);

                // Also store subscriber in localStorage for record keeping
                const subscribers = JSON.parse(
                    localStorage.getItem("newsletter_subscribers") || "[]"
                );
                subscribers.push({
                    email: email,
                    date: new Date().toISOString(),
                });
                localStorage.setItem(
                    "newsletter_subscribers",
                    JSON.stringify(subscribers)
                );

                // Update status and clear input
                setSubscribeStatus({
                    success: true,
                    error: "",
                    loading: false,
                });
                setEmail("");

                // Hide success message after 5 seconds
                setTimeout(() => {
                    setSubscribeStatus((prev) => ({ ...prev, success: false }));
                }, 5000);
            })
            .catch((err) => {
                console.error("Newsletter subscription failed:", err);
                setSubscribeStatus({
                    success: false,
                    error: "Failed to subscribe. Please try again later.",
                    loading: false,
                });
            });
    };

    return (
        <footer className={`${darkMode ? "bg-gray-900" : "bg-gray-100"} py-16`}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <div className="col-span-1">
                        <Link
                            to="/"
                            className="flex items-center space-x-2 mb-6"
                        >
                            <img
                                src={logo}
                                alt="Rent Elite Logo"
                                className={`h-12 w-auto filter ${getLogoStyles()}`}
                            />
                            <span
                                className={`text-2xl font-bold ${
                                    darkMode ? "text-white" : "text-gray-800"
                                }`}
                            >
                                Rent Elite
                            </span>
                        </Link>
                        <p
                            className={`${
                                darkMode ? "text-gray-300" : "text-gray-600"
                            } mb-6`}
                        >
                            Experience luxury on wheels with our premium car
                            rental service.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <div key={index}>
                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Follow us on ${social.name}`}
                                        data-tooltip-id={social.id}
                                        data-tooltip-content={social.name}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                                        ${
                                            darkMode
                                                ? "border-gray-700 text-gray-300 hover:border-emerald-500 hover:text-emerald-500"
                                                : "border-gray-300 text-gray-600 hover:border-emerald-600 hover:text-emerald-600"
                                        } transition-colors duration-300`}
                                        onClick={hideTooltips}
                                    >
                                        <social.Icon />
                                    </a>
                                    <Tooltip
                                        id={social.id}
                                        place="bottom"
                                        className="bg-emerald-800 text-white px-3 py-2 rounded text-sm"
                                        style={{
                                            backgroundColor: darkMode
                                                ? "#065f46"
                                                : "#059669",
                                            color: "white",
                                            borderRadius: "0.5rem",
                                            padding: "0.5rem 1rem",
                                            fontSize: "0.875rem",
                                            boxShadow:
                                                "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3
                            className={`text-lg font-semibold mb-6 ${
                                darkMode ? "text-white" : "text-gray-800"
                            }`}
                        >
                            Quick Links
                        </h3>
                        <ul className="space-y-4">
                            {["Home", "About Us", "Contact Us", "FAQs"].map(
                                (item) => {
                                    const path =
                                        item === "Home"
                                            ? "/"
                                            : `/${item
                                                  .toLowerCase()
                                                  .replace(/\s+/g, "-")}`;
                                    return (
                                        <li key={item}>
                                            <Link
                                                to={path}
                                                className={`${
                                                    isActiveLink(path)
                                                        ? "text-emerald-600"
                                                        : darkMode
                                                        ? "text-gray-300 hover:text-emerald-400"
                                                        : "text-gray-600 hover:text-emerald-600"
                                                } transition-colors duration-300`}
                                            >
                                                {item}
                                            </Link>
                                        </li>
                                    );
                                }
                            )}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3
                            className={`text-lg font-semibold mb-6 ${
                                darkMode ? "text-white" : "text-gray-800"
                            }`}
                        >
                            Contact Info
                        </h3>
                        <ul className={`space-y-4`}>
                            <li
                                className={`flex items-center space-x-3 group ${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                } hover:text-emerald-600 transition-colors duration-300`}
                            >
                                <span
                                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                        darkMode ? "bg-gray-800" : "bg-gray-200"
                                    } group-hover:bg-emerald-100 transition-colors duration-300`}
                                >
                                    <FaPhone className="text-sm group-hover:text-emerald-600" />
                                </span>
                                <span>(+91) 9424789919</span>
                            </li>
                            <li
                                className={`flex items-center space-x-3 group ${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                } hover:text-emerald-600 transition-colors duration-300`}
                            >
                                <span
                                    className={`flex items-center justify-center w-8 h-8 pl-2 pr-2 rounded-full ${
                                        darkMode ? "bg-gray-800" : "bg-gray-200"
                                    } group-hover:bg-emerald-100 transition-colors duration-300`}
                                >
                                    <FaEnvelope className="text-sm group-hover:text-emerald-600" />
                                </span>
                                <span>
                                    rentelitecarservice
                                    <br />
                                    @gmail.com
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3
                            className={`text-lg font-semibold mb-6 ${
                                darkMode ? "text-white" : "text-gray-800"
                            }`}
                        >
                            Newsletter
                        </h3>
                        <p
                            className={`${
                                darkMode ? "text-gray-300" : "text-gray-600"
                            } mb-4`}
                        >
                            Subscribe to our newsletter for monthly updates and
                            exclusive offers.
                        </p>

                        {subscribeStatus.success && (
                            <div
                                className={`mb-4 p-3 rounded-lg flex items-center ${
                                    darkMode
                                        ? "bg-emerald-900 text-emerald-200"
                                        : "bg-emerald-100 text-emerald-700"
                                }`}
                            >
                                <FaCheckCircle className="mr-2 flex-shrink-0" />
                                <span>
                                    Thank you for subscribing to our newsletter!
                                </span>
                            </div>
                        )}

                        {subscribeStatus.error && (
                            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 flex items-center">
                                <FaExclamationCircle className="mr-2 flex-shrink-0" />
                                <span>{subscribeStatus.error}</span>
                            </div>
                        )}

                        <form
                            onSubmit={handleSubscribe}
                            className="flex flex-col space-y-3"
                        >
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                                ${
                                    darkMode
                                        ? "bg-gray-800 text-white"
                                        : "bg-white text-gray-800"
                                }`}
                            />
                            <button
                                type="submit"
                                disabled={subscribeStatus.loading}
                                className={`px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-300 flex items-center justify-center ${
                                    subscribeStatus.loading
                                        ? "opacity-70 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {subscribeStatus.loading ? (
                                    <>
                                        <span className="animate-spin mr-2">
                                            ◌
                                        </span>
                                        <span>Subscribing...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane className="mr-2" />
                                        <span>Subscribe</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div
                    className={`mt-12 pt-8 border-t ${
                        darkMode ? "border-gray-800" : "border-gray-200"
                    }`}
                >
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p
                            className={`${
                                darkMode ? "text-gray-400" : "text-gray-600"
                            } text-sm`}
                        >
                            Copyright © {new Date().getFullYear()} Rent Elite.
                            All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link
                                to="/privacy-policy"
                                className={`text-sm ${
                                    darkMode
                                        ? "text-gray-400 hover:text-emerald-400"
                                        : "text-gray-600 hover:text-emerald-600"
                                } transition-colors duration-300`}
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                to="/terms-of-service"
                                className={`text-sm ${
                                    darkMode
                                        ? "text-gray-400 hover:text-emerald-400"
                                        : "text-gray-600 hover:text-emerald-600"
                                } transition-colors duration-300`}
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
