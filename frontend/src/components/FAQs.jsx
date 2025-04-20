import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex justify-between items-center"
            >
                <h3 className="text-xl font-semibold text-gray-800 text-left">
                    {question}
                </h3>
                {isOpen ? (
                    <FaChevronUp className="text-emerald-600 ml-4" />
                ) : (
                    <FaChevronDown className="text-emerald-600 ml-4" />
                )}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white px-6 pb-6 rounded-b-xl shadow-md"
                    >
                        <p className="text-gray-600 mt-4">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const FAQs = () => {
    const faqs = [
        {
            question: "What is Rent Elite?",
            answer: "Rent Elite is a premier car rental service dedicated to providing our customers with the best possible experience. We offer top-quality vehicles at competitive prices with exceptional customer service.",
        },
        {
            question: "How do I book a car?",
            answer: "You can book a car through our website by selecting your desired vehicle, choosing your rental dates, and completing the booking process. You can also contact our customer service team for assistance.",
        },
        {
            question: "What documents do I need to rent a car?",
            answer: "To rent a car, you will need a valid driver's license, a credit card in your name, and proof of insurance. Additional identification may be required for certain rentals.",
        },
        {
            question: "What is the cancellation policy?",
            answer: "Our cancellation policy allows you to cancel your reservation up to 24 hours before the scheduled pick-up time without any charges. Cancellations made within 24 hours of the pick-up time may incur a fee.",
        },
        {
            question: "Can I extend my rental period?",
            answer: "Yes, you can extend your rental period by contacting our customer service team. Additional charges may apply based on the extended rental duration.",
        },
        {
            question: "What should I do in case of an accident?",
            answer: "In case of an accident, please ensure your safety and contact emergency services if needed. Then, contact our customer service team to report the incident and receive further instructions.",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 to-white">
            <Navbar />
            <div className="flex-grow container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block p-4 bg-emerald-100 rounded-full mb-4">
                        <FaQuestionCircle className="text-4xl text-emerald-600" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Find answers to common questions about our services. If
                        you can't find what you're looking for, feel free to
                        contact our support team.
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                        />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FAQs;
