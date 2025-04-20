import React, { useState } from "react";
import { useSettings } from "../context/SettingsContext";
import LandingNavbar from "./LandingNavbar";
import LandingFooter from "./LandingFooter";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import useScrollToTop from "../hooks/useScrollToTop";

const LandingFAQs = () => {
    useScrollToTop();
    const { darkMode } = useSettings();
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "What documents do I need to rent a car?",
            answer: "To rent a car, you'll need a valid driver's license, proof of insurance, and a credit card. International customers may need additional documentation.",
        },
        {
            question: "What is your cancellation policy?",
            answer: "We offer free cancellation up to 48 hours before your scheduled pickup. Cancellations within 48 hours may be subject to a fee.",
        },
        {
            question: "Is insurance included in the rental price?",
            answer: "Basic insurance is included in all rentals. Additional coverage options are available for enhanced protection.",
        },
        {
            question:
                "What is the minimum age requirement to rent a luxury car?",
            answer: "The minimum age requirement is 25 years old. Some vehicles may have higher age requirements.",
        },
        {
            question: "Do you offer delivery services?",
            answer: "Yes, we offer delivery and pickup services to select locations, including airports and hotels.",
        },
        {
            question: "What happens if I return the car late?",
            answer: "Late returns may incur additional hourly or daily charges. Please contact us if you need to extend your rental.",
        },
        {
            question: "Do you require a security deposit?",
            answer: "Yes, a security deposit is required and will be refunded upon return of the vehicle in its original condition.",
        },
        {
            question: "What is your fuel policy?",
            answer: "Vehicles are provided with a full tank and should be returned with a full tank. A refueling fee will apply if not returned full.",
        },
    ];

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
                    className="max-w-3xl mx-auto"
                >
                    <h1 className="text-4xl font-bold text-center mb-12">
                        Frequently Asked Questions
                    </h1>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`rounded-lg overflow-hidden ${
                                    darkMode ? "bg-dark-lighter" : "bg-gray-50"
                                }`}
                            >
                                <button
                                    className="w-full px-6 py-4 flex justify-between items-center"
                                    onClick={() =>
                                        setActiveIndex(
                                            activeIndex === index ? null : index
                                        )
                                    }
                                >
                                    <span className="font-semibold text-left">
                                        {faq.question}
                                    </span>
                                    <FaChevronDown
                                        className={`transform transition-transform duration-300 ${
                                            activeIndex === index
                                                ? "rotate-180"
                                                : ""
                                        } ${
                                            darkMode
                                                ? "text-emerald-400"
                                                : "text-emerald-600"
                                        }`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {activeIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="px-6 pb-4"
                                        >
                                            <p
                                                className={
                                                    darkMode
                                                        ? "text-gray-300"
                                                        : "text-gray-600"
                                                }
                                            >
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <LandingFooter />
        </div>
    );
};

export default LandingFAQs;
