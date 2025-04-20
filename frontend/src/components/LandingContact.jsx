import React, { useState } from "react";
import { useSettings } from "../context/SettingsContext";
import LandingNavbar from "./LandingNavbar";
import LandingFooter from "./LandingFooter";
import { motion } from "framer-motion";
import {
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
    FaCheckCircle,
    FaExclamationCircle,
    FaPaperPlane,
} from "react-icons/fa";
import useScrollToTop from "../hooks/useScrollToTop";
import emailjs from "emailjs-com";

const LandingContact = () => {
    useScrollToTop();
    const { darkMode } = useSettings();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // EmailJS service, template, and user IDs
        const serviceID = "service_4ffcb8j";
        const templateID = "template_ixzktb1";
        const userID = "ZqfFDcSi_NjM6cL6K"; // Replace with your actual EmailJS user ID

        // Prepare template parameters
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            to_email: "rentelitecarservice@gmail.com",
        };

        // Send email using EmailJS
        emailjs
            .send(serviceID, templateID, templateParams, userID)
            .then((response) => {
                console.log("Email sent successfully:", response);
                setSuccess(true);
                setFormData({ name: "", email: "", message: "" });
                setLoading(false);
                setTimeout(() => setSuccess(false), 5000);
            })
            .catch((err) => {
                console.error("Failed to send email:", err);
                setError(
                    "Failed to send your message. Please try again later."
                );
                setLoading(false);
            });
    };

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
                    className="max-w-6xl mx-auto"
                >
                    <h1 className="text-4xl font-bold text-center mb-12">
                        Contact Us
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <div className="space-y-8">
                            <h2 className="text-2xl font-semibold mb-6">
                                Get in Touch
                            </h2>

                            {[
                                {
                                    icon: <FaPhone />,
                                    title: "Phone",
                                    info: "(+91) 9424789919",
                                },
                                {
                                    icon: <FaEnvelope />,
                                    title: "Email",
                                    info: "rentelitecarservice@gmail.com",
                                },
                                {
                                    icon: <FaClock />,
                                    title: "Business Hours",
                                    info: "Mon - Sat: 9:00 AM - 8:00 PM",
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-4"
                                >
                                    <div
                                        className={`text-xl ${
                                            darkMode
                                                ? "text-emerald-400"
                                                : "text-emerald-600"
                                        }`}
                                    >
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {item.title}
                                        </h3>
                                        <p
                                            className={
                                                darkMode
                                                    ? "text-gray-300"
                                                    : "text-gray-600"
                                            }
                                        >
                                            {item.info}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Contact Form */}
                        <div
                            className={`p-6 rounded-lg ${
                                darkMode ? "bg-dark-lighter" : "bg-gray-50"
                            }`}
                        >
                            <h2 className="text-2xl font-semibold mb-6">
                                Send us a Message
                            </h2>

                            {success && (
                                <div className="mb-6 p-4 rounded-lg bg-green-100 text-green-600 flex items-center">
                                    <FaCheckCircle className="mr-2" />
                                    <span>
                                        Thank you for reaching out! We'll
                                        respond shortly.
                                    </span>
                                </div>
                            )}

                            {error && (
                                <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-600 flex items-center">
                                    <FaExclamationCircle className="mr-2" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                                        ${
                                            darkMode
                                                ? "bg-gray-800 text-white"
                                                : "bg-white text-gray-800"
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                                        ${
                                            darkMode
                                                ? "bg-gray-800 text-white"
                                                : "bg-white text-gray-800"
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        rows="4"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                                        ${
                                            darkMode
                                                ? "bg-gray-800 text-white"
                                                : "bg-white text-gray-800"
                                        }`}
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-300 flex items-center justify-center ${
                                        loading
                                            ? "opacity-70 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <span className="animate-spin mr-2">
                                                ◌
                                            </span>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane className="mr-2" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>

            <LandingFooter />
        </div>
    );
};

export default LandingContact;
