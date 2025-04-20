import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";
import {
    FaGavel,
    FaCookie,
    FaCopyright,
    FaLink,
    FaUserShield,
} from "react-icons/fa";

const TermsOfService = () => {
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
                        <FaGavel className="text-4xl text-emerald-600" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Terms of Service
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        These terms and conditions outline the rules and
                        regulations for the use of our website.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <motion.div
                        {...fadeIn}
                        className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center mb-6">
                            <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                                <FaCookie className="text-2xl text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">
                                Cookies Policy
                            </h3>
                        </div>
                        <p className="text-gray-600">
                            We employ the use of cookies. By accessing the
                            website, you agreed to use cookies in agreement with
                            our Privacy Policy.
                        </p>
                    </motion.div>

                    <motion.div
                        {...fadeIn}
                        className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center mb-6">
                            <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                                <FaCopyright className="text-2xl text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">
                                License
                            </h3>
                        </div>
                        <p className="text-gray-600">
                            Unless otherwise stated, we own the intellectual
                            property rights for all material on the website.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    {...fadeIn}
                    className="bg-white p-8 rounded-2xl shadow-lg mb-12"
                >
                    <div className="flex items-center mb-6">
                        <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                            <FaLink className="text-2xl text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                            Hyperlinking to our Content
                        </h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                        The following organizations may link to our website
                        without prior written approval:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                        <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                            <span>Government agencies</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                            <span>Search engines</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                            <span>News organizations</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                            <span>Online directory distributors</span>
                        </li>
                    </ul>
                </motion.div>

                <motion.div
                    {...fadeIn}
                    className="bg-white p-8 rounded-2xl shadow-lg"
                >
                    <div className="flex items-center mb-6">
                        <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                            <FaUserShield className="text-2xl text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                            Your Privacy
                        </h3>
                    </div>
                    <p className="text-gray-600">
                        Please read our{" "}
                        <a
                            href="/dashboard/privacy-policy"
                            className="text-emerald-600 hover:text-emerald-700 underline"
                        >
                            Privacy Policy
                        </a>{" "}
                        for more information about how we protect your data.
                    </p>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default TermsOfService;
