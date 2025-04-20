import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { FaShieldAlt, FaUserSecret, FaEnvelope, FaPhone } from "react-icons/fa";

const PrivacyPolicy = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    };

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
                        <FaShieldAlt className="text-4xl text-emerald-600" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Privacy Policy
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Your privacy is important to us. This privacy statement
                        explains the personal data we collect, how we process
                        it, and for what purposes.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <motion.div
                        {...fadeIn}
                        className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center mb-6">
                            <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                                <FaUserSecret className="text-2xl text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">
                                Information We Collect
                            </h3>
                        </div>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                                Personal identification information
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                                Usage data and analytics
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                                Cookies and tracking technologies
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        {...fadeIn}
                        className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                            How We Use Information
                        </h3>
                        <ul className="space-y-4 text-gray-600">
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 mt-2"></span>
                                Provide, operate, and maintain our website
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 mt-2"></span>
                                Improve and personalize your experience
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 mt-2"></span>
                                Process your transactions securely
                            </li>
                        </ul>
                    </motion.div>
                </div>

                <motion.div
                    {...fadeIn}
                    className="bg-white p-8 rounded-2xl shadow-lg mb-12"
                >
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        Contact Us
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-emerald-100 rounded-lg">
                                <FaEnvelope className="text-xl text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
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
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="text-gray-700">
                                    (+91) 9424789919
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
