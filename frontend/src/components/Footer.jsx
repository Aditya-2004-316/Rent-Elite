import React, { useEffect } from "react";
import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaXTwitter,
} from "react-icons/fa6";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import logo from "../assets/logo.png";
import { useSettings } from "../context/SettingsContext";

const Footer = () => {
    const location = useLocation();
    const { translate, darkMode } = useSettings();

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

    // Function to scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Scroll to top when location changes
    useEffect(() => {
        scrollToTop();
    }, [location]);

    // Hide tooltips on location change
    useEffect(() => {
        hideTooltips();
    }, [location.pathname]);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    };

    return (
        <footer
            className={`py-16 transition-colors duration-300 ${
                darkMode ? "bg-emerald-950" : "bg-emerald-600"
            } text-white`}
        >
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-12 gap-y-10">
                    {/* Company Info */}
                    <motion.div {...fadeInUp} className="col-span-1">
                        {/* <h3 className="text-xl font-semibold mb-6">
                            {translate("Company Info")}
                        </h3> */}
                        <Link
                            to="/dashboard"
                            onClick={scrollToTop}
                            className="flex items-center space-x-3 mb-6 group hover:opacity-90 transition-all duration-300"
                        >
                            <img
                                src={logo}
                                alt="Rent Elite Logo"
                                className="h-12 w-auto brightness-0 invert transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="text-2xl font-bold text-white">
                                Rent Elite
                            </span>
                        </Link>
                        <p className="text-emerald-50 mb-8 leading-relaxed">
                            Experience luxury on wheels with our premium car
                            rental service.
                        </p>
                        <div className="flex space-x-4">
                            {[
                                {
                                    Icon: FaFacebook,
                                    href: "https://www.facebook.com/profile.php?id=61575164133624&sk=about",
                                    tooltip: "Facebook",
                                    id: "facebook-tooltip",
                                },
                                {
                                    Icon: FaXTwitter,
                                    href: "https://x.com/RentEliteCars",
                                    tooltip: "X",
                                    id: "x-tooltip",
                                },
                                {
                                    Icon: FaInstagram,
                                    href: "https://www.instagram.com/rent_elite?igsh=Ym90amJtczJnMDll",
                                    tooltip: "Instagram",
                                    id: "instagram-tooltip",
                                },
                                {
                                    Icon: FaLinkedin,
                                    href: "https://www.linkedin.com/in/rent-elite-718296360/",
                                    tooltip: "LinkedIn",
                                    id: "linkedin-tooltip",
                                },
                            ].map((social) => (
                                <div key={social.id}>
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        data-tooltip-id={social.id}
                                        data-tooltip-content={social.tooltip}
                                        className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-emerald-500/30 text-white hover:border-white hover:text-white transition-colors duration-300"
                                        onClick={hideTooltips}
                                    >
                                        <social.Icon />
                                    </a>
                                    <Tooltip
                                        id={social.id}
                                        place="bottom"
                                        className="!bg-emerald-800 !text-white"
                                        style={{
                                            backgroundColor: "#065f46",
                                            fontSize: "0.875rem",
                                            padding: "0.5rem 1rem",
                                            borderRadius: "0.5rem",
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Rent Elite Policies */}
                    <motion.div {...fadeInUp}>
                        <h3 className="text-xl font-semibold mb-6">
                            {translate("Rent Elite Policies")}
                        </h3>
                        <ul className="space-y-4">
                            {[
                                {
                                    path: "/dashboard/privacy-policy",
                                    label: "Privacy Policy",
                                },
                                {
                                    path: "/dashboard/terms-of-service",
                                    label: "Terms of Service",
                                },
                                {
                                    path: "/dashboard/about-us",
                                    label: "About Us",
                                },
                            ].map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        onClick={scrollToTop}
                                        className={`group flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 
                                            ${"hover:bg-emerald-500/20"}
                                            ${
                                                location.pathname === link.path
                                                    ? darkMode
                                                        ? "text-[#0fa16d] bg-[#333333]"
                                                        : "text-black bg-emerald-500/20"
                                                    : darkMode
                                                    ? "text-white hover:text-white"
                                                    : "text-emerald-50 hover:text-white"
                                            }`}
                                    >
                                        <span
                                            className={`w-1.5 h-1.5 bg-emerald-400 rounded-full group-hover:w-2 transition-all ${
                                                location.pathname === link.path
                                                    ? "w-2"
                                                    : ""
                                            }`}
                                        />
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                                            {link.label}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Support and Queries */}
                    <motion.div {...fadeInUp}>
                        <h3 className="text-xl font-semibold mb-6">
                            {translate("Support And Queries")}
                        </h3>
                        <ul className="space-y-4">
                            {[
                                {
                                    path: "/dashboard/contact-us",
                                    label: "Contact Us",
                                },
                                { path: "/dashboard/faqs", label: "FAQs" },
                                {
                                    path: "/dashboard/support",
                                    label: "Support",
                                },
                            ].map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        onClick={scrollToTop}
                                        className={`group flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 
                                            ${"hover:bg-emerald-500/20"}
                                            ${
                                                location.pathname === link.path
                                                    ? darkMode
                                                        ? "text-[#0fa16d] bg-[#333333]"
                                                        : "text-black bg-emerald-500/20"
                                                    : darkMode
                                                    ? "text-white hover:text-white"
                                                    : "text-emerald-50 hover:text-white"
                                            }`}
                                    >
                                        <span
                                            className={`w-1.5 h-1.5 bg-emerald-400 rounded-full group-hover:w-2 transition-all ${
                                                location.pathname === link.path
                                                    ? "w-2"
                                                    : ""
                                            }`}
                                        />
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                                            {link.label}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div {...fadeInUp}>
                        <h3 className="text-xl font-semibold mb-6">
                            {translate("Contact Information")}
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-center space-x-4 group hover:bg-emerald-500/20 p-2 rounded-lg transition-all duration-300 w-full">
                                <span className="w-10 h-10 flex items-center justify-center bg-emerald-500/20 rounded-full text-lg group-hover:bg-emerald-500/30 transition-colors flex-shrink-0">
                                    📞
                                </span>
                                <span className="text-emerald-50 group-hover:translate-x-1 transition-transform duration-300 flex-1">
                                    (+91) 9424789919
                                </span>
                            </li>
                            <li className="flex items-center space-x-4 group hover:bg-emerald-500/20 p-2 rounded-lg transition-all duration-300 w-full">
                                <span className="w-10 h-10 flex items-center justify-center bg-emerald-500/20 rounded-full text-lg group-hover:bg-emerald-500/30 transition-colors flex-shrink-0">
                                    ✉
                                </span>
                                <span className="text-emerald-50 group-hover:translate-x-1 transition-transform duration-300 flex-1 break-all">
                                    rentelitecarservice
                                    <br />
                                    @gmail.com
                                </span>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-emerald-500/30">
                    <div className="text-center">
                        <p className="-mb-8 text-sm text-emerald-50 opacity-90">
                            Copyright © {new Date().getFullYear()} Rent Elite.
                            All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
