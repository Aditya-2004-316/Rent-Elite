import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import LandingNavbar from "./LandingNavbar";
import LandingFooter from "./LandingFooter";
import { requestPasswordReset } from "../services/auth.service";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await requestPasswordReset(email);
            if (response.success) {
                setSuccess(true);
            }
        } catch (err) {
            setError(err.message || "Failed to send password reset link");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <LandingNavbar />

            <div className="flex-grow flex items-center justify-center px-4 py-12 mt-32 mb-20">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                    <Link
                        to="/login"
                        className="flex items-center text-emerald-600 mb-6"
                    >
                        <FaArrowLeft className="mr-2" /> Back to login
                    </Link>

                    <h2 className="text-2xl font-bold text-center mb-6">
                        Forgot Password
                    </h2>

                    {!success ? (
                        <>
                            <p className="text-gray-600 mb-6 text-center">
                                Enter your email address and we'll send you a
                                link to reset your password.
                            </p>

                            {error && (
                                <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="your.email@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-300 ${
                                        isSubmitting
                                            ? "opacity-70 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {isSubmitting
                                        ? "Sending..."
                                        : "Send Reset Link"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="mb-4 p-4 rounded-lg bg-emerald-100 text-emerald-700">
                                Password reset link sent! Please check your
                                email.
                            </div>
                            <p className="mb-4 text-gray-600">
                                We've sent a password reset link to {email}.
                                Please check your inbox and spam folder.
                            </p>
                            <Link
                                to="/login"
                                className="inline-block py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-300"
                            >
                                Return to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <LandingFooter />
        </div>
    );
};

export default ForgotPassword;
