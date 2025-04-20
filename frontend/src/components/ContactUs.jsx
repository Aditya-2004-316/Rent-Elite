import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
    FaUser,
    FaEnvelope,
    FaCommentAlt,
    FaPaperPlane,
    FaPhoneAlt,
    FaClock,
    FaCheckCircle,
    FaExclamationCircle,
} from "react-icons/fa";
import ChatBot from "./ChatBot";
import { useSettings } from "../context/SettingsContext";
import contactUs from "../assets/contact-mail.png";
import emailjs from "emailjs-com";

const ContactUs = () => {
    const { darkMode } = useSettings();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
            className={`min-h-screen transition-colors duration-300 ${
                darkMode ? "bg-[#1a1a1a]" : "bg-[#f0fbf7]"
            }`}
        >
            <div className="fixed top-0 left-0 right-0 z-30">
                <Navbar />
            </div>

            <div className="container mx-auto px-4 py-8 mt-20 md:mt-24">
                <div className="flex flex-col items-center mb-6">
                    <div
                        className={`p-4 rounded-full mb-4 ${
                            darkMode ? "bg-[#2a2a2a]" : "bg-mint-200"
                        } shadow-lg`}
                    >
                        <FaCommentAlt
                            className={`w-12 h-12 ${
                                darkMode
                                    ? "text-emerald-400"
                                    : "text-emerald-600"
                            }`}
                        />
                    </div>
                    <h1
                        className={`text-3xl md:text-4xl font-bold text-center mb-4 ${
                            darkMode ? "text-white" : "text-gray-800"
                        }`}
                    >
                        Contact Us
                    </h1>
                </div>

                <p
                    className={`text-lg text-center mb-12 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                    We're here to help! Reach out to us with any questions or
                    concerns.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Contact Information */}
                    <div
                        className={`${
                            darkMode
                                ? "bg-[#2a2a2a] border border-[#404040]"
                                : "bg-white"
                        } rounded-lg shadow-md p-8`}
                    >
                        <h2
                            className={`text-2xl font-bold mb-6 ${
                                darkMode ? "text-white" : "text-gray-800"
                            }`}
                        >
                            Get in Touch
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-center">
                                <div
                                    className={`p-3 rounded-full mr-4 ${
                                        darkMode
                                            ? "bg-[#333]"
                                            : "bg-emerald-100"
                                    }`}
                                >
                                    <FaPhoneAlt
                                        className={`text-xl ${
                                            darkMode
                                                ? "text-emerald-400"
                                                : "text-emerald-600"
                                        }`}
                                    />
                                </div>
                                <div>
                                    <h3
                                        className={`font-semibold ${
                                            darkMode
                                                ? "text-white"
                                                : "text-gray-800"
                                        }`}
                                    >
                                        Phone
                                    </h3>
                                    <p
                                        className={
                                            darkMode
                                                ? "text-gray-400"
                                                : "text-gray-600"
                                        }
                                    >
                                        (+91) 9424789919
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div
                                    className={`p-3 rounded-full mr-4 ${
                                        darkMode
                                            ? "bg-[#333]"
                                            : "bg-emerald-100"
                                    }`}
                                >
                                    <FaEnvelope
                                        className={`text-xl ${
                                            darkMode
                                                ? "text-emerald-400"
                                                : "text-emerald-600"
                                        }`}
                                    />
                                </div>
                                <div>
                                    <h3
                                        className={`font-semibold ${
                                            darkMode
                                                ? "text-white"
                                                : "text-gray-800"
                                        }`}
                                    >
                                        Email
                                    </h3>
                                    <p
                                        className={
                                            darkMode
                                                ? "text-gray-400"
                                                : "text-gray-600"
                                        }
                                    >
                                        rentelitecarservice@gmail.com
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div
                                    className={`p-3 rounded-full mr-4 ${
                                        darkMode
                                            ? "bg-[#333]"
                                            : "bg-emerald-100"
                                    }`}
                                >
                                    <FaClock
                                        className={`text-xl ${
                                            darkMode
                                                ? "text-emerald-400"
                                                : "text-emerald-600"
                                        }`}
                                    />
                                </div>
                                <div>
                                    <h3
                                        className={`font-semibold ${
                                            darkMode
                                                ? "text-white"
                                                : "text-gray-800"
                                        }`}
                                    >
                                        Business Hours
                                    </h3>
                                    <p
                                        className={
                                            darkMode
                                                ? "text-gray-400"
                                                : "text-gray-600"
                                        }
                                    >
                                        Mon - Sat: 9:00 AM - 7:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div
                        className={`${
                            darkMode
                                ? "bg-[#2a2a2a] border border-[#404040]"
                                : "bg-white"
                        } rounded-lg shadow-md p-8`}
                    >
                        {success && (
                            <div
                                className={`mb-6 p-4 rounded-lg ${
                                    darkMode
                                        ? "bg-[#1a472e] text-emerald-400"
                                        : "bg-emerald-100 text-emerald-600"
                                } flex items-center justify-center`}
                            >
                                <FaCheckCircle className="mr-2" />
                                <span className="font-semibold">
                                    Thank you for reaching out! We'll respond
                                    shortly.
                                </span>
                            </div>
                        )}

                        {error && (
                            <div
                                className={`mb-6 p-4 rounded-lg bg-red-100 text-red-600 flex items-center justify-center`}
                            >
                                <FaExclamationCircle className="mr-2" />
                                <span className="font-semibold">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className={`block font-semibold mb-2 ${
                                        darkMode
                                            ? "text-white"
                                            : "text-gray-700"
                                    }`}
                                >
                                    <FaUser className="inline mr-2 mb-1" />
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={`w-full p-3 rounded-lg border ${
                                        darkMode
                                            ? "bg-[#333] border-[#404040] text-white"
                                            : "bg-white border-gray-300 text-gray-900"
                                    } focus:ring-2 focus:ring-emerald-500 transition-colors duration-200`}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className={`block font-semibold mb-2 ${
                                        darkMode
                                            ? "text-white"
                                            : "text-gray-700"
                                    }`}
                                >
                                    <FaEnvelope className="inline mr-2 mb-1" />
                                    Your Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={`w-full p-3 rounded-lg border ${
                                        darkMode
                                            ? "bg-[#333] border-[#404040] text-white"
                                            : "bg-white border-gray-300 text-gray-900"
                                    } focus:ring-2 focus:ring-emerald-500 transition-colors duration-200`}
                                    placeholder="Enter your email address"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className={`block font-semibold mb-2 ${
                                        darkMode
                                            ? "text-white"
                                            : "text-gray-700"
                                    }`}
                                >
                                    <FaCommentAlt className="inline mr-2 mb-1" />
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className={`w-full p-3 rounded-lg border ${
                                        darkMode
                                            ? "bg-[#333] border-[#404040] text-white"
                                            : "bg-white border-gray-300 text-gray-900"
                                    } focus:ring-2 focus:ring-emerald-500 transition-colors duration-200`}
                                    placeholder="Write your message here"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-6 rounded-lg font-semibold text-white flex items-center justify-center space-x-2 transition duration-300 ${
                                    darkMode
                                        ? "bg-[#0fa16d] hover:bg-[#0d8a5c]"
                                        : "bg-emerald-600 hover:bg-emerald-700"
                                } ${
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
                                        <FaPaperPlane />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
            <ChatBot />
        </div>
    );
};

export default ContactUs;
