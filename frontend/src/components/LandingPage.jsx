import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FaCar,
    FaShieldAlt,
    FaClock,
    FaStar,
    FaArrowRight,
    FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import LandingNavbarWrapper from "./LandingNavbarWrapper";
import LandingFooterWrapper from "./LandingFooterWrapper";
import { useSettings } from "../context/SettingsContext";
import useScrollToTop from "../hooks/useScrollToTop";

// Import your hero image and other assets
import ferrariStradale from "/vehicles/Ferrari-SF90-Stradale.jpg"; // Add a high-quality car image
import mercedesAMGone from "/vehicles/Mercedes-AMG-One.jpg"; // Add luxury car images
import koenigseggJesko from "/vehicles/Koenigsegg-Jesko.jpg";
import porscheTurboS from "/vehicles/Porsche-TurboS.jpg";

const LandingPage = () => {
    useScrollToTop();
    const { darkMode: _, ...otherSettings } = useSettings();
    const [isVisible, setIsVisible] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    // Featured cars data
    const featuredCars = [
        {
            name: "Mercedes-AMG ONE",
            type: "Formula 1 Hybrid",
            description:
                "Formula 1 Hybrid technology for the road, featuring a 1.6L V6 hybrid powertrain derived from Mercedes' F1 car.",
            image: mercedesAMGone,
        },
        {
            name: "Koenigsegg Jesko",
            type: "Hypercar",
            description:
                "Named after the founder's father, this hypercar pushes the boundaries with its revolutionary 9-speed transmission.",
            image: koenigseggJesko,
        },
        {
            name: "Porsche Taycan Turbo S",
            type: "Electric Sports Car",
            description:
                "Porsche's first all-electric sports car, combining legendary performance with cutting-edge electric technology.",
            image: porscheTurboS,
        },
    ];

    const handleLearnMore = (car) => {
        setSelectedCar(car);
        setShowModal(true);
    };

    return (
        <div className="bg-white text-gray-900 min-h-screen">
            <LandingNavbarWrapper />

            {/* Hero Section */}
            <section className="relative h-screen">
                <div className="absolute inset-0">
                    <img
                        src={ferrariStradale}
                        alt="Ferrari SF90 Stradale"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>
                <div className="relative z-10 h-full flex items-center justify-center text-white">
                    <motion.div
                        initial="hidden"
                        animate={isVisible ? "visible" : "hidden"}
                        variants={fadeIn}
                        transition={{ duration: 1 }}
                        className="text-center px-4"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Experience Luxury on Wheels
                        </h1>
                        <p className="text-xl md:text-2xl mb-8">
                            Premium car rental service for those who deserve the
                            best
                        </p>
                        <Link
                            to="/cars"
                            className="bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 transition duration-300"
                        >
                            Explore Our Fleet
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section
                className={`py-20 ${
                    otherSettings.darkMode ? "bg-dark-lighter" : "bg-gray-50"
                }`}
            >
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl font-bold text-center mb-16"
                    >
                        Why Choose Rent Elite
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: (
                                    <FaCar className="text-5xl text-emerald-600" />
                                ),
                                title: "Premium Fleet",
                                description:
                                    "Access to the latest luxury vehicles from top manufacturers",
                            },
                            {
                                icon: (
                                    <FaShieldAlt className="text-5xl text-emerald-600" />
                                ),
                                title: "100% Secure",
                                description:
                                    "Fully insured vehicles with 24/7 roadside assistance",
                            },
                            {
                                icon: (
                                    <FaClock className="text-5xl text-emerald-600" />
                                ),
                                title: "Flexible Rentals",
                                description:
                                    "Custom rental periods with convenient pickup and return",
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.2,
                                }}
                                className="text-center p-6 rounded-lg"
                            >
                                <div className="flex justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-semibold mb-4">
                                    {feature.title}
                                </h3>
                                <p
                                    className={`${
                                        otherSettings.darkMode
                                            ? "text-gray-300"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Cars Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl font-bold text-center mb-16"
                    >
                        Featured Vehicles
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredCars.map((car, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.2,
                                }}
                                className={`rounded-lg overflow-hidden shadow-lg ${
                                    otherSettings.darkMode
                                        ? "bg-dark-lighter"
                                        : "bg-white"
                                }`}
                            >
                                <img
                                    src={car.image}
                                    alt={car.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-2xl font-semibold mb-2">
                                        {car.name}
                                    </h3>
                                    <div className="flex justify-between items-center">
                                        <p
                                            className={`${
                                                otherSettings.darkMode
                                                    ? "text-gray-300"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {car.type}
                                        </p>
                                        <button
                                            onClick={() => handleLearnMore(car)}
                                            className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors duration-300"
                                        >
                                            Learn More{" "}
                                            <FaArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section
                className={`py-20 ${
                    otherSettings.darkMode ? "bg-dark-lighter" : "bg-gray-50"
                }`}
            >
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl font-bold text-center mb-16"
                    >
                        What Our Clients Say
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "John Doe",
                                role: "Business Executive",
                                text: "The service was impeccable, and the car exceeded my expectations.",
                            },
                            {
                                name: "Jane Smith",
                                role: "Entrepreneur",
                                text: "Rent Elite made my business trip a luxurious experience.",
                            },
                            {
                                name: "Mike Johnson",
                                role: "Travel Enthusiast",
                                text: "Best luxury car rental service I've ever used. Highly recommended!",
                            },
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.2,
                                }}
                                className={`p-6 rounded-lg ${
                                    otherSettings.darkMode
                                        ? "bg-dark"
                                        : "bg-white"
                                } shadow-lg`}
                            >
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className="text-yellow-400"
                                        />
                                    ))}
                                </div>
                                <p className="mb-4">{testimonial.text}</p>
                                <div>
                                    <p className="font-semibold">
                                        {testimonial.name}
                                    </p>
                                    <p
                                        className={`${
                                            otherSettings.darkMode
                                                ? "text-gray-300"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {testimonial.role}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-emerald-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-bold mb-8">
                            Ready to Experience Luxury?
                        </h2>
                        <p className="text-xl mb-8">
                            Join our exclusive clientele and elevate your
                            journey
                        </p>
                        <Link
                            to="/signup"
                            className="inline-block bg-white text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300"
                        >
                            Get Started Today
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section
                className={`py-20 ${
                    otherSettings.darkMode ? "bg-dark-lighter" : "bg-gray-50"
                }`}
            >
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl font-bold text-center mb-16"
                    >
                        How It Works
                    </motion.h2>
                    <div className="max-w-4xl mx-auto">
                        {[
                            {
                                step: "1",
                                title: "Choose Your Vehicle",
                                description:
                                    "Browse our extensive fleet of luxury vehicles and select the perfect car for your journey.",
                                icon: "🚗",
                            },
                            {
                                step: "2",
                                title: "Select Duration",
                                description:
                                    "Pick your preferred rental duration and choose from our flexible booking options.",
                                icon: "📅",
                            },
                            {
                                step: "3",
                                title: "Verify Details",
                                description:
                                    "Complete a quick verification process and review your booking details.",
                                icon: "✓",
                            },
                            {
                                step: "4",
                                title: "Enjoy Your Ride",
                                description:
                                    "Pick up your vehicle and experience luxury on wheels with Rent Elite.",
                                icon: "🔑",
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{
                                    opacity: 0,
                                    x: index % 2 === 0 ? -50 : 50,
                                }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.2,
                                }}
                                className="flex items-start mb-12 relative"
                            >
                                {/* Timeline line */}
                                {index !== 3 && (
                                    <div className="absolute left-10 top-16 w-0.5 h-24 bg-emerald-600"></div>
                                )}

                                {/* Step number and icon */}
                                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold relative z-10">
                                    {item.icon}
                                </div>

                                {/* Content */}
                                <div className="ml-8">
                                    <h3 className="text-2xl font-semibold mb-2">
                                        {item.title}
                                    </h3>
                                    <p
                                        className={`text-lg ${
                                            otherSettings.darkMode
                                                ? "text-gray-300"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Additional Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        {[
                            {
                                title: "24/7 Support",
                                description:
                                    "Round-the-clock customer service to assist you anytime, anywhere.",
                                icon: "🎧",
                            },
                            {
                                title: "Flexible Booking",
                                description:
                                    "Easy modification and cancellation options for your convenience.",
                                icon: "📱",
                            },
                            {
                                title: "Premium Insurance",
                                description:
                                    "Comprehensive coverage for a worry-free rental experience.",
                                icon: "🛡️",
                            },
                        ].map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.2,
                                }}
                                className={`p-6 rounded-lg shadow-lg ${
                                    otherSettings.darkMode
                                        ? "bg-dark"
                                        : "bg-white"
                                } text-center`}
                            >
                                <div className="text-4xl mb-4 flex justify-center">
                                    {card.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {card.title}
                                </h3>
                                <p
                                    className={`${
                                        otherSettings.darkMode
                                            ? "text-gray-300"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {card.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Download App Section */}
                    {/* <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className={`mt-20 p-8 rounded-2xl ${
                            otherSettings.darkMode ? "bg-dark" : "bg-white"
                        } shadow-lg text-center`}
                    >
                        <h3 className="text-3xl font-bold mb-4">
                            Download Our Mobile App
                        </h3>
                        <p
                            className={`text-lg mb-8 ${
                                otherSettings.darkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                        >
                            Get the full Rent Elite experience on your mobile
                            device
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button className="bg-black text-white px-8 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition duration-300">
                                <span className="text-2xl">🍎</span>
                                <div className="text-left">
                                    <div className="text-xs">
                                        Download on the
                                    </div>
                                    <div className="text-lg font-semibold">
                                        App Store
                                    </div>
                                </div>
                            </button>
                            <button className="bg-black text-white px-8 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition duration-300">
                                <span className="text-2xl">🤖</span>
                                <div className="text-left">
                                    <div className="text-xs">Get it on</div>
                                    <div className="text-lg font-semibold">
                                        Google Play
                                    </div>
                                </div>
                            </button>
                        </div>
                    </motion.div> */}
                </div>
            </section>

            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={() => setShowModal(false)}
                    />
                    <div className="relative">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => setShowModal(false)}
                            className={`absolute -top-12 right-0 w-10 h-10 flex items-center justify-center rounded-full 
                                ${
                                    otherSettings.darkMode
                                        ? "bg-gray-800 hover:bg-gray-700"
                                        : "bg-white hover:bg-gray-100"
                                } 
                                text-2xl transition-colors duration-300`}
                        >
                            <FaTimes
                                className={`${
                                    otherSettings.darkMode
                                        ? "text-white"
                                        : "text-gray-800"
                                }`}
                            />
                        </motion.button>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className={`w-full max-w-2xl rounded-lg shadow-xl p-6 ${
                                otherSettings.darkMode
                                    ? "bg-dark-lighter"
                                    : "bg-white"
                            }`}
                        >
                            {selectedCar && (
                                <div>
                                    <img
                                        src={selectedCar.image}
                                        alt={selectedCar.name}
                                        className="w-full h-64 object-cover rounded-lg mb-4"
                                    />
                                    <h2 className="text-3xl font-bold mb-2">
                                        {selectedCar.name}
                                    </h2>
                                    <p
                                        className={`text-lg mb-4 ${
                                            otherSettings.darkMode
                                                ? "text-emerald-400"
                                                : "text-emerald-600"
                                        }`}
                                    >
                                        {selectedCar.type}
                                    </p>
                                    <p
                                        className={`text-lg ${
                                            otherSettings.darkMode
                                                ? "text-gray-300"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {selectedCar.description}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            )}

            <LandingFooterWrapper />
        </div>
    );
};

export default LandingPage;
