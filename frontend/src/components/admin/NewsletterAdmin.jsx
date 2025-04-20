import React, { useState, useEffect } from "react";
import { sendNewsletterToAllSubscribers } from "../../utils/newsletterUtils";
import { useSettings } from "../../context/SettingsContext";
import {
    FaPaperPlane,
    FaUserFriends,
    FaCalendarAlt,
    FaExclamationCircle,
    FaCheckCircle,
    FaEye,
    FaEyeSlash,
    FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const NewsletterAdmin = () => {
    const { darkMode } = useSettings();
    const navigate = useNavigate();
    const [newsletterData, setNewsletterData] = useState({
        subject: "",
        content: "",
    });
    const [subscribers, setSubscribers] = useState([]);
    const [showSubscribers, setShowSubscribers] = useState(false);
    const [status, setStatus] = useState({
        loading: false,
        success: false,
        error: null,
        result: null,
    });

    useEffect(() => {
        const userRole = localStorage.getItem("userRole");
        const authToken = localStorage.getItem("authToken");

        if (!authToken || userRole !== "admin") {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        loadSubscribers();
    }, []);

    const loadSubscribers = () => {
        const storedSubscribers = JSON.parse(
            localStorage.getItem("newsletter_subscribers") || "[]"
        );
        setSubscribers(storedSubscribers);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewsletterData((prev) => ({ ...prev, [name]: value }));
    };

    const removeSubscriber = (email) => {
        const updatedSubscribers = subscribers.filter(
            (sub) => sub.email !== email
        );
        localStorage.setItem(
            "newsletter_subscribers",
            JSON.stringify(updatedSubscribers)
        );
        loadSubscribers();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null, result: null });

        if (!newsletterData.subject.trim() || !newsletterData.content.trim()) {
            setStatus({
                loading: false,
                success: false,
                error: "Please fill in both subject and content",
                result: null,
            });
            return;
        }

        try {
            const result = await sendNewsletterToAllSubscribers(
                newsletterData.subject,
                newsletterData.content,
                "template_2aqx694" // Use your actual template ID
            );

            setStatus({
                loading: false,
                success: result.success,
                error: result.success
                    ? null
                    : "Failed to send newsletter to some subscribers",
                result,
            });

            if (result.success) {
                setNewsletterData({ subject: "", content: "" });
            }
        } catch (error) {
            setStatus({
                loading: false,
                success: false,
                error: error.message,
                result: null,
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Fixed Navbar */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Navbar />
            </div>

            {/* Main Content with padding to accommodate fixed navbar and footer */}
            <div
                className={`flex-grow pt-24 pb-16 mt-16 px-6 ${
                    darkMode
                        ? "bg-gray-900 text-white"
                        : "bg-gray-50 text-gray-800"
                }`}
            >
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 flex items-center">
                        <FaPaperPlane className="mr-3 text-emerald-500" />
                        Newsletter Management
                    </h1>

                    {/* Subscribers Section */}
                    <div
                        className={`mb-8 p-6 rounded-lg shadow-lg ${
                            darkMode ? "bg-gray-800" : "bg-white"
                        }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <FaUserFriends
                                    className="text-emerald-500 mr-2"
                                    size={24}
                                />
                                <button
                                    onClick={() =>
                                        setShowSubscribers(!showSubscribers)
                                    }
                                    className="text-lg font-semibold hover:text-emerald-500 transition-colors flex items-center"
                                >
                                    {subscribers.length} Subscribers
                                    {showSubscribers ? (
                                        <FaEyeSlash className="ml-2" />
                                    ) : (
                                        <FaEye className="ml-2" />
                                    )}
                                </button>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                                <FaCalendarAlt className="mr-1" />
                                Last updated: {new Date().toLocaleDateString()}
                            </div>
                        </div>

                        {/* Subscriber List */}
                        {showSubscribers && (
                            <div
                                className={`mt-4 p-4 rounded-lg ${
                                    darkMode ? "bg-gray-700" : "bg-gray-50"
                                }`}
                            >
                                <div className="max-h-60 overflow-y-auto">
                                    {subscribers.map((subscriber, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center justify-between p-2 ${
                                                index !== subscribers.length - 1
                                                    ? "border-b"
                                                    : ""
                                            } ${
                                                darkMode
                                                    ? "border-gray-600"
                                                    : "border-gray-200"
                                            }`}
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {subscriber.email}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Subscribed on:{" "}
                                                    {new Date(
                                                        subscriber.date
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    removeSubscriber(
                                                        subscriber.email
                                                    )
                                                }
                                                className="p-2 text-red-500 hover:text-red-600 transition-colors"
                                                title="Remove subscriber"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status Messages */}
                    {status.success && (
                        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-start">
                            <FaCheckCircle className="mr-2 mt-1 flex-shrink-0" />
                            <div>
                                <div className="font-bold">
                                    Newsletter sent successfully!
                                </div>
                                <div className="text-sm mt-1">
                                    Sent to {status.result?.sent} of{" "}
                                    {status.result?.total} subscribers
                                    {status.result?.failed > 0 &&
                                        ` (${status.result.failed} failed)`}
                                </div>
                            </div>
                        </div>
                    )}

                    {status.error && (
                        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg flex items-start">
                            <FaExclamationCircle className="mr-2 mt-1 flex-shrink-0" />
                            <div>
                                <div className="font-bold">
                                    Error sending newsletter
                                </div>
                                <div className="text-sm mt-1">
                                    {status.error}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Newsletter Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 mb-8">
                        <div
                            className={`p-6 rounded-lg shadow-lg ${
                                darkMode ? "bg-gray-800" : "bg-white"
                            }`}
                        >
                            <div className="mb-6">
                                <label className="block mb-2 font-medium">
                                    Newsletter Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={newsletterData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="Monthly Newsletter - July 2023"
                                    className={`w-full p-3 rounded-lg border ${
                                        darkMode
                                            ? "bg-gray-700 border-gray-600 text-white"
                                            : "bg-white border-gray-300 text-gray-900"
                                    } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">
                                    Newsletter Content (HTML supported)
                                </label>
                                <textarea
                                    name="content"
                                    value={newsletterData.content}
                                    onChange={handleChange}
                                    required
                                    rows="10"
                                    placeholder="<h1>Newsletter Content</h1><p>Hello from Rent Elite! Here are our monthly updates...</p>"
                                    className={`w-full p-3 rounded-lg border ${
                                        darkMode
                                            ? "bg-gray-700 border-gray-600 text-white"
                                            : "bg-white border-gray-300 text-gray-900"
                                    } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                                />
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <button
                                    type="submit"
                                    disabled={
                                        status.loading ||
                                        subscribers.length === 0
                                    }
                                    className={`px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center ${
                                        status.loading ||
                                        subscribers.length === 0
                                            ? "opacity-60 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {status.loading ? (
                                        <>
                                            <span className="animate-spin mr-2">
                                                ◌
                                            </span>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane className="mr-2" />
                                            <span>Send Newsletter</span>
                                        </>
                                    )}
                                </button>

                                {subscribers.length === 0 && (
                                    <p className="text-sm text-red-500">
                                        No subscribers available to send to.
                                    </p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default NewsletterAdmin;
