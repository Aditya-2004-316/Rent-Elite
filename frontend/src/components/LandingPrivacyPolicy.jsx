import React from "react";
import { useSettings } from "../context/SettingsContext";
import LandingNavbar from "./LandingNavbar";
import LandingFooter from "./LandingFooter";
import { motion } from "framer-motion";
import useScrollToTop from "../hooks/useScrollToTop";

const LandingPrivacyPolicy = () => {
    useScrollToTop();
    const { darkMode } = useSettings();

    return (
        <div
            className={`min-h-screen ${
                darkMode ? "bg-dark text-white" : "bg-white text-gray-900"
            }`}
        >
            <LandingNavbar />

            <div className="container mx-auto px-4 py-28">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl font-bold text-center mb-12">
                        Privacy Policy
                    </h1>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                Information We Collect
                            </h2>
                            <p
                                className={`${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                } mb-4`}
                            >
                                We collect information that you provide directly
                                to us, including:
                            </p>
                            <ul
                                className={`list-disc pl-6 ${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                } space-y-2`}
                            >
                                <li>Name and contact information</li>
                                <li>Driver's license and insurance details</li>
                                <li>Payment information</li>
                                <li>Rental preferences and history</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                How We Use Your Information
                            </h2>
                            <p
                                className={`${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                } mb-4`}
                            >
                                We use the information we collect to:
                            </p>
                            <ul
                                className={`list-disc pl-6 ${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                } space-y-2`}
                            >
                                <li>Process your rental reservations</li>
                                <li>Communicate with you about your rentals</li>
                                <li>
                                    Send you marketing communications (with your
                                    consent)
                                </li>
                                <li>Improve our services</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                Data Security
                            </h2>
                            <p
                                className={`${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                } mb-4`}
                            >
                                We implement appropriate security measures to
                                protect your personal information from
                                unauthorized access, disclosure, or destruction.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                Your Rights
                            </h2>
                            <p
                                className={`${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                } mb-4`}
                            >
                                You have the right to:
                            </p>
                            <ul
                                className={`list-disc pl-6 ${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                } space-y-2`}
                            >
                                <li>Access your personal information</li>
                                <li>Request corrections to your data</li>
                                <li>Request deletion of your data</li>
                                <li>Opt-out of marketing communications</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                Contact Us
                            </h2>
                            <p
                                className={`${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                            >
                                If you have any questions about our Privacy
                                Policy, please contact us at
                                rentelitecarservice@gmail.com
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>

            <LandingFooter />
        </div>
    );
};

export default LandingPrivacyPolicy;
