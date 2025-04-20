import React from "react";
import { useSettings } from "../context/SettingsContext";
import LandingNavbar from "./LandingNavbar";
import LandingFooter from "./LandingFooter";
import { motion } from "framer-motion";
import useScrollToTop from "../hooks/useScrollToTop";

const LandingTermsOfService = () => {
    const { darkMode } = useSettings();
    useScrollToTop();

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
                        Terms of Service
                    </h1>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                Acceptance of Terms
                            </h2>
                            <p
                                className={`${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                } mb-4`}
                            >
                                By accessing and using Rent Elite's services,
                                you agree to be bound by these Terms of Service
                                and all applicable laws and regulations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                Rental Requirements
                            </h2>
                            <ul
                                className={`list-disc pl-6 ${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                } space-y-2`}
                            >
                                <li>Must be at least 25 years of age</li>
                                <li>Valid driver's license</li>
                                <li>Proof of insurance</li>
                                <li>Valid credit card in renter's name</li>
                                <li>Clean driving record</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                Rental Policies
                            </h2>
                            <div
                                className={`space-y-4 ${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                            >
                                <h3 className="font-semibold">Reservations</h3>
                                <p>
                                    All reservations require a deposit and are
                                    subject to vehicle availability.
                                </p>

                                <h3 className="font-semibold">Cancellations</h3>
                                <p>
                                    Cancellations made 48 hours or more before
                                    pickup receive a full refund.
                                </p>

                                <h3 className="font-semibold">Insurance</h3>
                                <p>
                                    Basic insurance is included. Additional
                                    coverage options are available.
                                </p>

                                <h3 className="font-semibold">Fuel Policy</h3>
                                <p>
                                    Vehicles must be returned with a full tank
                                    of fuel.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                Vehicle Usage
                            </h2>
                            <ul
                                className={`list-disc pl-6 ${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                } space-y-2`}
                            >
                                <li>
                                    Vehicles may only be driven by authorized
                                    drivers
                                </li>
                                <li>No smoking in vehicles</li>
                                <li>No racing or track use</li>
                                <li>
                                    No international travel without prior
                                    authorization
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                Liability
                            </h2>
                            <p
                                className={`${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                } mb-4`}
                            >
                                Renters are responsible for any damage to the
                                vehicle during their rental period, subject to
                                the terms of their selected insurance coverage.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                Modifications to Terms
                            </h2>
                            <p
                                className={`${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                            >
                                Rent Elite reserves the right to modify these
                                terms at any time. Continued use of our services
                                constitutes acceptance of any modifications.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>

            <LandingFooter />
        </div>
    );
};

export default LandingTermsOfService;
