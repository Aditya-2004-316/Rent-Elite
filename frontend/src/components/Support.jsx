import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";
import {
    FaHeadset,
    FaEnvelope,
    FaPhone,
    FaClock,
    FaComments,
    FaQuestionCircle,
} from "react-icons/fa";

const Support = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    };

    const supportHours = [
        { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
        { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
        { day: "Sunday", hours: "Closed" },
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
                        <FaHeadset className="text-4xl text-emerald-600" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Support Center
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We're here to help! Our support team is ready to assist
                        you with any questions or concerns you may have.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <motion.div
                        {...fadeIn}
                        className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                            Contact Methods
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-emerald-100 rounded-lg">
                                    <FaEnvelope className="text-xl text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Email
                                    </p>
                                    <p className="text-gray-700">
                                        rentelitecarservice@gmail.com
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-emerald-100 rounded-lg">
                                    <FaPhone className="text-xl text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Phone
                                    </p>
                                    <p className="text-gray-700">
                                        (+91) 9424789919
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        {...fadeIn}
                        className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                            Support Hours
                        </h3>
                        <div className="space-y-4">
                            {supportHours.map((schedule, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-4"
                                >
                                    <div className="p-3 bg-emerald-100 rounded-lg">
                                        <FaClock className="text-xl text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {schedule.day}
                                        </p>
                                        <p className="text-gray-700">
                                            {schedule.hours}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        {...fadeIn}
                        className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center mb-6">
                            <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                                <FaQuestionCircle className="text-2xl text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">
                                FAQs
                            </h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Find quick answers to common questions in our FAQ
                            section.
                        </p>
                        <a
                            href="/dashboard/faqs"
                            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            View FAQs
                        </a>
                    </motion.div>

                    <motion.div
                        {...fadeIn}
                        className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center mb-6">
                            <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                                <FaComments className="text-2xl text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">
                                Contact Form
                            </h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Send us a message through our contact form for
                            detailed inquiries.
                        </p>
                        <a
                            href="/dashboard/contact-us"
                            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Contact Us
                        </a>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Support;
