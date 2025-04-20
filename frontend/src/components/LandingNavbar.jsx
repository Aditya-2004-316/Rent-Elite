import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaUser, FaCarAlt } from "react-icons/fa";
import { useSettings } from "../context/SettingsContext";
import logo from "../assets/logo.png";

const LandingNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { darkMode } = useSettings();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSignIn = () => {
        navigate("/login");
    };

    const handleRegister = () => {
        navigate("/signup");
    };

    // Modified getLogoStyles function
    const getLogoStyles = () => {
        if (isScrolled || window.location.pathname !== "/") {
            if (darkMode) {
                return "brightness-0 invert sepia(100%) saturate(3000%) hue-rotate(120deg) brightness(0.8)"; // Green in dark mode
            }
            return "brightness-0 sepia(100%) saturate(3000%) hue-rotate(120deg) brightness(0.8)"; // Green in light mode
        }
        return darkMode ? "brightness-0 invert" : "brightness-0"; // White or black based on mode
    };

    const navbarClasses = `
        fixed w-full z-50 transition-all duration-300
        ${
            isScrolled || window.location.pathname !== "/"
                ? `${
                      darkMode ? "bg-gray-900/95" : "bg-white/95"
                  } shadow-lg backdrop-blur-sm`
                : "bg-transparent"
        }
    `;

    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    const getLinkClasses = (path) => `
        relative px-4 py-2 text-lg font-medium transition-colors duration-300
        ${
            isScrolled || window.location.pathname !== "/"
                ? darkMode
                    ? `${
                          isActiveLink(path)
                              ? "text-emerald-400"
                              : "text-white hover:text-emerald-400"
                      }`
                    : `${
                          isActiveLink(path)
                              ? "text-emerald-600"
                              : "text-gray-800 hover:text-emerald-600"
                      }`
                : `${
                      isActiveLink(path)
                          ? "text-emerald-400"
                          : "text-white hover:text-emerald-400"
                  }`
        }
        before:content-[''] before:absolute before:bottom-0 before:left-0 
        ${
            isActiveLink(path) ? "" : "hover:before:w-full"
        } before:w-0 before:h-0.5
        before:bg-emerald-500 before:transition-all before:duration-300
    `;

    const mobileMenuVariants = {
        closed: {
            opacity: 0,
            x: "100%",
            transition: {
                duration: 0.3,
            },
        },
        open: {
            opacity: 1,
            x: "0%",
            transition: {
                duration: 0.3,
            },
        },
    };

    return (
        <nav className={navbarClasses}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <img
                            src={logo}
                            alt="Rent Elite Logo"
                            className={`h-12 w-auto transition-all duration-300 filter ${getLogoStyles()}`}
                        />
                        <span
                            className={`text-2xl font-bold ${
                                isScrolled || window.location.pathname !== "/"
                                    ? darkMode
                                        ? "text-white"
                                        : "text-gray-800"
                                    : "text-white"
                            }`}
                        >
                            Rent Elite
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link to="/" className={getLinkClasses("/")}>
                            Home
                        </Link>
                        <Link
                            to="/about-us"
                            className={getLinkClasses("/about-us")}
                        >
                            About Us
                        </Link>
                        <Link
                            to="/contact-us"
                            className={getLinkClasses("/contact-us")}
                        >
                            Contact Us
                        </Link>
                        <Link to="/faqs" className={getLinkClasses("/faqs")}>
                            FAQs
                        </Link>

                        {/* Auth Buttons */}
                        <div className="ml-6 flex items-center space-x-4">
                            <button
                                onClick={handleSignIn}
                                className={`px-6 py-2 rounded-full border-2 transition-all duration-300
                                    ${
                                        isScrolled ||
                                        window.location.pathname !== "/"
                                            ? darkMode
                                                ? "border-white text-white hover:bg-white hover:text-gray-900"
                                                : "border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                                            : "border-white text-white hover:bg-white hover:text-gray-900"
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={handleRegister}
                                className="px-6 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300"
                            >
                                Register
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-2xl"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <FaTimes
                                className={
                                    isScrolled
                                        ? darkMode
                                            ? "text-white"
                                            : "text-gray-800"
                                        : "text-white"
                                }
                            />
                        ) : (
                            <FaBars
                                className={
                                    isScrolled
                                        ? darkMode
                                            ? "text-white"
                                            : "text-gray-800"
                                        : "text-white"
                                }
                            />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={mobileMenuVariants}
                            className={`md:hidden absolute top-20 left-0 right-0 p-4 shadow-lg
                                ${darkMode ? "bg-gray-900" : "bg-white"}`}
                        >
                            <div className="flex flex-col space-y-4">
                                <Link
                                    to="/"
                                    className={`text-lg ${
                                        darkMode
                                            ? isActiveLink("/")
                                                ? "text-emerald-400"
                                                : "text-white hover:text-emerald-400"
                                            : isActiveLink("/")
                                            ? "text-emerald-600"
                                            : "text-gray-800 hover:text-emerald-600"
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/about-us"
                                    className={`text-lg ${
                                        darkMode
                                            ? isActiveLink("/about-us")
                                                ? "text-emerald-400"
                                                : "text-white hover:text-emerald-400"
                                            : isActiveLink("/about-us")
                                            ? "text-emerald-600"
                                            : "text-gray-800 hover:text-emerald-600"
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    About Us
                                </Link>
                                <Link
                                    to="/contact-us"
                                    className={`text-lg ${
                                        darkMode
                                            ? isActiveLink("/contact-us")
                                                ? "text-emerald-400"
                                                : "text-white hover:text-emerald-400"
                                            : isActiveLink("/contact-us")
                                            ? "text-emerald-600"
                                            : "text-gray-800 hover:text-emerald-600"
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Contact
                                </Link>
                                <Link
                                    to="/faqs"
                                    className={`text-lg ${
                                        darkMode
                                            ? isActiveLink("/faqs")
                                                ? "text-emerald-400"
                                                : "text-white hover:text-emerald-400"
                                            : isActiveLink("/faqs")
                                            ? "text-emerald-600"
                                            : "text-gray-800 hover:text-emerald-600"
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    FAQs
                                </Link>
                                <div className="pt-4 flex flex-col space-y-2">
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            handleSignIn();
                                        }}
                                        className="w-full px-6 py-2 text-center rounded-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            handleRegister();
                                        }}
                                        className="w-full px-6 py-2 text-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300"
                                    >
                                        Register
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default LandingNavbar;
