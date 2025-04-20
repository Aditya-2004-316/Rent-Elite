import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";
import {
    FaUsers,
    FaBullseye,
    FaStar,
    FaHandshake,
    FaCar,
    FaEnvelope,
    FaPhone,
} from "react-icons/fa";

const AboutUs = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    };

    const values = [
        {
            icon: FaUsers,
            title: "Customer Satisfaction",
            description:
                "We prioritize our customers' needs and work tirelessly to exceed their expectations.",
        },
        {
            icon: FaCar,
            title: "Quality",
            description:
                "We maintain a fleet of well-maintained, reliable vehicles to ensure your safety and comfort.",
        },
        {
            icon: FaHandshake,
            title: "Integrity",
            description:
                "We operate with honesty and transparency in all our dealings.",
        },
        {
            icon: FaStar,
            title: "Innovation",
            description:
                "We continuously seek to improve our services and embrace new technologies.",
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
                        <FaUsers className="text-4xl text-emerald-600" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        About Us
                    </h2>
                    <p className="text-gray-600 max-w-3xl mx-auto">
                        Welcome to Rent Elite! We are a premier car rental
                        service dedicated to providing our customers with the
                        best possible experience. Our mission is to make car
                        rentals easy, affordable, and convenient for everyone.
                    </p>
                </motion.div>

                <motion.div
                    {...fadeIn}
                    className="bg-white p-8 rounded-2xl shadow-lg mb-12"
                >
                    <div className="flex items-center mb-6">
                        <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                            <FaBullseye className="text-2xl text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                            Our Mission
                        </h3>
                    </div>
                    <p className="text-gray-600">
                        At Rent Elite, our mission is to offer top-quality
                        vehicles at competitive prices while ensuring
                        exceptional customer service. We strive to make your car
                        rental experience seamless and enjoyable.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            {...fadeIn}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                                    <value.icon className="text-xl text-emerald-600" />
                                </div>
                                <h4 className="text-xl font-semibold text-gray-800">
                                    {value.title}
                                </h4>
                            </div>
                            <p className="text-gray-600">{value.description}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    {...fadeIn}
                    className="bg-white p-8 rounded-2xl shadow-lg mb-12"
                >
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        Contact Information
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

export default AboutUs;
